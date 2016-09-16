// export function clamp(v, min, max){
//     return Math.min(Math.max(v, min), max)
// }





export function addDragHandler(el, startDrag){
    var startex, startey;

    function onstart(e){
        draggingCount++

        var onDrag = startDrag(e)

        e.preventDefault()
        e = e.touches ? e.touches[0] : e

        startex = e.clientX
        startey = e.clientY

        var onmove = function(e){
            e = e.touches ? e.touches[0] : e
            onDrag(
                e.clientX - startex,
                e.clientY - startey
            )
        }

        var onend = function(e){
            draggingCount--
            document.removeEventListener('mousemove', onmove)
            document.removeEventListener('touchmove', onmove)
            document.removeEventListener('touchend', onend)
            document.removeEventListener('touchcancel', onend)
            document.removeEventListener('mouseup', onend)
        }

        document.addEventListener('touchmove', onmove)
        document.addEventListener('mousemove', onmove)
        document.addEventListener('touchend', onend)
        document.addEventListener('touchcancel', onend)
        document.addEventListener('mouseup', onend)
    }

    el.addEventListener('touchstart', onstart)
    el.addEventListener('mousedown', onstart)
}









export var draggingCount = 0

export function makeDraggable(el, startDrag, drag){
    var startex, startey,
        startx, starty

    var onmove = function(e){
        e = e.touches ? e.touches[0] : e
        drag(
            startx + e.clientX - startex,
            starty + e.clientY - startey
        )
    }

    var onend = function(e){
        draggingCount--
        document.removeEventListener('mousemove', onmove)
        document.removeEventListener('touchmove', onmove)
        document.removeEventListener('touchend', onend)
        document.removeEventListener('touchcancel', onend)
        document.removeEventListener('mouseup', onend)
    }

    function onstart(e){
        draggingCount++

        e.preventDefault()

        e = e.touches ? e.touches[0] : e

        startex = e.clientX
        startey = e.clientY;

        [startx, starty] = startDrag(e)
        startx = startx || 0
        starty = starty || 0

        document.addEventListener('touchmove', onmove)
        document.addEventListener('mousemove', onmove)
        document.addEventListener('touchend', onend)
        document.addEventListener('touchcancel', onend)
        document.addEventListener('mouseup', onend)
    }

    el.addEventListener('touchstart', onstart)
    el.addEventListener('mousedown', onstart)
}

//acutally the only part of lodash I needed
export function forIn(obj, it){
    obj && Object.keys(obj).forEach(k => it(obj[k], k))
}

export function setAttributes(el, attrs, ns=null){
    forIn(attrs, (val, name) => {
        el.setAttributeNS(ns, name, val);
    })
}

export function shallowClone(o){
    var ret = {}
    Object.keys(o).forEach(k => ret[k] = o[k])
    return ret
}

export function findPhaseChange(f, known_true, known_false){
    while(Math.abs(known_true - known_false) > 1e-3){
        var mid = (known_true + known_false) / 2
        f(mid) ? known_true = mid : known_false = mid
    }
    return (known_true + known_false) / 2
}

// export function getAttribute(el, name){
//     return this.n.getAttributeNS(null, name);
//     this.n.setAttributeNS(null, name, value);
//     return this;
// }