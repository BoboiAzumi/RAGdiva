import "dotenv/config"
import { serve } from '@hono/node-server'
import { Context, Hono } from 'hono'
import { authRoute } from './routes/auth-route.js'
import type { HTTPResponseError } from 'hono/types'
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/auth", authRoute)

app.onError(async (err: Error | HTTPResponseError | HTTPException, c: Context) => {
  if (err instanceof HTTPException) {
    return c.json({
      message: err.message,
      data: []
    }, err.status)
  }

  return c.json({
    message: 'Internal Server Error : ' + err.message,
    data: []
  }, 500)
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
