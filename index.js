//mob and canv are the 2 canvas variables for the player entity. mob is the div container for canv which is the canvas.
var mob,
canv,

//isKeyDown holds the value of whether any keys are being held down.
//keyDown is an array with all the keys which are currently down.
isKeyDown = false,
keyDown = [],

//These are to set the movement speeds
//walkSpeed is the speed which the player moves while walking
//runSpeed is the speed which the player moves while running (Holding Spacebar)
walkSpeed = 3,
runSpeed = 5,
moveSpeed = walkSpeed,

//mX and mY holds the mouse variables and is updated when the mouse moves
mX,
mY,

//cursor and cursorCanv is the div container and canvas for the cursor image respectively
cursor,
cursorCanv,

//stage is the canvas for most other entites, ex: bullet shots and targets
stage,

//isScoping holds the value of whether the user is currently holding down the right mouse button
//scopeOverlay is the black div which covers the screen while scoping
//shotDelay is delay of which the player can shoot again (do not change)
isScoping = false,
scopeOverlay,
shotDelay = 100,

//Holds the HTML objects of the entities which show the 'reloading' progress
progBar = null,
progText = null,

//Array of targets currently on screen
targets = [];

//Simple function to convert degrees to radians.
Math.degToRad = function (degs) {
	degs = degs * Math.PI / 180;
	return degs;
	
};

//Called when the mouse has moved
function mouseHasMoved(e) {
	
	//sets mX and mY to the current cursor position
	mX = e.clientX;
	mY = e.clientY;
	
	//Moves the cursor container to the current mouse x and y. 100pixels is added to the Y.
	cursor.style.top = (mY + 100) + "px";
	cursor.style.left = mX + "px";
	
	//mobX and mobY is the current position of the player object
	var mobX = (window.getComputedStyle(mob, null).left),
	mobY = (window.getComputedStyle(mob, null).top);
	
	mobX = Number(mobX.substring(0, mobX.length - 2));
	mobY = Number(mobY.substring(0, mobY.length - 2));
	
	//These functions below set the player object to rotate and "look" at the cursor object.
	var opp = e.clientY - mobY,
	adj = e.clientX - mobX,
	getTan = opp / adj,
	angleRad = Math.atan(getTan),
	angleDeg = angleRad * 180 / Math.PI;
	
	if (adj < 0) {
		angleDeg = angleDeg + 180;
	}
	mob.style.webkitTransform = "rotate(" + angleDeg + "deg)";
	
}

//Initiates and draws the cursor object
function initCursor() {
	var ctxC = cursorCanv.getContext('2d');
	
	ctxC.strokeStyle = "red";
	ctxC.fillStyle = "white";
	
	ctxC.beginPath();
	ctxC.arc(10, 10, 10, Math.degToRad(80), Math.degToRad(100), false);
	ctxC.closePath();
	ctxC.stroke();
	
	ctxC.beginPath();
	ctxC.arc(10, 10, 10, Math.degToRad(170), Math.degToRad(190), false);
	ctxC.closePath();
	ctxC.stroke();
	
	ctxC.beginPath();
	ctxC.arc(10, 10, 10, Math.degToRad(260), Math.degToRad(280), false);
	ctxC.closePath();
	ctxC.stroke();
	
	ctxC.beginPath();
	ctxC.arc(10, 10, 10, Math.degToRad(350), Math.degToRad(10), false);
	ctxC.closePath();
	ctxC.stroke();
	
	ctxC.beginPath();
	ctxC.arc(10, 10, 2, Math.degToRad(0), Math.degToRad(360), false);
	ctxC.closePath();
	ctxC.fill();
}

//Draws the player object
function initDrawCanvas() {
	
	var ctx = canv.getContext('2d');
	
	ctx.fillStyle = "rgba(255,0,0,0.1)";
	ctx.beginPath();
	ctx.moveTo(0, 100);
	ctx.lineTo(200, 200);
	ctx.lineTo(200, 0);
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	ctx.arc(10, 100, 10, Math.degToRad(0), Math.degToRad(360), false);
	ctx.closePath();
	ctx.fillStyle = "rgba(0,0,0,1)";
	ctx.fill();
	
	//Calls function to initiate cursor
	initCursor();
}

