const { ActivityMappingService } = require('@semapps/activitypub');
const TurndownService = require('turndown');
const mappers = require('../config/mappers');

const turndownService = new TurndownService();

module.exports = {
  mixins: [ActivityMappingService],
  settings: {
    mappers,
    handlebars: {
      helpers: {
        slice: (start, text) => text.slice(start),
        firstOfArray: (value) => Array.isArray(value) ? value[0] : value,
        encodeUri: (uri) => encodeURIComponent(uri),
        htmlToMarkdown: (value) => turndownService.turndown(value)
      }
    },
    matchAnnouncedActivities: true
  }
};
