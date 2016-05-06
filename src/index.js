import 'lodash'
import numeric from 'numeric'
import {clamp} from './utils'
import {Data2Renderables, Data2Points} from './populators'
// import Render from ./rend
import Renderer from './renderers/hu'

global.g9 = function g9(initialData, populateRenderables, onChange) {

    var curData = initialData
    var renderer = new Renderer(makeSnapshot, desire)
    var renderables
    var data2renderables = Data2Renderables(populateRenderables)
    var data2points = Data2Points(populateRenderables)
    var stickyRenderables
    var snapshot

    function makeSnapshot(){
        snapshot = _.cloneDeep(renderables)
    }

    function desire(id, x, y){

        var renderable = renderables[id]

        x = clamp(x, renderable.xmin, renderable.xmax)
        y = clamp(y, renderable.ymin, renderable.ymax)

        var keys = _.keys(curData)
        if(renderable.cares) keys = renderable.cares;

        var vals = keys.map(k => curData[k])

        // console.log('optimizing', renderable, renderables, keys, vals)

        var sticky = _.keys(renderables).filter(k => renderables[k].sticky)

        var optvals = numeric.uncmin( v => {
            var tmpdata = _.clone(curData)
            keys.forEach( (k, i) => {
                tmpdata[k] = v[i]
            })

            var points = data2points(tmpdata)
            var c1 = points[id]

            var dx = c1.x - x
            var dy = c1.y - y
            var d = dx*dx + dy*dy

            if(sticky.length){
                var staystill = sticky.reduce( (sum , rid) => {
                    let point = points[rid]

                    let dsx = point.x - snapshot[rid].x
                    let dsy = point.y - snapshot[rid].y

                    return sum + dsx*dsx+dsy*dsy

                }, 0) / sticky.length

                return d + staystill/100

            } else {
                return d
            }

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

    function insertInto(selector){
        renderer.insertInto(selector)
    }

    function setData(newData){
        curData = newData
        render()
    }

    render()

    return { insertInto, setData, desire }
}