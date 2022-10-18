[![SemApps](https://badgen.net/badge/Powered%20by/SemApps/28CDFB)](https://semapps.org)

# ActivityPub Bridge

Subscribe to ActivityPub actors and send their activities in given chat channels.

Currently only supports [Mattermost](https://mattermost.com). Slack and Rocketchat support coming soon.

![Capture d’écran de 2022-09-14 19-08-18](https://user-images.githubusercontent.com/17931931/190218801-3f77ed31-c557-46a1-9af8-27f1e83982ca.png)

## Running instances

- https://passerelles.colibris-outilslibres.org

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
