//核心模块
(function(window) {
    var arr = [],
    push = arr.push,
    slice = arr.slice;
    function Itcast(selector) {
        return new Itcast.fn.init(selector);
    }

    Itcast.fn = Itcast.prototype = {
        constructor: Itcast,

        length: 0,

        each: function(callback) {
            return Itcast.each(this, callback);
        },
        map: function(callback) {
            return Itcast.map(this, callback);
        },
        toArray: function() {
            return slice.call(this);
        },
        get: function(index) {
            // arguments.length == 0 
            if (index === undefined) {
                // 没有传参
                return this.toArray();
            } else {
                // 传入了参数
                if (index >= 0) {
                    return this[index];
                } else if (index < 0) {
                    return this[this.length + index];
                }
            }

            return this; // 如果传入的既不是正数, 也不是负数, 也不是没有传参
        },
        end: function() {
            return this.prevObj || this;
        },
        pushStack: function(newObj) {
            newObj.prevObj = this;
            return newObj;
        }
    };

    Itcast.isArrayLike = function(array) {
        var length = array && array.length;

        return typeof length === 'number' && length >= 0;

    }
    Itcast.each = function(array, callback) {
        var i, k;
        if (Itcast.isArrayLike(array)) {
            // 使用 for 循环
            for (i = 0; i < array.length; i++) {
                if (callback.call(array[i], i, array[i]) === false) break;
            }
        } else {
            // 使用 for-in 循环
            for (k in array) {
                if (callback.call(array[i], k, array[k]) === false) break;
            }
        }
        return array;
    }

    Itcast.map = function(array, callback) {
        var i, k, res = [],
        tmp;
        if (Itcast.isArrayLike(array)) {
            // 使用 for 循环
            for (i = 0; i < array.length; i++) {
                tmp = callback(array[i], i);
                if (tmp !== undefined) {
                    res.push(tmp);
                }
            }
        } else {
            // 使用 for-in 循环
            for (k in array) {
                tmp = callback(array[k], k);
                if (tmp !== undefined) {
                    res.push(tmp);
                }
            }
        }
        return res;
    }
    Itcast.select = function(selector) {
        return document.querySelectorAll(selector);
    }

    Itcast.extend = Itcast.fn.extend = function(obj) {
        for (var k in obj) {
            this[k] = obj[k];
        }
    };

    window.Itcast = window.I = Itcast; // 在 全局范围内 引入两个变量
})(window);

//无new实例化相关
(function(window) {

    // 注意: 由于 核心模块应该首先执行, 因此在这里 Itcast 构造函数, I 函数等可以直接使用
    var Itcast = window.Itcast,
    I = Itcast,
    arr = [],
    push = arr.push;

    // 给 Itcast 的 原型增加一个属性, 以便可以容易的判断当前对象的类型
    Itcast.fn.type = 'Itcast';

    var init = Itcast.fn.init = function(selector) {
        // 需要判断, 根据传入的数据不同而实现不同的功能
        // 处理: null, undefined, '', 等
        if (!selector) return this;

        // 处理字符串: 选择器 和 html 格式的字符串
        if (typeof selector == 'string') {
            // 判断是选择器 还是 html 字符串
            if (selector.charAt(0) == '<' && selector.charAt(selector.length - 1) == '>') {
                // HTML 标签
                push.apply(this, Itcast.parseHTML(selector));
                return this;
            } else {
                // 选择器
                push.apply(this, Itcast.select(selector));
                return this;
            }
        }

        // 处理 dom 元素: nodeType
        if (selector.nodeType) {
            // 如果是 DOM 元素, 应该将其包装成 一个 Itcast 的对象
            // 但是 Itcast 对象本质有是一个伪数组
            // this[ 0 ] = selector;
            // this.length = 1;
            push.call(this, selector);

            return this;
        }

        // 处理 Itcast 元素: 
        // 1> 使用 constructor
        // 2> 使用 自定义的一个属性
        // 暂时使用 第一种做法
        // if ( selector.constructor == Itcast ) {
        if (selector.type === 'Itcast') {
            // 1, 直接返回传入的 Itcast 对象
            // return selector;
            // 2, 将传入 Itcast 对象中的每一个元素 一一加到 this 中, 构成一个新的 对象.
            push.apply(this, selector);

            return this;
        }

        // 处理 函数
        if (typeof selector == 'function') {
            // 当传入的是函数的时候, 相当于 onload 事件( 相当于, 但不是 onload )
            window.addEventListener('load', selector);
        }

    };

    init.prototype = Itcast.fn;

})(window);

