var sink = require('debug')('ama-team.voximplant-publisher.publisher');

/**
 * @param {VoxImplantScenarioApi} api
 * @constructor
 */
function VoxImplantPublisher(api) {
    //noinspection JSUnusedGlobalSymbols
    this.publish = function (name, content) {
        sink('Publishing scenario with name `%s`', name);
        return api.get(name).then(function (result) {
            if (result) {
                sink('Scenario `%s` exists (%s), updating it', name, JSON.stringify(result));
                return api.patch(name, content);
            }
            sink('Scenario `%s` doesn\'t exist, creating it', name);
            return api.create(name, content);
        })
    };
}

/**
 * @param {VoxImplantScenarioApi} api
 * @returns {VoxImplantPublisher}
 */
module.exports = function (api) {
    return new VoxImplantPublisher(api);
};