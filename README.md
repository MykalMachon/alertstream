# AlertStream

A simple http API and admin for log aggregation and alerting.

This project is inspired by [LogSnag](https://logsnag.com/) and [Sanity](https://sanity.io). It aims to be a much more minimal logging and alerting system for frontend errors and metadata.
Both Logsnag and Sanity are amazing but I need about 10% of their features for my work + would need data residency features they don't offer afaik. 

## Components

- HTTP API: API to do all the things.
- Web App: simple app to create channels + notification systems, manage roles, and API keys.

## But why?

I don't want to pay for a massive log aggregation tool and I want to very easily be able to spin up a tool to aggregate alerts in our web apps + back ends without having to pay $$$ or worry about data residency which is a common issue in govt and higher ed.

## Features 

- [ ] API 
  - [x] Authentication System
    - [x] Default admin account
    - [x] Login/Logout with cookies
    - [x] Login/Logout with JWT 
    - [x] API Key creation/listing/deleting
  - [ ] Channels for events
    - [x] Creating channels to sort events
    - [x] Deleting channels
    - [ ] Set retention period events
    - [ ] Link channels to relays 
  - [x] Events API
    - [x] Send events to the api via the API Key
  - [ ] Relays API
    - [ ] Create Relays
    - [ ] Update Relays
    - [ ] Deleted Relays
    - [ ] Teams Webhook Relay
    - [ ] Discord Webhook Relay      
- [ ] Frontend
  - [ ] Auth Context / User Login System
    - [ ] Login
    - [ ] Logout
    - [ ] View API Keys
    - [ ] Create API key
    - [ ] Delete API Key 
  - [ ] Channels
    - [ ] Create channels
    - [ ] Update channels
    - [ ] Views channels and events
    - [ ] Set Relay to Channels
  - [ ] Relays
    - [ ] View Relays
    - [ ] Create Relays
    - [ ] Update Relays
    - [ ] Delete Relays
- [ ] Other
  - [ ] Prometheus Endpoint (allow ingest into Prometheus)
  - [ ] Promtail Logfile (allow ingest into Loki).    
