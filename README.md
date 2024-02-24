# workers-ai-hono

## requirements
* node 18.16.1
* npm 6.12.0

## usage
### setup
```
npm install
npm run dev
```

### deploy
```
touch wrangler.toml
npm run deploy
```

wrangler.toml
```
name = "workers-ai-hono"
compatibility_date = "2023-01-01"

[ai]
binding = "AI" # i.e. available in your Worker on env.AI

[vars]
LOCAL_URL = "http://localhost:3000"
```
