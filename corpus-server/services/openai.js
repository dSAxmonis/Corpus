import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

/**
 * Detects the content type based on URL and metadata.
 * Returns one of: youtube, article, webpage, tweet, github, reddit,
 * instagram, linkedin, pdf, note, quote, image
 */
function detectContentType(url, title, content) {
  if (!url) return null
  try {
    const domain = new URL(url).hostname.replace('www.', '')
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) return 'youtube'
    if (domain.includes('github.com')) return 'github'
    if (domain.includes('twitter.com') || domain.includes('x.com')) return 'tweet'
    if (domain.includes('reddit.com')) return 'reddit'
    if (domain.includes('instagram.com')) return 'instagram'
    if (domain.includes('linkedin.com')) return 'linkedin'
    if (domain.includes('medium.com') || domain.includes('substack.com') || domain.includes('dev.to')) return 'article'
    if (url.endsWith('.pdf')) return 'pdf'
  } catch {}
  return 'webpage'
}

export async function generateSummaryAndTags({ title, content, url, type }) {
  if (!process.env.GROQ_API_KEY) {
    return { summary: '', tags: [], contentType: detectContentType(url, title, content) }
  }

  const contentType = detectContentType(url, title, content)
  const text = [title, content, url].filter(Boolean).join('\n').slice(0, 2000)
  const domain = url ? (() => { try { return new URL(url).hostname.replace('www.', '') } catch { return '' } })() : ''

  try {
    const result = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: `You are a personal knowledge assistant helping someone tag and summarize things they saved.

Your job: generate a summary and 4-7 highly specific, memorable tags for what they saved.

TAGGING RULES:
- Tags must help the user REMEMBER and FIND this item later
- Be SPECIFIC not generic: "react-hooks" not "code", "javascript-async" not "programming"
- Include: topic, domain/subject, format/medium if relevant, key concepts
- For YouTube: include "youtube", the channel topic, subject matter
- For articles: include the site name if notable (medium, substack), the topic
- For GitHub: include "github", language, what the project does
- For notes/quotes: focus purely on the concepts and themes
- Tags should be lowercase, hyphenated if multi-word
- 4 minimum, 7 maximum

OUTPUT: Only valid JSON, no markdown, no explanation:
{
  "summary": "One sharp sentence explaining exactly what this is and why someone would save it. Max 35 words.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`
        },
        {
          role: 'user',
          content: `Type: ${type || 'link'}
${contentType ? `Platform: ${contentType}` : ''}
${domain ? `Domain: ${domain}` : ''}
Content:
${text}`
        }
      ],
    })

    const raw = result.choices[0].message.content.trim()
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return {
      summary: parsed.summary || '',
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 7) : [],
      contentType,
    }
  } catch (err) {
    console.error('[groq]', err.message)
    return { summary: '', tags: [], contentType }
  }
}
