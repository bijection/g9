var initial = {
    az: 0,
    ax: 0,
    ay: 0,
    ez: 1,
    ex: 100,
    ey: 100,
}

var {sin, cos} = Math;


function mul(m,v){
    return m.map(row => row.reduce((a,b,i) => a + b*v[i], 0))
}

function rx(v, theta){
    return mul([
        [1,          0,           0],
        [0, cos(theta), -sin(theta)],
        [0, sin(theta),  cos(theta)],
    ], v)
}

function ry(v, theta){
    return mul([
        [cos(theta),          0,           sin(theta)],
        [0, 1, 0],
        [-sin(theta), 0,  cos(theta)],
    ], v)
}

function rz(v, theta){
    return mul([
        [cos(theta), -sin(theta), 0],
        [sin(theta),  cos(theta), 0],
        [0, 0, 1],
    ], v)
}

function rotate(v, ax, ay, az) {
    return rx(ry(rz(v,az),ay),ax)
}

function translate([x,y,z], dx, dy, dz) {
    return [x+dx,y+dy,z+dz]
}

function project([x,y,z]){
    return [300*x/z, 300*y/z]
}

console.log(project)

// mul([[1,0,0],[1,2,0],[0,0,1]], [1,2,3])

// function rotate(x,y,z, ){
//     return [Math.cos(a)*x - Math.sin(a)*y, Math.sin(a)*x + Math.cos(a)*y]
// }

var points= []
for (var x = 0; x < 2; x++) {
    for (var y = 0; y < 2; y++) {
        for (var z = 0; z < 2; z++) {
            points.push([x -.5,y -.5, z - .5])
        }
    }
}

console.log(points)

var edges = []

for (var i = 0; i < points.length; i++) {
    var pi = points[i]
    for (var j = i+1; j < points.length; j++) {
        var pj = points[j]
        if(pi.reduce((a,c,k)=> a + (c!= pj[k]), 0) === 1){
            edges.push([pi, pj])
        }
    }
}


function data2graphics(data, ctx){
    var {ax,ay,az} = data

    var drawedge = ctx.pure(function([p1,p2]){
        ctx.line(
            ...project(
                translate(rotate(p1, ax,ay,0), 0,0,2)),
            ...project(
                translate(rotate(p2, ax,ay,0), 0,0,2)), {
            affects: ['ax', 'ay'],
            "stroke-width": 10,
            "stroke-linecap": "round"
        })
    })

    edges.forEach(drawedge)
}   

function log(x){
    console.log(x)
}

var demo = g9(initial, data2graphics, log)