import hu from './lib/hu'

var shapes = {}

export function addshape(type, {renderer, populator, cost}){
	shapes[type] = {renderer, populator, cost}
}

export default shapes


// var g9shapes = {
// 	circle: {
// 		renderer: class circle extends draggable {

// 		    create(container){
// 		        this.el = hu('<circle>', container).attr({r:5, fill:'#000'})
// 		    }

// 		    getPos(){
// 		        return [Number(this.el.attr('cx')), Number(this.el.attr('cy'))]
// 		    }

// 		    update(c){
// 		        this.el.attr({
// 		            cx:clamp(c.x, c.xmin, c.xmax),
// 		            cy:clamp(c.y, c.ymin, c.ymax)
// 		        })
// 		    }

// 		},
// 		populator(getId, x, y, opts={}){
//             let {bounds, cares} = opts, id = getId(opts)

//             return {
//                 type: 'circle', id,
//                 ...defaultBounds,
//                 ...bounds,
//                 x, y, cares
//             }
// 		},
// 		cost(renderable, renderables, x, y){
// 	        x = clamp(x, renderable.xmin, renderable.xmax)
// 	        y = clamp(y, renderable.ymin, renderable.ymax)

//             var dx = renderable.x - x
//             var dy = renderable.y - y
//             return dx*dx + dy*dy
// 		}
// 	},

// 	line: {
// 		renderer: class line extends element {

// 		    constructor(id, env, desire){
// 		        super()
// 		        this.el = hu('<line>', env).attr({stroke: '#000'})
// 				this.el.id = id

// 				var r
// 				makeDraggable(
// 					this.el,
// 					e => {
// 						var dx = this.second.x - this.first.x
// 						var dy = this.second.y - this.first.y						
// 						var dist = Math.sqrt(dx*dx + dy*dy)

// 						var {left, top} = this.el.n.getBoundingClientRect()

// 						dx = Math.min(this.first.x,this.second.x) - left
// 						dy = Math.min(this.first.y,this.second.y) - top

// 						var {clientX: mousex, clientY: mousey} = e

// 						mousex+=dx
// 						mousey+=dy

// 						dx = mousex - this.first.x
// 						dy = mousey - this.first.y

// 						var dist2d1 = Math.sqrt(dx*dx + dy*dy)

// 						r = dist2d1 / dist

// 						var startx = this.first.x + (this.second.x - this.first.x)*r
// 						var starty = this.first.y + (this.second.y - this.first.y)*r

// 						this.r = r

// 						return [startx, starty]
// 					},
// 					(x,y) => {
// 						desire(id, r, x, y)
// 					}
// 				)
// 		    }

// 		    update(c, renderables) {

// 		        var d1 = renderables[c.d1]
// 		        var d2 = renderables[c.d2]

// 		        this.first = d1
// 		        this.second = d2

// 		        this.el.attr({
// 		            x1:clamp(d1.x, d1.xmin, d1.xmax),
// 		            y1:clamp(d1.y, d1.ymin, d1.ymax),
// 		            x2:clamp(d2.x, d2.xmin, d2.xmax),
// 		            y2:clamp(d2.y, d2.ymin, d2.ymax),
// 		        })
// 		    }
// 		},
// 		populator(getId, d1, d2, opts={}){
//             let id = getId(opts)

//             d1 = typeof d1.data == 'undefined' ? d1 : d1.data.id
//             d2 = typeof d2.data == 'undefined' ? d2 : d2.data.id

//             return {
//                 type: 'line', id,
//                 d1, d2,
//                 cares: opts.cares
//             }
//         },
// 		cost(renderable, renderables, r, x, y){
// 			var d1 = renderables[renderable.d1]
// 			var d2 = renderables[renderable.d2]

// 			console.log(r,x,y)
// 			console.log('d1d2',d1,d2)

// 			var rx = d1.x + (d2.x - d1.x)*r
// 			var ry = d1.y + (d2.y - d1.y)*r

//             var dx = rx - x
//             var dy = ry - y

//             return dx*dx + dy*dy
// 		}
// 	}
// }

// export default g9shapes