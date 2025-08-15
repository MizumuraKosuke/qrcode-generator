import { type NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { createCanvas, loadImage } from 'canvas'

async function generateQR(url: string, iconUrl?: string, iconData?: string, size = 400) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Fill background
  ctx.fillStyle = '#f4f5f8'
  ctx.fillRect(0, 0, size, size)

  // Generate QR code
  const qrBuffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: size,
    color: {
      dark: '#000000',
      light: '#f4f5f8',
    },
  })

  const qrImage = await loadImage(qrBuffer)
  ctx.drawImage(qrImage, 0, 0, size, size)

  // Add icon if provided
  if (iconUrl || iconData) {
    try {
      let icon
      if (iconData) {
        // Handle base64 encoded image data
        try {
          const buffer = Buffer.from(iconData, 'base64')
          icon = await loadImage(buffer)
        } catch (err) {
          console.error('Base64 decode/load error:', err)
          throw err
        }
      } else if (iconUrl) {
        try {
          const response = await fetch(iconUrl, {
            headers: {
              'User-Agent': 'QR Generator Bot'
            }
          })
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          const contentType = response.headers.get('content-type')
          
          if (!contentType?.startsWith('image/')) {
            throw new Error(`Invalid content type: ${contentType}`)
          }
          
          const arrayBuffer = await response.arrayBuffer()
          icon = await loadImage(Buffer.from(arrayBuffer))
        } catch (err) {
          console.error('URL fetch/load error:', err)
          throw err
        }
      }

      if (icon) {
        const iconSize = Math.floor(size * 0.15)
        const iconX = (size - iconSize) / 2
        const iconY = (size - iconSize) / 2

        // White background for icon
        ctx.fillStyle = 'white'
        ctx.fillRect(iconX - 4, iconY - 4, iconSize + 8, iconSize + 8)

        ctx.drawImage(icon, iconX, iconY, iconSize, iconSize)
      }
    } catch (iconError) {
      console.error('Failed to load icon:', iconError)
      // Continue without icon instead of failing
    }
  }

  return canvas.toBuffer('image/png')
}

// In-memory cache for POST requests
const postCache = new Map<string, { data: { url: string; iconUrl?: string; iconData?: string; size?: number }; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function POST(req: NextRequest, { params }: { params: Promise<{ hash: string }> }) {
  try {
    const { hash } = await params
    const body = await req.json() as { url: string; iconUrl?: string; iconData?: string; size?: number }
    const { url, iconUrl, iconData, size = 400 } = body

    if (!url) {
      return new Response('URL parameter is required', { status: 400 })
    }

    // Cache the request data
    postCache.set(hash, { data: body, timestamp: Date.now() })

    const buffer = await generateQR(url, iconUrl, iconData, size)

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (e: unknown) {
    console.log(`Failed to generate image: ${String(e)}`)
    return NextResponse.json(
      { error: 'Failed to generate image', details: String(e) },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ hash: string }> }) {
  try {
    const { hash } = await params
    const cached = postCache.get(hash)

    if (!cached || Date.now() - cached.timestamp > CACHE_DURATION) {
      return new Response('Hash not found or expired', { status: 404 })
    }

    const { url, iconUrl, iconData, size = 400 } = cached.data

    const buffer = await generateQR(url, iconUrl, iconData, size)

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (e: unknown) {
    console.log(`Failed to generate image: ${String(e)}`)
    return NextResponse.json(
      { error: 'Failed to generate image', details: String(e) },
      { status: 500 },
    )
  }
}