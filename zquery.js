function $(str){
    var myArr = {};//伪数组

    function parseHTML(str){
        var myDiv = document.createElement('div');
        myDiv.innerHTML = str;
        return myDiv.childNodes;
    }

    if(!str)return;//$(''),$(undefined),$(null)
    if(typeof str === 'object' && str.nodeType === 1){
        var arr = {
            0:str,
            length:1
        };
        myArr = arr;
    }else if(typeof str === 'string'){
        if(str.includes('<')){
            myArr = parseHTML(str);
        }else{
            var arr = document.querySelectorAll(str);
            myArr = arr;
        }
    }

    myArr.__proto__.map = function(callback){
        var tempArr = [];
        for(var i=0;i<this.length;i++){
            tempArr.push(callback(i,this[i]));
        }
        return tempArr;
    }

    myArr.__proto__.extend = function(obj){
        for(var i in obj){
            myArr.__proto__[i] = obj[i];
        }
    }

    myArr.__proto__.get = function(num){
        if(typeof num === 'undefined'){
            return myArr;
        }else{
            return {0:myArr[num],length:1};
        }
    }

    myArr.__proto__.appendTo = function(dom){
        for(var i=0;i<dom.length;i++){
            for(var j=0;j<this.length;j++){
                dom[i].insertAdjacentHTML('beforeend',this[j]);
            }
        }
    }

    myArr.__proto__.parent = function(){
        return {0:myArr[0].parentNode(),length:1};
    }

    myArr.__proto__.on = function(eventType,cb){
        for(var i=0;i<this.length;i++){
            this[i].addEventListener(eventType,function(){
                if(cb && typeof cb === 'function')cb();
            },false);
        }
    }


    myArr.__proto__.off = function(eventType,cb){
        for(var i=0;i<this.length;i++){
            this[i].removeEventListener(eventType,function(){
                if(cb && typeof cb === 'function')cb();
            },false);
        }
    }

    myArr.__proto__.css = function(k,v){
        if(typeof k === 'string'){
            if(typeof v === 'undefined'){
                return getComputedStyle(this[0])[k];
            }else{
                for(var i=0;i<this.length;i++){
                    this[i].style[k] = v;
                }
            }
        }else if(typeof k === 'object'){
            for(var i=0;i<this.length;i++){
                for(var j in k){
                    this[i][j] = k[j];
                }
            }
        }
    }

    myArr.__proto__.addClass = function(myClassName){
        for(var i=0;i<this.length;i++){
            this[i].className += ' ' + myClassName;
        }
    }

    myArr.__proto__.hasClass = function(myClassName){
        var reg = new RegExp('\\s' + myClassName + '\\s');
        return reg.test(this[0].className);
    }

    myArr.__proto__.removeClass = function(myClassName){
        var reg = new RegExp('\\s' + myClassName + '\\s');
        for(var i=0;i<this.length;i++){
            this[i].className = this[i].className.replace(reg,'');
        }
    }

    myArr.__proto__.toggleClass = function(myClassName){
        if(this.hasClass(myClassName)){
            this.removeClass(myClassName);
        }else{
            this.addClass(myClassName);
        }
    }

    myArr.__proto__.attr = function(k,v){
        if(typeof k === 'string'){
            if(typeof v === 'undefined'){
                return this[0].getAttribute(k);
            }else{
                for(var i=0;i<this.length;i++){
                    this[i].setAttribute(k,v);
                }
            }
        }else if(typeof k === 'object'){
            for(var i=0;i<this.length;i++){
                for(var j in k){
                    this[i][j] = k[j];
                }
            }
        }
    }


    myArr.__proto__.html = function(v){
        if(typeof v === 'undefined'){
            return this[0].innerHTML;
        }else{
            for(var i=0;i<this.length;i++){
                this[i].innerHTML = v;
            }
        }
    }

    return myArr;
}
