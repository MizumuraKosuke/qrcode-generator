'use client'

import Image from 'next/image'

interface QRDisplayProps {
  data?: {
    qrCode: string
    url: string
    iconUrl?: string
    iconData?: string
    size: number
  } | null
  loading: boolean
}

export function QRDisplay({ data, loading }: QRDisplayProps) {
  if (!data && !loading) {
    return null
  }

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      <div className="rounded-lg bg-white/95 backdrop-blur-sm shadow-2xl p-3 sm:p-4 border border-white/20">
        {loading ? (
          <div className="flex h-64 w-64 flex-col items-center justify-center gap-3 sm:h-80 sm:w-80">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-amber-500"></div>
            <span className="text-sm font-medium text-amber-600">
              Loading QR...
            </span>
          </div>
        ) : (
          data && (
            <Image
              src={data.qrCode}
              alt="QR Code"
              width={400}
              height={400}
              className="h-auto w-full max-w-xs sm:max-w-sm"
              unoptimized
            />
          )
        )}
      </div>
    </div>
  )
}