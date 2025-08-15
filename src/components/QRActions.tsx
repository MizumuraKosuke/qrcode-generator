'use client'

import { useState } from 'react'

interface QRActionsProps {
  data?: {
    qrCode: string
    url: string
    iconUrl?: string
    iconData?: string
    size: number
  } | null
  loading: boolean
}

export function QRActions({ data, loading }: QRActionsProps) {
  const [copySuccess, setCopySuccess] = useState(false)

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

  if (!data || loading) {
    return null
  }

  return (
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
            href={data.qrCode}
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
            {window.location.origin}{data.qrCode}
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
  )
}