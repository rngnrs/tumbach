'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeUserBansMonitoring = exports.banUser = exports.updatePostBanInfo = exports.checkUserPermissions = exports.checkUserBan = exports.setSynchronizationData = exports.getSynchronizationData = exports.removeSuperuser = exports.addSuperuser = exports.unregisterUser = exports.updateRegisteredUser = exports.registerUser = exports.getRegisteredUsers = exports.getRegisteredUser = exports.getRegisteredUserLevelsByIp = exports.getRegisteredUserLevels = exports.getBannedUsers = exports.getBannedUser = exports.getUserIP = exports.useCaptcha = exports.setUserCaptchaQuota = exports.getUserCaptchaQuota = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var getUserCaptchaQuota = exports.getUserCaptchaQuota = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(boardName, userID) {
    var board, quota;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            board = _board2.default.board(boardName);

            if (board) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt('return', Promise.reject(new Error(Tools.translate('Invalid board'))));

          case 3:
            _context3.next = 5;
            return UserCaptchaQuotas.getOne(userID);

          case 5:
            quota = _context3.sent;

            quota = Tools.option(quota, 'number', 0, { test: function test(q) {
                return q >= 0;
              } });

            if (!(quota <= 0)) {
              _context3.next = 11;
              break;
            }

            _context3.next = 10;
            return UserCaptchaQuotas.getOne(boardName + ':' + userID);

          case 10:
            quota = _context3.sent;

          case 11:
            return _context3.abrupt('return', Tools.option(quota, 'number', 0, { test: function test(q) {
                return q >= 0;
              } }));

          case 12:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getUserCaptchaQuota(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var setUserCaptchaQuota = exports.setUserCaptchaQuota = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(boardName, userID, quota) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            quota = Tools.option(quota, 'number', 0, { test: function test(q) {
                return q >= 0;
              } });
            _context4.next = 3;
            return UserCaptchaQuotas.setOne(boardName + ':' + userID, quota);

          case 3:
            return _context4.abrupt('return', _context4.sent);

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function setUserCaptchaQuota(_x5, _x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

var useCaptcha = exports.useCaptcha = function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(boardName, userID) {
    var board, key, quota;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            board = _board2.default.board(boardName);

            if (board) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt('return', Promise.reject(new Error(Tools.translate('Invalid board'))));

          case 3:
            if (!(board.captchaQuota < 1)) {
              _context5.next = 5;
              break;
            }

            return _context5.abrupt('return', 0);

          case 5:
            key = userID;
            _context5.next = 8;
            return UserCaptchaQuotas.getOne(userID);

          case 8:
            quota = _context5.sent;

            quota = Tools.option(quota, 'number', 0, { test: function test(q) {
                return q >= 0;
              } });
            if (quota <= 0) {
              key = boardName + ':' + userID;
            }
            _context5.next = 13;
            return UserCaptchaQuotas.incrementBy(key, -1);

          case 13:
            quota = _context5.sent;

            if (!(+quota < 0)) {
              _context5.next = 18;
              break;
            }

            _context5.next = 17;
            return UserCaptchaQuotas.setOne(key, 0);

          case 17:
            return _context5.abrupt('return', _context5.sent);

          case 18:
            return _context5.abrupt('return', Tools.option(quota, 'number', 0, { test: function test(q) {
                return q >= 0;
              } }));

          case 19:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function useCaptcha(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

var getUserIP = exports.getUserIP = function () {
  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(boardName, postNumber) {
    var Post, post;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return client.collection('post');

          case 2:
            Post = _context6.sent;
            _context6.next = 5;
            return Post.findOne({
              boardName: boardName,
              number: postNumber
            }, { 'user.ip': 1 });

          case 5:
            post = _context6.sent;

            if (post) {
              _context6.next = 8;
              break;
            }

            throw new Error(Tools.translate('No such post'));

          case 8:
            return _context6.abrupt('return', post.user.ip);

          case 9:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function getUserIP(_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();

var getBannedUser = exports.getBannedUser = function () {
  var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(ip, boardNames) {
    var BannedUser, binaryAddress, bannedUser;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            ip = Tools.correctAddress(ip);
            _context7.next = 3;
            return client.collection('bannedUser');

          case 3:
            BannedUser = _context7.sent;
            binaryAddress = Tools.binaryAddress(ip);
            _context7.next = 7;
            return BannedUser.findOne({
              $or: [{ ip: ip }, {
                subnet: {
                  start: { $lte: binaryAddress },
                  end: { $gte: binaryAddress }
                }
              }]
            }, { _id: 0 });

          case 7:
            bannedUser = _context7.sent;

            if (bannedUser) {
              _context7.next = 10;
              break;
            }

            return _context7.abrupt('return', {
              ip: ip,
              bans: {}
            });

          case 10:
            return _context7.abrupt('return', processBannedUser(getBannedUserBoardNames(boardNames), bannedUser));

          case 11:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function getBannedUser(_x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}();

var getBannedUsers = exports.getBannedUsers = function () {
  var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(boardNames) {
    var BannedUser, bannedUsers;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return client.collection('bannedUser');

          case 2:
            BannedUser = _context8.sent;
            _context8.next = 5;
            return BannedUser.find({}, { _id: 0 }).toArray();

          case 5:
            bannedUsers = _context8.sent;

            boardNames = getBannedUserBoardNames(boardNames);
            return _context8.abrupt('return', bannedUsers.map(processBannedUser.bind(null, boardNames)).reduce(function (acc, bannedUser) {
              acc[bannedUser.ip] = bannedUser;
              return acc;
            }, {}));

          case 8:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function getBannedUsers(_x14) {
    return _ref8.apply(this, arguments);
  };
}();

var getRegisteredUserInternal = function () {
  var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(query) {
    var _ref10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var full = _ref10.full;
    var User, projection, user;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return client.collection('user');

          case 2:
            User = _context9.sent;
            projection = { _id: 0 };

            if (!full) {
              projection = {
                superuser: 1,
                levels: 1
              };
            }
            _context9.next = 7;
            return User.findOne(query, projection);

          case 7:
            user = _context9.sent;

            if (user) {
              _context9.next = 10;
              break;
            }

            return _context9.abrupt('return', null);

          case 10:
            return _context9.abrupt('return', processRegisteredUser(user));

          case 11:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function getRegisteredUserInternal(_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}();

var getRegisteredUserLevels = exports.getRegisteredUserLevels = function () {
  var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(hashpass) {
    var user;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return getRegisteredUserInternal({ hashpass: hashpass });

          case 2:
            user = _context10.sent;
            return _context10.abrupt('return', user ? user.levels : {});

          case 4:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function getRegisteredUserLevels(_x18) {
    return _ref11.apply(this, arguments);
  };
}();

var getRegisteredUserLevelsByIp = exports.getRegisteredUserLevelsByIp = function () {
  var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(ip, subnet) {
    var query, user;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            ip = Tools.correctAddress(ip);

            if (ip) {
              _context11.next = 3;
              break;
            }

            return _context11.abrupt('return', {});

          case 3:
            query = {
              $or: [{ 'ips.ip': ip }]
            };

            if (subnet) {
              query.$or.push({
                'ips.binary': {
                  $elemMatch: {
                    $gte: subnet.start,
                    $lte: subnet.end
                  }
                }
              });
            }
            _context11.next = 7;
            return getRegisteredUserInternal(query);

          case 7:
            user = _context11.sent;
            return _context11.abrupt('return', user ? user.levels : {});

          case 9:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function getRegisteredUserLevelsByIp(_x19, _x20) {
    return _ref12.apply(this, arguments);
  };
}();

var getRegisteredUser = exports.getRegisteredUser = function () {
  var _ref13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(hashpass) {
    var user;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return getRegisteredUserInternal({ hashpass: hashpass }, { full: true });

          case 2:
            user = _context12.sent;

            if (user) {
              _context12.next = 5;
              break;
            }

            throw new Error(Tools.translate('No user with this hashpass'));

          case 5:
            return _context12.abrupt('return', user);

          case 6:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function getRegisteredUser(_x21) {
    return _ref13.apply(this, arguments);
  };
}();

var getRegisteredUsers = exports.getRegisteredUsers = function () {
  var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
    var User, users;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return client.collection('user');

          case 2:
            User = _context13.sent;
            _context13.next = 5;
            return User.find({}, { _id: 0 }).toArray();

          case 5:
            users = _context13.sent;
            return _context13.abrupt('return', users.map(processRegisteredUser));

          case 7:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function getRegisteredUsers() {
    return _ref14.apply(this, arguments);
  };
}();

var registerUser = exports.registerUser = function () {
  var _ref15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(hashpass, levels, ips) {
    var User, count;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return client.collection('user');

          case 2:
            User = _context14.sent;
            _context14.next = 5;
            return User.count({ hashpass: hashpass });

          case 5:
            count = _context14.sent;

            if (!(count > 0)) {
              _context14.next = 8;
              break;
            }

            throw new Error(Tools.translate('A user with this hashpass is already registered'));

          case 8:
            _context14.next = 10;
            return User.insertOne({
              hashpass: hashpass,
              levels: levels,
              ips: processRegisteredUserData(levels, ips)
            });

          case 10:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));

  return function registerUser(_x22, _x23, _x24) {
    return _ref15.apply(this, arguments);
  };
}();

var updateRegisteredUser = exports.updateRegisteredUser = function () {
  var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee15(hashpass, levels, ips) {
    var User, _ref17, matchedCount;

    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return client.collection('user');

          case 2:
            User = _context15.sent;
            _context15.next = 5;
            return User.updateOne({
              hashpass: hashpass
            }, {
              $set: {
                levels: levels,
                ips: processRegisteredUserData(levels, ips)
              }
            });

          case 5:
            _ref17 = _context15.sent;
            matchedCount = _ref17.matchedCount;

            if (!(matchedCount <= 0)) {
              _context15.next = 9;
              break;
            }

            throw new Error(Tools.translate('No user with this hashpass'));

          case 9:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, this);
  }));

  return function updateRegisteredUser(_x25, _x26, _x27) {
    return _ref16.apply(this, arguments);
  };
}();

var unregisterUser = exports.unregisterUser = function () {
  var _ref18 = _asyncToGenerator(regeneratorRuntime.mark(function _callee16(hashpass) {
    var User, _ref19, deletedCount;

    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return client.collection('user');

          case 2:
            User = _context16.sent;
            _context16.next = 5;
            return User.deleteOne({ hashpass: hashpass });

          case 5:
            _ref19 = _context16.sent;
            deletedCount = _ref19.deletedCount;

            if (!(deletedCount <= 0)) {
              _context16.next = 9;
              break;
            }

            throw new Error(Tools.translate('No user with this hashpass'));

          case 9:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, this);
  }));

  return function unregisterUser(_x28) {
    return _ref18.apply(this, arguments);
  };
}();

var addSuperuser = exports.addSuperuser = function () {
  var _ref20 = _asyncToGenerator(regeneratorRuntime.mark(function _callee17(hashpass, ips) {
    var User, count;
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            if (hashpass) {
              _context17.next = 2;
              break;
            }

            throw new Error(Tools.translate('Invalid hashpass'));

          case 2:
            _context17.next = 4;
            return client.collection('user');

          case 4:
            User = _context17.sent;
            count = User.findOne({ 'hashpass': hashpass });

            if (!(count > 0)) {
              _context17.next = 8;
              break;
            }

            throw new Error(Tools.translate('A user with this hashpass is already registered'));

          case 8:
            _context17.next = 10;
            return User.insertOne({
              hashpass: hashpass,
              superuser: true,
              ips: processUserIPs(ips)
            });

          case 10:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, this);
  }));

  return function addSuperuser(_x29, _x30) {
    return _ref20.apply(this, arguments);
  };
}();

var removeSuperuser = exports.removeSuperuser = function () {
  var _ref21 = _asyncToGenerator(regeneratorRuntime.mark(function _callee18(hashpass) {
    var User, _ref22, deletedCount;

    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            if (hashpass) {
              _context18.next = 2;
              break;
            }

            throw new Error(Tools.translate('Invalid hashpass'));

          case 2:
            _context18.next = 4;
            return client.collection('user');

          case 4:
            User = _context18.sent;
            _context18.next = 7;
            return User.deleteOne({ hashpass: hashpass });

          case 7:
            _ref22 = _context18.sent;
            deletedCount = _ref22.deletedCount;

            if (!(deletedCount <= 0)) {
              _context18.next = 11;
              break;
            }

            throw new Error(Tools.translate('No user with this hashpass'));

          case 11:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee18, this);
  }));

  return function removeSuperuser(_x31) {
    return _ref21.apply(this, arguments);
  };
}();

var getSynchronizationData = exports.getSynchronizationData = function () {
  var _ref23 = _asyncToGenerator(regeneratorRuntime.mark(function _callee19(key) {
    var SynchronizationData;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return client.collection('synchronizationData');

          case 2:
            SynchronizationData = _context19.sent;
            _context19.next = 5;
            return SynchronizationData.findOne({ key: key });

          case 5:
            return _context19.abrupt('return', _context19.sent);

          case 6:
          case 'end':
            return _context19.stop();
        }
      }
    }, _callee19, this);
  }));

  return function getSynchronizationData(_x32) {
    return _ref23.apply(this, arguments);
  };
}();

var setSynchronizationData = exports.setSynchronizationData = function () {
  var _ref24 = _asyncToGenerator(regeneratorRuntime.mark(function _callee20(key, data) {
    var SynchronizationData, expireAt;
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.next = 2;
            return client.collection('synchronizationData');

          case 2:
            SynchronizationData = _context20.sent;
            expireAt = Tools.now();

            expireAt.setSeconds(expireAt.getSeconds() + (0, _config2.default)('server.synchronizationData.ttl'));
            _context20.next = 7;
            return SynchronizationData.updateOne({ key: key }, {
              $set: {
                data: data,
                expiresAt: expireAt
              }
            }, { upsert: true });

          case 7:
            _context20.next = 9;
            return _context20.sent;

          case 9:
          case 'end':
            return _context20.stop();
        }
      }
    }, _callee20, this);
  }));

  return function setSynchronizationData(_x33, _x34) {
    return _ref24.apply(this, arguments);
  };
}();

