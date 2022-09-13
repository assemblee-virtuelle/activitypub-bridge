const path = require('path');
const { CoreService } = require('@semapps/core');
const CONFIG = require('../config/config');

module.exports = {
  mixins: [CoreService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    baseDir: path.resolve(__dirname, '..'),
    triplestore: {
      url: CONFIG.SPARQL_ENDPOINT,
      user: CONFIG.JENA_USER,
      password: CONFIG.JENA_PASSWORD,
      mainDataset: CONFIG.MAIN_DATASET,
    },
    jsonContext: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    activitypub: {
      dispatch: {
        queueServiceUrl: CONFIG.QUEUE_SERVICE_URL
      }
    },
    api: {
      port: CONFIG.PORT,
      assets: {
        folder: "./public",
      }
    },
    mirror: false,
    sparqlEndpoint: false,
    void: false,
    webacl: false,
  }
};
