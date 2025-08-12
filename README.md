# QR Code Generator

A simple, fast QR code generation service built with T3 Stack (Next.js, TypeScript, tRPC, Tailwind CSS).

## Features

- 🚀 **Instant QR Code Generation** - Generate QR codes from any URL
- 🖼️ **Icon Integration** - Add custom icons to QR codes  
- 🔗 **Direct Image Links** - Get shareable URLs for generated QR codes
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **Fast & Lightweight** - Built with modern web technologies

## Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Web Interface

1. Enter a URL (e.g., `https://google.com`)
2. Optionally add an icon URL or use the test image button
3. Adjust size with the slider
4. Click "Generate QR Code"
5. Copy the direct image link to use anywhere

### Direct API Usage

Generate QR codes programmatically:

```bash
# Basic QR code
GET /api/qr-image?url=https://example.com

# With custom icon
GET /api/qr-image?url=https://example.com&icon=https://icon.png

# Custom size (200-800px)
GET /api/qr-image?url=https://example.com&size=600
```

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **tRPC** - End-to-end typesafe APIs
- **Tailwind CSS** - Styling
- **Canvas API** - Server-side image generation
- **QRCode.js** - QR code generation

## Examples

```html
<!-- Use in HTML -->
<img src="http://localhost:3000/api/qr-image?url=https://example.com" alt="QR Code" />
```

```markdown
<!-- Use in Markdown -->
![QR Code](http://localhost:3000/api/qr-image?url=https://example.com&size=300)
```

## Development

```bash
# Format code
yarn format:write

# Lint code  
yarn lint

# Type check
yarn typecheck

# Build for production
yarn build
```

## License

MIT
