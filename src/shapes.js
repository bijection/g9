import hu from './lib/hu'
import {makeDraggable, clamp} from './utils'

const defaultBounds = {
    xmin: -Infinity,
    xmax: Infinity,
    ymin: -Infinity,
    ymax: Infinity,
}


class element {
    render(renderable, renderables){
        this.el.attr(renderable.attributes)
        this.update(renderable, renderables)
    }
}

class draggable extends element{

    constructor(id, env, desire){
        super()
        this.create(env)
        this.el.id = id
        makeDraggable(
            this.el,
            this.getPos.bind(this),
            (x, y) => desire(this.type,id, x, y)
        )
    }
}



var g9shapes = {
	circle: {
		renderer: {
			hu: class circle extends draggable {

				type='circle';

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
			}
		},
		populator:  function circle(getId, x, y, opts={}){
            let {bounds, cares} = opts, id = getId(opts)

            return {
                type: 'circle', id,
                ...defaultBounds,
                ...bounds,
                x, y, cares
            }
		},
		cost: function(renderable, x, y){
	        x = clamp(x, renderable.xmin, renderable.xmax)
	        y = clamp(y, renderable.ymin, renderable.ymax)

            var dx = renderable.x - x
            var dy = renderable.y - y
            return dx*dx + dy*dy
		}
	}
}

export default g9shapes