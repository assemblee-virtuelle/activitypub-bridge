const path = require('path');
const { JsonLdService } = require('@semapps/jsonld');
const CONFIG = require('../../config/config');

module.exports = {
  mixins: [JsonLdService],
  settings: {
    baseUri: CONFIG.HOME_URL
  }
};