var checkUserBan = exports.checkUserBan = function () {
  var _ref25 = _asyncToGenerator(regeneratorRuntime.mark(function _callee21(ip, boardNames) {
    var _ref26 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var write = _ref26.write;
    var geolocationInfo = _ref26.geolocationInfo;
    var ban, bannedUser;
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            ip = Tools.correctAddress(ip);
            ban = ipBans[ip];

            if (!(ban && (write || 'NO_ACCESS' === ban.level))) {
              _context21.next = 4;
              break;
            }

            throw { ban: ban };

          case 4:
            if (!boardNames) {
              _context21.next = 11;
              break;
            }

            _context21.next = 7;
            return getBannedUser(ip, boardNames);

          case 7:
            bannedUser = _context21.sent;

            ban = (0, _underscore2.default)(bannedUser.bans).find(function (ban) {
              return ban && (write || 'NO_ACCESS' === ban.level);
            });

            if (!ban) {
              _context21.next = 11;
              break;
            }

            throw { ban: ban };

          case 11:
            if (!geolocationInfo) {
              _context21.next = 13;
              break;
            }

            return _context21.abrupt('return', checkGeoBan(geolocationInfo, ip));

          case 13:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, this);
  }));

  return function checkUserBan(_x35, _x36, _x37) {
    return _ref25.apply(this, arguments);
  };
}();

