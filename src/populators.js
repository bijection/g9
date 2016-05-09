const defaultBounds = {
    xmin: -Infinity,
    xmax: Infinity,
    ymin: -Infinity,
    ymax: Infinity,
}

const empty = {attr(){return empty}}

var autoId = 0
var autoIdInfix = ''
function getId(opts={}, stack){
    if(typeof opts === 'string' || typeof opts === 'number'){
        return opts
    } else if ('id' in opts){
        return opts.id
    }
    return 'auto' + autoIdInfix + autoId++
}

export function Data2Renderables(populateRenderables){
    return function data2renderables(data){

        var renderables = {}//, stickyRenderables = {}

        autoId = 0
        
        function handle(id){
            return {
                data:renderables[id],
                attr(attributes){
                    renderables[id].attributes = {...renderables[id].attributes, ...attributes}
                    return this
                }
            }
        }

        var stack = [0]
        autoIdInfix = stack.join('|')

        function pure(fn){
            return function(){
                stack[stack.length - 1]++
                stack.push(0)
                var oldAutoId = autoId
                autoId = 0
                autoIdInfix = stack.join('|')
                var value = fn.apply(this, arguments)
                stack.pop()
                autoId = oldAutoId
                autoIdInfix = stack.join('|')
                return value;
            }
        }

        function addRenderable(r){
            r.stack = stack.join('|')
            renderables[r.id] = r
        }

        function text(text, x, y, opts={}){
            let {bounds, sticky, cares} = opts, id = getId(opts)
            addRenderable({
                type: 'text', id,
                ...defaultBounds,
                ...bounds,
                x, y, text, sticky, cares
            })
            return handle(id)
        }

        function circle(x, y, opts={}){
            let {bounds, sticky, cares} = opts, id = getId(opts)

            addRenderable({
                type: 'circle', id,
                ...defaultBounds,
                ...bounds,
                x, y, sticky, cares
            })
            return handle(id)
        }

        function line(d1, d2, opts={}){
            // console.log(d1, d2)
            let id = getId(opts)

            d1 = typeof d1.data == 'undefined' ? d1 : d1.data.id
            d2 = typeof d2.data == 'undefined' ? d2 : d2.data.id

            addRenderable({
                type: 'line', id,
                d1, d2,
            })

            return handle(id)
        }

        function image(href, x, y, width, height, opts={}){
            let {bounds, sticky, cares} = opts, id = getId(opts)
            
            addRenderable({
                type: 'image', id,
                ...defaultBounds,
                ...bounds,
                x, y, width, height, href, sticky, cares
            })

            return handle(id)
        }

        function polyline(ids, opts={}){
            var ret = [], id = getId(opts)
            for (var i = 1; i < ids.length; i++) {
                // console.log(i, ids[i], ids)
                ret.push(line(ids[i-1], ids[i], id+'_'+i))
            }
            return ret
        }

        var it = populateRenderables(data, {
            text,
            circle,
            line,
            image,
            polyline, 
            pure
        })

        if(populateRenderables.constructor.name === 'GeneratorFunction'){
            for(var val of it);    
        }

        return renderables
    }
}



export function Data2Points(populatePoints){

    return function data2points(data, target=null){

        var points = {}

        autoId = 0

        var stack = [0]
        autoIdInfix = stack.join('|')
        
        function pure(fn){
            return function(){
                stack[stack.length - 1]++
                if(target === null || (target + '|').startsWith(stack.join('|'))){
                    stack.push(0)

                    var oldAutoId = autoId
                    autoId = 0
                    autoIdInfix = stack.join('|')
                    
                    var value = fn.apply(this, arguments)
                    
                    autoIdInfix = stack.join('|')                
                    stack.pop()
                    autoId = oldAutoId
                }

                return value;
            }
        }

        function point(x,y,opts={}){
            let id = getId(opts)
            points[id] = {
                ...defaultBounds,
                ...opts.bounds,
                x, y, id,
                stack: stack.join('|'),
            }
            return {
                data:points[id],
                attr(){
                    return this
                }
            }
        }

        function line(d1,d2,opts){ getId(opts); return empty }

        function text(text, x, y, opts){ return point(x,y,opts) }

        function circle(x, y, opts){ return point(x,y,opts) }

        function image(href, x, y, width, height, opts){ return point(x,y,opts) }

        function polyline(ids, opts){
            var ret = [], id = getId(opts) //have to getId the same way as 2renderables
            for (var i = ids.length; i ; i--) ret.push(empty);
            return ret
        }


        var it = populatePoints(data, {
            text, circle, line, image, polyline, pure
        })

        if(populatePoints.constructor.name === 'GeneratorFunction'){

            for(var val of it){
                if(val.data && val.data.id === desiredid) break
            }

        }

        return points
    }
}