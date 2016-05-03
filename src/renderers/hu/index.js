import hu from '../../lib/hu'
import * as elementCreators from './elements'

export default class Renderer {
    
    elements = {};
    el = hu('<svg>');

    constructor(snapshot, desire){
        this.snapshot = snapshot
        this.desire = desire
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
    }

    insertInto(selector){
        hu(this.el, selector)
    }
}