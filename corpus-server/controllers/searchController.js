import Item from '../models/Item.js'
import { parseQuery } from '../services/searchParser.js'

/**
 * Smart search — supports:
 * - Full text across title, content, summary, tags, note, url
 * - tag:design  site:youtube.com  type:youtube  type:note
 * - -exclude  "exact phrase"  word1 || word2
 * - yesterday  last week  last month
 * - Fuzzy fallback: if text search returns 0 results, tries regex on title/content
 */
export async function smartSearch(req, res) {
  const raw = (req.query.q || '').trim()
  if (!raw) return res.json({ items: [], parsed: {} })

  try {
    const parsed = parseQuery(raw)
    const baseQuery = {
      userId: req.user.id,
      deletedAt: null,
      archived: false,
    }

    // apply operator filters
    if (parsed.tags.length) {
      baseQuery.tags = { $all: parsed.tags }
    }
    if (parsed.site) {
      baseQuery.url = { $regex: parsed.site, $options: 'i' }
    }
    if (parsed.contentTypes.length) {
      baseQuery.contentType = { $in: parsed.contentTypes }
    }
    if (parsed.itemTypes.length) {
      baseQuery.type = { $in: parsed.itemTypes }
    }
    if (parsed.dateFilter) {
      baseQuery.createdAt = parsed.dateFilter
    }

    let items = []

    // ── OR SEARCH ──
    if (parsed.orTerms.length) {
      const orConditions = parsed.orTerms.map(term => ({
        $or: [
          { title: { $regex: term, $options: 'i' } },
          { content: { $regex: term, $options: 'i' } },
          { summary: { $regex: term, $options: 'i' } },
          { tags: { $regex: term, $options: 'i' } },
          { note: { $regex: term, $options: 'i' } },
        ]
      }))
      items = await Item.find({
        ...baseQuery,
        $or: orConditions.flatMap(c => c.$or),
      }).sort({ createdAt: -1 }).limit(40)
    }

    // ── EXACT PHRASE ──
    else if (parsed.exact) {
      items = await Item.find({
        ...baseQuery,
        $or: [
          { title: { $regex: parsed.exact, $options: 'i' } },
          { content: { $regex: parsed.exact, $options: 'i' } },
          { summary: { $regex: parsed.exact, $options: 'i' } },
          { note: { $regex: parsed.exact, $options: 'i' } },
        ]
      }).sort({ createdAt: -1 }).limit(40)
    }

    // ── TEXT SEARCH WITH OPERATORS ONLY (no text term) ──
    else if (!parsed.text && parsed.hasOperators) {
      items = await Item.find(baseQuery)
        .sort({ createdAt: -1 })
        .limit(40)
    }

    // ── FULL TEXT + OPERATORS ──
    else if (parsed.text) {
      // build exclusion from -words
      let searchText = parsed.text
      if (parsed.exclude.length) {
        searchText += ' ' + parsed.exclude.map(w => `-${w}`).join(' ')
      }

      // 1. MongoDB text search (weighted: title > tags > summary > content)
      items = await Item.find(
        { ...baseQuery, $text: { $search: searchText } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(40)

      // 2. Fuzzy fallback — if text search returns nothing, try regex
      if (items.length === 0) {
        const terms = parsed.text.split(/\s+/).filter(t => t.length > 1)
        const regexConditions = terms.map(term => ({
          $or: [
            { title: { $regex: term, $options: 'i' } },
            { content: { $regex: term, $options: 'i' } },
            { summary: { $regex: term, $options: 'i' } },
            { tags: { $regex: term, $options: 'i' } },
            { note: { $regex: term, $options: 'i' } },
            { url: { $regex: term, $options: 'i' } },
            { contentType: { $regex: term, $options: 'i' } },
          ]
        }))

        if (regexConditions.length) {
          items = await Item.find({
            ...baseQuery,
            $and: regexConditions,
          })
            .sort({ createdAt: -1 })
            .limit(40)
        }
      }
    }

    // ── OPERATORS ONLY — already fetched above ──
    // if still empty and user only used operators, baseQuery already handles it

    return res.json({ items, parsed })
  } catch (err) {
    console.error('[search]', err.message)
    return res.status(500).json({ error: 'Search failed', details: err.message })
  }
}
