'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delall = exports.initialize = exports.nextPostNumber = exports.getPageCount = exports.getLastPostNumbers = exports.getLastPostNumber = exports.getArchive = exports.getCatalog = exports.getPage = exports.getThread = exports.checkQuota = exports.useQuota = exports.incrementQuotaBy = exports.setQuota = exports.getQuota = undefined;

var getQuota = exports.getQuota = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(boardName) {
    var exists, quota;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (_board2.default.board(boardName)) {
              _context.next = 2;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 2:
            _context.next = 4;
            return ThreadQuotas.exists(boardName);

          case 4:
            exists = _context.sent;

            if (exists) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', false);

          case 7:
            _context.next = 9;
            return ThreadQuotas.get(boardName);

          case 9:
            quota = _context.sent;
            return _context.abrupt('return', Tools.option(quota, 'number', 0, { test: function test(q) {
                return q >= 0;
              } }));

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getQuota(_x) {
    return _ref.apply(this, arguments);
  };
}();

var setQuota = exports.setQuota = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(boardName, quota) {
    var board, expireAt;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            board = _board2.default.board(boardName);

            if (board) {
              _context2.next = 3;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 3:
            expireAt = board.threadTimeQuota;

            quota = Tools.option(quota, 'number', 0, { test: function test(q) {
                return q >= 0;
              } });
            _context2.next = 7;
            return ThreadQuotas.setex(quota, expireAt, boardName);

          case 7:
            return _context2.abrupt('return', _context2.sent);

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function setQuota(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var incrementQuotaBy = exports.incrementQuotaBy = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(boardName, quota) {
    var key;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            key = void 0;

            if (!boardName) {
              _context3.next = 5;
              break;
            }

            if (_board2.default.board(boardName)) {
              _context3.next = 4;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 4:
            key = boardName;

          case 5:
            quota = Tools.option(quota, 'number', 1, { test: function test(q) {
                return 0 !== q;
              } });
            _context3.next = 8;
            return ThreadQuotas.incrementBy(quota, key);

          case 8:
            return _context3.abrupt('return', _context3.sent);

          case 9:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function incrementQuotaBy(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var useQuota = exports.useQuota = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(boardName) {
    var board, quota;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            board = _board2.default.board(boardName);

            if (board) {
              _context4.next = 3;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 3:
            if (!(board.threadQuota < 1)) {
              _context4.next = 5;
              break;
            }

            return _context4.abrupt('return', true);

          case 5:
            _context4.next = 7;
            return ThreadQuotas.incrementBy(-1, boardName);

          case 7:
            quota = _context4.sent;

            if (!(+quota < 0)) {
              _context4.next = 12;
              break;
            }

            _context4.next = 11;
            return ThreadQuotas.set(boardName, 0);

          case 11:
            return _context4.abrupt('return', _context4.sent);

          case 12:
            return _context4.abrupt('return', Tools.option(quota, 'number', 0, { test: function test(q) {
                return q >= 0;
              } }));

          case 13:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function useQuota(_x6) {
    return _ref4.apply(this, arguments);
  };
}();

var checkQuota = exports.checkQuota = function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(boardName) {
    var board, quota;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            board = _board2.default.board(boardName);

            if (board) {
              _context5.next = 3;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 3:
            if (!(board.threadQuota > 0)) {
              _context5.next = 17;
              break;
            }

            _context5.next = 6;
            return getQuota(boardName);

          case 6:
            quota = _context5.sent;

            if (!(quota === false)) {
              _context5.next = 13;
              break;
            }

            _context5.next = 10;
            return setQuota(boardName, board.threadQuota);

          case 10:
            _context5.next = 12;
            return getQuota(boardName);

          case 12:
            quota = _context5.sent;

          case 13:
            if (!(+quota <= 0)) {
              _context5.next = 15;
              break;
            }

            return _context5.abrupt('return', false);

          case 15:
            _context5.next = 17;
            return useQuota(boardName);

          case 17:
            return _context5.abrupt('return', true);

          case 18:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function checkQuota(_x7) {
    return _ref5.apply(this, arguments);
  };
}();

var getThread = exports.getThread = function () {
  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(boardName, threadNumber) {
    var board, thread, posts;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            board = _board2.default.board(boardName);

            if (board) {
              _context6.next = 3;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 3:
            _context6.next = 5;
            return ThreadsModel.getThread(boardName, threadNumber);

          case 5:
            thread = _context6.sent;
            _context6.next = 8;
            return PostsModel.getThreadPosts(boardName, threadNumber, { sort: true });

          case 8:
            posts = _context6.sent;

            thread.postCount = posts.length;

            if (!(thread.postCount <= 0)) {
              _context6.next = 12;
              break;
            }

            throw new Error(Tools.translate('No such thread'));

          case 12:
            thread.opPost = posts.splice(0, 1)[0];
            thread.lastPosts = posts;
            thread.title = postSubject(thread.opPost, 50) || null;
            addDataToThread(thread, board);
            return _context6.abrupt('return', thread);

          case 17:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function getThread(_x8, _x9) {
    return _ref6.apply(this, arguments);
  };
}();

var getPage = exports.getPage = function () {
  var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(boardName, pageNumber) {
    var board, pageCount, threads, Post, lastPostNumber;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            board = _board2.default.board(boardName);

            if (board) {
              _context8.next = 3;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 3:
            pageNumber = Tools.option(pageNumber, 'number', -1, { test: function test(n) {
                return n >= 0;
              } });
            pageCount = pageCounts.get(boardName);

            if (!(pageNumber < 0 || pageNumber >= pageCount)) {
              _context8.next = 7;
              break;
            }

            throw new Error(Tools.translate('Invalid page number'));

          case 7:
            _context8.next = 9;
            return ThreadsModel.getThreads(boardName, {
              sort: -1,
              limit: board.threadsPerPage,
              offset: pageNumber * board.threadsPerPage
            });

          case 9:
            threads = _context8.sent;
            _context8.next = 12;
            return client.collection('post');

          case 12:
            Post = _context8.sent;
            _context8.next = 15;
            return Tools.series(threads, function () {
              var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(thread) {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return PostsModel.getPost(boardName, thread.number, {
                          withExtraData: true,
                          withFileInfos: true,
                          withReferences: true
                        });

                      case 2:
                        thread.opPost = _context7.sent;
                        _context7.next = 5;
                        return PostsModel.getThreadPosts(boardName, thread.number, {
                          limit: board.maxLastPosts,
                          offset: 1,
                          sort: true
                        });

                      case 5:
                        thread.lastPosts = _context7.sent;
                        _context7.next = 8;
                        return ThreadsModel.getThreadPostCount(boardName, thread.number);

                      case 8:
                        thread.postCount = _context7.sent;

                        addDataToThread(thread, board);
                        if (thread.postCount > board.maxLastPosts + 1) {
                          thread.omittedPosts = thread.postCount - board.maxLastPosts - 1;
                        } else {
                          thread.omittedPosts = 0;
                        }

                      case 11:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                }, _callee7, this);
              }));

              return function (_x12) {
                return _ref8.apply(this, arguments);
              };
            }());

          case 15:
            threads = threads.filter(function (thread) {
              return thread.opPost && thread.postCount > 0;
            });
            _context8.next = 18;
            return getLastPostNumber(boardName);

          case 18:
            lastPostNumber = _context8.sent;
            return _context8.abrupt('return', {
              threads: threads,
              pageCount: pageCount,
              currentPage: pageNumber,
              lastPostNumber: lastPostNumber,
              postingSpeed: Renderer.postingSpeedString(board.launchDate, lastPostNumber)
            });

          case 20:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function getPage(_x10, _x11) {
    return _ref7.apply(this, arguments);
  };
}();

var getCatalog = exports.getCatalog = function () {
  var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(boardName, sortMode) {
    var board, threads, Post, sortFunction, lastPostNumber;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            board = _board2.default.board(boardName);

            if (board) {
              _context10.next = 3;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 3:
            _context10.next = 5;
            return ThreadsModel.getThreads(boardName);

          case 5:
            threads = _context10.sent;
            _context10.next = 8;
            return client.collection('post');

          case 8:
            Post = _context10.sent;
            _context10.next = 11;
            return Tools.series(threads, function () {
              var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(thread) {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return PostsModel.getPost(boardName, thread.number, {
                          withFileInfos: true,
                          withReferences: true
                        });

                      case 2:
                        thread.opPost = _context9.sent;
                        _context9.next = 5;
                        return ThreadsModel.getThreadPostCount(boardName, thread.number);

                      case 5:
                        thread.postCount = _context9.sent;

                        addDataToThread(thread, board);

                      case 7:
                      case 'end':
                        return _context9.stop();
                    }
                  }
                }, _callee9, this);
              }));

              return function (_x15) {
                return _ref10.apply(this, arguments);
              };
            }());

          case 11:
            sortFunction = ThreadsModel.sortThreadsByCreationDate;
            _context10.t0 = (sortMode || 'date').toLowerCase();
            _context10.next = _context10.t0 === 'recent' ? 15 : _context10.t0 === 'bumps' ? 17 : 19;
            break;

          case 15:
            sortFunction = ThreadsModel.sortThreadsByDate;
            return _context10.abrupt('break', 20);

          case 17:
            sortFunction = ThreadsModel.sortThreadsByPostCount;
            return _context10.abrupt('break', 20);

          case 19:
            return _context10.abrupt('break', 20);

          case 20:
            _context10.next = 22;
            return getLastPostNumber(boardName);

          case 22:
            lastPostNumber = _context10.sent;
            return _context10.abrupt('return', {
              threads: threads.sort(sortFunction),
              lastPostNumber: lastPostNumber,
              postingSpeed: Renderer.postingSpeedString(board.launchDate, lastPostNumber)
            });

          case 24:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function getCatalog(_x13, _x14) {
    return _ref9.apply(this, arguments);
  };
}();

var getArchive = exports.getArchive = function () {
  var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(boardName) {
    var board, threads, Post, lastPostNumber;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            board = _board2.default.board(boardName);

            if (board) {
              _context12.next = 3;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 3:
            _context12.next = 5;
            return ThreadsModel.getThreads(boardName, { archived: true });

          case 5:
            threads = _context12.sent;

            threads.sort(ThreadsModel.sortThreadsByDate);
            _context12.next = 9;
            return client.collection('post');

          case 9:
            Post = _context12.sent;
            _context12.next = 12;
            return Tools.series(threads, function () {
              var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(thread) {
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return PostsModel.getPost(boardName, thread.number);

                      case 2:
                        thread.opPost = _context11.sent;

                        thread.title = postSubject(thread.opPost, 50) || null;

                      case 4:
                      case 'end':
                        return _context11.stop();
                    }
                  }
                }, _callee11, this);
              }));

              return function (_x17) {
                return _ref12.apply(this, arguments);
              };
            }());

          case 12:
            _context12.next = 14;
            return getLastPostNumber(boardName);

          case 14:
            lastPostNumber = _context12.sent;
            return _context12.abrupt('return', {
              threads: threads,
              lastPostNumber: lastPostNumber,
              postingSpeed: Renderer.postingSpeedString(board.launchDate, lastPostNumber)
            });

          case 16:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function getArchive(_x16) {
    return _ref11.apply(this, arguments);
  };
}();

var getLastPostNumber = exports.getLastPostNumber = function () {
  var _ref13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13(boardName) {
    var PostCounter, result;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            if (_board2.default.board(boardName)) {
              _context13.next = 2;
              break;
            }

            throw new Error(Tools.translate('Invalid boardName'));

          case 2:
            _context13.next = 4;
            return client.collection('postCounter');

          case 4:
            PostCounter = _context13.sent;
            _context13.next = 7;
            return PostCounter.findOne({ _id: boardName }, { lastPostNumber: 1 });

          case 7:
            result = _context13.sent;
            return _context13.abrupt('return', result ? result.lastPostNumber : 0);

          case 9:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function getLastPostNumber(_x18) {
    return _ref13.apply(this, arguments);
  };
}();

var getLastPostNumbers = exports.getLastPostNumbers = function () {
  var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(boardNames) {
    var PostCounter, query, result;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            if (!(0, _underscore2.default)(boardNames).isArray()) {
              boardNames = [boardNames];
            }

            if (!boardNames.some(function (boardName) {
              return !_board2.default.board(boardName);
            })) {
              _context14.next = 3;
              break;
            }

            throw new Error(Tools.translate('Invalid boardName'));

          case 3:
            _context14.next = 5;
            return client.collection('postCounter');

          case 5:
            PostCounter = _context14.sent;
            query = {
              _id: { $in: boardNames }
            };
            _context14.next = 9;
            return PostCounter.find(query).toArray();

          case 9:
            result = _context14.sent;
            return _context14.abrupt('return', result.reduce(function (acc, _ref15) {
              var _id = _ref15._id,
                  lastPostNumber = _ref15.lastPostNumber;

              acc[_id] = lastPostNumber;
              return acc;
            }, {}));

          case 11:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));

  return function getLastPostNumbers(_x19) {
    return _ref14.apply(this, arguments);
  };
}();

var getPageCount = exports.getPageCount = function () {
  var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee15(boardName) {
    var board, Thread, threadCount, pageCount;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            board = _board2.default.board(boardName);

            if (board) {
              _context15.next = 3;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 3:
            _context15.next = 5;
            return client.collection('thread');

          case 5:
            Thread = _context15.sent;
            _context15.next = 8;
            return ThreadsModel.getThreadCount(boardName);

          case 8:
            threadCount = _context15.sent;
            pageCount = Math.ceil(threadCount / board.threadsPerPage) || 1;

            pageCounts.set(boardName, pageCount);
            return _context15.abrupt('return', pageCount);

          case 12:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, this);
  }));

  return function getPageCount(_x20) {
    return _ref16.apply(this, arguments);
  };
}();

