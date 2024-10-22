import { Hono } from 'hono'

const eventApi = new Hono()

eventApi.get('/', (c) => c.text('Hello from /api/v1/events!'))

export default eventApi;