// import hu from '../../lib/hu'
import {makeDraggable, clamp} from '../../utils'

export const defaultBounds = {
    xmin: -Infinity,
    xmax: Infinity,
    ymin: -Infinity,
    ymax: Infinity,
}


export class element {
    render(renderable, renderables){
        this.el.attr(renderable.attributes)
        this.update(renderable, renderables)
    }
}

export class draggable extends element{

    constructor(id, env, desire){
        super()
        this.create(env)
        this.el.id = id

        makeDraggable(
            this.el,
            this.getPos.bind(this),
            (x, y) => desire(id, x, y)
        )
    }
}


// export class circle extends draggable {

//     create(env){
//         this.el = hu('<circle>', env).attr({r:5, fill:'#000'})
//     }

//     getPos(){
//         return [Number(this.el.attr('cx')), Number(this.el.attr('cy'))]
//     }

//     update(c){
//         this.el.attr({
//             cx:clamp(c.x, c.xmin, c.xmax),
//             cy:clamp(c.y, c.ymin, c.ymax)
//         })
//     }
// }

// export class line extends element {

//     constructor(id, env){
//         super()
//         this.el = hu('<line>', env).attr({stroke: '#000'})
//         this.el.id = id
//     }

//     update(c, renderables) {

//         var d1 = renderables[c.d1]
//         var d2 = renderables[c.d2]

//         this.el.attr({
//             x1:clamp(d1.x, d1.xmin, d1.xmax),
//             y1:clamp(d1.y, d1.ymin, d1.ymax),
//             x2:clamp(d2.x, d2.xmin, d2.xmax),
//             y2:clamp(d2.y, d2.ymin, d2.ymax),
//         })
//     }
// }

// export class text extends draggable {

//     create(env){
//         this.el = hu('<text>', env)
//     }

//     getPos(){
//         return [Number(this.el.attr('x')),Number(this.el.attr('y'))]
//     }

//     update(c) {
//         this.el.attr({
//             x:clamp(c.x, c.xmin, c.xmax),
//             y:clamp(c.y, c.ymin, c.ymax),
//         }).text(c.text)
//     }
// }

// export class image extends draggable {
//     create(env){
//         this.el = hu('<image>', env)
//     }

//     getPos(){
//         return [Number(this.el.attr('x')),Number(this.el.attr('y'))]
//     }

//     update(c) {
//         this.el.n.setAttributeNS("http://www.w3.org/1999/xlink",'href', c.href)

//         this.el.attr({
//             x:clamp(c.x, c.xmin, c.xmax),
//             y:clamp(c.y, c.ymin, c.ymax),
//             width:c.width,
//             height:c.height,
//         })
//     }
// }