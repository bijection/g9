import {addDragHandler, setAttributes} from '../utils'

export default class point {
    static argNames = ['cx', 'cy', 'affects'];

    constructor(get_args, minimize_args){
        this.minimize_args = minimize_args
        this.get_args = get_args
    }

    mount(container){
        this.container = container
        this.el = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        this.container.appendChild(this.el)
        setAttributes(this.el, {r:5})

        var dragstart = e => {
            var {cx, cy} = this.get_args()

            return (dx, dy) => {
                var {affects} = this.get_args()

                this.minimize_args(args => {
                    var drx = args.cx - (cx + dx)
                    var dry = args.cy - (cy + dy)
                    return drx*drx + dry*dry
                }, affects)
            }
        }

        addDragHandler(this.el, dragstart)
    }

    unmount() {
        this.container.removeChild(this.el)
    }

    update() {
        setAttributes(this.el, this.get_args())
    }
}