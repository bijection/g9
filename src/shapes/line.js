import {addDragHandler, setAttributes} from '../utils'

export default class line {

    static argNames = ['x1', 'y1', 'x2', 'y2', 'affects'];

    constructor(get_args, minimize_args){
        this.minimize_args = minimize_args
        this.get_args = get_args
    }

    mount(container){
        this.container = container
        this.el = document.createElementNS("http://www.w3.org/2000/svg", "line")
        this.container.appendChild(this.el)
        setAttributes(this.el, {stroke: '#000'})

        var drag_start = e => {
            var {x1,y1,x2,y2} = this.get_args()
            var {clientX, clientY} = e

            var cx = clientX - this.container.g9Offset.left
            var cy = clientY - this.container.g9Offset.top

            var dx1 = x2 - x1, dy1 = y2 - y1
            var dx2 = cx - x1
            var dy2 = cy - y1

            var r = Math.sqrt(dx2*dx2 + dy2*dy2) / Math.sqrt(dx1*dx1 + dy1*dy1)

            return (dx, dy) => {
                var {affects} = this.get_args()

                this.minimize_args(args => {

                    var {x1, y1, x2, y2} = args
                    var dx1 = x1 + (x2 - x1)*r - (cx + dx)
                    var dy1 = y1 + (y2 - y1)*r - (cy + dy)
                    return dx1*dx1 + dy1*dy1

                }, affects)
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