// Generated by CoffeeScript 1.4.0
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(function(require, exports) {
  var copy, input, show;
  show = function() {};
  input = '<input id="input"/>';
  copy = function(json) {
    return JSON.parse(JSON.stringify(json));
  };
  exports.editor = function(id) {
    var add_history, all, alpha, choice, create_block, ctrl_c, ctrl_v, ctrl_x, ctrl_y, ctrl_z, do_render, elem, focused, get_local, history, insert_blank, insert_char, key_ctrl_c, key_ctrl_m, key_ctrl_v, key_ctrl_x, key_ctrl_y, key_ctrl_z, list, move_down, move_left, move_right, move_up, render, reset_history, ret, rm_caret, set_local, tool, _ref;
    elem = document.querySelector("#" + id);
    _ref = require('./functions'), insert_char = _ref.insert_char, insert_blank = _ref.insert_blank, move_left = _ref.move_left, move_right = _ref.move_right, move_up = _ref.move_up, move_down = _ref.move_down, create_block = _ref.create_block, ctrl_x = _ref.ctrl_x, ctrl_c = _ref.ctrl_c, ctrl_v = _ref.ctrl_v, ctrl_z = _ref.ctrl_z, ctrl_y = _ref.ctrl_y, add_history = _ref.add_history, reset_history = _ref.reset_history, rm_caret = _ref.rm_caret;
    tool = {
      err: function(info) {
        throw new Error(info);
      }
    };
    ret = {};
    list = [['\t']];
    focused = false;
    history = {
      all: [['\t']],
      now: 0
    };
    set_local = function(str) {
      return localStorage["cirru." + id] = str;
    };
    get_local = function() {
      return localStorage["cirru." + id];
    };
    ret.reset_history = function(list) {
      return history = reset_history(history, list);
    };
    ret.__defineGetter__('value', function() {
      return rm_caret(list);
    });
    render = require('./renderer').render;
    ret.render = do_render = function() {
      render(list, elem);
      return set_local(JSON.stringify({
        value: list
      }));
    };
    ret.val = function(value) {
      if (value != null) {
        list = value;
        return do_render();
      } else {
        return list;
      }
    };
    elem.onclick = function(e) {
      var fd;
      document.body.click();
      focused = true;
      fd = 'cirru-focused';
      if (elem.className.indexOf(fd) < 0) {
        elem.className = elem.className + ' ' + fd;
      }
      return e.stopPropagation();
    };
    document.addEventListener('click', function() {
      var fd;
      focused = false;
      fd = 'cirru-focused';
      if (elem.className.indexOf(fd) >= 0) {
        return elem.className = elem.className.replace(fd, '').replace(/\s+$/, '');
      }
    });
    alpha = 'qwertyuiopasdfghjklzxcvbnm';
    all = '`1234567890-=~!@#$%^&*()_+ ';
    all += alpha;
    all += alpha.toUpperCase();
    all += '[]\\{}|;:"\',./<>?';
    all = all.split('');
    document.body.addEventListener('keypress', function(e) {
      var char;
      if (focused) {
        char = String.fromCharCode(e.keyCode);
        if (__indexOf.call(all, char) >= 0) {
          list = insert_char(list, char);
          history = add_history(copy(history), copy(list));
          return do_render();
        }
      }
    });
    choice = require('./control').choice;
    document.body.addEventListener('keydown', function(e) {
      var code;
      if (focused) {
        code = e.keyCode;
        show(code, e);
        if (!e.ctrlKey) {
          if (choice[code] != null) {
            list = choice[code](list);
            history = add_history(copy(history), copy(list));
            do_render();
            return e.preventDefault();
          }
        } else {
          show(code);
          if (code === 77) {
            return key_ctrl_m(e);
          } else if (code === 88) {
            return key_ctrl_x();
          } else if (code === 67) {
            return key_ctrl_c();
          } else if (code === 86) {
            return key_ctrl_v();
          } else if (code === 90) {
            return key_ctrl_z();
          } else if (code === 89) {
            return key_ctrl_y();
          }
        }
      }
    });
    key_ctrl_m = function(e) {
      var input_elem;
      if (focused) {
        document.querySelector('#caret').outerHTML = input;
        focused = false;
        input_elem = document.querySelector('#input');
        input_elem.focus();
        input_elem.onkeydown = function(e) {
          if (e.keyCode === 13) {
            focused = true;
            list = insert_char(list, document.querySelector('#input').value);
            do_render();
            return e.stopPropagation();
          }
        };
        e.stopPropagation();
        return false;
      }
    };
    key_ctrl_x = function() {
      show('control x');
      list = ctrl_x(list);
      do_render();
      return false;
    };
    key_ctrl_c = function() {
      list = ctrl_c(list);
      do_render();
      return false;
    };
    key_ctrl_v = function() {
      list = ctrl_v(list);
      do_render();
      return false;
    };
    key_ctrl_z = function() {
      list = ctrl_z(history);
      do_render();
      return false;
    };
    key_ctrl_y = function() {
      list = ctrl_y(history);
      do_render();
      return false;
    };
    list = get_local() != null ? (JSON.parse(get_local())).value : (set_local(JSON.stringify({
      value: ['\t']
    })), ['\t']);
    ret.render();
    ret.reset_history(list);
    elem.click();
    return ret;
  };
});