var checkUserPermissions = exports.checkUserPermissions = function () {
  var _ref27 = _asyncToGenerator(regeneratorRuntime.mark(function _callee22(req, boardName, postNumber, permission, password) {
    var board, Post, post, user, threadNumber, Thread, thread;
    return regeneratorRuntime.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            board = _board2.default.board(boardName);

            if (board) {
              _context22.next = 3;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 3:
            _context22.next = 5;
            return client.collection('post');

          case 5:
            Post = _context22.sent;
            _context22.next = 8;
            return Post.findOne({
              boardName: boardName,
              number: postNumber
            }, {
              threadNumber: 1,
              user: 1
            });

          case 8:
            post = _context22.sent;

            if (post) {
              _context22.next = 11;
              break;
            }

            throw new Error(Tools.translate('Not such post: $[1]', '', '/' + boardName + '/' + postNumber));

          case 11:
            user = post.user;
            threadNumber = post.threadNumber;

            if (!req.isSuperuser()) {
              _context22.next = 15;
              break;
            }

            return _context22.abrupt('return');

          case 15:
            if (!(Tools.compareRegisteredUserLevels(req.level(boardName), Permissions[permission]()) >= 0)) {
              _context22.next = 22;
              break;
            }

            if (!(Tools.compareRegisteredUserLevels(req.level(boardName), 'USER') > 0 && Tools.compareRegisteredUserLevels(req.level(boardName), user.level) > 0)) {
              _context22.next = 18;
              break;
            }

            return _context22.abrupt('return');

          case 18:
            if (!(req.hashpass && req.hashpass === user.hashpass)) {
              _context22.next = 20;
              break;
            }

            return _context22.abrupt('return');

          case 20:
            if (!(password && password === user.password)) {
              _context22.next = 22;
              break;
            }

            return _context22.abrupt('return');

          case 22:
            if (board.opModeration) {
              _context22.next = 24;
              break;
            }

            throw new Error(Tools.translate('Not enough rights'));

          case 24:
            _context22.next = 26;
            return client.collection('thread');

          case 26:
            Thread = _context22.sent;
            _context22.next = 29;
            return Thread.fineOne({
              boardName: boardName,
              number: threadNumber
            });

          case 29:
            thread = _context22.sent;

            if (thread) {
              _context22.next = 32;
              break;
            }

            throw new Error(Tools.translate('Not such thread: $[1]', '', '/' + boardName + '/' + threadNumber));

          case 32:
            if (!(thread.user.ip !== req.ip && (!req.hashpass || req.hashpass !== thread.user.hashpass))) {
              _context22.next = 34;
              break;
            }

            throw new Error(Tools.translate('Not enough rights'));

          case 34:
            if (!(Tools.compareRegisteredUserLevels(req.level(boardName), user.level) >= 0)) {
              _context22.next = 36;
              break;
            }

            return _context22.abrupt('return');

          case 36:
            if (!(req.hashpass && req.hashpass === user.hashpass)) {
              _context22.next = 38;
              break;
            }

            return _context22.abrupt('return');

          case 38:
            if (!(password && password === user.password)) {
              _context22.next = 40;
              break;
            }

            return _context22.abrupt('return');

          case 40:
            throw new Error(Tools.translate('Not enough rights'));

          case 41:
          case 'end':
            return _context22.stop();
        }
      }
    }, _callee22, this);
  }));

  return function checkUserPermissions(_x39, _x40, _x41, _x42, _x43) {
    return _ref27.apply(this, arguments);
  };
}();

