import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Ai } from '@cloudflare/ai'

type Bindings = {
    AI: any
    VERCEL_URL: string
}

type Answer = {
    response: string
  }

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', async (c, next) => {
    const corsMiddleware = cors({
        origin: ['http://localhost:3000',  c.env.VERCEL_URL || ''],
        allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
        allowMethods: ['POST', 'GET', 'OPTIONS'],
        exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
        credentials: true,
    })
    return await corsMiddleware(c, next)
})

  
app.all('/api/ai', async (c): Promise<Response> => {
    const body = await c.req.json()
    console.log(body['prompt'])

    const ai = new Ai(c.env.AI)
    const answer: Answer = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
        prompt: body['prompt'],
    });

    return c.json({ response : answer.response })
    // return c.json({ success: true })
})

app.all('/api2/abc', (c) => {
    return c.json({ success: true })
})

export default app
