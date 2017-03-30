'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderPostFileInfo = exports.createThumbnail = undefined;

var createThumbnail = exports.createThumbnail = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(file, thumbPath, path) {
    var metadata, width, height, i, result, duration, bitrate, pngThumbPath, thumbInfo, _thumbInfo;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return new Promise(function (resolve, reject) {
              _fluentFfmpeg2.default.ffprobe(path, function (err, metadata) {
                if (err) {
                  return reject(err);
                }
                resolve(metadata);
              });
            });

          case 2:
            metadata = _context.sent;
            width = void 0, height = void 0;
            i = 0;

          case 5:
            if (!(i < metadata.streams.length)) {
              _context.next = 13;
              break;
            }

            if (!(!isNaN(+metadata.streams[i].width) && !isNaN(+metadata.streams[i].height))) {
              _context.next = 10;
              break;
            }

            width = Tools.option(metadata.streams[i].width, 'number', 0, { test: function test(w) {
                return w > 0;
              } });
            height = Tools.option(metadata.streams[i].height, 'number', 0, { test: function test(h) {
                return h > 0;
              } });
            return _context.abrupt('break', 13);

          case 10:
            i++;
            _context.next = 5;
            break;

          case 13:
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
            _context.prev = 18;
            pngThumbPath = thumbPath + '.png';
            _context.next = 22;
            return new Promise(function (resolve, reject) {
              (0, _fluentFfmpeg2.default)(path).frames(1).on('error', reject).on('end', resolve).save(pngThumbPath);
            });

          case 22:
            file.thumbPath = pngThumbPath;
            _context.next = 28;
            break;

          case 25:
            _context.prev = 25;
            _context.t0 = _context['catch'](18);

            _logger2.default.error(_context.t0.stack || _context.t0);

          case 28:
            if (!(thumbPath === file.thumbPath)) {
              _context.next = 34;
              break;
            }

            _context.next = 31;
            return Files.generateRandomImage(file.hash, file.mimeType, thumbPath);

          case 31:
            result.thumbDimensions = {
              width: 200,
              height: 200
            };
            _context.next = 49;
            break;

          case 34:
            _context.next = 36;
            return Files.getImageSize(file.thumbPath);

          case 36:
            thumbInfo = _context.sent;

            if (thumbInfo) {
              _context.next = 39;
              break;
            }

            throw new Error(Tools.translate('Failed to identify image file: $[1]', '', file.thumbPath));

          case 39:
            result.thumbDimensions = {
              width: thumbInfo.width,
              height: thumbInfo.height
            };

            if (!(result.thumbDimensions.width > 200 || result.thumbDimensions.height > 200)) {
              _context.next = 49;
              break;
            }

            _context.next = 43;
            return Files.resizeImage(file.thumbPath, 200, 200);

          case 43:
            _context.next = 45;
            return Files.getImageSize(file.thumbPath);

          case 45:
            _thumbInfo = _context.sent;

            if (_thumbInfo) {
              _context.next = 48;
              break;
            }

            throw new Error(Tools.translate('Failed to identify image file: $[1]', '', file.thumbPath));

          case 48:
            result.thumbDimensions = {
              width: _thumbInfo.width,
              height: _thumbInfo.height
            };

          case 49:
            return _context.abrupt('return', result);

          case 50:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[18, 25]]);
  }));

  return function createThumbnail(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var renderPostFileInfo = exports.renderPostFileInfo = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(fileInfo) {
    var _ref3, duration, bitrate;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
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
            return _context2.stop();
        }
      }
    }, _callee2, this);
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
