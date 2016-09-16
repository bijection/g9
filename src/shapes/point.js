import {addDragHandler, setAttributes} from '../utils'

export default class point {
    static args = ['cx', 'cy', 'affects'];

    constructor(container, minimize, get_args){
        this.container = container
        this.minimize = minimize
        this.get_args = get_args
    }

    mount(){
        this.el = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        this.container.appendChild(this.el)
        setAttributes(this.el, {r:5})

        var dragstart = e => {
            var {cx, cy} = this.get_args()

            return (dx, dy) => {
                this.minimize(this.get_args().affects, r => {
                    var drx = r.cx - (cx + dx)
                    var dry = r.cy - (cy + dy)
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
        setAttributes(this.el, this.get_args())
    }
}