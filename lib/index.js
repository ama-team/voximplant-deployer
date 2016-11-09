var publisher = require('./VoxImplantPublisher'),
    api = require('./VoxImplantScenarioApi');

module.exports = function (authentication) {
    return publisher(api(authentication));
};