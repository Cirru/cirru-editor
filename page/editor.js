// Generated by CoffeeScript 1.3.3
var cirru,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

cirru = function() {
  var blank, caret, editable, empty, exist, focus, in_sight, leaf, menu, paste, piece, point, put, root, text;
  if (typeof $ === "undefined" || $ === null) {
    alert('Where s my jQuery!?');
  }
  editable = 'contenteditable';
  caret = "<code id='target' " + editable + "='true'/>";
  menu = '<footer id="menu"></footer>';
  blank = ['', '<br>'];
  paste = '';
  window.p = function() {
    return $('#point');
  };
  window.t = function() {
    return $('#target');
  };
  window.m = function() {
    return $('#menu');
  };
  window.s = function() {
    return $('#sel');
  };
  window.c = function() {
    return $('#cirru');
  };
  empty = function(elem) {
    var _ref;
    return _ref = elem.html(), __indexOf.call(blank, _ref) >= 0;
  };
  root = function(elem) {
    return elem.parent().attr('id') === 'cirru';
  };
  exist = function(elem) {
    return elem.length > 0;
  };
  leaf = function(elem) {
    return elem[0].tagName === 'CODE';
  };
  text = function(elem) {
    return elem.html().replace(/<br>/g, '');
  };
  point = function(refocus) {
    var aval, old, up;
    if (refocus == null) {
      refocus = true;
    }
    aval = [];
    old = p().removeAttr('id').removeAttr(editable);
    if (exist(old)) {
      old.html(text(old));
      old[0].onclick = function(e) {
        old.attr('id', 'target').attr(editable, 'true');
        point(false);
        return e.stopPropagation();
      };
      while (empty(old)) {
        up = old.parent();
        old.remove();
        old = up;
        if (root(old)) {
          if (empty(old)) {
            old.remove();
          }
          break;
        }
      }
    }
    t().attr('id', 'point').attr(editable, 'true');
    if (refocus) {
      focus();
    }
    return put();
  };
  focus = function() {
    var sel;
    sel = window.getSelection();
    sel.collapse(p()[0], 1);
    $('div').addClass('inline');
    $('div:has(div)').removeClass('inline');
    p().focus();
    return localStorage.cirru = c().html();
  };
  in_sight = true;
  c().bind('focus', function() {
    return in_sight = true;
  });
  c().bind('blur', function() {
    return in_sight = false;
  });
  c().keydown(function(e) {
    var it, next, prev, up, _ref, _ref1, _ref2;
    console.log(e.keyCode);
    if (in_sight) {
      switch (e.keyCode) {
        case 13:
          if (exist(s())) {
            p().html(text(s()));
            s().removeAttr('id');
            focus();
            return false;
          } else {
            p().after("<div>" + caret + "</div>");
            next = p().next();
            next[0].onclick = function(e) {
              next.append(caret);
              point();
              return e.stopPropagation();
            };
          }
          break;
        case 9:
          if (exist(s())) {
            p().html(text(s()));
          }
          if (e.shiftKey) {
            p().before(caret);
          } else {
            p().after(caret);
          }
          break;
        case 46:
          if (exist(p().prev())) {
            it = p().prev();
            if (leaf(it)) {
              it.attr('id', 'target');
            } else {
              it.append(caret);
            }
          } else if (exist(p().next())) {
            it = p().next();
            if (leaf(it)) {
              it.attr('id', 'target');
            } else {
              it.prepend(caret);
            }
          } else if (!root(p())) {
            p().parent().after(caret).remove();
          } else if (_ref = p().html(), __indexOf.call(blank, _ref) < 0) {
            p().after(caret);
          } else {
            return true;
          }
          p().remove();
          break;
        case 38:
          if (_ref1 = p().html(), __indexOf.call(blank, _ref1) < 0) {
            p().before(caret);
          } else if (exist(p().prev())) {
            prev = p().prev();
            if (leaf(prev)) {
              prev.attr('id', 'target');
            } else {
              prev.append(caret);
            }
          } else if (!root(p())) {
            p().parent().before(caret);
          } else {
            return false;
          }
          break;
        case 40:
          if (_ref2 = p().html(), __indexOf.call(blank, _ref2) < 0) {
            p().after(caret);
          } else if (exist(p().next())) {
            next = p().next();
            if (leaf(next)) {
              next.attr('id', 'target');
            } else {
              next.prepend(caret);
            }
          } else if (!root(p())) {
            p().parent().after(caret);
          } else {
            return false;
          }
          break;
        case 219:
          if (e.ctrlKey && (!(root(p())))) {
            up = p().parent();
            up.after(caret);
            point();
            console.log(up.parent());
            paste = up[0].innerHTML || '';
            up.remove();
          }
          return true;
        case 221:
          if (e.ctrlKey && paste.length > 0) {
            p().before(paste);
          }
          return true;
        case 33:
          if (!exist(s())) {
            m().children().last().attr('id', 'sel');
          } else {
            if (exist(s().prev().prev())) {
              s().removeAttr('id').prev().prev().attr('id', 'sel');
            } else {
              s().removeAttr('id');
            }
            return false;
          }
          break;
        case 34:
          if (exist(s())) {
            if (exist(s().next().next())) {
              s().removeAttr('id').next().next().attr('id', 'sel');
            }
          } else if (exist(m().children())) {
            m().children().first().attr('id', 'sel');
          }
          return false;
        case 27:
          if (exist(m().children())) {
            m().empty();
          }
          return false;
        default:
          return true;
      }
    }
    point();
    return false;
  });
  cirru.parse = function() {
    var map, res;
    map = function(item, b) {
      if (leaf([item])) {
        return item.innerText;
      } else {
        return [
          $.map(item.children, function(x) {
            return map(x);
          })
        ];
      }
    };
    res = $.map(c()[0].children, map);
    return res;
  };
  piece = function() {
    var all, platten, words;
    all = cirru.parse();
    words = [];
    platten = function(item) {
      return item.forEach(function(i) {
        if (Array.isArray(i)) {
          return platten(i);
        } else if (!((i === '') || (__indexOf.call(words, i) >= 0))) {
          return words.push(i);
        }
      });
    };
    platten(all);
    return words;
  };
  put = function() {
    var left, top, _ref;
    _ref = p().offset(), left = _ref.left, top = _ref.top;
    m().offset({
      left: left,
      top: top + 20
    });
    m().empty();
    return p()[0].oninput = function() {
      var aval, exp, input, x;
      x = '.*';
      input = text(p());
      exp = new RegExp('^' + input.split('').join(x));
      aval = piece().filter(function(item) {
        return (exp.test(item)) && (item !== input) && input !== '';
      });
      m().empty();
      aval.slice(0, 11).forEach(function(item) {
        var sel;
        m().append("<span>" + item + "</span><br>");
        sel = m().children().last().prev();
        return sel[0].onclick = function() {
          p().html(text(sel));
          s().removeAttr('id');
          return focus();
        };
      });
      if (exist(m().children())) {
        return m().children().first().attr('id', 'sel');
      }
    };
  };
  if (localStorage.cirru != null) {
    c().html(localStorage.cirru);
  } else if (!exist(p())) {
    c().append(caret).after(menu);
  }
  t().attr('id', 'point');
  focus();
  c()[0].onclick = function(e) {
    return focus();
  };
  c()[0].onscroll = function() {
    return put();
  };
  return c().bind('input', function() {
    return localStorage.cirru = c().html();
  });
};
