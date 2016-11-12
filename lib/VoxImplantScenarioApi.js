'use strict';

var request = require('request-promise'),
    sink = require('debug')('ama-team.voximplant-publisher.api');

var VOXIMPLANT_API_URL = 'https://api.voximplant.com/platform_api';
var SCENARIO_RETRIEVAL_ROUTE = '/GetScenarios';
var SCENARIO_CREATION_ROUTE = '/AddScenario';
var SCENARIO_UPDATE_ROUTE = '/SetScenarioInfo';
var DEFAULT_PAGE_SIZE = 64;
var METHOD_GET = 'GET';
var METHOD_POST = 'POST';

function VoxImplantScenarioApi(authentication, baseUrl) {
    baseUrl = baseUrl || VOXIMPLANT_API_URL;

    this.get = function (name) {
        sink('Retrieving scenario `%s`', name);
        return findScenario(name).then(function (result) {
            if (result) {
                sink('Found scenario `%s`, fetching extended information', name);
                return getScenario(result.scenario_id);
            }
            sink('Could not find scenario `%s`', name);
            return null;
        });
    };

    this.create = function (name, content) {
        sink('Creating scenario `%s`', name);
        return executeRequest(METHOD_GET, SCENARIO_CREATION_ROUTE, { scenario_name: name, scenario_script: content }).then(function (result) {
            sink('Scenario `%s` creation result: %s', name, JSON.stringify(result));
            return result.scenario_id;
        });
    };

    this.patch = function (name, content) {
        sink('Patching scenario `%s`', name);
        var query = { required_scenario_name: name, scenario_script: content };
        return executeRequest(METHOD_POST, SCENARIO_UPDATE_ROUTE, query).then(function (response) {
            sink('Patched scenario `%s`, response: %s', JSON.stringify(response));
            return response.result == 1;
        });
    };

    function findScenario(name) {
        sink('Starting iteration page scan to find scenario `%s`', name);
        return scanScenarioPage(name, 0, DEFAULT_PAGE_SIZE);
    }

    function scanScenarioPage(name, offset, size) {
        sink('Retrieving scenario slice %d - %d to find scenario `%s`', offset, offset + size - 1, name);
        return executeRequest(METHOD_GET, SCENARIO_RETRIEVAL_ROUTE, { offset: offset, count: size }).then(function (response) {
            if (!response.result || response.result.length == 0) {
                sink('Retrieved empty page while searching for scenario `%s`, halting', name);
                return null;
            }
            sink('Retrieved scenario page while searching for `%s`: %s', name, JSON.stringify(response.result));
            var matches = response.result.filter(function (scenario) {
                return scenario.scenario_name == name;
            });
            if (matches.length > 0) {
                sink('Found scenario matching name `%s`: %s', name, JSON.stringify(matches[0]));
                return matches[0];
            }
            return scanScenarioPage(name, offset + size, size);
        });
    }

    function getScenario(id) {
        sink('Fetching information for scenario with id %s', id);
        return executeRequest(METHOD_GET, SCENARIO_RETRIEVAL_ROUTE, { scenario_id: id, with_script: true }).then(function (response) {
            if (response.result.length == 0) {
                sink('Could not find anything for scenario with id %s', id);
                return null;
            }
            var data = response.result[0],
                scenario = {
                id: data.scenario_id,
                name: data.scenario_name,
                content: data.scenario_script
            };
            sink('Fetched scenario with id %s: %s', id, JSON.stringify(scenario));
            return scenario;
        });
    }

    function executeRequest(method, route, query) {
        var uri = baseUrl + route;
        for (var key in authentication) {
            if (authentication.hasOwnProperty(key)) {
                query[key] = authentication[key];
            }
        }
        sink('Executing request: %s %s %s', method, uri, JSON.stringify(query));
        return request({ method: method, uri: uri, qs: query, json: true }).then(function (result) {
            if (result.error) {
                throw {
                    message: result.error.msg,
                    code: result.error.code,
                    detailed: result.error
                };
            }
            return result;
        });
    }
}

/**
 * @param authentication
 * @param baseUrl
 * @returns {VoxImplantScenarioApi}
 */
module.exports = function (authentication, baseUrl) {
    return new VoxImplantScenarioApi(authentication, baseUrl);
};