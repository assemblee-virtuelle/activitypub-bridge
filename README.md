[![SemApps](https://badgen.net/badge/Powered%20by/SemApps/28CDFB)](https://semapps.org)

# ActivityPub Bridge

Currently supports sending messages to [Mattermost](https://mattermost.com) channels.

## Getting started

Requirements:
- Node (v12.20 recommended)
- Yarn
- Docker
- Docker-compose

### 1. Launch Jena Fuseki

```bash
docker-compose up
```

It is now running on http://localhost:3030

### 2. Launch in dev mode

```bash
yarn install
yarn run dev
```

## Mattermost configuration

### Overriding profile usernames et pictures

By default, Mattermost will post webhook messages as the user who created the webhook, with a `BOT` label.

To be able to use the default image, you need enable the `EnablePostUsernameOverride` and `EnablePostIconOverride` settings.

More informations on the [Mattermost docs](https://docs.mattermost.com/configure/configuration-settings.html#enable-integrations-to-override-usernames)