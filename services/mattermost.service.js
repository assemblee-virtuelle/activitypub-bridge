const fetch = require("node-fetch");

module.exports = {
  name: 'mattermost',
  settings: {
    defaultMessage: {
      username: 'activitypub-bridge',
      icon_url: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/activitypub/activitypub.png',
      attachments: [{
        author_name: 'activitypub-bridge',
        author_icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/activitypub/activitypub.png',
        color: '#b9cd00'
      }]
    }
  },
  actions: {
    async postMessage(ctx) {
      const { webhookUri, message } = ctx.params;

      const attachment = {
        ...this.settings.defaultMessage.attachments[0],
        ...message,
      };

      if( !attachment.fallback ) attachment.fallback = attachment.text;

      const response = await fetch(webhookUri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...this.settings.defaultMessage,
          attachments: [attachment]
        })
      });

      return response.ok;
    }
  }
};
