import shapes from  './shapes/'
import {forIn, clamp} from  './utils'

export default class Renderer {
    
    elements = {};
    el = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    align = {
        x:'left',
        y:'top'
    }

    constructor(desire){
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
        var {width, height} = this.el.getBoundingClientRect()

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

        this.el.setAttribute('viewBox',  
            [xcoord, ycoord, width, height].join(' '))
    }

    render(renderables){
        var {elements, desire, el} = this
        forIn(renderables, (renderable, id) => {

            if(!elements[id]){
                elements[id] = new shapes[renderable.type].renderer(id, el, desire)
            }

            elements[id].render(renderable)
        })

        forIn(elements, (element, id) => {
            if(!(id in renderables)){
                element.remove()
                delete elements[id]
            }
        })

        this.resize()
    }

    insertInto(selector){
        if(typeof selector === "string"){
            document.querySelector(selector).appendChild(this.el)
        } else {
            selector.appendChild(this.el)
        }
        this.resize()
        return this
    }
}