/**
 * Resize/compress before upload — user picks any size; we store a web-friendly file.
 */
export function compressImageFile(file, { maxWidth = 1920, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) {
      reject(new Error('Please choose an image file.'))
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Could not process image.'))
            return
          }
          const ext = file.type.includes('png') ? 'png' : 'jpg'
          resolve(new File([blob], `image.${ext}`, { type: blob.type || 'image/jpeg' }))
        },
        file.type.includes('png') ? 'image/png' : 'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not load image.'))
    }

    img.src = url
  })
}
