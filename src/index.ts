import { Ai } from '@cloudflare/ai'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
    AI: any
    VERCEL_URL: string
    LOCAL_URL: string
}

type Answer = {
    response: string
  }

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', async (c, next) => {
    const corsMiddleware = cors({
        origin: [c.env.LOCAL_URL || '',  c.env.VERCEL_URL || ''],
        allowHeaders: ['Content-Type'],
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
})

app.all('/api/hc', (c) => {
    return c.json({ success: true })
})

export default app
