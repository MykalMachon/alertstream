import { Hono } from 'hono'

// WEB VIEW IMPORTS
import Layout from "./components/Layout.tsx";
import HomePageView from "./views/Home.tsx";

// API IMPORTS 
import authApi from "./api/auth.ts";
import eventApi from "./api/events.ts";
import channelApi from "./api/channels.ts";
import settingsApi from "./api/settings.ts";

const app = new Hono()

// REACT APP
app.get('/', (c) => c.html(<HomePageView />))
app.get('/login', (c) => c.html(<Layout>
  <h1>Login</h1>
</Layout>))

app.get('/channels', (c) => c.html(<Layout>
  <h1>Channels</h1>
</Layout>))
app.get('/channels/:cid/events', (c) => c.html(<Layout>
  <h1>Settings</h1>
</Layout>))

app.get('/settings', (c) => c.html(<Layout>
  <h1>Settings</h1>
</Layout>))

// HTTP API
app.route('/api/v1/auth', authApi)
app.route('/api/v1/events', eventApi)
app.route('/api/v1/channels', channelApi)
app.route('/api/v1/settings', settingsApi)

if (import.meta.main) {
  // Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
  Deno.serve(app.fetch)
}
