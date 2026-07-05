/**
 * Parses a search query string into structured search parameters.
 *
 * Supported syntax:
 *   tag:design          → filter by tag
 *   site:youtube.com    → filter by domain
 *   type:youtube        → filter by contentType
 *   type:note           → filter by item type
 *   -word               → exclude word
 *   "exact phrase"      → exact match
 *   word1 || word2      → OR search
 *   yesterday/lastweek  → date filter
 *   anything else       → full text search
 */
export function parseQuery(raw) {
  const result = {
    text: '',           // main search text
    tags: [],           // tag: filters
    site: null,         // site: filter
    contentTypes: [],   // type: filters
    itemTypes: [],      // link/note/quote/image
    exclude: [],        // -word exclusions
    exact: null,        // "exact phrase"
    orTerms: [],        // OR terms
    dateFilter: null,   // { $gte: Date }
    hasOperators: false,
  }

  let q = raw.trim()

  // OR search
  if (q.includes('||')) {
    result.orTerms = q.split('||').map(t => t.trim()).filter(Boolean)
    result.hasOperators = true
    return result
  }

  // extract tag: operators
  q = q.replace(/\btag:(\S+)/gi, (_, val) => {
    result.tags.push(val.toLowerCase())
    result.hasOperators = true
    return ''
  })

  // extract site: operator
  q = q.replace(/\bsite:(\S+)/gi, (_, val) => {
    result.site = val.toLowerCase()
    result.hasOperators = true
    return ''
  })

  // extract type: operator
  const CONTENT_TYPES = ['youtube', 'github', 'twitter', 'tweet', 'reddit', 'instagram', 'linkedin', 'article', 'webpage', 'pdf']
  const ITEM_TYPES = ['link', 'note', 'quote', 'image']
  q = q.replace(/\btype:(\S+)/gi, (_, val) => {
    const v = val.toLowerCase()
    if (ITEM_TYPES.includes(v)) {
      result.itemTypes.push(v)
    } else {
      result.contentTypes.push(v)
    }
    result.hasOperators = true
    return ''
  })

  // extract exact phrase
  const exactMatch = q.match(/"([^"]+)"/)
  if (exactMatch) {
    result.exact = exactMatch[1]
    q = q.replace(exactMatch[0], '')
    result.hasOperators = true
  }

  // extract -exclusions
  q = q.replace(/-(\w+)/g, (_, word) => {
    result.exclude.push(word)
    result.hasOperators = true
    return ''
  })

  // date shortcuts
  const now = new Date()
  if (/\byesterday\b/i.test(q)) {
    const d = new Date(now); d.setDate(d.getDate() - 1); d.setHours(0,0,0,0)
    result.dateFilter = { $gte: d }
    q = q.replace(/\byesterday\b/gi, '')
    result.hasOperators = true
  } else if (/\blast\s*week\b/i.test(q)) {
    const d = new Date(now); d.setDate(d.getDate() - 7)
    result.dateFilter = { $gte: d }
    q = q.replace(/\blast\s*week\b/gi, '')
    result.hasOperators = true
  } else if (/\blast\s*month\b/i.test(q)) {
    const d = new Date(now); d.setMonth(d.getMonth() - 1)
    result.dateFilter = { $gte: d }
    q = q.replace(/\blast\s*month\b/gi, '')
    result.hasOperators = true
  }

  result.text = q.trim()
  return result
}
