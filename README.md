# QR Code Generator

Simple QR code generation service with icon support. Built with T3 Stack.

🌐 **Live Demo**: [https://qrcode-generator-sage-alpha.vercel.app/](https://qrcode-generator-sage-alpha.vercel.app/)
> ⚠️ Beta URL - for testing only, don't use in production

## Quick Start

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Usage

```bash
# Basic QR code
GET /api/qr-image?url=https://example.com

# With icon
GET /api/qr-image?url=https://example.com&icon=https://icon.png

# Custom size
GET /api/qr-image?url=https://example.com&size=600
```

## Examples

```html
<img src="http://localhost:3000/api/qr-image?url=https://github.com" alt="QR Code" />
```

```bash
# Live test (⚠️ Beta URL)
curl "https://qrcode-generator-sage-alpha.vercel.app/api/qr-image?url=https://github.com"
```

## Development

```bash
yarn build    # Production build
yarn lint     # Check code quality
```

## License

MIT
