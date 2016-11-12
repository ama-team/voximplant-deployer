'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VoxImplantPublisher = require('./VoxImplantPublisher');

var _VoxImplantPublisher2 = _interopRequireDefault(_VoxImplantPublisher);

var _VoxImplantScenarioApi = require('./VoxImplantScenarioApi');

var _VoxImplantScenarioApi2 = _interopRequireDefault(_VoxImplantScenarioApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (authentication) {
  return (0, _VoxImplantPublisher2.default)((0, _VoxImplantScenarioApi2.default)(authentication));
};