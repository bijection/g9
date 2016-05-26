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
    var el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var align = {
        x:'left',
        y:'top'
    }
    var width = 0
    var height = 0

    function xAlign(val='left'){
        align.x = val
        resize()
        return this
    }

    function yAlign(val='top'){
        align.y = val
        resize()
        return this
    }

    function resize(){
        var {x,y} = align
        var {width: w, height: h} = el.getBoundingClientRect()

        if(x === 'left'){
            var xcoord = 0
        } else if (x === 'center') {
            var xcoord = -w/2
        } else {
            var xcoord = -w
        }

        if(y === 'top'){
            var ycoord = 0
        } else if (y === 'center') {
            var ycoord = -h/2
        } else {
            var ycoord = -h
        }

        width = w
        height = h

        el.setAttribute('viewBox',  
            [xcoord, ycoord, w, h].join(' '))

        render()
    }


    function insertInto(selector){
        if(typeof selector === "string"){
            document.querySelector(selector).appendChild(el)
        } else {
            selector.appendChild(el)
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

        onChange(curData, renderables)
    }

    function setData(newData){
        curData = newData
        render()
    }

    window.addEventListener('load', resize)
    window.addEventListener('resize', resize)

    return {setData, desire, xAlign, yAlign, insertInto}
}