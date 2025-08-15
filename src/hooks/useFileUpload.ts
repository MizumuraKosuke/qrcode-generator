'use client'

import { useState, useEffect } from 'react'

export function useFileUpload(iconFile: File | null) {
  const [iconData, setIconData] = useState<string | null>(null)

  useEffect(() => {
    if (iconFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        // Extract base64 data (remove data:image/...;base64, prefix)
        const base64 = result.split(',')[1]
        setIconData(base64 ?? null)
      }
      reader.readAsDataURL(iconFile)
    } else {
      setIconData(null)
    }
  }, [iconFile])

  return iconData
}