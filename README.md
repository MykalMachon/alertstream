# AlertStream

a simple http alerting and log aggregation tool. There are two core functions here. 

## Components

- HTTP API: API to send error logs to 
- Web Admin: simple app to create channels + notification systems, manage roles, and API keys.
- Redis: persistent log store database

## But why?

I don't want to pay for a massive log aggregation tool and I want to very easily be able to spin up a tool to aggregate alerts in our web apps + back ends without having to pay $$$ or worry about data residency which is a common issue in govt and higher ed.
