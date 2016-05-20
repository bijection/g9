import Data2Renderables from './populators'
import Renderer from './renderer'
import minimize from './minimize'
import shapes from  './shapes/'


module.exports = function g9(initialData, populateRenderables, onChange=()=>{}) {

    var curData = initialData
    var renderables

    var renderer = new Renderer(desire)
    var data2renderables = Data2Renderables(populateRenderables)

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

            var points = data2renderables(tmpdata, renderable.stack)
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