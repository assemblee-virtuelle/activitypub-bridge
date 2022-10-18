const { ACTIVITY_TYPES, OBJECT_TYPES, ACTOR_TYPES } = require('@semapps/activitypub');

module.exports = [
  {
    match: {
      type: ACTIVITY_TYPES.CREATE,
      actor: {
        type: ACTOR_TYPES.PERSON,
      },
      object: {
        type: OBJECT_TYPES.NOTE,
      },
    },
    mapping: {
      author_name: '{{activity.actor.preferredUsername}}',
      author_link: '{{activity.actor.id}}',
      author_icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Mastodon_Logotype_%28Simple%29.svg/216px-Mastodon_Logotype_%28Simple%29.svg.png',
      pretext: "New message on Mastodon",
      text: '{{{htmlToMarkdown activity.object.content}}}'
    }
  },
];
