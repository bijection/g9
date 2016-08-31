import Data2Renderables from './Data2Renderables'
// import Renderer from './Renderer'
import minimize, {gradient} from './minimize'
import shapes from  './shapes/'
import {forIn, shallowClone, findPhaseChange} from  './utils'


module.exports = function g9(initialData, populateRenderables, onChange=()=>{}) {

    var curData = shallowClone(initialData)

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

    var lastvals = {};

    function desire(id, ...desires){

        var low_precision = true
        var renderable = renderables[id]
        var type = renderable.type

        var keys = Object.keys(curData)
        if(renderable.cares) keys = renderable.cares;

        var vals = keys.map(k => curData[k])

        var cost = v => {
            var tmpdata = {...curData}
            keys.forEach( (k, i) => tmpdata[k] = v[i])

            var points = data2renderables(tmpdata, renderable.stack, {width, height})
            var c1 = points[id]

            return shapes[type].cost(c1, ...desires)
        }

        var old_cost = cost(vals)

        var grad = a => gradient(cost,a)
        var gradZero = v => grad(v).every(e => e===0)

        // If we're stuck in a zero gradient, try
        // substituting the last set of values 
        // with a nonzero gradient, and fall back
        // to the initial values if that doesn't 
        // work.
        if( gradZero(vals) ){
            
            var substitute = alt => grad(alt).forEach((e,i) => {
                if(e !== 0) vals[i] = alt[i];
            })

            if( lastvals[id]   ) substitute(lastvals[id]);
            if( gradZero(vals) ) substitute(keys.map(k => initialData[k]));

            low_precision = false
        }

        // Probably the most important part of the
        // desire function. I'm putting a comment
        // here because otherwise it would be easy
        // to miss this line.
        var optvals = minimize(cost, vals, low_precision).solution

        // If we end up with a zero gradient make
        // sure we don't overshoot. We want to be
        // exactly at the phase change.
        if(gradZero(optvals)){

            keys.forEach((k, i) => {
                optvals[i] = findPhaseChange(v => {
                    var mock = optvals.slice(0)
                    mock[i] = v
                    return grad(mock)[i] === 0
                }, optvals[i], vals[i])
            })

        } else {
            lastvals[id] = vals.slice(0)
        }


        if( cost(optvals) < old_cost){

            keys.forEach((k, i) => curData[k] = optvals[i])
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