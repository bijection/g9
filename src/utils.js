// export function clamp(v, min, max){
//     return Math.min(Math.max(v, min), max)
// }

export function makeDraggable(el, startDrag, drag){
    var startex, startey,
        startx, starty

    var onmove = function(e){
        drag(
            startx + e.clientX - startex,
            starty + e.clientY - startey
        )
    }

    var onend = function(e){
        document.removeEventListener('mousemove', onmove)
        document.removeEventListener('mouseup', onend)
    }

    el.addEventListener('mousedown',function(e){

        e.preventDefault()

        startex = e.clientX
        startey = e.clientY;

        [startx, starty] = startDrag(e)
        startx = startx || 0
        starty = starty || 0

        document.addEventListener('mousemove', onmove)
        document.addEventListener('mouseup', onend)
    })
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