
$M4 = function() {
    return Matrix.I(4);
}

$M4.set = function(m,r,c,val) { m.elements[r][c] = val; return m};

$M4.rotationX = function (rad) {
    var cos= Math.cos(rad);
    var sin= Math.sin(rad);
    return Matrix.create([
        [1 , 0   , 0    , 0] , 
        [0 , cos , -sin , 0] , 
        [0 , sin , cos  , 0] , 
        [0 , 0   ,  0   , 1]
    ]);
}
$M4.rotateX = function(m, rad) { return m.multiply($M4.rotationX(rad)) };

$M4.rotationY = function (rad) {
    var cos= Math.cos(rad);
    var sin= Math.sin(rad);
    return Matrix.create([
        [cos  , 0 , sin , 0] , 
        [0    , 1 , 0   , 0] , 
        [-sin , 0 , cos , 0] , 
        [0    , 0 , 0   , 1]
    ]);
}
$M4.rotateY = function(m, rad) { return m.multiply($M4.rotationY(rad)) };

$M4.rotationZ = function (rad) {
    var cos= Math.cos(rad);
    var sin= Math.sin(rad);
    return Matrix.create([
        [cos , -sin , 0 , 0] , 
        [sin , cos  , 0 , 0] , 
        [0   , 0    , 1 , 0] , 
        [0   , 0    , 0 , 1]
    ]);
}
$M4.rotateZ = function(m, rad) { return m.multiply($M4.rotationZ(rad)) };

$M4.eulerRotation = function(a, b, c) {
   var ca = Math.cos(a);
   var sa = Math.sin(a);
   var cb = Math.cos(b);
   var sb = Math.sin(b);
   var cc = Math.cos(c);
   var sc = Math.sin(c);
  return Matrix.create([
       [cb*cc   , sa*sb*cc  + ca*sc , -ca*sb*cc + sa*sc , 0] , 
       [- cb*sc , -sa*sb*sc + ca*cc , ca*sb*sc  + sa*cc , 0] , 
       [sb      , -sa*cb            , ca*cb             , 0] ,
       [0       , 0                 , 0                 , 1]
   ]);
}
$M4.rotate = function(m,x,y,z) { return m.multiply($M4.eulerRotation(x,y,x)) };

//$M4.3to2 = function(m, v) {
//    var x = v.e(1);
//    var y = v.e(2);
//    var vz = v.e(3);
//    var tx = m.e(1,4);
//    var ty = m.e(2,4);
//    var vx = x + tx;
//    var vy = y + ty;
//    x = vx * a00 + vy * a01 + vz * a02 + a03;
//    y = vx * a10 + vy * a11 + vz * a12 + a13;
//    return [x, y];
//}

// p = console.log;

function mapping(v) {
      var fl = 500;
      var scale = fl / (fl + v.e(3));
      return [v.e(1) * scale, v.e(2) * scale];
}

function createVSquare(size) {
    var v = $V([size, size, size, 1]);
    var m = $M4();
    m = $M4.rotateX(m, Math.PI/2);
    var res = [v];
    for (var i = 0;  i < 3; i++) {
        res.push(m.multiply(res[res.length-1]));
    }
    m = $M4();
    $M4.set(m,0,3,-size*2); // tx
    for (var i = 0;  i < 4; i++) {
        res.push(m.multiply(res[i]));
    }
}

function moveTo(c, x,y) {
    c.cx = x + 300;
    c.cy = y + 200;
}

function rand(start, end) {
    if (typeof end == 'undefined') {
        return Math.floor(Math.random() * start);
    }
    var e;
    if (start < end) {
       e = start - end;
       return Math.floor(Math.random() * e) + end;
    } else {
       e = end - start;
       return Math.floor(Math.random() * e) - end;
    }
}

var circles = [];
var camera = $M4();
function loop() {
    camera = $M4.rotate(camera, Math.PI/180 * 5, Math.PI/180 * 2, Math.PI/180 * 1 );
    //camera = $M4.rotateY(camera, Math.PI/180 * 10);
    for (var i = 0;  i < circles.length; i++) {
        var circle = circles[i];
        var t = camera.multiply(circle.vector);
        var xy = mapping(t);
        circle.cx = xy[0] + 300;
        circle.cy = xy[1] + 200;
        circle.styles.opacity = ((t.e(3) + 127) / 255) * 0.8 + 0.2;
        circle.applyStyles();
    }
    setTimeout(loop, 50);
}

function init() {
   for (var i = 0;  i < 50; i++) {
        var circle = C('circle');
        circle.cx = 0;
        circle.cy = 0;
        circle.r = 5;
        var v = $V([127,0,0,1]);
        var m = $M4.eulerRotation(Math.PI*2*Math.random(),Math.PI*2*Math.random(),Math.PI*2*Math.random());
        v = m.multiply(v).map(function(i) { return i|0 });
        circle.vector = v;
        //circle.vector = $V([rand(127, -127), rand(127, -127), rand(127, -127), 1]);
        //var v = circle.vector;
        var color = new JSColor();
        color.setRGB(v.e(1) + 127,v.e(2) + 127,  v.e(3) + 127 );
        circle.styles = {
            opacity: 1,
            fill: color.toString('#')
        }
        circle.applyStyles();
        circles.push(circle);
        _('canvas').appendChild(circle);
   }
   loop();
}

