const { ActivityPubService } = require('@semapps/activitypub');
const CONFIG = require('../../config/config');

module.exports = {
  mixins: [ActivityPubService],
  settings: {
    baseUri: CONFIG.HOME_URL,
    dispatch: {
      queueServiceUrl: CONFIG.QUEUE_SERVICE_URL
    }
  }
};
