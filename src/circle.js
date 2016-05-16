import {draggable, element, defaultBounds} from './renderers/hu/elements'
import {addshape} from './shapes'
import {clamp} from './utils'

addshape('circle',{
	renderer: class circle extends draggable {

	    create(container){
	        this.el = hu('<circle>', container).attr({r:5, fill:'#000'})
	    }

	    getPos(){
	        return [Number(this.el.attr('cx')), Number(this.el.attr('cy'))]
	    }

	    update(c){
	        this.el.attr({
	            cx:clamp(c.x, c.xmin, c.xmax),
	            cy:clamp(c.y, c.ymin, c.ymax)
	        })
	    }

	},
	populator(getId, x, y, opts={}){
        let {bounds, cares} = opts, id = getId(opts)

        return {
            type: 'circle', id,
            ...defaultBounds,
            ...bounds,
            x, y, cares
        }
	},
	cost(renderable, renderables, x, y){
        x = clamp(x, renderable.xmin, renderable.xmax)
        y = clamp(y, renderable.ymin, renderable.ymax)

        var dx = renderable.x - x
        var dy = renderable.y - y
        return dx*dx + dy*dy
	}
})
