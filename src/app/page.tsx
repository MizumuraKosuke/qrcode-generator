'use client'

import { useState } from 'react'
import { QRForm } from '@/components/QRForm'
import { QRDisplay } from '@/components/QRDisplay'
import { QRActions } from '@/components/QRActions'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useQRGeneration } from '@/hooks/useQRGeneration'

export default function Home() {
  const [url, setUrl] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [size, setSize] = useState(400)

  const iconData = useFileUpload(iconFile)
  const { data, loading } = useQRGeneration(url, iconUrl, iconData, size)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-teal-500 text-white relative">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-8 sm:gap-12 sm:py-16 relative z-10">
        <h1 className="text-center text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-[5rem] text-white drop-shadow-lg">
          QR Code <span className="text-amber-500 drop-shadow-lg">Generator</span>
        </h1>

        <QRForm
          url={url}
          setUrl={setUrl}
          iconUrl={iconUrl}
          setIconUrl={setIconUrl}
          iconFile={iconFile}
          setIconFile={setIconFile}
          size={size}
          setSize={setSize}
        />

        {(data ?? loading) && (
          <>
            <QRDisplay data={data} loading={loading} />
            <QRActions data={data} loading={loading} />
          </>
        )}
      </div>
    </main>
  )
}
