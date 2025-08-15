'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { api } from '@/trpc/react' 

export default function Home() {
  const [url, setUrl] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [size, setSize] = useState(400)
  const [copySuccess, setCopySuccess] = useState(false)
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
  const [postData, setPostData] = useState<{
    qrCode: string
    url: string
    iconData: string
    size: number
  } | null>(null)
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

  const handleCopyLink = async () => {
    if (!finalData) return

    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${finalData.qrCode}`,
      )
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-teal-500 text-white relative">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-8 sm:gap-12 sm:py-16 relative z-10">
        <h1 className="text-center text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-[5rem] text-white drop-shadow-lg">
          QR Code <span className="text-amber-500 drop-shadow-lg">Generator</span>
        </h1>

        <div className="w-full max-w-md space-y-4">
          <div>
            <label htmlFor="url" className="mb-2 block text-sm font-medium text-white drop-shadow">
              URL
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-white/20 bg-white/95 backdrop-blur-sm px-3 py-3 text-base text-gray-800 placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none sm:py-2 sm:text-sm shadow-lg"
            />
          </div>

          <div>
            <label htmlFor="iconUrl" className="mb-2 block text-sm font-medium text-white drop-shadow">
              Icon (Optional)
            </label>
            <div className="space-y-2">
              <input
                id="iconUrl"
                type="url"
                value={iconUrl}
                onChange={(e) => {
                  setIconUrl(e.target.value)
                  setIconFile(null)
                }}
                placeholder="https://example.com/icon.png"
                className="w-full rounded-lg border border-white/20 bg-white/95 backdrop-blur-sm px-3 py-3 text-base text-gray-800 placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none sm:py-2 sm:text-sm shadow-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setIconUrl('https://picsum.photos/seed/qr-test/200/300')
                  setIconFile(null)
                }}
                className="text-xs underline drop-shadow"
              >
                Use Test Image (picsum.photos)
              </button>
              <div className="text-center text-white/80 text-sm">または</div>
              <input
                id="iconFile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  setIconFile(file)
                  if (file) setIconUrl('')
                }}
                className="w-full rounded-lg border border-white/20 bg-white/95 backdrop-blur-sm px-3 py-3 text-base text-gray-800 placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none sm:py-2 sm:text-sm shadow-lg file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
              {iconFile && (
                <div className="text-sm text-white/90 bg-white/10 rounded px-2 py-1">
                  選択されたファイル: {iconFile.name}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="size" className="mb-2 block text-sm font-medium text-white drop-shadow">
              Size: {size}px
            </label>
            <input
              id="size"
              type="range"
              min="200"
              max="800"
              step="50"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full rounded-lg bg-white/95 backdrop-blur-sm appearance-none h-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>

        </div>

        {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
        {(finalData || finalLoading) && (
          <div className="flex w-full max-w-lg flex-col items-center gap-4">
            <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow-2xl p-3 sm:p-4 border border-white/20">
              {finalLoading ? (
                <div className="flex h-64 w-64 flex-col items-center justify-center gap-3 sm:h-80 sm:w-80">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-amber-500"></div>
                  <span className="text-sm font-medium text-amber-600">
                    Loading QR...
                  </span>
                </div>
              ) : (
                finalData && (
                  <Image
                    src={finalData.qrCode}
                    alt="QR Code"
                    width={400}
                    height={400}
                    className="h-auto w-full max-w-xs sm:max-w-sm"
                    unoptimized
                  />
                )
              )}
            </div>
            {finalData && !finalLoading && (
              <div className="w-full space-y-4">
                {/* Direct Image Link - Most prominent */}
                <div className="rounded-lg bg-white/95 backdrop-blur-sm p-3 sm:p-4 shadow-lg">
                <h3 className="mb-2 text-base font-semibold text-amber-400 sm:text-lg">
                  🔗 Direct Image Link
                </h3>
                <p className="mb-3 text-xs text-gray-700 sm:text-sm">
                  Use this URL anywhere to display the QR code:
                </p>
                <div className="rounded bg-black/85 p-2 font-mono text-xs sm:p-3 sm:text-sm shadow-inner overflow-hidden">
                  <a
                    href={finalData.qrCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline block leading-relaxed"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {window.location.origin}{finalData.qrCode}
                  </a>
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`mt-3 w-full transform rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all duration-200 sm:text-base ${
                    copySuccess
                      ? 'scale-105 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:scale-105 hover:from-amber-600 hover:to-amber-700'
                  } shadow-lg hover:shadow-xl active:scale-95`}
                >
                  {copySuccess ? (
                    <span className="flex items-center justify-center gap-2">
                      ✅ Copied!
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      📋 Copy Direct Link
                    </span>
                  )}
                </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
