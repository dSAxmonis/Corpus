import ogs from 'open-graph-scraper'

export async function scrapeUrl(url) {
  try {
    const { result } = await ogs({ url, timeout: 8000 })
    const domain = new URL(url).hostname.replace('www.', '')
    return {
      title: result.ogTitle || result.twitterTitle || domain,
      description: result.ogDescription || result.twitterDescription || '',
      thumbnailUrl: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || null,
      faviconUrl: result.favicon
        ? new URL(result.favicon, url).href
        : `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      siteName: result.ogSiteName || domain,
    }
  } catch {
    const domain = (() => { try { return new URL(url).hostname.replace('www.', '') } catch { return url } })()
    return {
      title: domain,
      description: '',
      thumbnailUrl: null,
      faviconUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      siteName: domain,
    }
  }
}
