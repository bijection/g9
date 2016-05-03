export default class Renderer {    

    constructor(snapshot, desire){}

    render(renderables){}

    insertInto(selector){
        console.warn('[g9] The abstract renderer does not create a DOM element. InsertInto() is a no-op.')
    }
}