var updatePostBanInfo = exports.updatePostBanInfo = function () {
  var _ref28 = _asyncToGenerator(regeneratorRuntime.mark(function _callee23(boardName, postNumber, bannedFor) {
    var Post, result, post;
    return regeneratorRuntime.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            if (_board2.default.board(boardName)) {
              _context23.next = 2;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 2:
            postNumber = Tools.option(postNumber, 'number', 0, { test: Tools.testPostNumber });

            if (postNumber) {
              _context23.next = 5;
              break;
            }

            return _context23.abrupt('return');

          case 5:
            _context23.next = 7;
            return client.collection('post');

          case 7:
            Post = _context23.sent;
            _context23.next = 10;
            return Post.findOneAndUpdate({
              boardName: boardName,
              number: postNumber
            }, {
              $set: {
                options: { bannedFor: !!bannedFor }
              }
            }, {
              projection: { threadNumber: 1 },
              returnOriginal: false
            });

          case 10:
            result = _context23.sent;
            post = result.value;

            if (post) {
              _context23.next = 14;
              break;
            }

            return _context23.abrupt('return');

          case 14:
            _context23.next = 16;
            return IPC.render(boardName, post.threadNumber, postNumber, 'edit');

          case 16:
          case 'end':
            return _context23.stop();
        }
      }
    }, _callee23, this);
  }));

  return function updatePostBanInfo(_x44, _x45, _x46) {
    return _ref28.apply(this, arguments);
  };
}();

