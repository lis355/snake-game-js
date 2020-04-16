import React from "react";

const DIRECTIONS = {
	LEFT: "LEFT",
	UP: "UP",
	RIGHT: "RIGHT",
	DOWN: "DOWN"
};

function randIntMax(n) {
	return Math.floor(Math.random() * n);
}

class Map {
	constructor(game, n) {
		this.game = game;
		this.N = n;
	}

	draw(ctx) {
		for (let i = 0; i < this.N; i++) {
			for (let j = 0; j < this.N; j++) {
				ctx.strokeStyle = "#EDEDED";
				ctx.beginPath();
				ctx.rect(this.game.cellW * i, this.game.cellH * j, this.game.cellH, this.game.cellW);
				ctx.stroke();
			}
		}

		ctx.beginPath();
		ctx.rect(0, 0, this.game.cellH * this.N, this.game.cellW * this.N);
		ctx.stroke();
	}
}

class MapEntity {
	constructor(map) {
		this.map = map;
	}

	update() { }
	draw(ctx) { }
}

class Snake extends MapEntity {
	constructor(game, color, startX, startY, startSize, startDirection) {
		super(game.map);

		this.game = game;

		this.color = color;

		this.body = [[startX, startY]];
		this.direction = startDirection;

		for (let i = 0; i < startSize - 1; i++) {
			this.rise(false);
		}
	}

	update() {
		const isEatedApple = this.isEatedApple(this.game.apple);
		if (isEatedApple) {
			this.game.generateApple();
		}

		this.rise(!isEatedApple);
	}

	rise(looseTail = true) {
		const part = [this.body[0][0], this.body[0][1]];
		if (this.direction === DIRECTIONS.LEFT) {
			part[0] -= 1;
		} else if (this.direction === DIRECTIONS.UP) {
			part[1] -= 1;
		} else if (this.direction === DIRECTIONS.RIGHT) {
			part[0] += 1;
		} else if (this.direction === DIRECTIONS.DOWN) {
			part[1] += 1;
		}

		this.body.unshift(part);

		if (looseTail) {
			this.body.pop();
		}

		for (let i = 0; i < this.body.length; i++) {
			this.body[i][0] = (this.body[i][0] + this.map.N) % this.map.N;
			this.body[i][1] = (this.body[i][1] + this.map.N) % this.map.N;
		}
	}

	isEatedApple(apple) {
		for (let i = 0; i < this.body.length; i++) {
			if (this.body[i][0] === apple.x && this.body[i][1] === apple.y) {
				return true;
			}
		}

		return false;
	}

	draw(ctx) {
		for (let i = 0; i < this.body.length; i++) {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.map.game.cellW * this.body[i][0], this.map.game.cellH * this.body[i][1], this.map.game.cellH, this.map.game.cellW);
		}
	}
}

class Apple extends MapEntity {
	constructor(map, x, y) {
		super(map);

		this.x = x;
		this.y = y;
	}

	draw(ctx) {
		ctx.fillStyle = "#EAA4B8";
		ctx.fillRect(this.map.game.cellW * this.x, this.map.game.cellH * this.y, this.map.game.cellH, this.map.game.cellW);
	}

	static generate(map) {
		return new Apple(map, randIntMax(map.N), randIntMax(map.N));
	}
}

const MAP_SIZE = 25;

class Game {
	constructor() {
		this.map = new Map(this, MAP_SIZE);

		this.snakes = [
			new Snake(this, "#77D6C0", 1, 1, 3, DIRECTIONS.RIGHT),
			new Snake(this, "#40B8EF", MAP_SIZE - 2, MAP_SIZE - 2, 3, DIRECTIONS.LEFT)
		];

		this.generateApple();
	}

	generateApple() {
		this.apple = Apple.generate(this.map);
	}

	update() {
		this.snakes.forEach(snake => {
			snake.update();

			if (snake.isEatedApple(this.apple)) {

			}
		});

		// if (!eated) {
		// 	snake.pop();
		// }
	}

	draw(canvas) {
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		this.cellW = canvas.width / this.map.N;
		this.cellH = canvas.height / this.map.N;

		ctx.lineWidth = 1;

		this.map.draw(ctx);
		this.apple.draw(ctx);
		this.snakes.forEach(snake => { snake.draw(ctx); });
	}

	handleKeyDown(key) {
		key = key && key.code;
		if (!key) return;

		if (key === "ArrowLeft") {
			this.snakes[0].direction = DIRECTIONS.LEFT;
		} else if (key === "ArrowUp") {
			this.snakes[0].direction = DIRECTIONS.UP;
		} else if (key === "ArrowRight") {
			this.snakes[0].direction = DIRECTIONS.RIGHT;
		} else if (key === "ArrowDown") {
			this.snakes[0].direction = DIRECTIONS.DOWN;
		}

		if (key === "KeyA") {
			this.snakes[1].direction = DIRECTIONS.LEFT;
		} else if (key === "KeyW") {
			this.snakes[1].direction = DIRECTIONS.UP;
		} else if (key === "KeyD") {
			this.snakes[1].direction = DIRECTIONS.RIGHT;
		} else if (key === "KeyS") {
			this.snakes[1].direction = DIRECTIONS.DOWN;
		}
	}
}

const UPDATE_INTERVAL = 1000 / 8;

class App extends React.Component {
	componentDidMount() {
		this.game = new Game();

		setInterval(() => {
			this.game.update();
			this.game.draw(this.refs.canvas);
		}, UPDATE_INTERVAL);

		document.addEventListener("keydown", this.game.handleKeyDown.bind(this.game));
	}

	render() {
		return <canvas ref="canvas" width={400} height={400} />;
	}
}

export default App;
