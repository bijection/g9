import hu from '../lib/hu'
import {makeDraggable, clamp} from '../utils'

export function Env(){
    return hu('<svg>')
}


export function ElementCreators(snapshot, desire){
    class draggable {

        constructor(id, env){
            this.createEl(env)
            this.el.id = id
            makeDraggable(
                this.el,
            () => {
                snapshot()
                return this.startPos()
            },
            (x, y) => desire(id, x, y)
            )
        }
    }
    
    class circle extends draggable {

        createEl(env){
            this.el = hu('<circle>', env).attr({r:5, fill:'#000'})
        }

        startPos(){
            return [Number(this.el.attr('cx')), Number(this.el.attr('cy'))]
        }

        render(c){
            this.el.attr({
                cx:clamp(c.x, c.xmin, c.xmax),
                cy:clamp(c.y, c.ymin, c.ymax)
            })
        }
    }
    
    class line {

        constructor(id, env){
            this.el = hu('<line>', env).attr({stroke: '#000'})
            this.el.id = id
        }

        render(c, renderables) {

            var d1 = renderables[c.d1]
            var d2 = renderables[c.d2]

            this.el.attr({
                x1:clamp(d1.x, d1.xmin, d1.xmax),
                y1:clamp(d1.y, d1.ymin, d1.ymax),
                x2:clamp(d2.x, d2.xmin, d2.xmax),
                y2:clamp(d2.y, d2.ymin, d2.ymax),
            })
        }
    }

    class text extends draggable {

        createEl(env){
            this.el = hu('<text>', env)
        }

        startPos(){
            return [Number(this.el.attr('x')),Number(this.el.attr('y'))]
        }

        render(c) {
            this.el.attr({
                x:clamp(c.x, c.xmin, c.xmax),
                y:clamp(c.y, c.ymin, c.ymax),
            }).text(c.text)
        }
    }
    
    class image extends draggable {
        createEl(env){
            this.el = hu('<image>', env)
        }

        startPos(){
            return [Number(this.el.attr('x')),Number(this.el.attr('y'))]
        }

        render(c) {
            this.el.n.setAttributeNS("http://www.w3.org/1999/xlink",'href', c.href)

            this.el.attr({
                x:clamp(c.x, c.xmin, c.xmax),
                y:clamp(c.y, c.ymin, c.ymax),
                width:c.width,
                height:c.height,
            })
        }
    }
    return {circle, line, text, image}
}