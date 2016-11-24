'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderPostFileInfo = exports.createThumbnail = undefined;

var createThumbnail = exports.createThumbnail = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(file, thumbPath, path) {
    var _this = this;

    var metadata, width, height, result, duration, bitrate, thumbInfo, _thumbInfo;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return new Promise(function (resolve, reject) {
              _fluentFfmpeg2.default.ffprobe(path, function (err, metadata) {
                if (err) {
                  return reject(err);
                }
                resolve(metadata);
              });
            });

          case 2:
            metadata = _context2.sent;
            width = Tools.option(metadata.streams[0].width, 'number', 0, { test: function test(w) {
                return w > 0;
              } });
            height = Tools.option(metadata.streams[0].height, 'number', 0, { test: function test(h) {
                return h > 0;
              } });
            result = {};

            if (width && height) {
              result.dimensions = {
                width: width,
                height: height
              };
            }
            duration = metadata.format.duration;
            bitrate = +metadata.format.bit_rate;

            result.extraData = {
              duration: +duration ? durationToString(duration) : duration,
              bitrate: bitrate ? Math.floor(bitrate / 1024) : 0
            };
            _context2.prev = 10;
            return _context2.delegateYield(regeneratorRuntime.mark(function _callee() {
              var pngThumbPath;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      pngThumbPath = thumbPath + '.png';
                      _context.next = 3;
                      return new Promise(function (resolve, reject) {
                        (0, _fluentFfmpeg2.default)(path).frames(1).on('error', reject).on('end', resolve).save(pngThumbPath);
                      });

                    case 3:
                      file.thumbPath = pngThumbPath;

                    case 4:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this);
            })(), 't0', 12);

          case 12:
            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t1 = _context2['catch'](10);

            _logger2.default.error(_context2.t1.stack || _context2.t1);

          case 17:
            if (!(thumbPath === file.thumbPath)) {
              _context2.next = 23;
              break;
            }

            _context2.next = 20;
            return Files.generateRandomImage(file.hash, file.mimeType, thumbPath);

          case 20:
            result.thumbDimensions = {
              width: 200,
              height: 200
            };
            _context2.next = 38;
            break;

          case 23:
            _context2.next = 25;
            return Files.getImageSize(file.thumbPath);

          case 25:
            thumbInfo = _context2.sent;

            if (thumbInfo) {
              _context2.next = 28;
              break;
            }

            throw new Error(Tools.translate('Failed to identify image file: $[1]', '', file.thumbPath));

          case 28:
            result.thumbDimensions = {
              width: thumbInfo.width,
              height: thumbInfo.height
            };

            if (!(result.thumbDimensions.width > 200 || result.thumbDimensions.height > 200)) {
              _context2.next = 38;
              break;
            }

            _context2.next = 32;
            return Files.resizeImage(file.thumbPath, 200, 200);

          case 32:
            _context2.next = 34;
            return Files.getImageSize(file.thumbPath);

          case 34:
            _thumbInfo = _context2.sent;

            if (_thumbInfo) {
              _context2.next = 37;
              break;
            }

            throw new Error(Tools.translate('Failed to identify image file: $[1]', '', file.thumbPath));

          case 37:
            result.thumbDimensions = {
              width: _thumbInfo.width,
              height: _thumbInfo.height
            };

          case 38:
            return _context2.abrupt('return', result);

          case 39:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[10, 14]]);
  }));

  return function createThumbnail(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var renderPostFileInfo = exports.renderPostFileInfo = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(fileInfo) {
    var _ref3, duration, bitrate;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (fileInfo.dimensions) {
              fileInfo.sizeText += ', ' + fileInfo.dimensions.width + 'x' + fileInfo.dimensions.height;
            }
            _ref3 = fileInfo.extraData || {}, duration = _ref3.duration, bitrate = _ref3.bitrate;

            if (duration) {
              fileInfo.sizeText += ', ' + duration;
            }
            if (bitrate) {
              fileInfo.sizeTooltip = bitrate + ' ' + Tools.translate('kbps');
            }

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function renderPostFileInfo(_x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.match = match;
exports.suffixMatchesMimeType = suffixMatchesMimeType;
exports.defaultSuffixForMimeType = defaultSuffixForMimeType;
exports.thumbnailSuffixForMimeType = thumbnailSuffixForMimeType;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _fluentFfmpeg = require('fluent-ffmpeg');

var _fluentFfmpeg2 = _interopRequireDefault(_fluentFfmpeg);

var _promisifyNode = require('promisify-node');

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

var _files = require('../core/files');

var Files = _interopRequireWildcard(_files);

var _logger = require('../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

var _tools = require('../helpers/tools');

var Tools = _interopRequireWildcard(_tools);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var MIME_TYPES_FOR_SUFFIXES = new Map();
var DEFAULT_SUFFIXES_FOR_MIME_TYPES = new Map();
var THUMB_SUFFIXES_FOR_MIME_TYPE = new Map();

function durationToString(duration) {
  duration = Math.floor(+duration);
  var hours = Tools.pad(Math.floor(duration / 3600), 2, '0');
  duration %= 3600;
  var minutes = Tools.pad(Math.floor(duration / 60), 2, '0');
  var seconds = Tools.pad(duration % 60, 2, '0');
  return (hours != '00' ? hours + ':' : '') + (minutes + ':' + seconds);
}

function defineMimeTypeSuffixes(mimeType, extensions, thumbSuffix) {
  if (!(0, _underscore2.default)(extensions).isArray()) {
    extensions = [extensions];
  }
  extensions.forEach(function (extension) {
    MIME_TYPES_FOR_SUFFIXES.set(extension, mimeType);
  });
  DEFAULT_SUFFIXES_FOR_MIME_TYPES.set(mimeType, extensions[0]);
  THUMB_SUFFIXES_FOR_MIME_TYPE.set(mimeType, thumbSuffix);
}

defineMimeTypeSuffixes('video/mp4', 'mp4', 'png');
defineMimeTypeSuffixes('video/webm', 'webm', 'png');

function match(mimeType) {
  return Files.isVideoType(mimeType);
}

function suffixMatchesMimeType(suffix, mimeType) {
  return MIME_TYPES_FOR_SUFFIXES.get(suffix) === mimeType;
}

function defaultSuffixForMimeType(mimeType) {
  return DEFAULT_SUFFIXES_FOR_MIME_TYPES.get(mimeType) || null;
}

function thumbnailSuffixForMimeType(mimeType) {
  return THUMB_SUFFIXES_FOR_MIME_TYPE.get(mimeType);
}
//# sourceMappingURL=video.js.map
