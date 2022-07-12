const urlJoin = require("url-join");
const { ACTIVITY_TYPES, OBJECT_TYPES, ACTOR_TYPES } = require('@semapps/activitypub');

const create = (objectType, actorUri) => ({
  type: ACTIVITY_TYPES.CREATE,
  actor: {
    id: actorUri
  },
  object: {
    type: objectType
  }
});

module.exports = [
  {
    match: create('pair:Document', urlJoin(process.env.SEMAPPS_COLIBRIS_SOCIAL_URL, 'services', 'lemag')),
    mapping: {
      author_name: '{{{activity.actor.name}}}',
      author_link: '{{{activity.actor.url}}}',
      pretext: "Un nouvel article a été créé",
      title: '{{{activity.object.pair:label}}}',
      title_link: '{{activity.object.pair:webPage}}',
      text: '{{{activity.object.pair:comment}}}',
      image_url: '{{firstOfArray activity.object.pair:depictedBy}}'
    }
  },
  {
    match: create('pair:Event', urlJoin(process.env.SEMAPPS_COLIBRIS_SOCIAL_URL, 'services', 'universite')),
    mapping: {
      author_name: '{{{activity.actor.name}}}',
      author_link: '{{{activity.actor.url}}}',
      pretext: "Une nouvelle formation a été créée",
      title: '{{{activity.object.pair:label}}}',
      title_link: '{{activity.object.pair:aboutPage}}',
      text: '{{{activity.object.pair:comment}}}',
      image_url: '{{firstOfArray activity.object.pair:depictedBy}}',
    }
  },
  {
    match: create('pair:Event', urlJoin(process.env.SEMAPPS_COLIBRIS_SOCIAL_URL, 'services', 'lemouvement')),
    mapping: {
      author_name: '{{{activity.actor.name}}}',
      author_link: '{{{activity.actor.url}}}',
      pretext: "Un nouvel événement a été créé",
      title: '{{{activity.object.pair:label}}}',
      title_link: '{{activity.object.pair:aboutPage}}',
      text: '{{{activity.object.pair:comment}}}',
      image_url: '{{firstOfArray activity.object.pair:depictedBy}}',
    }
  },
  {
    match: create('pair:Group', urlJoin(process.env.SEMAPPS_COLIBRIS_SOCIAL_URL, 'services', 'groupeslocaux')),
    mapping: {
      author_name: '{{{activity.actor.name}}}',
      author_link: '{{{activity.actor.url}}}',
      pretext: "Un nouveau groupe local a été créé",
      title: '{{{activity.object.pair:label}}}',
      title_link: '{{activity.object.pair:webPage}}',
      text: '{{{activity.object.pair:comment}}}',
      image_url: '{{firstOfArray activity.object.pair:depictedBy}}',
    }
  },
  {
    match: {
      type: ACTIVITY_TYPES.CREATE,
      actor: urlJoin(process.env.SEMAPPS_COLIBRIS_SOCIAL_URL, 'services', 'lafabrique'),
      object: {
        type: 'pair:Resource',
        'pair:neededBy': {
          type: 'pair:Project'
        }
      }
    },
    mapping: {
      author_name: '{{{activity.actor.name}}}',
      author_link: '{{{activity.actor.url}}}',
      pretext: "Un nouveau besoin a été posté",
      title: '{{{activity.object.pair:neededBy.pair:label}}} {{{slice 3 activity.object.pair:label}}}', // {projet} recherche {besoin}
      title_link: '{{activity.object.pair:neededBy.pair:aboutPage}}',
      text: '{{{activity.object.pair:description}}}',
      image_url: '{{firstOfArray activity.object.pair:neededBy.pair:depictedBy}}',
    }
  },
  {
    match: create('pair:Organization', urlJoin(process.env.SEMAPPS_COLIBRIS_SOCIAL_URL, 'services', 'presdecheznous')),
    mapping: {
      author_name: '{{{activity.actor.name}}}',
      author_link: '{{{activity.actor.url}}}',
      pretext: "Un nouvel acteur a été posté",
      title: '{{{activity.object.pair:label}}}',
      title_link: '{{activity.object.pair:aboutPage}}',
      text: '{{{activity.object.pair:description}}}',
      image_url: '{{#if activity.object.pair:depictedBy}}{{activity.object.pair:depictedBy}}{{else}}https://dev.colibris.social/images/places.png{{/if}}',
    }
  },
  {
    match: create('pair:Resource', urlJoin(process.env.SEMAPPS_COLIBRIS_SOCIAL_URL, 'services', 'laboutique')),
    mapping: {
      author_name: '{{{activity.actor.name}}}',
      author_link: '{{{activity.actor.url}}}',
      pretext: "Un nouveau produit est disponible",
      title: '{{{activity.object.pair:label}}}',
      title_link: '{{activity.object.pair:webPage}}',
      text: '{{{activity.object.pair:description}}}',
      image_url: '{{firstOfArray activity.object.pair:depictedBy}}',
    }
  },
  {
    match: create('pair:Project', urlJoin(process.env.SEMAPPS_COLIBRIS_SOCIAL_URL, 'services', 'lafabrique')),
    mapping: {
      author_name: '{{{activity.actor.name}}}',
      author_link: '{{{activity.actor.url}}}',
      pretext: "Un nouveau projet a été posté",
      title: '{{{activity.object.pair:label}}}',
      title_link: '{{activity.object.pair:aboutPage}}',
      text: '{{{activity.object.pair:description}}}',
      image_url: '{{firstOfArray activity.object.pair:depictedBy}}',
    }
  },
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
      pretext: "Nouveau message sur Mastodon",
      text: '{{{activity.object.content}}}'
    }
  },
]