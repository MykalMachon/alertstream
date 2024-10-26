import { Hono } from 'hono'

const settingsApi = new Hono()

settingsApi.get('/', (c) => c.text('Hello from /api/v1/settings!'));

export default settingsApi;