import {draggable, element} from './renderers/hu/elements'
import {addshape} from './shapes'
import {makeDraggable, clamp} from './utils'

addshape('line', {
	renderer: class line extends element {

	    constructor(id, env, desire){
	        super()
	        this.el = hu('<line>', env).attr({stroke: '#000'})
			this.el.id = id

			var r
			makeDraggable(
				this.el,
				e => {
					var {first, second} = this

					var dx = second.x - first.x
					var dy = second.y - first.y						
					var dist = Math.sqrt(dx*dx + dy*dy)

					var {left, top} = this.el.n.getBoundingClientRect()
					var {clientX, clientY} = e

					dx = clientX + Math.min(first.x, second.x) - left - first.x
					dy = clientY + Math.min(first.y, second.y) - top - first.y

					var dist2d1 = Math.sqrt(dx*dx + dy*dy)

					r = dist2d1 / dist
					this.r = r

					var startx = first.x + (second.x - first.x)*r
					var starty = first.y + (second.y - first.y)*r

					return [startx, starty]
				},
				(x,y) => desire(id, r, x, y)
			)
	    }

	    update(c, renderables) {

	        var d1 = renderables[c.d1]
	        var d2 = renderables[c.d2]

	        this.first = d1
	        this.second = d2

	        this.el.attr({
	            x1:clamp(d1.x, d1.xmin, d1.xmax),
	            y1:clamp(d1.y, d1.ymin, d1.ymax),
	            x2:clamp(d2.x, d2.xmin, d2.xmax),
	            y2:clamp(d2.y, d2.ymin, d2.ymax),
	        })
	    }
	},
	populator(getId, d1, d2, opts={}){
        let id = getId(opts)

        d1 = typeof d1.data == 'undefined' ? d1 : d1.data.id
        d2 = typeof d2.data == 'undefined' ? d2 : d2.data.id

        return {
            type: 'line', id,
            d1, d2,
            cares: opts.cares
        }
    },
	cost(renderable, renderables, r, x, y){
		var d1 = renderables[renderable.d1]
		var d2 = renderables[renderable.d2]

		var dx = d1.x + (d2.x - d1.x)*r - x
		var dy = d1.y + (d2.y - d1.y)*r - y

        return dx*dx + dy*dy
	}
})