//dom相关
(function(window) {

    // 注意: 由于 核心模块应该首先执行, 因此在这里 Itcast 构造函数, I 函数等可以直接使用
    var Itcast = window.Itcast,
    I = Itcast,
    arr = [],
    push = arr.push;

    function parseHTML(htmlStr) {
        var rest = [],
        i,
        div = document.createElement('div');
        div.innerHTML = htmlStr;
        for (i = 0; i < div.childNodes.length; i++) {
            rest.push(div.childNodes[i]);
        }
        return rest
    }
    Itcast.parseHTML = parseHTML;

    // 其他
    Itcast.fn.extend({
        appendTo: function(selector) {
            var iObj = Itcast(selector),
            // 准备一个空的新的 Itcast 对象( 容器 )
            iNewObj = Itcast(),
            tmp,
            // 存储临时的数据
            rest = [],
            len = iObj.length,
            i;

            this.each(function() {

                for (i = 0; i < len; i++) {
                    tmp = i == len - 1 ? this: this.cloneNode(true);
                    iObj[i].appendChild(tmp);
                    rest.push(tmp);
                }

            });

            push.apply(iNewObj, rest);

            return this.pushStack(iNewObj);
        },
        append: function(selector) {

    }

    });

    Itcast.extend({
        unique: function(iObj) {
            var tmp = [],
            newIOIbj = Itcast();
            for (var i = 0; i < iObj.length; i++) {
                if (tmp.indexOf(iObj[i]) == -1) {
                    tmp.push(iObj[i]);
                }
            }
            push.apply(newIOIbj, tmp);
            return newIOIbj;
        }
    });

    Itcast.fn.extend({
        parent: function() {
            var iObj = Itcast();

            push.apply(iObj, this.map(function(v) {
                return v.parentNode;
            }));
            // 去除重复
            iObj = Itcast.unique(iObj);

            return this.pushStack(iObj);
        }
    });

})(window);

//事件相关
(function(window) {

    Itcast.fn.extend({

        on: function(eventName, callback) {
            // 遍历 this. 给每一个 dom 元素都绑定事件
            return this.each(function() {
                this.addEventListener(eventName, callback);
            });

        },
        off: function(eventName, callback) {
            // 遍历 this. 给每一个 dom 元素都绑定事件
            return this.each(function() {
                this.removeEventListener(eventName, callback);
            });

        }

    });

    Itcast.each(('abort,blur,cancel,canplay,canplaythrough,change,click,close,contextmenu,' + 'cuechange,dblclick,drag,dragend,dragenter,dragleave,dragover,dragstart,drop,' + 'durationchange,emptied,ended,error,focus,input,invalid,keydown,keypress,keyup,' + 'load,loadeddata,loadedmetadata,loadstart,mousedown,mouseenter,mouseleave,mousemove,' + 'mouseout,mouseover,mouseup,mousewheel,pause,play,playing,progress,ratechange,reset,' + 'resize,scroll,seeked,seeking,select,show,stalled,submit,suspend,timeupdate,toggle,' + 'volumechange,waiting,autocomplete,autocompleteerror,beforecopy,beforecut,' + 'beforepaste,copy,cut,paste,search,selectstart,wheel,webkitfullscreenchange,' + 'webkitfullscreenerror').split(','),
    function(i, v) {
        Itcast.fn[v] = function(callback) {
            return this.on(v, callback);
        };
    });

})(window);

//样式相关
(function(window) {

    Itcast.fn.extend({
        css: function(name, value) {
            if (value === undefined) {
                // 一个参数
                if (typeof name === 'string') {
                    // 获得对应的样式
                    return this[0].style[name] || window.getComputedStyle(this[0])[name];
                } else {
                    // 设置多个样式
                    return this.each(function() {
                        // name 是一个对象
                        var that = this;
                        Itcast.each(name,
                        function(k, v) {
                            that.style[k] = v;
                        });
                    });
                }
            } else {
                // 设置一个样式
                return this.each(function() {
                    this.style[name] = value;
                });
            }
        },
        addClass: function(name) {
            return this.each(function() {
                if (this.className) {
                    this.className += ' ' + name;
                } else {
                    this.className = name;
                }
            });
        },
        removeClass: function(name) {
            // 将 this 中 的 className 属性中 与 name 同名的 样式去掉
            return this.each(function() {
                var names = this.className && this.className.split(' ') || [];

                // filter 方法, map 方法
                // indexOf
                // var newNames = names.filter( function ( v, i ) {
                //     return v != name;
                // });
                var newNames = names.map(function(v, i) {
                    if (v != name) {
                        return v;
                    }
                });

                this.className = newNames.join(' ');
            });
        },
        hasClass: function(name) {
            // 判断 第 0 个元素是否含有
            var dom = this[0];
            var names = dom.className && dom.className.split(' ') || [];
            for (var i = 0; i < names.length; i++) {
                if (names[i] == name) {
                    return true;
                }
            }
            return false;
        },
        toggleClass: function(name) {
            return this.each(function() {
                var iObj = Itcast(this);
                if (iObj.hasClass(name)) {
                    iObj.removeClass(name);
                } else {
                    iObj.addClass(name);
                }
            });
        }

    });

})(window);
