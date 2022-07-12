const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/triplestore');
const CONFIG = require('../config/config');

module.exports = {
  name: 'bridge',
  mixins: [DbService],
  adapter: new TripleStoreAdapter({ type: 'Bridge', dataset: CONFIG.SETTINGS_DATASET }),
  settings: {
    idField: '@id'
  },
  dependencies: ['triplestore'],
  actions: {
    async findByBotUri(ctx) {
      const { botUri } = ctx.params;
      const subscriptions = await this._find(ctx, { query: { botUri } });
      return subscriptions.length > 0 ? subscriptions[0] : null;
    }
  }
};
