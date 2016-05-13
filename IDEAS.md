how about 


g9shapes = {
	circle: {
		renderer: {
			hu: class circle extends draggable {

			    createEl(container){
			        this.el = hu('<circle>', container).attr({r:5, fill:'#000'})
			    }

			    startPos(){
			        return [Number(this.el.attr('cx')), Number(this.el.attr('cy'))]
			    }

			    renderEl(c){
			        this.el.attr({
			            cx:clamp(c.x, c.xmin, c.xmax),
			            cy:clamp(c.y, c.ymin, c.ymax)
			        })
			    }
			}
		},
		populator:  function circle(x, y, opts={}){
            let {bounds, cares} = opts, id = getId(opts)

            return {
                type: 'circle', id,
                ...defaultBounds,
                ...bounds,
                x, y, cares
            }
		}
		cost: function(renderable, x, y){
	        x = clamp(x, renderable.xmin, renderable.xmax)
	        y = clamp(y, renderable.ymin, renderable.ymax)

            var dx = renderable.x - x
            var dy = renderable.y - y
            return dx*dx + dy*dy
		}
	}
}

function desire(type, id, ...desires){

    var renderable = renderables[id]

    var keys = _.keys(curData)
    if(renderable.cares) keys = renderable.cares;

    var vals = keys.map(k => curData[k])

    var optvals = numeric.uncmin( v => {
        var tmpdata = _.clone(curData)
        keys.forEach( (k, i) => {
            tmpdata[k] = v[i]
        })

        var points = data2renderables(tmpdata, renderable.stack)
        var c1 = points[id]

        return g9shapes[type].cost(c1, ...desires)

    }, vals).solution

    keys.forEach(function(k, i){
        curData[k] = optvals[i]
    })

    render()
}
