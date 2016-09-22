# [g9.js](http://omrelli.ug/g9)

g9 is a javascript library for creating **automatically interactive graphics**.

With g9, interactive visualization is as easy as visualization that isn't. Just write a function which draws shapes based on data, and g9 will automatically figure out how to manipulate that data when you drag the shapes around.


For example, the following code:
```javascript
g9({
	x: 0,
	y: 0
}, function(data, ctx){
	
	ctx.point(data.x, data.y)
	ctx.point(data.y, data.x)
	
})
.insertInto('#container')
```

draws two dots at (x,y) and (y,x), as you might expect, but with no additional effort, it's interactive, so dragging either of the dots changes the value of x and y, and moves the other dot: 

![basic demo](basic.gif)

This **automatic interactivity** makes it trivial to manipulable complex visualizations like this fractal:

![dragon demo](dragon.gif)

You can see (and play with!) more examples [on the website](http://omrelli.ug/g9), or [head to the docs](#docs) for a full treatment of the API.


# Installation
You can use g9 with npm (if your're using webpack or browserify) or with a script tag:




## npm

```
npm install g9
```

```javascript
var g9 = require('g9')
// or 
import g9 from 'g9'
```



## `<script/>`

First download a copy of g9 [here](https://raw.githubusercontent.com/bijection/g9/master/dist/g9.js), then

```html
<script src='path/to/g9.js'></script>
 
<script>
	// g9 is now defined 
</script>
```


# Docs


## g9([initialData](#initialdata), [render](#render)[, [onRender](#onrender)]): [g9Canvas](#g9canvas)
This is the main g9 function, which returns a [g9Canvas](#g9Canvas) which you can mount in your page with the `g9Canvas.insertInto(selectorOrDOMNode)` method. For example: 

```javascript
g9({foo: 10}, function(data, ctx){
	ctx.point(data.foo, 17)
})
.insertInto('#container')
```

The g9Canvas API is covered [here](#g9Canvas).

`g9()` takes the following arguments:


### initialData
`initialData` is a flat object with numeric values, which will be used in the first call to `render`. For example:

```javascript
var initialData = {
    foo: 10
}
```



### render(data, ctx: [g9Context](#g9context))

`render(data, ctx)` is a function that receives a `data` object with the same keys as `initialData`, but possibly different values, and a [g9Context](#g9context) `ctx`. The g9Context API is covered [here](#g9context).

`render` is responsible for calling methods on `ctx` to produce a drawing.
For example:

```javascript
function render(data, ctx){
    ctx.point(data.foo, 17)
}
```
creates a point at x-coordinate `data.foo` and y-coordinate 17.


When someone interacts with the graphics, for example by trying to drag an element to a new position, g9 optimizes over the space of possible values for `data` to find a set of values that comes closest to creating the change. In the preceeding example, if `data.foo` is initially 10 and you tried to drag the point to the left, g9 might come up with

```javascript
{
    foo: 8
}
```
After optimization, g9 rerenders the entire scene with the new data, so that everything is consistent.



### onRender(data, renderedObjects)
`onRender(data, renderedObjects)` is an optional argument which, if included, is called after each re-render with the data that determined the render, and the set of rendered objects. Typical uses for `onRender` include debugging compositions and updating other parts of your page.
















## g9Canvas
A `g9Canvas` is the obect returned by a call to g9(initialData, render, onRender)

### g9Canvas.insertInto(selectorOrDOMNode)
Mounts the graphics as a child of `selectorOrDOMNode`, which can be either a selector or a DOM node, and returns the graphics object to enable chaining.

For example:

```javascript
g9({foo: 10}, function(data, ctx){
	ctx.point(data.foo, 17)
})
.insertInto('#container')
```


### g9Canvas.align(xAlign, yAlign)
Sets the position of the origin in relation to which graphics are drawn. `xAlign` and `yAlign` are both strings that default to 'center'. Returns the graphics object to enable chaining.

* `xAlign` can be either 'left', 'center', or 'right'.
* `yAlign` can be either 'top', 'center', or 'bottom'.

For example:

```javascript
g9({foo: 10}, function(data, ctx){
	ctx.point(data.foo, 17)
})
.align('bottom', 'left')
.insertInto('#container')
```



### g9Canvas.node
A read-only reference to the `svg` DOM node that holds the g9 graphics.



### g9Canvas.setData(data)
Sets the data currently being visualized by a g9 instance to `data`. This is useful for animations. For example: 

```javascript
var graphics = g9({foo: 10}, function(data, ctx){
	ctx.point(data.foo, 17)
})
.insertInto('#container')

var theta = 0

setInterval(function(){
	graphics.setData( {foo: Math.cos( theta += 0.01 )} )
}, 30)
```


### g9Canvas.resize()
Invalidates the g9 display. Usually a noop, but should be called after programmatically resizing the g9 DOM node or its container.




### g9Canvas.desire(id, ...desires)
Internal method, genreally safe to ignore, but useful for complex animation. For now, the best way to use this is to read the source.
















## g9Context
A new, immutable g9Context object `ctx` is passed as the second argument to `render` each time `render` is called. It has a variety of drawing methods and some read-only properties that the render function uses to create a drawing.


### g9Context.[drawingMethod]
When calling a drawing method, you can include any number of ordered arguments, optionally followed by an object that specifies futher arguments by name, and / or includes svg properties. For example, all of the following are equivalent: 

```javascript
ctx.point(30, 50, ['a'])

ctx.point(30, 50, {affects: ['a']})

ctx.point(30, {
	y: 50,
	affects: ['a']
})

ctx.point({
	x: 30,
	y: 50,
	affects: ['a']
})
```

> Note: The optional argument `affects` is a list of keys whose corresponding value g9 is allowed to change when a user drags the shape.

Currently, the built-in drawing methods are

#### g9Context.point(x, y[, affects])
  
A point. Useful svg properties are `r` (radius), and `fill`. For example:

```javascript
ctx.point(30, 50, {r: 40, 	fill: 'red'	})
```

#### g9Context.circle(x, y, radius[, affects])
  
A circle. As opposed to the point, circles can rotate around your mouse as you drag them. Useful svg properties are `stroke` (a color), and `fill`. For example:

```javascript
ctx.circle(30, 50, 40, {r: 40, stroke: 'blue' })
```


#### g9Context.line(x1, y1, x2, y2[, affects])
  
A line. Useful svg properties are `stroke-width`, `stroke` (stroke color), and `stroke-linecap`. For example:

```javascript
ctx.line(30, 50, 60, 100, {
	'stroke-width': 10,
	'stroke': 'red',
	'stroke-linecap': 'round'
})
```
#### g9Context.rect(x, y, width, height[, affects])
  
A rectangle. A useful svg property is `fill`. For example:

```javascript
ctx.rect(0, 0, 100, 100, {'fill': '#ff6600'})
```


#### g9Context.text(text, x, y[, affects])
  
A text label. Useful svg properties are `font-family`, `font-size`, `fill`, and `text-anchor`. For example:

```javascript
ctx.text('Hello World!', 30, 50, {
	'font-family': 'sans-serif',
	'font-size': '20px',
	'text-anchor': 'middle',
	'fill': '#badd09'
})
```

#### g9Context.image(href, x, y, width, height[, affects])
  
An image. A useful svg property is `preserveAspectRatio`. For example:

```javascript
ctx.image('http://placehold.it/350x150', 0, 0, 350, 150, {
	'preserveAspectRatio': 'xMaxYMax'
})
```

### g9Context.width
Read only. The current width of the svg container, as dertermined by page size and / or css.

### g9Context.height
Read only. The current height of the svg container, as dertermined by page size and / or css.

### g9Context.pure(pureFn)
`ctx.pure(pureFn)` is a decorator that speeds up deterministic, stateless (and usually recursive) functions. Internally, `ctx.pure` tells g9 that it doesn't have to execute certain branches when it is optimizing. For recursive funtions, this can make optimization take `O(log(n))` time, instead of `O(n)` time, where `n` is the number of objects drawn by `pureFn`. For example: 

```javascript
g9({
    deltaAngle:33,
    attenuation:0.7,
    startLength:189
}, function(data, ctx){

    var deltaAngle = data.deltaAngle,
        attenuation = data.attenuation,
        startLength = data.startLength
    
    var drawTree = function (x1, y1, length, angle, n){
        var x2 = x1 + length * Math.cos(angle*Math.PI/180);
        var y2 = y1 + length * Math.sin(angle*Math.PI/180);
     
        ctx.point(x2, y2, {affects:['deltaAngle', 'attenuation']})
        
        ctx.line(x1,y1,x2,y2)

        if(n > 0) {
            drawTree(x2, y2, length*attenuation, angle+deltaAngle, n-1);
            drawTree(x2, y2, length*attenuation, angle-deltaAngle, n-1);
        }

    }
    
    drawTree = ctx.pure(drawTree)

    drawTree(0, ctx.height/2 - 30, startLength, -90, 9)

})
```
A live version of this example is on [the examples page](https://omrelli.ug/g9/gallery).




