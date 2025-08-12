'use client'

import { useState } from 'react'
import { api } from '@/trpc/react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const [size, setSize] = useState(400)
  const [copySuccess, setCopySuccess] = useState(false)

  const queryInput = {
    url,
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    iconUrl: iconUrl || undefined,
    size,
  }

  const { data, isLoading } = api.qr.generate.useQuery(
    queryInput,
    {
      enabled: !!url && url.startsWith('http') && url.length > 7,
    },
  )

  const handleCopyLink = async () => {
    if (!data) return

    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${data.qrCode}`,
      )
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-8 sm:gap-12 sm:py-16">
        <h1 className="text-center text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-[5rem]">
          QR Code <span className="text-[hsl(280,100%,70%)]">Generator</span>
        </h1>

        <div className="w-full max-w-md space-y-4">
          <div>
            <label htmlFor="url" className="mb-2 block text-sm font-medium">
              URL
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-gray-300 bg-white/10 px-3 py-3 text-base text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none sm:py-2 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="iconUrl" className="mb-2 block text-sm font-medium">
              Icon URL (Optional)
            </label>
            <div className="space-y-2">
              <input
                id="iconUrl"
                type="url"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://example.com/icon.png"
                className="w-full rounded-lg border border-gray-300 bg-white/10 px-3 py-3 text-base text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none sm:py-2 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setIconUrl('https://picsum.photos/200/300')}
                className="text-xs text-purple-300 underline hover:text-purple-200"
              >
                Use Test Image (picsum.photos)
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="size" className="mb-2 block text-sm font-medium">
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
              className="w-full"
            />
          </div>

        </div>

        {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
        {(data || isLoading) && (
          <div className="flex w-full max-w-lg flex-col items-center gap-4">
            <div className="rounded-lg bg-white p-3 sm:p-4">
              {isLoading ? (
                <div className="flex h-64 w-64 flex-col items-center justify-center gap-3 sm:h-80 sm:w-80">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                  <span className="text-sm font-medium text-purple-600">
                    Loading QR...
                  </span>
                </div>
              ) : (
                data && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={data.qrCode}
                    alt="QR Code"
                    className="h-auto w-full max-w-xs sm:max-w-sm"
                    onError={(e) => {
                      console.error('Failed to load QR image:', data.qrCode)
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )
              )}
            </div>
            {data && !isLoading && (
              <div className="w-full space-y-4">
                {/* Direct Image Link - Most prominent */}
                <div className="rounded-lg border border-purple-400/30 bg-purple-600/20 p-3 sm:p-4">
                <h3 className="mb-2 text-base font-semibold text-purple-300 sm:text-lg">
                  🔗 Direct Image Link
                </h3>
                <p className="mb-3 text-xs text-gray-300 sm:text-sm">
                  Use this URL anywhere to display the QR code:
                </p>
                <div className="rounded bg-black/30 p-2 font-mono text-xs break-all sm:p-3 sm:text-sm">
                  <a
                    href={data.qrCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 underline hover:text-purple-200"
                  >
                    {window.location.origin}
                    {data.qrCode}
                  </a>
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`mt-3 w-full transform rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all duration-200 sm:text-base ${
                    copySuccess
                      ? 'scale-105 bg-green-600 hover:bg-green-700'
                      : 'bg-purple-600 hover:scale-105 hover:bg-purple-700'
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

                {/* Original URL */}
                <div className="text-center">
                  <span className="text-sm text-gray-400">QR code for: </span>
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-purple-400 underline hover:text-purple-300"
                  >
                    {data.url}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
