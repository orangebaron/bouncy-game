const canvas = document.getElementById("c")
const ctx = canvas.getContext("2d")

const canvasSize = [500,500]
const earthCenter = [canvasSize[0]/2,canvasSize[1]/2]
const earthRadius = canvasSize[0]/4
const playerRadius = 10
var playerPos = [canvasSize[0]/2,10]
var playerVel = [0,0]
const fps = 100
const gravity = 10
const playerBoostSpeed = 4

function drawCircle(p,r,c) {
	ctx.fillStyle=c
	ctx.beginPath()
	ctx.arc(p[0],p[1],r,0,2*Math.PI)
	ctx.fill()
}

//vector functions
function add(a,b) {
	return [a[0]+b[0],a[1]+b[1]]
}
function sub(a,b) {
	return [a[0]-b[0],a[1]-b[1]]
}
function mult(a,b) {
	return [a[0]*b,a[1]*b]
}
function size(a) {
	return Math.sqrt((a[0]*a[0])+(a[1]*a[1]))
}
function normalize(a) {
	d = size(a)
	return [a[0]/d,a[1]/d]
}
function dot(a,b) {
	return a[0]*b[0] + a[1]*b[1]
}
playerVel = mult(playerVel,1/fps)

//player input
keysDown = []
document.onkeydown = function(event) {
	if (event.key == "a") {
		keysDown[0] = true
	} else if (event.key == "d") {
		keysDown[1] = true
	}
}
document.onkeyup = function(event) {
	if (event.key == "a") {
		keysDown[0] = false
	} else if (event.key == "d") {
		keysDown[1] = false
	}
}

function loop() {
	ctx.fillStyle="#000000"
	ctx.fillRect(0,0,canvasSize[0],canvasSize[1])
	drawCircle(earthCenter,earthRadius,"#00A000")
	
	//player input
	var tanAccel = 0
	if (keysDown[0]) {
		tanAccel += 1
	}
	if (keysDown[1]) {
		tanAccel -= 1
	}
	const directionToCenter = normalize(sub(playerPos,earthCenter))
	playerVel = add(playerVel,mult([Math.sin(Math.atan(directionToCenter[1]/directionToCenter[0])),Math.cos(Math.atan(directionToCenter[1]/directionToCenter[0]))],tanAccel*playerBoostSpeed/fps))
	
	if (size(sub(earthCenter,playerPos))<earthRadius+playerRadius) {
		//collision
		playerVel = sub(playerVel,mult(mult(directionToCenter,dot(playerVel,directionToCenter)),2))
	} else {
		//gravity
		playerVel = add(playerVel,mult(normalize(sub(earthCenter,playerPos)),gravity/fps))
	}
	//calculate+draw
	playerPos = add(playerPos,playerVel)
	drawCircle(playerPos,playerRadius,"#FFFFFF")
	//loop
	setTimeout(loop,1000/fps)
}
loop()
