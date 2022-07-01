const { LdpService } = require('@semapps/ldp');
const CONFIG = require('../../config/config');
const ontologies = require('../../config/ontologies.json');

module.exports = {
  mixins: [LdpService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    ontologies,
    defaultContainerOptions: {
      jsonContext: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    }
  }
};
