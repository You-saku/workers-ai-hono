import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Ai } from '@cloudflare/ai'

type Bindings = {
    AI: any
}

type Answer = {
    response: string
  }

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())
app.use(
    '/api/*',
    cors({
      origin: 'http://localhost:3000',
      allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
      allowMethods: ['POST', 'GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
      maxAge: 600,
      credentials: true,
    })
  )
  
app.all('/api/ai', async (c): Promise<Response> => {
    const body = await c.req.json()
    console.log(body['prompt'])

    const ai = new Ai(c.env.AI)
    const answer: Answer = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
        prompt: body['prompt'],
    });

    // return new Response(JSON.stringify(answer));


    return c.json({ response : answer.response })
    // return c.json({ success: true })
})

app.all('/api2/abc', (c) => {
    return c.json({ success: true })
})

export default app
