#!/usr/bin/env node
'use strict';

require('babel-polyfill');

require('source-map-support/register');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _board = require('./boards/board');

var _board2 = _interopRequireDefault(_board);

var _captcha = require('./captchas/captcha');

var _captcha2 = _interopRequireDefault(_captcha);

var _nodeCaptcha = require('./captchas/node-captcha');

var _nodeCaptcha2 = _interopRequireDefault(_nodeCaptcha);

var _nodeCaptchaNoscript = require('./captchas/node-captcha-noscript');

var _nodeCaptchaNoscript2 = _interopRequireDefault(_nodeCaptchaNoscript);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _controllers = require('./controllers');

var _controllers2 = _interopRequireDefault(_controllers);

var _geolocation = require('./core/geolocation');

var _geolocation2 = _interopRequireDefault(_geolocation);

var _renderer = require('./core/renderer');

var Renderer = _interopRequireWildcard(_renderer);

var _websocketServer = require('./core/websocket-server');

var _websocketServer2 = _interopRequireDefault(_websocketServer);

var _config = require('./helpers/config');

var _config2 = _interopRequireDefault(_config);

var _ipc = require('./helpers/ipc');

var IPC = _interopRequireWildcard(_ipc);

var _logger = require('./helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

var _onlineCounter = require('./helpers/online-counter');

var OnlineCounter = _interopRequireWildcard(_onlineCounter);

var _program = require('./helpers/program');

var _program2 = _interopRequireDefault(_program);

var _tools = require('./helpers/tools');

var Tools = _interopRequireWildcard(_tools);

var _boards = require('./models/boards');

var BoardsModel = _interopRequireWildcard(_boards);

var _statistics = require('./models/statistics');

var StatisticsModel = _interopRequireWildcard(_statistics);

var _users = require('./models/users');

var UsersModel = _interopRequireWildcard(_users);

var _mongodbClientFactory = require('./storage/mongodb-client-factory');

var _mongodbClientFactory2 = _interopRequireDefault(_mongodbClientFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function generateFileName() {
  var fileName = _underscore2.default.now().toString();
  if (fileName != generateFileName.lastFileName) {
    generateFileName.lastFileName = fileName;
    return fileName;
  }
  return new Promise(function (resolve) {
    setTimeout(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var fileName;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fileName();

            case 2:
              fileName = _context.sent;

              resolve(fileName);

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })), 1);
  });
}

function onReady() {
  //NOTE: Overcoming Babel bug
  _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
    var interval;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            if (!onReady.ready) {
              onReady.ready = 0;
            }
            ++onReady.ready;

            if (!((0, _config2.default)('system.workerCount') === onReady.ready)) {
              _context3.next = 9;
              break;
            }

            _context3.next = 6;
            return UsersModel.initializeUserBansMonitoring();

          case 6:
            if ((0, _config2.default)('server.statistics.enabled')) {
              interval = (0, _config2.default)('server.statistics.ttl') * Tools.MINUTE;

              setInterval(StatisticsModel.generateStatistics.bind(StatisticsModel), interval);
            }
            if ((0, _config2.default)('server.rss.enabled')) {
              setInterval(_asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return IPC.renderRSS();

                      case 3:
                        _context2.next = 8;
                        break;

                      case 5:
                        _context2.prev = 5;
                        _context2.t0 = _context2['catch'](0);

                        _logger2.default.error(_context2.t0.stack || _context2.t0);

                      case 8:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, this, [[0, 5]]);
              })), (0, _config2.default)('server.rss.ttl') * Tools.MINUTE);
            }
            (0, _commands2.default)();

          case 9:
            _context3.next = 16;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3['catch'](0);

            console.error(_context3.t0);
            try {
              _logger2.default.error(_context3.t0.stack || _context3.t0);
            } catch (err) {
              console.error(err);
            }
            process.exit(1);

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 11]]);
  }))();
}

