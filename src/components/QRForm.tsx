import { useRef } from 'react'

interface QRFormProps {
  url: string
  setUrl: (url: string) => void
  iconUrl: string
  setIconUrl: (iconUrl: string) => void
  iconFile: File | null
  setIconFile: (file: File | null) => void
  size: number
  setSize: (size: number) => void
}

export function QRForm({
  url,
  setUrl,
  iconUrl,
  setIconUrl,
  iconFile,
  setIconFile,
  size,
  setSize,
}: QRFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
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
        <label className="mb-3 block text-sm font-medium text-white drop-shadow">
          Icon (Optional)
        </label>
        
        {/* Current Selection Display */}
        {(iconUrl || iconFile) && (
          <div className="mb-3 p-3 bg-white/10 rounded-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-white/90 text-sm">
                  {iconFile ? `📁 ${iconFile.name}` : `🔗 ${iconUrl}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIconUrl('')
                  setIconFile(null)
                  // Clear the file input
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
                className="font-bold text-lg leading-none"
                title="選択を削除"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* URL Input */}
          <div>
            <input
              id="iconUrl"
              type="url"
              value={iconUrl}
              onChange={(e) => {
                setIconUrl(e.target.value)
                setIconFile(null)
              }}
              placeholder="画像URLを入力... https://example.com/icon.png"
              className="w-full rounded-lg border border-white/20 bg-white/95 backdrop-blur-sm px-3 py-3 text-base text-gray-800 placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none sm:py-2 sm:text-sm shadow-lg"
              disabled={!!iconFile}
            />
            {!iconFile && (
              <button
                type="button"
                onClick={() => {
                  setIconUrl('https://picsum.photos/seed/qr-test/200/300')
                  setIconFile(null)
                }}
                className="mt-1 text-xs text-white/70 hover:text-white underline"
              >
                テスト画像を使用
              </button>
            )}
          </div>

          <div className="text-center text-white/60 text-sm font-medium">または</div>

          {/* File Input */}
          <div>
            <input
              ref={fileInputRef}
              id="iconFile"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                setIconFile(file)
                if (file) setIconUrl('')
              }}
              className="w-full rounded-lg border border-white/20 bg-white/95 backdrop-blur-sm px-3 py-3 text-base text-gray-800 placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none sm:py-2 sm:text-sm shadow-lg file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-white hover:file:bg-amber-400"
              disabled={!!iconUrl}
            />
          </div>
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
  )
}
