export function clamp(v, min, max){
    return Math.min(Math.max(v, min), max)
}

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

    el.on('mousedown',function(e){

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

//like the only part of lodash I need
export function forIn(obj, it){
    return Object.keys(obj).forEach(k => it(obj[k], k))
}