var nextPostNumber = exports.nextPostNumber = function () {
  var _ref17 = _asyncToGenerator(regeneratorRuntime.mark(function _callee16(boardName, incrementBy) {
    var board, PostCounter, result, lastPostNumber;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            board = _board2.default.board(boardName);

            if (board) {
              _context16.next = 3;
              break;
            }

            throw new Error(Tools.translate('Invalid board'));

          case 3:
            incrementBy = Tools.option(incrementBy, 'number', 1, { test: function test(i) {
                return i >= 1;
              } });
            _context16.next = 6;
            return client.collection('postCounter');

          case 6:
            PostCounter = _context16.sent;
            _context16.next = 9;
            return PostCounter.findOneAndUpdate({ _id: boardName }, {
              $inc: { lastPostNumber: incrementBy }
            }, {
              projection: { lastPostNumber: 1 },
              upsert: true,
              returnOriginal: false
            });

          case 9:
            result = _context16.sent;

            if (result) {
              _context16.next = 12;
              break;
            }

            return _context16.abrupt('return', 0);

          case 12:
            lastPostNumber = result.value.lastPostNumber;
            //TODO: improve get skipping

            if (!(1 === incrementBy && board.skippedGetOrder > 0 && !(lastPostNumber % Math.pow(10, board.skippedGetOrder)))) {
              _context16.next = 17;
              break;
            }

            _context16.next = 16;
            return nextPostNumber(boardName, incrementBy);

          case 16:
            return _context16.abrupt('return', _context16.sent);

          case 17:
            return _context16.abrupt('return', lastPostNumber);

          case 18:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, this);
  }));

  return function nextPostNumber(_x21, _x22) {
    return _ref17.apply(this, arguments);
  };
}();

