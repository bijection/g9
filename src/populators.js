import shapes from  './shapes'

const defaultBounds = {
    xmin: -Infinity,
    xmax: Infinity,
    ymin: -Infinity,
    ymax: Infinity,
}


export function Data2Renderables(populateRenderables){
    return function data2renderables(data, target=null){

        var renderables = {}

        var autoId = 0
        var stack = [0]
        var autoIdInfix = stack.join('|')

        function getId(opts={}, stack){
            if(typeof opts === 'string' || typeof opts === 'number'){
                return opts
            } else if ('id' in opts){
                return opts.id
            }
            return 'auto' + autoIdInfix + autoId++
        }

        // function handle(id){
        //     return {
        //         data:renderables[id],
        //         attr(attributes){
        //             renderables[id].attributes = {...renderables[id].attributes, ...attributes}
        //             return this
        //         }
        //     }
        // }


        function pure(fn){
            return function(){
                stack[stack.length - 1]++
                if(target === null || (target + '|').startsWith(stack.join('|'))){
                    stack.push(0)

                    var oldAutoId = autoId
                    autoId = 0
                    autoIdInfix = stack.join('|')
                    
                    var value = fn.apply(this, arguments)                    
                    
                    stack.pop()
                    autoId = oldAutoId
                    autoIdInfix = stack.join('|')
                }

                return value;
            }
        }


        function addRenderable(r){
            r.stack = stack.join('|')
            renderables[r.id] = r
            return {
                data:r,
                attr(attributes){
                    renderables[r.id].attributes = {...renderables[r.id].attributes, ...attributes}
                    return this
                }
            }
        }

        var ctx = {pure}

        _.forIn(shapes, (shape, type) => {
            ctx[type] = (...args) => {
                return addRenderable(shape.populator(getId, ...args))
            }
        })

        populateRenderables(data, ctx)

        // function text(text, x, y, opts={}){
        //     let {bounds, sticky, cares} = opts, id = getId(opts)
        //     addRenderable({
        //         type: 'text', id,
        //         ...defaultBounds,
        //         ...bounds,
        //         x, y, text, sticky, cares
        //     })
        //     return handle(id)
        // }

        // function circle(x, y, opts={}){
        //     let {bounds, sticky, cares} = opts, id = getId(opts)

        //     addRenderable({
        //         type: 'circle', id,
        //         ...defaultBounds,
        //         ...bounds,
        //         x, y, sticky, cares
        //     })
        //     return handle(id)
        // }

        // function line(d1, d2, opts={}){
        //     // console.log(d1, d2)
        //     let id = getId(opts)

        //     d1 = typeof d1.data == 'undefined' ? d1 : d1.data.id
        //     d2 = typeof d2.data == 'undefined' ? d2 : d2.data.id

        //     addRenderable({
        //         type: 'line', id,
        //         d1, d2,
        //     })

        //     return handle(id)
        // }

        // function image(href, x, y, width, height, opts={}){
        //     let {bounds, sticky, cares} = opts, id = getId(opts)
            
        //     addRenderable({
        //         type: 'image', id,
        //         ...defaultBounds,
        //         ...bounds,
        //         x, y, width, height, href, sticky, cares
        //     })

        //     return handle(id)
        // }

        // function polyline(ids, opts={}){
        //     var ret = [], id = getId(opts)
        //     for (var i = 1; i < ids.length; i++) {
        //         // console.log(i, ids[i], ids)
        //         ret.push(line(ids[i-1], ids[i], id+'_'+i))
        //     }
        //     return ret
        // }

        // var it = populateRenderables(data, {
        //     text,
        //     circle,
        //     line,
        //     image,
        //     polyline, 
        //     pure
        // })

        // if(populateRenderables.constructor.name === 'GeneratorFunction'){
        //     for(var val of it);    
        // }

        return renderables
    }
}