//Called when a key is pressed
function keyIsDown(e) {
	isKeyDown = true;
	
	//Adds the current pressed key to the keyDown array
	keyDown.push(e.keyCode);
	
}

function keyIsUp(e) {
	isKeyDown = false;
	
	//Removes all keys with the same keyCode from the keyDown array
	while (keyDown.indexOf(e.keyCode) > 0) {
		keyDown.splice(keyDown.indexOf(e.keyCode), 1);
	}
}

//Creates and displays the reloading progress bars
function addProgress() {
	//Progress Bar
	progBar = document.createElement("progress");
	progBar.setAttribute("class", "reloadBar");
	document.body.appendChild(progBar);
	
	//Progress Text
	progText = document.createElement("div");
	progText.setAttribute("class", "reloadText");
	document.body.appendChild(progText);
	progText.innerHTML = "RELOADING";
}

//Updates the reloading progress bar with the amount of time left.
function updateProgress() {
	progBar.setAttribute("value", shotDelay / 100);
}

//Removes the reloading progress bar and text.
function removeProgress() {
	document.body.removeChild(progBar);
	progBar = null;
	
	document.body.removeChild(progText);
	progText = null;
}

//Main loop of program
function loop() {
	//mobX and mobY are the current position of the player object
	var mobX = (window.getComputedStyle(mob, null).left),
	mobY = (window.getComputedStyle(mob, null).top);
	
	mobX = Number(mobX.substring(0, mobX.length - 2));
	mobY = Number(mobY.substring(0, mobY.length - 2));
	
	//Check if spacebar is down, if it is, the speed is running, else the speed is walking.
	if (keyDown.indexOf(32) > 0) {
		moveSpeed = runSpeed;
	} else {
		moveSpeed = walkSpeed;
	}
	
	//Checks the keyDown array for all current keys down
	//Do the corresponding action for each key down
	var i;
	if (isKeyDown) {
		for (i = 0; i < keyDown.length; i += 1) {
			switch (keyDown[i]) {
			case 65:
				mob.style.left = (mobX - moveSpeed) + "px";
				break;
				
			case 87:
				mob.style.top = (mobY - moveSpeed) + "px";
				break;
				
			case 68:
				mob.style.left = (mobX + moveSpeed) + "px";
				break;
				
			case 83:
				mob.style.top = (mobY + moveSpeed) + "px";
				break;
				
			}
			//Update the rotation of player object to keep "looking" at the cursor.
			mouseHasMoved({
				clientX : mX,
				clientY : mY
			});
		}
	}
	
	//Checks if the user is holding down the right mouse button and shows the scoping overlay accordingly
	if (isScoping) {
		scopeOverlay.style.visibility = "visible";
	} else {
		scopeOverlay.style.visibility = "hidden";
	}
	
	//If the delay timer is over, call the function to remove the reloading progress bar and text.
	if (shotDelay >= 100 && progBar != null) {
		removeProgress();
	} else if (progBar != null) {
		//If not, add to the timer and update the progress bar
		shotDelay += 1;
		updateProgress();
	}
	
}

//Called when a mouse button is held down
function mouseIsDown(e) {
	//Check if the button is the right mouse button
	if (e.which == 3) {
		isScoping = true;
	}
}

//Called when a mouse button is released
function mouseIsUp(e) {
	//Check if the button is the right mouse button
	if (e.which == 3) {
		isScoping = false;
	}
}

