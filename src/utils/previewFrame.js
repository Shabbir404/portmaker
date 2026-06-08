import { injectPortfolioNavFix } from './portfolioNavFix.js'

/** Wrap HTML for iframe preview (blob URL). */
export function prepareHtmlForPreview(html = '') {
  return injectPortfolioNavFix(html)
}

export function createPreviewBlobUrl(html) {
  const blob = new Blob([prepareHtmlForPreview(html)], { type: 'text/html;charset=utf-8' })
  return URL.createObjectURL(blob)
}

export { injectPortfolioNavFix } from './portfolioNavFix.js'
