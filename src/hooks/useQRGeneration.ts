'use client'

import { useState, useMemo, useEffect } from 'react'
import { api } from '@/trpc/react'

interface QRData {
  qrCode: string
  url: string
  iconUrl?: string
  iconData?: string
  size: number
}

export function useQRGeneration(url: string, iconUrl: string, iconData: string | null, size: number) {
  const isValidUrl = !!url && url.startsWith('http') && url.length > 7

  const queryInput = useMemo(() => {
    const input = {
      url,
      iconUrl: iconUrl || undefined,
      iconData: iconData ?? undefined,
      size,
    }
    return input
  }, [url, iconUrl, iconData, size])

  const { data, isLoading } = api.qr.generate.useQuery(
    queryInput,
    {
      enabled: isValidUrl && !iconData, // Skip tRPC when iconData exists
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  )

  // Direct POST handling for iconData to avoid 431 errors
  const [postData, setPostData] = useState<QRData | null>(null)
  const [postLoading, setPostLoading] = useState(false)

  useEffect(() => {
    if (isValidUrl && iconData) {
      setPostLoading(true)
      const directPost = async () => {
        try {
          // Generate simple hash for the request
          const dataString = JSON.stringify({ url, iconData, size })
          const hash = btoa(dataString).replace(/[+/=]/g, '').substring(0, 16)
          
          // First POST the data to cache it
          await fetch(`/api/qr-image/post/${hash}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url,
              iconData,
              size,
            }),
          })
          
          // Then use the GET endpoint
          setPostData({
            qrCode: `/api/qr-image/post/${hash}`,
            url,
            iconData,
            size,
          })
        } catch (error) {
          console.error('Direct POST failed:', error)
        } finally {
          setPostLoading(false)
        }
      }
      void directPost()
    } else {
      setPostData(null)
      setPostLoading(false)
    }
  }, [url, iconData, size, isValidUrl])

  // Use POST data when available, otherwise use tRPC data
  const finalData = postData ?? data
  const finalLoading = postLoading || isLoading

  return {
    data: finalData,
    loading: finalLoading,
  }
}