import {addDragHandler, setAttributes} from '../utils'

export default class circle {

    static args = ['cx', 'cy', 'r', 'affects'];

    constructor(container, minimize, get_args){
        this.container = container
        this.minimize = minimize
        this.get_args = get_args
    }

    mount(){
        this.el = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        this.container.appendChild(this.el)

        var get_dist_ratio = (args, x, y) => {
            var dx = args.cx - x
            var dy = args.cy - y

            return Math.sqrt(dx*dx + dy*dy) / args.r
        }

        var drag_start = e => {
            var {clientX, clientY} = e
            
            var ex = clientX - this.container.g9Offset.left
            var ey = clientY - this.container.g9Offset.top
    
            var r = get_dist_ratio(this.get_args(), ex, ey)

            return (dx, dy) => {
                this.minimize(this.get_args().affects, args => {

                    var dr = r - get_dist_ratio(args, ex + dx, ey + dy)
                    return dr*dr

                })
            }
        }

        addDragHandler(this.el, drag_start)
    }

   unmount() {
        this.container.removeChild(this.el)
    }

    update() {
        setAttributes(this.el, this.get_args())
    }
}