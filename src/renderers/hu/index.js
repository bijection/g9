import hu from '../../lib/hu'
import * as elementCreators from './elements'

export default class Renderer {
    
    elements = {};
    el = hu('<svg>').attr({"preserveAspectRatio": 'xMidYMid meet'});
    align = {
        x:'left',
        y:'top'
    }

    constructor(snapshot, desire){
        this.snapshot = snapshot
        this.desire = desire
        window.addEventListener('resize', this.resize.bind(this))
    }

    xAlign(align='left'){
        this.align.x = align
        this.resize()
        return this
    }

    yAlign(align='top'){
        this.align.y = align
        this.resize()
        return this
    }

    resize(){
        var {x,y} = this.align
        var {width, height} = this.el.n.getBoundingClientRect()

        if(x === 'left'){
            var xcoord = 0
        } else if (x === 'center') {
            var xcoord = -width/2
        } else {
            var xcoord = -width
        }

        if(y === 'top'){
            var ycoord = 0
        } else if (y === 'center') {
            var ycoord = -height/2
        } else {
            var ycoord = -height
        }

        this.el.n.setAttribute('viewBox',  
            [xcoord, ycoord, width, height].join(' '))
    }

    render(renderables){
        var {elements, snapshot, desire, el} = this
        _.forIn(renderables, (renderable, id) => {

            if(!elements[id]){
                elements[id] = new elementCreators[renderable.type](id, el, snapshot, desire)
            }

            elements[id].render(renderable, renderables)
        })

        _.forIn(elements, (element, id) => {
            if(!(id in renderables)){
                element.el.remove()
                delete elements[id]
            }
        })

        this.resize()
    }

    insertInto(selector){
        hu(this.el, selector)
        this.resize()
        return this
    }
}