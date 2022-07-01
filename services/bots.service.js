const { ControlledContainerMixin } = require("@semapps/ldp");
const { ACTOR_TYPES } = require("@semapps/activitypub");

module.exports = {
  name: 'bots',
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/bots',
    acceptedTypes: [ACTOR_TYPES.APPLICATION],
    dereference: ['sec:publicKey']
  }
};
