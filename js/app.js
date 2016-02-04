// Enemies our player must avoid
var Enemy = function(initialX, initialY, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    this.x = initialX;
    this.y = initialY;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    if (this.x > 500) {
        this.x = -60;
        this.randomSpeed();
    }

    //This is the range in which the player can get to the enemy 
    //and vice versa before the collision happens
    var bugXLeftRange = this.x - 50;
    var bugXRightRange = this.x + 50;
    var bugYTopRange = this.y - 50;
    var bugYBottomRange = this.y + 50;
    //Handles the collision between player and enemy here so if 
    //player gets in range within 50 of enemy, the player 
    //will be reset back to it's starting point due to the
    //resetPlayerPosition function being invoked.
    if (player.x > bugXLeftRange && player.x < bugXRightRange && player.y > bugYTopRange && player.y < bugYBottomRange) {
        player.resetPlayerPosition();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//Random method is used in this function to get a number from 1-5 to 
//multiply by 75 to generate a random speed to use for dt
Enemy.prototype.randomSpeed = function() {
    var speedMultiply = Math.floor(Math.random() * 5 + 1);
    this.speed = 75 * speedMultiply;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

//Player will appear at this default location on x and y axis of canvas
var playerInitialX = 200,
    playerInitialY = 400;
//*Create player class
var Player = function() {
    this.x = playerInitialX;
    this.y = playerInitialY;
    //Sets wallChecker values to default.  Left and Right walls 
    //are false because player is not next to a left or right wall.
    //Bottom wall is true because player spawns at bottom middle of canvas
    //near a bottomWall
    this.wallChecker = {
        leftWall: false,
        rightWall: false,
        bottomWall: true
    };
    //Player's image is loaded
    this.sprite = 'images/char-boy.png';
};

//Player's update method uses dt as a parameter just like 
//enemy's update method so everything can run at same speed
//across all systems running the game
Player.prototype.update = function(dt) {
};

//Player's image is rendered on canvas at it's
//x and y location mentioned above
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Resets player back to default location and then 
//resetCheckPosition becomes invoked from below
Player.prototype.resetPlayerPosition = function() {
    this.x = playerInitialX;
    this.y = playerInitialY;
    this.resetCheckPosition();
};

//Player movement is set to move by the push of the keys 
//listed below (left, right, up, down).  Player moves a 
//length of 90 up or down, and a length of 100 left or right
//across the canvas.  CheckPosition is invoked to find out if 
//Player is near a wall.
Player.prototype.handleInput = function(keyPressed) {
    var stepHorizontalLength = 100,
        stepVerticalLength = 90;
    this.CheckPosition();

    //When left key is pressed move left 100
    //on x axis of canvas until wall reached
    if (keyPressed === 'left') {
        if (this.wallChecker.leftWall) {
            return null;
        }

        this.x -= stepHorizontalLength;

    //When right key is pressed move right 100
    //on x axis of canvas until wall reached
    } else if (keyPressed === 'right') {
        if (this.wallChecker.rightWall) {
            return null;
        }

        this.x += stepHorizontalLength;

    //When up key is pressed move up 90
    //on y axis of canvas until you reach 40
    //on y axis and then reset player position
    //(Thats how you beat the game)
    } else if (keyPressed === 'up') {
        if (this.y === 40) {
            this.resetPlayerPosition();
            return null;
        }

        this.y -= stepVerticalLength;

    //When down key is pressed move down 90
    //on y axis of canvas until you reach a wall
    } else if (keyPressed === 'down') {
        if (this.wallChecker.bottomWall) {
            return null;
        }

        this.y += stepVerticalLength;

    //if any other key but up, down, left, right
    //are pushed return this message on console
    } else {
        console.log('>>> WRONG KEY PRESSED <<<');
        return null;
    }
};

//If player is at 0 on x axis then he is near a left wall
//but not a right wall.  If a player is at 400 on x axis vice versa.
//If he is anywhere else on x axis he is not near any walls.
//If player is at 400 on the y axis he is near a bottom wall
//otherwise he is not near a wall.
Player.prototype.CheckPosition = function() {
    if (this.x === 0) {
        this.setHorizontalWallCheckerState(true, false);
    } else if (this.x === 400) {
        this.setHorizontalWallCheckerState(false, true);
    } else {
        this.setHorizontalWallCheckerState(false, false);
    }

    if (this.y === 400) {
        this.wallChecker.bottomWall = true;
    } else {
        this.wallChecker.bottomWall = false;
    }
};

//Sets wall checkers back to default value considering player
//will be back to default location
Player.prototype.resetCheckPosition = function() {
    this.setHorizontalWallCheckerState(false, false);
    this.wallChecker.bottomWall = true;
};

//This function when invoked up top changes the values of
//left and rightwallstate to either true or false which is why
//they are parameters.  If either of these are true then it just
//means that player is near whichever wall that lists true not
//near a wall if it's false.
Player.prototype.setHorizontalWallCheckerState = function(leftWallState, rightWallState) {
    this.wallChecker.leftWall = leftWallState;
    this.wallChecker.rightWall = rightWallState;
};

// Now instantiate your objects.

// Place all enemy objects in an array called allEnemies
var allEnemies = [];

//Created a copy of Enemy class so we could set the individual 
//locations of each enemy (3 of them) on the x and y axis through
//this for loop and also set a random speed to each one.
//Looks confusing but the -60...tempSpeed are just substituting the 
//parameters from the enemy object.  So -60 is where
//these enemies will start on x axis, 60+85*i is where they start
//on y axis going as fast as tempSpeed allows them across the canvas.
for (var i = 0; i < 3; i++) {
    var tempSpeed = Math.floor(Math.random() * 5 + 1) * 75;
    allEnemies.push(new Enemy(-60, 60 + 85 * i, tempSpeed));
}
// Place the player object in a variable called player
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});