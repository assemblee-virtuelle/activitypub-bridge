const { ControlledContainerMixin } = require("@semapps/ldp");
const { ACTOR_TYPES, ACTIVITY_TYPES, PUBLIC_URI, delay } = require("@semapps/activitypub");

module.exports = {
  name: 'bots',
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/bots',
    acceptedTypes: [ACTOR_TYPES.APPLICATION],
    dereference: ['sec:publicKey']
  },
  hooks: {
    before: {
      async delete(ctx) {
        const { resourceUri } = ctx.params;

        const bot = await ctx.call('activitypub.actor.get', { actorUri: resourceUri });
        const followingCollection = await ctx.call('activitypub.collection.get', { collectionUri: bot.following });

        for( let actorUri of followingCollection.items ) {
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
    }
  }
};
