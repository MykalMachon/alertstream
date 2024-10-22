import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello from Deno!'))

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  Deno.serve(app.fetch)
}
