var animateFrame = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame() ||
window.mozRequestAnimationFrame ||
function(callback) {
		window.setTimeout(callback, 1000 / 60)
};


var welcome = document.createElement("canvas");
var canvas = document.createElement("canvas");
var width = 320;
var height = 420;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext("2d");
var player = new Player();
var computer = new Computer();
var ball = new Ball(160, 210, 0, 3);
var pong = document.getElementById("pong");
var welcome = document.getElementById("welcome");
var time = document.getElementById("time");
var keysDown = {};

function startGame() {
	var timer = new Timer(1, 1000);
	timer.start();
	pong.removeChild(welcome);
	document.getElementById("pong").appendChild(canvas);
}

function Timer(count, interval) {
	this.count = count ? count : 0;
	this.interval = interval ? interval : 0;
	this.isPaused = false;
	this.intervalID = 0;
	this.outputSpanID = "time";
	this.callback = null
}
Timer.prototype.printTime = function() {
	document.getElementById(this.outputSpanID).innerHTML = this.count
};
Timer.prototype.stop = function() {
	clearInterval(this.intervalID);
	this.count = 0;
	this.interval = 0;
	this.isPaused = false;
	this.printTime();
	if (this.callback) {
		this.callback()
	}
};

Timer.prototype.start = function(e) {
	if (this.intervalID != 0) {
		clearInterval(this.intervalID)
	}
	this.printTime();
	var self = this;
//setInterval method sets the interval for repeating the function
  this.intervalID = setInterval(function() {
      self.count -= 1;
      if (self.count >= 0) {
          self.printTime();
			} else {
			init();
			self.stop();
			pong.removeChild(time);
			console.log(self.count);
     }
    }, self.interval);
};

function init() {
	animateFrame(step)
}
var step = function() {
	update();
	render();
	animateFrame(step)
};
var update = function() {
	player.update();
	computer.update(ball);
	ball.update(player.paddle, computer.paddle)
};
var render = function() {
	context.fillStyle = "#1F8DD6";
	context.fillRect(0, 0, width, height);
	player.render();
	computer.render();
	ball.render()
};

function Ball(x, y, cscore, pscore) {
	this.x = x;
	this.y = y;
	this.x_speed = 0;
	this.y_speed = 3;
	this.radius = 5;
	this.computer = cscore;
	this.player = pscore;
	this.cscore = 1;
	this.pscore = 1;
	this.say = 0;
}
Ball.prototype.render = function() {
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
	context.fillStyle = "#f19b1e";
	context.fill()
};

Ball.prototype.update = function (paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    if (this.x - 5 < 0) {
        this.x = 5;
        this.x_speed = -this.x_speed;
    } else if (this.x + 5 > 320) {
        this.x = 295;
        this.x_speed = -this.x_speed;
    }

    if (this.y < 0 || this.y > 420) {
        if (this.y > 420) {
            this.computer = document.getElementById("computer").innerHTML = this.cscore++
        } else {
            this.player = document.getElementById("player").innerHTML = this.pscore++
        }
        this.x_speed = 0;
        this.y_speed = 3;
        this.x = 160;
        this.y = 210;
    }

    if (top_y > 200) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = -3;
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
    } else {
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed = 3;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    }
};


function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

Paddle.prototype.render = function() {
	context.fillStyle = "#0D212E";
	context.fillRect(this.x, this.y, this.width, this.height)
};

Paddle.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if (this.x < 0) {
        this.x = 0;
        this.x_speed = 0;
    } else if (this.x + this.width > 320) {
        this.x = 320 - this.width;
        this.x_speed = 0;
    }
};

Player.prototype.render = function() {
	this.paddle.render()
};

function Player() {
	this.paddle = new Paddle(140, 400, 50, 10)
}

Player.prototype.update = function() {
	for (var a in keysDown) {
		var b = Number(a);
		if (b == 37) {
			this.paddle.move(-4, 0)
		} else {
			if (b == 39) {
				this.paddle.move(4, 0)
			} else {
				this.paddle.move(0, 0)
			}
		}
	}
};
function Computer() {
	this.paddle = new Paddle(140, 10, 50, 10)
}

Computer.prototype.render = function() {
	this.paddle.render()
};

Computer.prototype.update = function (ball) {
    var x_pos = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    if (diff < 0 && diff < -4) {
        diff = -5;
    } else if (diff > 0 && diff > 4) {
        diff = 5;
    }
    this.paddle.move(diff, 0);
    if (this.paddle.x < 0) {
        this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > 300) {
        this.paddle.x = 300 - this.paddle.width;
    }
};

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});