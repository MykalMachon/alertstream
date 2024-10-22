import { Hono } from 'hono'

const authApi = new Hono()

authApi.get('/', (c) => c.text('Hello from /api/v1/auth!'))

authApi.post('/login', (c) => c.json({ message: 'stub' }))
authApi.post('/logout', (c) => c.json({ message: 'stub' }))

// API Keys
authApi.post('/apikey/', (c) => c.json({ message: 'stub' }))
authApi.delete('/apikey/', (c) => c.json({ message: 'stub' }))

export default authApi;