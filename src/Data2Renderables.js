import shapes from  './shapes/'
import {forIn} from './utils'

export default function Data2Renderables(populateRenderables){
    return function data2renderables(data, target=null, {width, height}){

        var renderables = {}

        var autoId = 0
        var stack = [0]
        var autoIdInfix = stack.join('|')

        function getId(){
            return 'auto' + autoIdInfix + autoId++
        }

        function pure(fn){
            return function pureFn(){
                stack[stack.length - 1]++
                if(target === null || (target + '|').startsWith(stack.join('|'))){
                    stack.push(0)

                    var oldAutoId = autoId
                    autoId = 0
                    autoIdInfix = stack.join('|')
                    
                    var value = fn.apply(this, arguments)                    
                    
                    stack.pop()
                    autoId = oldAutoId
                    autoIdInfix = stack.join('|')
                }

                return value;
            }
        }

        // var {width, height} = renderer
        var ctx = {pure, width, height}

        forIn(shapes, (shape, type) => {
            ctx[type] = function(){
                // console.log(type, opts)
                var args = [].slice.call(arguments)
                var ret = {}

                var lastArg = args[args.length - 1]
                if(typeof lastArg === 'object'){
                    ret = {...lastArg}
                    var stop = args.length - 1
                } else {
                    var stop = args.length
                }

                for (var i = 0; i < stop; i++)
                    ret[shape.argNames[i]] = args[i];

                ret.type = type
                ret.id = getId()
                ret.stack = stack.join('|')
                renderables[ret.id] = ret

            }
        })

        populateRenderables(data, ctx)

        return renderables
    }
}