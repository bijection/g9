import 'lodash'
import numeric from 'numeric'
// import {clamp} from './utils'
import {Data2Renderables} from './populators'
// import Render from ./rend
import Renderer from './renderers/hu'
import shapes from  './shapes'


global.g9 = function g9(initialData, populateRenderables, onChange) {

    var curData = initialData
    var renderables

    var renderer = new Renderer(desire)
    var data2renderables = Data2Renderables(populateRenderables)

    function desire(type, id, ...desires){

        var renderable = renderables[id]

        var keys = _.keys(curData)
        if(renderable.cares) keys = renderable.cares;

        var vals = keys.map(k => curData[k])

        var optvals = numeric.uncmin( v => {
            var tmpdata = _.clone(curData)
            keys.forEach( (k, i) => {
                tmpdata[k] = v[i]
            })

            var points = data2renderables(tmpdata, renderable.stack)
            var c1 = points[id]

            return shapes[type].cost(c1, ...desires)

        }, vals).solution

        keys.forEach(function(k, i){
            curData[k] = optvals[i]
        })

        render()
    }



    function render(){
        renderables = data2renderables(curData)
        renderer.render(renderables)
        onChange(curData, renderables)
    }

    function getRenderer(){
        return renderer
    }

    function setData(newData){
        curData = newData
        render()
    }

    render()

    return { getRenderer, setData, desire }
}