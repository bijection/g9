var isMac = window.navigator.platform.indexOf('Mac') !== -1


//https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
function inViewPort(el) {

    var rect = el.getBoundingClientRect();

    return rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
}

;[].slice.call(document.querySelectorAll('.input')).forEach(function(i){


    function init(){
       var cm = CodeMirror.fromTextArea(i.querySelector('textarea'), {
            theme: 'solarized',
            indentUnit: 4,
            keyMap: 'sublime',
            lineWrapping: true
        })

        var _graphics;
        var _intervals = [];

        function run(){
            var _g9 = window.g9
            var _setInterval = window.setInterval
            var g9 = function(a,b,c) {
                _graphics = _g9(a,b,c)
                return _graphics
            }
            var setInterval = function(a,b){
                _intervals.push(_setInterval(a,b))
            }
            if(_graphics && _graphics.remove) {try{_graphics.remove()}catch(e){}}
            var _interval; while(_interval = _intervals.pop()) clearInterval(_interval);
            eval(cm.getValue())
        }

        cm.setOption('extraKeys', {
            "Cmd-Enter": run,
            "Ctrl-Enter": run
        })

        cm.on('changes', function(){
            _graphics && _graphics.resize()
        })

        run()

        var runButton = i.querySelector('.run-button')
        runButton.addEventListener('click', run)
        runButton.innerHTML += isMac ? ' (Cmd-Enter)' : '(Ctrl-Enter)' 
    }


    if(inViewPort(i))
        init();
    else {
        window.addEventListener('scroll', function tryInit(){
            if(!inViewPort(i)) return;
        
            init()
            window.removeEventListener('scroll', tryInit)
        })
    }

})