import _ from 'lodash'
import numeric from 'numeric'
import {clamp} from './utils'
import {Data2Renderables, Data2Points} from './populators'
// import Render from ./rend
import hu from './lib/hu'
import {Env, ElementCreators} from './renderers/huRenderer'

global.g9 = function g9(initialData, populateRenderables, onChange) {

    var data = initialData
    var env = Env()
    var elements = {}
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

        var keys = _.keys(data)
        if(renderable.cares) keys = renderable.cares;

        var vals = keys.map(k => data[k])

        // console.log('optimizing', renderable, renderables, keys, vals)

        var sticky = _.keys(renderables).filter(k => renderables[k].sticky)

        var optvals = numeric.uncmin( v => {
            var tmpdata = _.clone(data)
            keys.forEach( (k, i) => {
                tmpdata[k] = v[i]
            })

            var points = data2points(tmpdata)
            var c1 = points[id]

            var dx = c1.x - x
            var dy = c1.y - y
            var d = dx*dx+dy*dy

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
            data[k] = optvals[i]
        })

        renderables = data2renderables(data)
        render()
        onChange(data, renderables)
    }

    var elementCreators = ElementCreators(makeSnapshot, desire)

    function render(){
        _.forIn(renderables, function(renderable, id){

            if(!elements[id]){
                elements[id] = new elementCreators[renderable.type](id, env)
            }

            elements[id].render(renderable, renderables)
            elements[id].el.attr(renderable.attributes)

        })
    }

    function insertInto(selector){
        hu(env, selector)
    }

    function setData(newData){
        data = newData
        renderables = data2renderables(data)
        render()
    }

    renderables = data2renderables(data)
    render()

    return { render, insertInto, setData }
}