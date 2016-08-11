import Data2Renderables from './Data2Renderables'
// import Renderer from './Renderer'
import minimize, {gradient} from './minimize'
import shapes from  './shapes/'
import {forIn} from  './utils'


module.exports = function g9(initialData, populateRenderables, onChange=()=>{}) {

    var curData = initialData
    var renderables

    var data2renderables = Data2Renderables(populateRenderables)

    var elements = {}
    var node = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    var xAlign = 'left', yAlign = 'top'
    
    var width = 0, height = 0, top = 0, left = 0
    var xOffset = 0, yOffset = 0

    function align(xval='left', yval='top'){
        xAlign = xval
        yAlign = yval
        resize()
        return this
    }

    function resize(rerender = true){
        ({width, height, top, left} = node.getBoundingClientRect())

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

        node.setAttribute('viewBox', [-xOffset, -yOffset, width, height].join(' '))

        if(rerender) render();
    }


    function insertInto(selector){
        if(typeof selector === "string"){
            document.querySelector(selector).appendChild(node)
        } else {
            selector.appendChild(node)
        }
        resize()
        return this
    }

    var firstvals = {}, lastvals = {};

    function desire(id, ...desires){

        var renderable = renderables[id]
        var type = renderable.type

        var keys = Object.keys(curData)
        if(renderable.cares) keys = renderable.cares;

        var vals = keys.map(k => curData[k])

        var f = v => {
            var tmpdata = {...curData}
            keys.forEach( (k, i) => {
                tmpdata[k] = v[i]
            })

            var points = data2renderables(tmpdata, renderable.stack, {width, height})
            var c1 = points[id]

            var cost = shapes[type].cost(c1, ...desires)
            // console.log('cost', cost)
            return cost

        }

        var old_cost = f(vals)

        var low_precision = true
        if(!firstvals[id]) firstvals[id] = vals;
        if(!lastvals[id]) lastvals[id] = vals;
        
        var grad = a => gradient(f,a)

        if( grad(vals).every(e => e===0) ){
            grad(lastvals[id]).forEach((e,i) => {
                if(e !== 0){
                    vals[i] = lastvals[id][i]
                }
            })
            if( grad(vals).every(e => e===0) ){
                grad(firstvals[id]).forEach((e,i) => {
                    if(e !== 0){
                        vals[i] = firstvals[id][i]
                    }
                })
            }
            low_precision = false
        }

        lastvals[id] = vals.slice(0)

        var optvals = minimize(f, vals, low_precision).solution

        var new_cost = f(optvals)

        if( new_cost < old_cost){

            keys.forEach(function(k, i){
                curData[k] = optvals[i]
            })

            render()

        }

    }

    function render(){
        renderables = data2renderables(curData, null, {width, height})
        
        forIn(renderables, (renderable, id) => {

            if(!elements[id]){
                elements[id] = new shapes[renderable.type].renderer(id, node, desire)
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
    window.addEventListener('scroll', e => resize(false))

    return {setData, desire, align, insertInto, resize, node}
}