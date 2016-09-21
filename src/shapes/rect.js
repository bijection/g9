import {addDragHandler, setAttributes} from '../utils'

export default class rect {
    static argNames = ['x', 'y', 'width', 'height', 'affects'];

    constructor(container, minimize, get_args){
        this.container = container
        this.minimize = minimize
        this.get_args = get_args
    }

    mount(){
        this.el = document.createElementNS("http://www.w3.org/2000/svg", "rect")
        this.container.appendChild(this.el)

        var drag_start = e => {
            var {x, y, width, height} = this.get_args()
            
            var cx = e.clientX  - this.container.g9Offset.left
            var cy = e.clientY - this.container.g9Offset.top

            var rx = (cx - x) / width
            var ry = (cy - y) / height

            return (dcx, dcy) => {
                this.minimize(this.get_args().affects, args => {

                    var dx = args.x + args.width*rx - (cx+dcx)
                    var dy = args.y + args.height*ry - (cy+dcy)
                    return dx*dx + dy*dy

                })
            }
        }

        addDragHandler(this.el, drag_start)
    }

    unmount() {
        this.container.removeChild(this.el)
    }

    update() {
        var args = this.get_args()
        let {x,y,width,height} = args
        if(width < 0){
            args.x += width
            args.width = -width
        }
        if(height < 0){
            args.y+=height
            args.height = -height
        }
        setAttributes(this.el, args)
    }
}