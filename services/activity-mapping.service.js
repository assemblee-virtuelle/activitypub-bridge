const { ActivityMappingService } = require('@semapps/activitypub');
const mappers = require('../config/mappers');

module.exports = {
  mixins: [ActivityMappingService],
  settings: {
    mappers,
    handlebars: {
      helpers: {
        slice: (start, text) => text.slice(start),
        firstOfArray: (value) => Array.isArray(value) ? value[0] : value,
        encodeUri: (uri) => encodeURIComponent(uri),
      }
    },
    matchAnnouncedActivities: true
  }
};
