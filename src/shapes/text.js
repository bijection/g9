import {addDragHandler, setAttributes} from '../utils'

export default class text {
    static argNames = ['text', 'x', 'y', 'affects'];

    constructor(container, minimize, get_args){
        this.container = container
        this.minimize = minimize
        this.get_args = get_args
    }

    mount(){
        this.el = document.createElementNS("http://www.w3.org/2000/svg", "text")
        this.container.appendChild(this.el)

        var dragstart = e => {
            var {x, y} = this.get_args()

            return (dx, dy) => {
                this.minimize(this.get_args().affects, r => {
                    var drx = r.x - (x + dx)
                    var dry = r.y - (y + dy)
                    return drx*drx + dry*dry
                })
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