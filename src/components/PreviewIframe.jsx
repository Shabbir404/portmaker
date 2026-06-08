import { useEffect, useState } from 'react'
import { createPreviewBlobUrl } from '../utils/previewFrame'

/**
 * Renders portfolio HTML in an iframe via blob URL so in-page nav (#about, etc.) works.
 */
export default function PreviewIframe({ html, title = 'Portfolio preview', className = '', style }) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    if (!html) {
      setSrc('')
      return undefined
    }
    const url = createPreviewBlobUrl(html)
    setSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [html])

  if (!src) return null

  return (
    <iframe
      title={title}
      src={src}
      className={className}
      style={style}
    />
  )
}
