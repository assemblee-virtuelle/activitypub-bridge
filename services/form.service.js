const Handlebars = require('handlebars');
const fs = require('fs').promises;
const { MIME_TYPES } = require("@semapps/mime-types");
const { ACTOR_TYPES, ACTIVITY_TYPES, PUBLIC_URI, delay } = require("@semapps/activitypub");

module.exports = {
  name: 'form',
  dependencies: ['api'],
  actions: {
    async display(ctx) {
      const { id, message } = ctx.params;
      const bridge = id ? await ctx.call('bridge.get', { id: `urn:Bridge:${id}` }) : {};

      ctx.meta.$responseType = 'text/html';
      return this.formTemplate({
        title: 'Passerelle Mattermost',
        message,
        bridge,
        id: bridge['@id'] ? bridge['@id'].substring(11) : undefined
      });
    },
    async process(ctx) {
      let { remove, id, email, actorUri, webhookUri } = ctx.params;

      if (remove) {
        //////////////////////////////////////////////////////
        // REMOVE BRIDGE
        //////////////////////////////////////////////////////

        const bridge = await ctx.call('bridge.get', { id: `urn:Bridge:${id}` });

        // Do not await bot deletion as it takes 10+ seconds
        ctx.call('bots.delete', { resourceUri: bridge.botUri });

        await ctx.call('bridge.remove', { id: bridge['@id'] });

        return this.redirectToForm(ctx, 'deleted');
      } else if (id) {
        //////////////////////////////////////////////////////
        // UPDATE BRIDGE
        //////////////////////////////////////////////////////

        const bridge = await ctx.call('bridge.get', { id: `urn:Bridge:${id}` });

        if (actorUri !== bridge.actorUri) {
          throw new Error('Actor cannot be changed. Delete this bridge and recreate it.')
        }

        if (webhookUri !== bridge.webhookUri) {
          const webhookSent = await this.checkWebhook(ctx, webhookUri);
          if (!webhookSent) return this.redirectToForm(ctx, 'webhook-not-working');
        }

        await ctx.call('bridge.update', {
          ...bridge,
          email,
          webhookUri
        });

        return this.redirectToForm(ctx, 'updated', bridge['@id']);
      } else {
        //////////////////////////////////////////////////////
        // CREATE BRIDGE
        //////////////////////////////////////////////////////

        actorUri = await this.getActorUri(ctx, actorUri)
        if( !actorUri ) return this.redirectToForm(ctx, 'actor-not-found');

        const webhookSent = await this.checkWebhook(ctx, webhookUri);
        if (!webhookSent) return this.redirectToForm(ctx, 'webhook-not-working');

        const botUri = await ctx.call('bots.post', {
          resource: {
            type: ACTOR_TYPES.APPLICATION,
            name: 'ActivityPub Bridge'
          },
          contentType: MIME_TYPES.JSON
        });

        // const bot = await ctx.call('activitypub.actor.awaitCreateComplete', { actorUri: botUri });
        //
        // await ctx.call('activitypub.outbox.post', {
        //   collectionUri: bot.outbox,
        //   actor: bot.id,
        //   type: ACTIVITY_TYPES.FOLLOW,
        //   object: actorUri,
        //   to: [actorUri, PUBLIC_URI]
        // });

        const bridge = await ctx.call('bridge.create', {
          botUri,
          email,
          actorUri,
          webhookUri
        });

        // TODO send email to admin

        return this.redirectToForm(ctx, 'created', bridge['@id']);
      }
    }
  },
  async started() {
    await this.broker.call('api.addRoute', {
      route: {
        authorization: false,
        authentication: false,
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        aliases: {
          'POST /:id?': 'form.process',
          'GET /:id?': 'form.display'
        }
      },
      toBottom: false
    });

    const templateFile = await fs.readFile(__dirname + '/../templates/form.hbs');

    Handlebars.registerHelper('ifCond', (v1, operator, v2, options) => {
      if (typeof v2 === 'number') v1 = parseInt(v1, 10);
      switch (operator) {
        case '==':
          return v1 == v2 ? options.fn(this) : options.inverse(this);
        case '===':
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case '!=':
          return v1 != v2 ? options.fn(this) : options.inverse(this);
        case '!==':
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case '<':
          return v1 < v2 ? options.fn(this) : options.inverse(this);
        case '<=':
          return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case '>':
          return v1 > v2 ? options.fn(this) : options.inverse(this);
        case '>=':
          return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case '&&':
          return v1 && v2 ? options.fn(this) : options.inverse(this);
        case '||':
          return v1 || v2 ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    });

    this.formTemplate = Handlebars.compile(templateFile.toString());
  },
  methods: {
    redirectToForm(ctx, message, id) {
      ctx.meta.$statusCode = 302;
      if (id) {
        ctx.meta.$location = `/${id.substring(11)}?message=${encodeURI(message)}`;
      } else {
        ctx.meta.$location = `/?message=${encodeURI(message)}`;
      }
    },
    async getActorUri(ctx, actor) {
      if (actor.startsWith('http')) {
        try {
          await ctx.call('activitypub.actor.get', {actorUri: actor});
          return actor;
        } catch (e) {
          return null;
        }
      } else {
        return await ctx.call('webfinger.getRemoteUri', {account: actor});
      }
    },
    async checkWebhook(ctx, webhookUri) {
      return await ctx.call('mattermost.postMessage', {
        webhookUri,
        message: {
          title: 'Succès !',
          text: "La passerelle ActivityPub-Mattermost a bien été activée !",
          image_url: 'https://www.meme-arsenal.com/memes/c5ecb681f153a68857fa3eda4e02aaf1.jpg',
          footer: "N'hésitez pas à supprimer ce message une fois lu"
        }
      })
    }
  }
};