function initializeMaster() {
  //NOTE: Overcoming Babel bug
  _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
    var i, hasNewPosts;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return _nodeCaptcha2.default.removeOldCaptchImages();

          case 3:
            _context6.next = 5;
            return _nodeCaptchaNoscript2.default.removeOldCaptchImages();

          case 5:
            _context6.next = 7;
            return (0, _mongodbClientFactory2.default)().createIndexes();

          case 7:
            _context6.next = 9;
            return Renderer.compileTemplates();

          case 9:
            _context6.next = 11;
            return Renderer.reloadTemplates();

          case 11:
            _context6.next = 13;
            return Renderer.generateTemplatingJavaScriptFile();

          case 13:
            if (!(_program2.default.rerender || (0, _config2.default)('system.rerenderCacheOnStartup'))) {
              _context6.next = 16;
              break;
            }

            _context6.next = 16;
            return Renderer.rerender();

          case 16:
            console.log(Tools.translate('Generating statistics…'));
            _context6.next = 19;
            return StatisticsModel.generateStatistics();

          case 19:
            _context6.next = 21;
            return Renderer.generateCustomJavaScriptFile();

          case 21:
            _context6.next = 23;
            return Renderer.generateCustomCSSFiles();

          case 23:
            console.log(Tools.translate('Spawning workers, please, wait…'));
            _cluster2.default.on('exit', function (worker) {
              _logger2.default.error(Tools.translate('[$[1]] Died, respawning…', '', worker.process.pid));
              _cluster2.default.fork();
            });
            for (i = 0; i < (0, _config2.default)('system.workerCount'); ++i) {
              _cluster2.default.fork();
            }
            _logger2.default.initialize('main');
            IPC.on('ready', onReady);
            IPC.on('fileName', generateFileName);
            IPC.on('sendChatMessage', function (data) {
              return IPC.send('sendChatMessage', data);
            });
            IPC.on('stop', function () {
              return IPC.send('stop');
            });
            IPC.on('start', function () {
              return IPC.send('start');
            });
            IPC.on('reloadBoards', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
              return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _board2.default.initialize();
                      _context4.next = 3;
                      return IPC.send('reloadBoards');

                    case 3:
                      _context4.next = 5;
                      return IPC.enqueueTask('reloadBoards');

                    case 5:
                    case 'end':
                      return _context4.stop();
                  }
                }
              }, _callee4, this);
            })));
            IPC.on('reloadTemplates', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
              return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.next = 2;
                      return Renderer.compileTemplates();

                    case 2:
                      _context5.next = 4;
                      return Renderer.reloadTemplates();

                    case 4:
                      _context5.next = 6;
                      return Renderer.generateTemplatingJavaScriptFile();

                    case 6:
                      _context5.next = 8;
                      return IPC.send('reloadTemplates');

                    case 8:
                      _context5.next = 10;
                      return IPC.enqueueTask('reloadTemplates');

                    case 10:
                    case 'end':
                      return _context5.stop();
                  }
                }
              }, _callee5, this);
            })));
            hasNewPosts = {};

            setInterval(function () {
              if ((0, _underscore2.default)(hasNewPosts).isEmpty()) {
                return;
              }
              IPC.send('notifyAboutNewPosts', hasNewPosts).catch(function (err) {
                _logger2.default.error(err.stack || err);
              });
              hasNewPosts = {};
            }, Tools.SECOND);
            IPC.on('notifyAboutNewPosts', function (key) {
              hasNewPosts[key] = 1;
            });
            _context6.next = 43;
            break;

          case 39:
            _context6.prev = 39;
            _context6.t0 = _context6['catch'](0);

            _logger2.default.error(_context6.t0.stack || _context6.t0);
            process.exit(1);

          case 43:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[0, 39]]);
  }))();
}

function initializeWorker() {
  //NOTE: Overcoming Babel bug
  _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
    var sockets, server, ws;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            console.log(Tools.translate('[$[1]] Initializing…', '', process.pid));
            _context8.prev = 1;
            _context8.next = 4;
            return _geolocation2.default.initialize();

          case 4:
            _context8.next = 6;
            return BoardsModel.initialize();

          case 6:
            _context8.next = 8;
            return Renderer.reloadTemplates();

          case 8:
            sockets = new WeakSet();
            server = _http2.default.createServer(_controllers2.default);
            ws = new _websocketServer2.default(server);

            server.listen((0, _config2.default)('server.port'), function () {
              console.log(Tools.translate('[$[1]] Listening on port $[2]', '', process.pid, (0, _config2.default)('server.port')));
              IPC.on('exit', function (status) {
                process.exit(status);
              });
              IPC.on('stop', function () {
                return new Promise(function (resolve, reject) {
                  server.close(function () {
                    sockets.forEach(function (socket) {
                      sockets.delete(socket);
                      socket.destroy();
                    });
                    OnlineCounter.clear();
                    console.log(Tools.translate('[$[1]] Closed', '', process.pid));
                    resolve();
                  });
                });
              });
              IPC.on('start', function () {
                return new Promise(function (resolve, reject) {
                  server.listen((0, _config2.default)('server.port'), function () {
                    console.log(Tools.translate('[$[1]] Listening on port $[2]…', '', process.pid, (0, _config2.default)('server.port')));
                    resolve();
                  });
                });
              });
              IPC.on('sendChatMessage', function () {
                var _ref8 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    type = _ref8.type,
                    message = _ref8.message,
                    ips = _ref8.ips,
                    hashpasses = _ref8.hashpasses;

                ws.sendMessage(type, message, ips, hashpasses);
              });
              IPC.on('reloadBoards', function () {
                _board2.default.initialize();
              });
              IPC.on('reloadTemplates', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return Renderer.reloadTemplates();

                      case 2:
                        return _context7.abrupt('return', _context7.sent);

                      case 3:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                }, _callee7, this);
              })));
              IPC.on('notifyAboutNewPosts', function (keys) {
                ws.notifyAboutNewPosts(keys);
              });
              IPC.on('getConnectionIPs', function () {
                return OnlineCounter.unique();
              });
              IPC.send('ready').catch(function (err) {
                _logger2.default.error(err);
              });
            });
            server.on('connection', function (socket) {
              sockets.add(socket);
              socket.on('close', function () {
                sockets.delete(socket);
              });
            });
            _context8.next = 20;
            break;

          case 15:
            _context8.prev = 15;
            _context8.t0 = _context8['catch'](1);

            console.error(_context8.t0);
            try {
              _logger2.default.error(_context8.t0.stack || _context8.t0);
            } catch (err) {
              console.error(err);
            }
            process.exit(1);

          case 20:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this, [[1, 15]]);
  }))();
}

_board2.default.initialize();
_captcha2.default.initialize();
_controllers2.default.initialize();

if (_cluster2.default.isMaster) {
  initializeMaster();
} else {
  initializeWorker();
}

process.on('uncaughtException', function (err) {
  console.log(err);
});
//# sourceMappingURL=server.js.map
