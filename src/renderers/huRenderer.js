import hu from '../lib/hu'
import {makeDraggable, clamp} from '../utils'

export function Env(){
	return hu('<svg>')
}

export function ElementCreators(snapshot, desire){
	return {
	    circle(id, env){

	        var circle = hu('<circle>', env).attr({r:5, fill:'#000'})

	        var startpx, startpy

	        makeDraggable(circle, () => {
	            snapshot()
	            startpx = Number(circle.attr('cx'))
	            startpy = Number(circle.attr('cy'))
	        }, (dx, dy) => {
	            desire(id, startpx+dx, startpy+dy)
	        })

	        circle.id = id

	        return {
	            render(c){

	                circle.attr({
	                    cx:clamp(c.x, c.xmin, c.xmax),
	                    cy:clamp(c.y, c.ymin, c.ymax)
	                });
	            },
	            el: circle,
	        }
	    },
	    line(id, env){

	        var line = hu('<line>', env).attr({stroke: '#000'})

	        line.id = id

	        return {
	            render(c, renderables) {

	                var d1 = renderables[c.d1]
	                var d2 = renderables[c.d2]

	                line.attr({
	                    x1:clamp(d1.x, d1.xmin, d1.xmax),
	                    y1:clamp(d1.y, d1.ymin, d1.ymax),
	                    x2:clamp(d2.x, d2.xmin, d2.xmax),
	                    y2:clamp(d2.y, d2.ymin, d2.ymax),
	                })
	            },
	            el: line
	        }
	    },
	    text(id, env){

	        var text = hu('<text>', env)

	        var startpx, startpy

	        makeDraggable(text, function(){
	            snapshot()
	            startpx = Number(text.attr('x'))
	            startpy = Number(text.attr('y'))
	        }, function(dx, dy){
	            desire(id, startpx+dx, startpy+dy)
	        })

	        text.id = id

	        return {
	            render(c) {

	                text.attr({
	                    x:clamp(c.x, c.xmin, c.xmax),
	                    y:clamp(c.y, c.ymin, c.ymax),
	                }).text(c.text)
	            },
	            el: text
	        }
	    },
	    image(id, env){
	        var image = hu('<image>', env)

	        var startpx, startpy

	        makeDraggable(image, function(){
	            snapshot()
	            startpx = Number(image.attr('x'))
	            startpy = Number(image.attr('y'))
	        }, function(dx, dy){
	            desire(id, startpx+dx, startpy+dy)
	        })

	        image.id = id
	        return {
	            render(c) {

	                image.n.setAttributeNS("http://www.w3.org/1999/xlink",'href', c.href)

	                image.attr({
	                    x:clamp(c.x, c.xmin, c.xmax),
	                    y:clamp(c.y, c.ymin, c.ymax),
	                    width:c.width,
	                    height:c.height,
	                })
	            },
	            el: image
	        }
	    }
	}
}