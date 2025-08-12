import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const qrRouter = createTRPCRouter({
  generate: publicProcedure
    .input(
      z.object({
        url: z.string().url(),
        iconUrl: z.string().url().optional(),
        size: z.number().min(100).max(1000).default(400),
      }),
    )
    .query(async ({ input }) => {
      // Use server-side image generation with canvas for both cases
      const params = new URLSearchParams({
        url: input.url,
        size: input.size.toString(),
      })

      if (input.iconUrl) {
        params.set('icon', input.iconUrl)
      }

      const imageUrl = `/api/qr-image?${params.toString()}`

      return {
        qrCode: imageUrl,
        url: input.url,
        iconUrl: input.iconUrl,
        size: input.size,
      }
    }),
})
