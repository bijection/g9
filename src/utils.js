export function clamp(v, min, max){
    return Math.min(Math.max(v, min), max)
}

export function makeDraggable(el, startDrag, drag){
    var startpx, startpy,
        startex, startey

    var onmove = function(e){
        drag(e.clientX - startex, e.clientY - startey)
    }

    var onend = function(e){
        document.removeEventListener('mousemove', onmove)
        document.removeEventListener('mouseup', onend)
    }

    el.on('mousedown',function(e){

        e.preventDefault()

        startex = e.clientX
        startey = e.clientY

        startDrag()

        document.addEventListener('mousemove', onmove)
        document.addEventListener('mouseup', onend)
    })
}