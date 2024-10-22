import { Hono } from 'hono'

const channelApi = new Hono()

channelApi.get('/', (c) => c.text('Hello from /api/v1/channels!'));

export default channelApi;