var initialize = exports.initialize = function () {
  var _ref18 = _asyncToGenerator(regeneratorRuntime.mark(function _callee18() {
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return Tools.series(_board2.default.boardNames(), function () {
              var _ref19 = _asyncToGenerator(regeneratorRuntime.mark(function _callee17(boardName) {
                return regeneratorRuntime.wrap(function _callee17$(_context17) {
                  while (1) {
                    switch (_context17.prev = _context17.next) {
                      case 0:
                        _context17.next = 2;
                        return getPageCount(boardName);

                      case 2:
                      case 'end':
                        return _context17.stop();
                    }
                  }
                }, _callee17, this);
              }));

              return function (_x23) {
                return _ref19.apply(this, arguments);
              };
            }());

          case 2:
            _context18.next = 4;
            return ThreadsModel.clearDeletedThreads();

          case 4:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee18, this);
  }));

  return function initialize() {
    return _ref18.apply(this, arguments);
  };
}();

var delall = exports.delall = function () {
  var _ref20 = _asyncToGenerator(regeneratorRuntime.mark(function _callee24(req, ip, boardNames) {
    var deletedThreads, updatedThreads, deletedPosts, Post;
    return regeneratorRuntime.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            ip = Tools.correctAddress(ip);

            if (ip) {
              _context24.next = 3;
              break;
            }

            throw new Error(Tools.translate('Invalid IP address'));

          case 3:
            deletedThreads = {};
            updatedThreads = {};
            deletedPosts = {};
            _context24.next = 8;
            return client.collection('post');

          case 8:
            Post = _context24.sent;
            _context24.next = 11;
            return Tools.series(boardNames, function () {
              var _ref21 = _asyncToGenerator(regeneratorRuntime.mark(function _callee19(boardName) {
                var posts;
                return regeneratorRuntime.wrap(function _callee19$(_context19) {
                  while (1) {
                    switch (_context19.prev = _context19.next) {
                      case 0:
                        _context19.next = 2;
                        return Post.find({
                          boardName: boardName,
                          'user.ip': ip
                        }, {
                          number: 1,
                          threadNumber: 1
                        }).toArray();

                      case 2:
                        posts = _context19.sent;

                        posts.forEach(function (post) {
                          if (post.threadNumber === post.number) {
                            deletedThreads[boardName + ':' + post.threadNumber] = {
                              boardName: boardName,
                              number: post.threadNumber
                            };
                          }
                        });
                        posts.filter(function (post) {
                          return !deletedThreads.hasOwnProperty(boardName + ':' + post.threadNumber);
                        }).forEach(function (post) {
                          updatedThreads[boardName + ':' + post.threadNumber] = {
                            boardName: boardName,
                            number: post.threadNumber
                          };
                          deletedPosts[boardName + ':' + post.number] = {
                            boardName: boardName,
                            number: post.number,
                            threadNumber: post.threadNumber
                          };
                        });

                      case 5:
                      case 'end':
                        return _context19.stop();
                    }
                  }
                }, _callee19, this);
              }));

              return function (_x27) {
                return _ref21.apply(this, arguments);
              };
            }());

          case 11:
            _context24.next = 13;
            return Tools.series(deletedPosts, function () {
              var _ref22 = _asyncToGenerator(regeneratorRuntime.mark(function _callee20(post) {
                return regeneratorRuntime.wrap(function _callee20$(_context20) {
                  while (1) {
                    switch (_context20.prev = _context20.next) {
                      case 0:
                        _context20.next = 2;
                        return Post.deleteOne({
                          boardName: post.boardName,
                          number: post.number
                        });

                      case 2:
                      case 'end':
                        return _context20.stop();
                    }
                  }
                }, _callee20, this);
              }));

              return function (_x28) {
                return _ref22.apply(this, arguments);
              };
            }());

          case 13:
            _context24.next = 15;
            return Tools.series(deletedThreads, function () {
              var _ref23 = _asyncToGenerator(regeneratorRuntime.mark(function _callee21(thread) {
                return regeneratorRuntime.wrap(function _callee21$(_context21) {
                  while (1) {
                    switch (_context21.prev = _context21.next) {
                      case 0:
                        _context21.next = 2;
                        return ThreadsModel.deleteThread(thread.boardName, thread.number);

                      case 2:
                      case 'end':
                        return _context21.stop();
                    }
                  }
                }, _callee21, this);
              }));

              return function (_x29) {
                return _ref23.apply(this, arguments);
              };
            }());

          case 15:
            _context24.next = 17;
            return Tools.series(updatedThreads, function () {
              var _ref24 = _asyncToGenerator(regeneratorRuntime.mark(function _callee22(thread) {
                return regeneratorRuntime.wrap(function _callee22$(_context22) {
                  while (1) {
                    switch (_context22.prev = _context22.next) {
                      case 0:
                        _context22.next = 2;
                        return IPC.render(thread.boardName, thread.number, thread.number, 'edit');

                      case 2:
                      case 'end':
                        return _context22.stop();
                    }
                  }
                }, _callee22, this);
              }));

              return function (_x30) {
                return _ref24.apply(this, arguments);
              };
            }());

          case 17:
            _context24.next = 19;
            return Tools.series(deletedThreads, function () {
              var _ref25 = _asyncToGenerator(regeneratorRuntime.mark(function _callee23(thread) {
                return regeneratorRuntime.wrap(function _callee23$(_context23) {
                  while (1) {
                    switch (_context23.prev = _context23.next) {
                      case 0:
                        _context23.next = 2;
                        return IPC.render(thread.boardName, thread.number, thread.number, 'delete');

                      case 2:
                      case 'end':
                        return _context23.stop();
                    }
                  }
                }, _callee23, this);
              }));

              return function (_x31) {
                return _ref25.apply(this, arguments);
              };
            }());

          case 19:
          case 'end':
            return _context24.stop();
        }
      }
    }, _callee24, this);
  }));

  return function delall(_x24, _x25, _x26) {
    return _ref20.apply(this, arguments);
  };
}();

