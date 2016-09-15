'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcProgress = require('rc-progress');

var _s3upload = require('react-s3-uploader/s3upload');

var _s3upload2 = _interopRequireDefault(_s3upload);

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DropzoneS3Uploader = function (_React$Component) {
  _inherits(DropzoneS3Uploader, _React$Component);

  function DropzoneS3Uploader() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DropzoneS3Uploader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DropzoneS3Uploader.__proto__ || Object.getPrototypeOf(DropzoneS3Uploader)).call.apply(_ref, [this].concat(args))), _this), _this.onProgress = function (progress) {
      var progFn = _this.props.onProgress;
      if (progFn) progFn(progress);
      _this.setState({ progress: progress });
    }, _this.onError = function (err) {
      var errFn = _this.props.onError;
      if (errFn) errFn(err);
      _this.setState({ error: err });
    }, _this.onFinish = function (info) {
      var finFn = _this.props.onFinish;
      if (finFn) finFn(info);
      _this.setState({ filename: info.filename, error: null, progress: null });
    }, _this.handleDrop = function (files) {
      var error = null;
      var size = files[0].size;
      var max_file_size = _this.props.max_file_size || _this.props.maxFileSize;

      if (!_this.props.multiple && files.length > 1) {
        error = 'Only drop one file';
      } else if (max_file_size && size > max_file_size) {
        var size_kb = (size / 1024 / 1024).toFixed(2);
        var max_kb = (max_file_size / 1024 / 1024).toFixed(2);
        error = 'Files nust be smaller than ' + max_kb + 'kb. Yours is ' + size_kb + 'kb';
      }
      _this.setState({ error: error });
      if (error) return;

      new _s3upload2.default({ // eslint-disable-line
        files: files,
        signingUrl: _this.props.signing_url || _this.props.signingUrl || '/s3/sign',
        signingUrlQueryParams: _this.props.signing_url_query_params || _this.props.signingUrlQueryParams || {},
        onProgress: _this.onProgress,
        onFinishS3Put: _this.onFinish,
        onError: _this.onError,
        uploadRequestHeaders: _this.props.headers || { 'x-amz-acl': 'public-read' },
        contentDisposition: 'auto',
        server: _this.props.server || _this.props.host || ''
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DropzoneS3Uploader, [{
    key: 'render',
    value: function render() {
      var state = this.state || { filename: this.props.filename };
      var filename = state.filename;
      var progress = state.progress;
      var error = state.error;

      var s3_url = this.props.s3_url || this.props.s3Url;
      var file_url = filename ? s3_url + '/' + filename : null;

      var dropzone_props = {
        style: this.props.style || {
          height: 200,
          border: 'dashed 2px #999',
          borderRadius: 5,
          position: 'relative',
          cursor: 'pointer'
        },
        activeStyle: this.props.active_style || this.props.activeStyle || {
          borderStyle: 'solid',
          backgroundColor: '#eee'
        },
        rejectStyle: this.props.reject_style || this.props.rejectStyle || {
          borderStyle: 'solid',
          backgroundColor: '#ffdddd'
        },
        multiple: this.props.multiple || false,
        accept: this.props.accept
      };

      var image_style = this.props.image_style || this.props.imageStyle || {
        position: 'absolute',
        top: 0,
        width: 'auto',
        height: '100%'
      };

      var contents = null;
      if (this.props.children) {
        contents = _react2.default.cloneElement(_react2.default.Children.only(this.props.children), {
          file_url: file_url, s3_url: s3_url, filename: filename, progress: progress, error: error, image_style: image_style,
          fileUrl: file_url, s3Url: s3_url, imageStyle: image_style
        });
      } else if (file_url) {
        if (DropzoneS3Uploader.isImage(file_url)) {
          contents = _react2.default.createElement('img', { src: file_url, style: image_style });
        } else {
          contents = _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement('span', { className: 'glyphicon glyphicon-file', style: { fontSize: '50px' } }),
            filename
          );
        }
      }

      return _react2.default.createElement(
        _reactDropzone2.default,
        _extends({ onDrop: this.handleDrop }, dropzone_props),
        contents,
        progress ? _react2.default.createElement(_rcProgress.Line, { percent: progress, strokeWidth: '4', strokeColor: '#D3D3D3' }) : null,
        error ? _react2.default.createElement(
          'small',
          null,
          error
        ) : null
      );
    }
  }], [{
    key: 'isImage',
    value: function isImage(filename) {
      return filename && filename.match(/\.(jpeg|jpg|gif|png)/);
    }
  }]);

  return DropzoneS3Uploader;
}(_react2.default.Component);

DropzoneS3Uploader.propTypes = {
  host: _react.PropTypes.string,
  server: _react.PropTypes.string,
  s3_url: _react.PropTypes.string,
  s3Url: _react.PropTypes.string,
  signing_url: _react.PropTypes.string,
  signingUrl: _react.PropTypes.string,
  signing_url_query_params: _react.PropTypes.object,
  signingUrlQueryParams: _react.PropTypes.object,

  children: _react.PropTypes.element,
  headers: _react.PropTypes.object,
  multiple: _react.PropTypes.bool,
  accept: _react.PropTypes.string,
  filename: _react.PropTypes.string,
  max_file_size: _react.PropTypes.number,
  maxFileSize: _react.PropTypes.number,

  style: _react.PropTypes.object,
  active_style: _react.PropTypes.object,
  activeStyle: _react.PropTypes.object,
  reject_style: _react.PropTypes.object,
  rejectStyle: _react.PropTypes.object,
  image_style: _react.PropTypes.object,
  imageStyle: _react.PropTypes.object,

  onError: _react.PropTypes.func,
  onProgress: _react.PropTypes.func,
  onFinish: _react.PropTypes.func
};
exports.default = DropzoneS3Uploader;