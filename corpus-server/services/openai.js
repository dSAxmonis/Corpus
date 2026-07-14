import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

// try these in order — if the primary model is deprecated/renamed by Groq,
// fall back automatically instead of failing outright
const MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama3-70b-8192',
]

function detectContentType(url) {
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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function callGroq(messages) {
  let lastError
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await client.chat.completions.create({
          model,
          max_tokens: 300,
          temperature: 0.2,
          messages,
        })
        return result
      } catch (err) {
        lastError = err
        console.error(`[groq] model=${model} attempt=${attempt + 1} failed:`, err.status || '', err.message)
        if (attempt === 0) await sleep(700)
      }
    }
    // this model failed twice, try the next one in MODELS
  }
  throw lastError
}

export async function generateSummaryAndTags({ title, content, url, type }) {
  if (!process.env.GROQ_API_KEY) {
    console.error('[groq] GROQ_API_KEY is not set — AI tagging will not work. Check your environment variables (Render dashboard, not just local .env).')
    return { summary: '', tags: [], contentType: detectContentType(url), failed: true }
  }

  const contentType = detectContentType(url)
  const text = [title, content, url].filter(Boolean).join('\n').slice(0, 2000)
  const domain = url ? (() => { try { return new URL(url).hostname.replace('www.', '') } catch { return '' } })() : ''

  try {
    const result = await callGroq([
      {
        role: 'system',
        content: `You are a personal knowledge assistant helping someone tag and summarize things they saved.

Your job: generate a summary and 4-7 highly specific, memorable tags for what they saved.

TAGGING RULES:
- Tags must help the user REMEMBER and FIND this item later
- Be SPECIFIC not generic: "react-hooks" not "code", "javascript-async" not "programming"
- Include: topic, domain/subject, format/medium if relevant, key concepts
- For YouTube: include "youtube", the channel topic, subject matter
- For articles: include the site name if notable, the topic
- For GitHub: include "github", language, what the project does
- For notes/quotes: focus purely on the concepts and themes
- Tags should be lowercase, hyphenated if multi-word
- 4 minimum, 7 maximum

OUTPUT: Only valid JSON, no markdown, no explanation:
{
  "summary": "One sharp sentence explaining exactly what this is and why someone would save it. Max 35 words.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`,
      },
      {
        role: 'user',
        content: `Type: ${type || 'link'}\n${contentType ? `Platform: ${contentType}` : ''}\n${domain ? `Domain: ${domain}` : ''}\nContent:\n${text}`,
      },
    ])

    const raw = result.choices[0].message.content.trim()
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return {
      summary: parsed.summary || '',
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 7) : [],
      contentType,
      failed: false,
    }
  } catch (err) {
    console.error('[groq] all models/attempts exhausted:', err.status || '', err.message)
    return { summary: '', tags: [], contentType, failed: true }
  }
}
