import { type NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { createCanvas, loadImage } from 'canvas'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')
    const iconUrl = searchParams.get('icon')
    const size = parseInt(searchParams.get('size') ?? '400')

    if (!url) {
      return new Response('URL parameter is required', { status: 400 })
    }

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
    if (iconUrl) {
      try {
        const icon = await loadImage(iconUrl)
        const iconSize = Math.floor(size * 0.15)
        const iconX = (size - iconSize) / 2
        const iconY = (size - iconSize) / 2

        // White background for icon
        ctx.fillStyle = 'white'
        ctx.fillRect(iconX - 4, iconY - 4, iconSize + 8, iconSize + 8)

        ctx.drawImage(icon, iconX, iconY, iconSize, iconSize)
      } catch (iconError) {
        console.log('Failed to load icon:', iconError)
      }
    }

    const buffer = canvas.toBuffer('image/png')

    return new NextResponse(buffer, {
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
