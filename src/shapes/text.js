import {addDragHandler, setAttributes} from '../utils'

export default class text {
    static argNames = ['text', 'x', 'y', 'affects'];

    constructor(get_args, minimize_args){
        this.minimize_args = minimize_args
        this.get_args = get_args
    }

    mount(container){
        this.container = container
        this.el = document.createElementNS("http://www.w3.org/2000/svg", "text")
        this.container.appendChild(this.el)

        var dragstart = e => {
            var {x, y} = this.get_args()

            return (dx, dy) => {

                var {affects} = this.get_args()

                this.minimize_args(args => {
                    var drx = args.x - (x + dx)
                    var dry = args.y - (y + dy)
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
        var args = this.get_args()
        setAttributes(this.el, args)
        this.el.innerHTML = args.text
    }
}