var banUser = exports.banUser = function () {
  var _ref29 = _asyncToGenerator(regeneratorRuntime.mark(function _callee26(ip, newBans, subnet) {
    var bannedUser, oldBans, BannedUser, _getPostsToUpdate, postsBannedFor, postsNotBannedFor;

    return regeneratorRuntime.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            ip = Tools.correctAddress(ip);

            if (ip) {
              _context26.next = 3;
              break;
            }

            throw new Error(Tools.translate('Invalid IP address'));

          case 3:
            _context26.next = 5;
            return getBannedUser(ip);

          case 5:
            bannedUser = _context26.sent;
            oldBans = bannedUser.bans;
            _context26.next = 9;
            return Tools.series(oldBans, function () {
              var _ref30 = _asyncToGenerator(regeneratorRuntime.mark(function _callee24(_1, boardName) {
                return regeneratorRuntime.wrap(function _callee24$(_context24) {
                  while (1) {
                    switch (_context24.prev = _context24.next) {
                      case 0:
                        _context24.next = 2;
                        return UserBans.delete(ip + ':' + boardName);

                      case 2:
                      case 'end':
                        return _context24.stop();
                    }
                  }
                }, _callee24, this);
              }));

              return function (_x50, _x51) {
                return _ref30.apply(this, arguments);
              };
            }());

          case 9:
            _context26.next = 11;
            return client.collection('bannedUser');

          case 11:
            BannedUser = _context26.sent;

            if (!(0, _underscore2.default)(newBans).isEmpty()) {
              _context26.next = 17;
              break;
            }

            _context26.next = 15;
            return BannedUser.deleteOne({ ip: ip });

          case 15:
            _context26.next = 21;
            break;

          case 17:
            _context26.next = 19;
            return BannedUser.updateOne({ ip: ip }, {
              $set: {
                subnet: subnet,
                bans: (0, _underscore2.default)(newBans).toArray()
              }
            }, { upsert: true });

          case 19:
            _context26.next = 21;
            return Tools.series((0, _underscore2.default)(newBans).pick(function (ban) {
              return ban.expiresAt && ban.postNumber;
            }), function () {
              var _ref31 = _asyncToGenerator(regeneratorRuntime.mark(function _callee25(ban) {
                var delay;
                return regeneratorRuntime.wrap(function _callee25$(_context25) {
                  while (1) {
                    switch (_context25.prev = _context25.next) {
                      case 0:
                        delay = Math.ceil((+ban.expiresAt - +Tools.now()) / Tools.SECOND);
                        _context25.next = 3;
                        return UserBans.setex(ban, delay, ip + ':' + ban.boardName);

                      case 3:
                      case 'end':
                        return _context25.stop();
                    }
                  }
                }, _callee25, this);
              }));

              return function (_x52) {
                return _ref31.apply(this, arguments);
              };
            }());

          case 21:
            _getPostsToUpdate = getPostsToUpdate(oldBans, newBans);
            postsBannedFor = _getPostsToUpdate.postsBannedFor;
            postsNotBannedFor = _getPostsToUpdate.postsNotBannedFor;
            _context26.next = 26;
            return Tools.series(postsBannedFor, function (_ref32) {
              var postNumber = _ref32.postNumber;
              var boardName = _ref32.boardName;

              return updatePostBanInfo(boardName, postNumber, true);
            });

          case 26:
            _context26.next = 28;
            return Tools.series(postsNotBannedFor, function (_ref33) {
              var postNumber = _ref33.postNumber;
              var boardName = _ref33.boardName;

              return updatePostBanInfo(boardName, postNumber, false);
            });

          case 28:
          case 'end':
            return _context26.stop();
        }
      }
    }, _callee26, this);
  }));

  return function banUser(_x47, _x48, _x49) {
    return _ref29.apply(this, arguments);
  };
}();

