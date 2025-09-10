import { Buffer } from "buffer"

export default async function handler(req: any, res: any) {
    try {
      // ambil path setelah /api/
      const url = req.url as string
      const targetUrl = `https://take-home-test-api.nutech-integrasi.com${url.replace(/^\/api/, '')}`
  
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          ...req.headers,
          host: '', // buang host vercel
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
      })
  
      // copy content-type
      const contentType = response.headers.get('content-type')
      if (contentType) {
        res.setHeader('content-type', contentType)
      }
  
      // forward response ke client
      const buffer = Buffer.from(await response.arrayBuffer())
      res.statusCode = response.status
      res.end(buffer)
    } catch (err: any) {
      res.statusCode = 500
      res.json({ message: 'Proxy error', error: err.message })
    }
  }
  