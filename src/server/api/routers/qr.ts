import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { createHash } from 'crypto'

export const qrRouter = createTRPCRouter({
  generate: publicProcedure
    .input(
      z.object({
        url: z.string().url(),
        iconUrl: z.string().url().optional(),
        iconData: z.string().optional(), // Base64 encoded image data
        size: z.number().min(100).max(1000).default(400),
      }),
    )
    .query(async ({ input }) => {
      // Use POST for any iconData (base64 files are always large)
      const usePOST = !!input.iconData

      if (usePOST) {
        // Generate a unique hash for the POST request to enable caching
        const hash = createHash('md5').update(JSON.stringify(input)).digest('hex')
        
        return {
          qrCode: `/api/qr-image/post/${hash}`,
          url: input.url,
          iconUrl: input.iconUrl,
          iconData: input.iconData,
          size: input.size,
          _postData: input, // Include data for POST request
        }
      } else {
        // Use GET for small data
        const params = new URLSearchParams({
          url: input.url,
          size: input.size.toString(),
        })

        if (input.iconUrl) {
          params.set('icon', input.iconUrl)
        } else if (input.iconData) {
          params.set('iconData', input.iconData)
        }

        const imageUrl = `/api/qr-image?${params.toString()}`

        return {
          qrCode: imageUrl,
          url: input.url,
          iconUrl: input.iconUrl,
          iconData: input.iconData,
          size: input.size,
        }
      }
    }),
})