var updateBanOnMessage = function () {
  var _ref34 = _asyncToGenerator(regeneratorRuntime.mark(function _callee27(message) {
    var ip, boardName, postNumber, BannedUser;
    return regeneratorRuntime.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            _context27.prev = 0;
            ip = Tools.correctAddress(message.split(':').slice(1, -1).join(':'));

            if (ip) {
              _context27.next = 4;
              break;
            }

            throw new Error(Tools.translate('Invalid IP address'));

          case 4:
            boardName = message.split(':').pop();

            if (_board2.default.board(boardName)) {
              _context27.next = 7;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 7:
            postNumber = Tools.option(ban.postNumber, 'number', 0, { test: Tools.testPostNumber });

            if (postNumber) {
              _context27.next = 10;
              break;
            }

            throw new Error(Tools.translate('Invalid post number'));

          case 10:
            _context27.next = 12;
            return client.collection('bannedUser');

          case 12:
            BannedUser = _context27.sent;
            _context27.next = 15;
            return BannedUser.updateOne({ ip: ip }, {
              $pull: {
                bans: { boardName: boardName }
              }
            });

          case 15:
            _context27.next = 17;
            return BannedUser.deleteOne({
              ip: ip,
              bans: { $size: 0 }
            });

          case 17:
            _context27.next = 19;
            return updatePostBanInfo(boardName, postNumber, false);

          case 19:
            _context27.next = 24;
            break;

          case 21:
            _context27.prev = 21;
            _context27.t0 = _context27['catch'](0);

            Logger.error(_context27.t0.stack || _context27.t0);

          case 24:
          case 'end':
            return _context27.stop();
        }
      }
    }, _callee27, this, [[0, 21]]);
  }));

  return function updateBanOnMessage(_x53) {
    return _ref34.apply(this, arguments);
  };
}();