//Checks if a shot managed to hit any targets
function checkShot(x, y) {
	var i,
	j,
	k;
	//Check every target
	for (i = 0; i < targets.length; i++) {
		//Check along each x "row"
		for (j = 0; j < targets[i].size; j++) {
			//Check the y's for each x "row"
			for (k = 0; k < targets[i].size; k++) {
				if (x == (j + targets[i].x) && y == (k + targets[i].y)) {
					//If the shot has hit the target, return the target hit and remove the target from the targets list
					var ret = targets[i];
					targets.splice(i, 1);
					return ret;
				}
			}
		}
	}
	//If not, return false
	return false;
}

//Called when the left mouse button is clicked
function shoot(e) {
	//If the delay is not over, stop this function
	if (shotDelay < 100) {
		return;
	}
	
	//Reset the delay timer
	shotDelay = 0;
	
	//randX and randY are the current cursor object position ( pixels are added to center the bullet with the cursor object's crosshairs)
	var randX = e.clientX + 10;
	var randY = e.clientY + 100 + 10;
	
	//mobX and mobY is the current position of the player objects
	var mobX = (window.getComputedStyle(mob, null).left),
	mobY = (window.getComputedStyle(mob, null).top);
	
	mobX = Number(mobX.substring(0, mobX.length - 2));
	mobY = Number(mobY.substring(0, mobY.length - 2));
	
	//Get the distance from the player and the intended target and get 1/10 of it
	var multiplier = Math.sqrt(((randX - mobX) * (randX - mobX)) + ((randY - mobY) * (randY - mobY)));
	multiplier *= 1 / 10;
	
	//If the player is not using the scope, reduce the accuracy with the multiplier.
	if (!isScoping) {
		//Merely for randomization
		if (Math.round(Math.random()) == 1) {
			randX -= Math.floor(Math.random() * multiplier);
		} else {
			randX += Math.floor(Math.random() * multiplier);
		}
		
		//Merely for randomization
		if (Math.round(Math.random()) == 1) {
			randY -= Math.floor(Math.random() * multiplier);
		} else {
			randY += Math.floor(Math.random() * multiplier);
		}
		
	}
	
	//Draw the shot
	var ctx = stage.getContext('2d');
	ctx.beginPath();
	ctx.arc(randX, randY, 2, Math.degToRad(0), Math.degToRad(360), false);
	ctx.closePath();
	ctx.fillStyle = "black";
	ctx.fill();
	
	//Check if the shot has hit any targets, if it has, clear the targets from the stage.
	var shot = checkShot(randX, randY);
	if (shot != false) {
		ctx.clearRect(shot.x, shot.y, shot.size, shot.size);
	}
	
	//Begin the reloading progress timer.
	addProgress();
}

//Creates 5 targets and randomly places them around the screen.
function createTargets() {
	var ctx = stage.getContext('2d'),
	i;
	for (i = 0; i < 5; i++) {
		var xToPush = Math.floor(Math.random() * (window.innerWidth - 10));
		var yToPush = 100 + Math.floor(Math.random() * (window.innerHeight - 10));
		targets.push({
			x : xToPush,
			y : yToPush,
			size : 10
		});
		
		ctx.fillStyle = "black";
		ctx.fillRect(xToPush, yToPush, 10, 10);
	}
}

//Called when the window has finished loading
window.onload = function () {
	//Sets the event listeners.
	document.body.addEventListener('mousemove', mouseHasMoved, false);
	
	document.body.addEventListener('keydown', keyIsDown, false);
	document.body.addEventListener('keyup', keyIsUp, false);
	
	document.body.addEventListener('mousedown', mouseIsDown, false);
	document.body.addEventListener('mouseup', mouseIsUp, false);
	document.body.addEventListener('click', shoot, false);
	
	mob = document.getElementById('mob');
	canv = document.getElementById('mobCanv');
	stage = document.getElementById('stage');
	scopeOverlay = document.getElementById('scopeOverlay');
	stage.width = window.innerWidth;
	stage.height = window.innerHeight;
	
	cursor = document.getElementById('cursor');
	cursorCanv = document.getElementById('cursorCanv');
	
	//Create targets, draw the player and begin the main loop.
	createTargets();
	initDrawCanvas();
	setInterval(loop, 10);
};
