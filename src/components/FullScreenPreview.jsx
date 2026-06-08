import { useEffect, useRef } from 'react'
import { X, ExternalLink, Maximize2 } from 'lucide-react'
import PreviewIframe from './PreviewIframe'
import { createPreviewBlobUrl } from '../utils/previewFrame'

export default function FullScreenPreview({ html, title = 'Preview', onClose }) {
  const wrapRef = useRef(null)
  const isBrowserFullscreen = () => document.fullscreenElement === wrapRef.current

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (isBrowserFullscreen()) {
          document.exitFullscreen?.()
        } else {
          onClose()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const openInNewTab = () => {
    const url = createPreviewBlobUrl(html)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(url), 120_000)
  }

  const toggleBrowserFullscreen = async () => {
    if (!wrapRef.current) return
    try {
      if (isBrowserFullscreen()) {
        await document.exitFullscreen?.()
      } else {
        await wrapRef.current.requestFullscreen?.()
      }
    } catch {
      /* unsupported or blocked */
    }
  }

  return (
    <div className="fs-preview" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fs-preview__toolbar">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink truncate">{title}</p>
          <p className="text-[11px] text-ink-3 hidden sm:block">Full-size preview · scroll and interact like a live site</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button type="button" onClick={toggleBrowserFullscreen} className="fs-preview__btn" title="Browser fullscreen">
            <Maximize2 size={15} />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
          <button type="button" onClick={openInNewTab} className="fs-preview__btn" title="Open in new tab">
            <ExternalLink size={15} />
            <span className="hidden sm:inline">New tab</span>
          </button>
          <button type="button" onClick={onClose} className="fs-preview__btn fs-preview__btn--close" title="Close (Esc)">
            <X size={16} />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      <div ref={wrapRef} className="fs-preview__frame-wrap">
        <PreviewIframe
          html={html}
          title={title}
          className="fs-preview__iframe"
        />
      </div>
    </div>
  )
}

export function FullScreenPreviewLoading({ title = 'Loading preview…', onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="fs-preview" role="dialog" aria-modal="true">
      <div className="fs-preview__toolbar">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <button type="button" onClick={onClose} className="fs-preview__btn fs-preview__btn--close">
          <X size={16} />
        </button>
      </div>
      <div className="fs-preview__frame-wrap flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-accent rounded-full animate-spin" />
      </div>
    </div>
  )
}