var initializeUserBansMonitoring = exports.initializeUserBansMonitoring = function () {
  var _ref35 = _asyncToGenerator(regeneratorRuntime.mark(function _callee28() {
    return regeneratorRuntime.wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            _context28.next = 2;
            return (0, _redisClientFactory2.default)().config('SET', 'notify-keyspace-events', 'Ex');

          case 2:
            _context28.next = 4;
            return BanExpiredChannel.subscribe(updateBanOnMessage);

          case 4:
          case 'end':
            return _context28.stop();
        }
      }
    }, _callee28, this);
  }));

  return function initializeUserBansMonitoring() {
    return _ref35.apply(this, arguments);
  };
}();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _fs = require('q-io/fs');

var _fs2 = _interopRequireDefault(_fs);

var _posts = require('./posts');

var PostsModel = _interopRequireWildcard(_posts);

var _threads = require('./threads');

var ThreadsModel = _interopRequireWildcard(_threads);

var _board = require('../boards/board');

var _board2 = _interopRequireDefault(_board);

var _config = require('../helpers/config');

var _config2 = _interopRequireDefault(_config);

var _fsWatcher = require('../helpers/fs-watcher');

var _fsWatcher2 = _interopRequireDefault(_fsWatcher);

var _ipc = require('../helpers/ipc');

var IPC = _interopRequireWildcard(_ipc);

var _permissions = require('../helpers/permissions');

var Permissions = _interopRequireWildcard(_permissions);

var _tools = require('../helpers/tools');

var Tools = _interopRequireWildcard(_tools);

var _channel = require('../storage/channel');

var _channel2 = _interopRequireDefault(_channel);

var _hash = require('../storage/hash');

var _hash2 = _interopRequireDefault(_hash);

var _key = require('../storage/key');

var _key2 = _interopRequireDefault(_key);

var _mongodbClientFactory = require('../storage/mongodb-client-factory');

var _mongodbClientFactory2 = _interopRequireDefault(_mongodbClientFactory);

var _redisClientFactory = require('../storage/redis-client-factory');