exports.postSubject = postSubject;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _posts = require('./posts');

var PostsModel = _interopRequireWildcard(_posts);

var _threads = require('./threads');

var ThreadsModel = _interopRequireWildcard(_threads);

var _board = require('../boards/board');

var _board2 = _interopRequireDefault(_board);

var _renderer = require('../core/renderer');

var Renderer = _interopRequireWildcard(_renderer);

var _ipc = require('../helpers/ipc');

var IPC = _interopRequireWildcard(_ipc);

var _tools = require('../helpers/tools');

var Tools = _interopRequireWildcard(_tools);

var _mongodbClientFactory = require('../storage/mongodb-client-factory');

var _mongodbClientFactory2 = _interopRequireDefault(_mongodbClientFactory);

var _key = require('../storage/key');

var _key2 = _interopRequireDefault(_key);

var _redisClientFactory = require('../storage/redis-client-factory');

var _redisClientFactory2 = _interopRequireDefault(_redisClientFactory);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var client = (0, _mongodbClientFactory2.default)();
var pageCounts = new Map();

var ThreadQuotas = new _key2.default((0, _redisClientFactory2.default)(), 'threadQuotas', {
  parse: function parse(quota) {
    return +quota;
  },
  stringify: function stringify(quota) {
    return quota.toString();
  }
});

function addDataToThread(thread, board) {
  thread.bumpLimit = board.bumpLimit;
  thread.postLimit = board.postLimit;
  thread.bumpLimitReached = thread.postCount >= board.bumpLimit;
  thread.postLimitReached = thread.postCount >= board.postLimit;
  thread.postingEnabled = board.postingEnabled && !thread.closed;
}

function postSubject(post, maxLength) {
  var subject = '';
  if (post.subject) {
    subject = post.subject;
  } else if (post.text) {
    subject = Renderer.plainText(post.text);
  }
  subject = subject.replace(/\r*\n+/gi, '');
  maxLength = Tools.option(maxLength, 'number', 0, { test: function test(l) {
      return l > 0;
    } });
  if (maxLength > 1 && subject.length > maxLength) {
    subject = subject.substr(0, maxLength - 1) + '…';
  }
  return subject;
}
//# sourceMappingURL=boards.js.map
