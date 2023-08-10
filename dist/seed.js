"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("reflect-metadata");

var _typeorm = require("typeorm");

var _User = require("./entity/User");

var _Post = require("./entity/Post");

var _Comment = require("./entity/Comment");

(0, _typeorm.createConnection)().then( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(connection) {
    var manager, random, u1, p1, c1;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            manager = connection.manager;
            random = Math.round(Math.random() * 100); // 创建 user 1

            u1 = new _User.User();
            u1.username = "hannah ".concat(random);
            u1.passwordDigest = 'xxx';
            _context.next = 7;
            return manager.save(u1);

          case 7:
            // 创建 post 1
            p1 = new _Post.Post();
            p1.title = "Post ".concat(random);
            p1.content = "My ".concat(random, " Post");
            p1.author = u1;
            _context.next = 13;
            return manager.save(p1);

          case 13:
            c1 = new _Comment.Comment();
            c1.user = u1;
            c1.post = p1;
            c1.content = 'Awesome!';
            _context.next = 19;
            return manager.save(c1);

          case 19:
            connection.close();
            console.log('OK!');

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}())["catch"](function (error) {
  return console.log(error);
});