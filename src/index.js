import Data2Renderables from './Data2Renderables'
// import Renderer from './Renderer'
import minimize from './minimize'
import shapes from  './shapes/'
import {forIn} from  './utils'


module.exports = function g9(initialData, populateRenderables, onChange=()=>{}) {

    var curData = initialData
    var renderables

    var data2renderables = Data2Renderables(populateRenderables)

    var elements = {}
    var container = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    var xAlign = 'left', yAlign = 'top'
    
    var width = 0, height = 0, top = 0, left = 0
    var xOffset = 0, yOffset = 0

    function align(xval='left', yval='top'){
        xAlign = xval
        yAlign = yval
        resize()
        return this
    }

    function resize(){
        ({width, height, top, left} = container.getBoundingClientRect())

        if(xAlign === 'left'){
            xOffset = 0
        } else if (xAlign === 'center') {
            xOffset = width/2
        } else {
            xOffset = width
        }

        if(yAlign === 'top'){
            yOffset = 0
        } else if (yAlign === 'center') {
            yOffset = height/2
        } else {
            yOffset = height
        }

        container.setAttribute('viewBox', [-xOffset, -yOffset, width, height].join(' '))

        render()
    }


    function insertInto(selector){
        if(typeof selector === "string"){
            document.querySelector(selector).appendChild(container)
        } else {
            selector.appendChild(container)
        }
        resize()
        return this
    }


    function desire(id, ...desires){

        var renderable = renderables[id]
        var type = renderable.type

        var keys = Object.keys(curData)
        if(renderable.cares) keys = renderable.cares;

        var vals = keys.map(k => curData[k])

        var optvals = minimize( v => {
            var tmpdata = {...curData}
            keys.forEach( (k, i) => {
                tmpdata[k] = v[i]
            })

            var points = data2renderables(tmpdata, renderable.stack, {width, height})
            var c1 = points[id]

            var cost = shapes[type].cost(c1, ...desires)
            // console.log('cost', cost)
            return cost

        }, vals).solution

        keys.forEach(function(k, i){
            curData[k] = optvals[i]
        })

        render()
    }

    function render(){
        renderables = data2renderables(curData, null, {width, height})
        
        forIn(renderables, (renderable, id) => {

            if(!elements[id]){
                elements[id] = new shapes[renderable.type].renderer(id, container, desire)
            }

            elements[id].setOffset(top + yOffset, left + xOffset)
            elements[id].render(renderable)
        })

        forIn(elements, (element, id) => {
            if(!(id in renderables)){
                element.remove()
                delete elements[id]
            }
        })

        onChange(curData, renderables)
    }

    function setData(newData){
        curData = newData
        render()
    }

    window.addEventListener('load', resize)
    window.addEventListener('resize', resize)

    return {setData, desire, align, insertInto, resize}
}