var _redisClientFactory2 = _interopRequireDefault(_redisClientFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var client = (0, _mongodbClientFactory2.default)();

var BanExpiredChannel = new _channel2.default((0, _redisClientFactory2.default)('BAN_EXPIRED'), '__keyevent@' + (0, _config2.default)('system.redis.db') + '__:expired', {
  parse: false,
  stringify: false
});
var UserBans = new _key2.default((0, _redisClientFactory2.default)(), 'userBans');
var UserCaptchaQuotas = new _hash2.default((0, _redisClientFactory2.default)(), 'captchaQuotas', {
  parse: function parse(quota) {
    return +quota;
  },
  stringify: function stringify(quota) {
    return quota.toString();
  }
});

function transformIPBans(bans) {
  return (0, _underscore2.default)(bans).reduce(function (acc, ban, ip) {
    ip = Tools.correctAddress(ip);
    if (ip) {
      acc[ip] = ban;
    }
    return acc;
  }, {});
}

var ipBans = _fsWatcher2.default.createWatchedResource(__dirname + '/../../misc/user-bans.json', function (path) {
  return transformIPBans(require(path));
}, function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(path) {
    var data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _fs2.default.read(path);

          case 2:
            data = _context.sent;

            ipBans = transformIPBans(JSON.parse(data));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()) || {};

function transformGeoBans(bans) {
  return (0, _underscore2.default)(bans).reduce(function (acc, value, key) {
    if (typeof value === 'string') {
      value = [value];
    }
    if ((0, _underscore2.default)(value).isArray()) {
      value = new Set(value.map(function (ip) {
        return Tools.correctAddress(ip);
      }).filter(function (ip) {
        return !!ip;
      }));
    } else {
      value = !!value;
    }
    acc.set(key.toUpperCase(), value);
    return acc;
  }, new Map());
}

var geoBans = _fsWatcher2.default.createWatchedResource(__dirname + '/../../misc/geo-bans.json', function (path) {
  return transformGeoBans(require(path));
}, function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(path) {
    var data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _fs2.default.read(path);

          case 2:
            data = _context2.sent;

            geoBans = transformGeoBans(JSON.parse(data));

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}()) || new Map();

function getBannedUserBoardNames(boardNames) {
  if (!boardNames) {
    return _board2.default.boardNames();
  } else if (!(0, _underscore2.default)(boardNames).isArray()) {
    return [boardNames];
  } else {
    return boardNames;
  }
}

function processBannedUser(boardNames, bannedUser) {
  bannedUser.bans = bannedUser.bans.filter(function (ban) {
    return boardNames.indexOf(ban.boardName) >= 0;
  }).reduce(function (acc, ban) {
    acc[ban.boardName] = ban;
    return acc;
  }, {});
  return bannedUser;
}

function processRegisteredUser(user) {
  if (user.superuser) {
    user.levels = _board2.default.boardNames().reduce(function (acc, boardName) {
      acc[boardName] = 'SUPERUSER';
      return acc;
    }, {});
  } else {
    user.levels = user.levels.reduce(function (acc, level) {
      acc[level.boardName] = level.level;
      return acc;
    }, {});
  }
  return user;
}

function processUserIPs(ips) {
  if ((0, _underscore2.default)(ips).isArray()) {
    ips = ips.map(function (ip) {
      return Tools.correctAddress(ip);
    });
    if (ips.some(function (ip) {
      return !ip;
    })) {
      throw new Error(Tools.translate('Invalid IP address'));
    }
  }
  return ips;
}

function processRegisteredUserData(levels, ips) {
  if (levels.length <= 0) {
    throw new Error(Tools.translate('Access level is not specified for any board'));
  }
  if (levels.some(function (level) {
    return !_board2.default.board(level.boardName);
  })) {
    throw new Error(Tools.translate('Invalid board'));
  }
  var invalidLevel = (0, _underscore2.default)(levels).some(function (level) {
    return Tools.compareRegisteredUserLevels(level.level, 'USER') < 0 || Tools.compareRegisteredUserLevels(level.level, 'SUPERUSER') >= 0;
  });
  if (invalidLevel) {
    throw new Error(Tools.translate('Invalid access level'));
  }
  return processUserIPs(ips);
}

function checkGeoBan(geolocationInfo, ip) {
  var def = geoBans.get('*');
  if (def) {
    geolocationInfo = geolocationInfo || {};
  } else if (!geolocationInfo || !geolocationInfo.countryCode) {
    return;
  }
  var countryCode = geolocationInfo.countryCode;
  if (typeof countryCode !== 'string') {
    countryCode = '';
  }
  var user = geoBans.get(countryCode.toUpperCase());
  if (ip && ((typeof user === 'undefined' ? 'undefined' : _typeof(user)) === 'object' && user.has(ip) || (typeof def === 'undefined' ? 'undefined' : _typeof(def)) === 'object' && def.has(ip))) {
    return;
  }
  if (typeof user === 'boolean' && !user) {
    return;
  }
  if (!user && !def) {
    return;
  }
  throw new Error(Tools.translate('Posting is disabled for this country'));
}

function getPostsToUpdate(oldBans, newBans) {
  var postsBannedFor = [];
  var postsNotBannedFor = [];
  _board2.default.boardNames().forEach(function (boardName) {
    var ban = newBans[boardName];
    if (ban) {
      if (ban.postNumber) {
        postsBannedFor.push({
          boardName: boardName,
          postNumber: ban.postNumber
        });
      }
    } else {
      ban = oldBans[boardName];
      if (ban && ban.postNumber) {
        postsNotBannedFor.push({
          boardName: boardName,
          postNumber: ban.postNumber
        });
      }
    }
  });
  return {
    postsBannedFor: postsBannedFor,
    postsNotBannedFor: postsNotBannedFor
  };
}
//# sourceMappingURL=users.js.map