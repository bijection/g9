const defaultBounds = {
    xmin: -Infinity,
    xmax: Infinity,
    ymin: -Infinity,
    ymax: Infinity,
}

const empty = {attr(){return empty}}

function sticky(renderable){
    renderable.sticky = true
}


export function Data2Renderables(populateRenderables){
    return function data2renderables(data){

        var renderables = {}//, stickyRenderables = {}

        var autoId = 0
        function getId(opts){
            if(typeof opts === 'string' || typeof opts === 'number'){
                return opts
            } else if ('id' in opts){
                return opts.id
            }
            return autoId++
        }

        function handle(id){
            var h = {
                data:renderables[id],
                attr(attributes){
                    renderables[id].attributes = {...renderables[id].attributes, ...attributes}
                    return h
                }
            }
            return h
        }

        function addRenderable(r){
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

        populateRenderables(data, {
            text,
            circle,
            line,
            image,
            polyline, 
        })

        return renderables
    }
}




export function Data2Points(populatePoints){


    return function data2points(data){

        var points = {}

        var autoId = 0
        function getId(opts={}){
            if(typeof opts === 'string' || typeof opts === 'number'){
                return opts
            } else if ('id' in opts){
                return opts.id
            }
            return autoId++
        }

        function point(x,y,opts={}){
            let id = getId(opts)
            points[id] = {...defaultBounds, ...opts.bounds, x, y, id}
            return empty
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

        populatePoints(data, {
            text, circle, line, image, polyline,
        })

        return points
    }
}