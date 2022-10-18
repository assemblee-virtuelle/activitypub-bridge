const { ControlledContainerMixin, getSlugFromUri, delay } = require("@semapps/ldp");
const { ACTOR_TYPES, ACTIVITY_TYPES, PUBLIC_URI } = require("@semapps/activitypub");

module.exports = {
  name: 'bots',
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/bots',
    acceptedTypes: [ACTOR_TYPES.APPLICATION],
    dereference: ['sec:publicKey'],
    readOnly: true
  },
  events: {
    async 'activitypub.inbox.received'(ctx) {
      const { recipients, activity } = ctx.params;
      for (const botUri of recipients) {
        const bridge = await ctx.call('bridge.findByBotUri', { botUri });
        // If this actor is not linked with a bridge, ignore
        if (bridge) {
          const message = await ctx.call('activity-mapping.map', { activity });
          // If no mapping can be found for this activity, ignore
          if (message) {
            this.logger.info(`Activity ${activity.id} sent to ${bridge.webhookUri} (channel: ${bridge.channel || 'default'})`);
            await ctx.call('mattermost.postMessage', {
              webhookUri: bridge.webhookUri,
              channel: bridge.channel,
              message
            });
          }
        }
      }
    }
  },
  hooks: {
    before: {
      async delete(ctx) {
        const { resourceUri } = ctx.params;

        const bot = await ctx.call('activitypub.actor.get', {actorUri: resourceUri});
        const followingCollection = await ctx.call('activitypub.collection.get', {collectionUri: bot.following});

        for (let actorUri of followingCollection.items) {
          await ctx.call('activitypub.outbox.post', {
            collectionUri: bot.outbox,
            actor: bot.id,
            type: ACTIVITY_TYPES.UNDO,
            object: {
              type: ACTIVITY_TYPES.FOLLOW,
              object: actorUri
            },
            to: [actorUri, PUBLIC_URI]
          });
        }

        // Wait 10s to give time to remote actors to check message identity
        await delay(10000);
      }
    },
    after: {
      async create(ctx, res) {
        await ctx.call('auth.account.create', {
          slug: getSlugFromUri(res.resourceUri),
          username: getSlugFromUri(res.resourceUri),
          webId: res.resourceUri
        });
        return res;
      },
    },
  },
};
