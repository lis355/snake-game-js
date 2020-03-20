import React from "react";

const N = 30;

const snake = [
	[2, Math.floor(N / 2)],
	[1, Math.floor(N / 2)],
	[0, Math.floor(N / 2)]
];

let direction = "RIGHT";

function generateApple() {
	return [Math.floor(Math.random() * N), Math.floor(Math.random() * N)];
}

let apple = generateApple();

function handleKeyDown(key) {
	if (key.key === "ArrowLeft") {
		direction = "LEFT";
	} else if (key.key === "ArrowUp") {
		direction = "UP";
	} else if (key.key === "ArrowRight") {
		direction = "RIGHT";
	} else if (key.key === "ArrowDown") {
		direction = "DOWN";
	}
}

class App extends React.Component {
	componentDidMount() {
		setInterval(() => {
			this.processSnake();
			this.draw();
		}, 1000 / 8);

		document.addEventListener("keydown", handleKeyDown);
	}

	processSnake() {
		// Двигаем змейку

		const part = [snake[0][0], snake[0][1]];
		if (direction === "LEFT") {
			part[0] -= 1;
		} else if (direction === "UP") {
			part[1] -= 1;
		} else if (direction === "RIGHT") {
			part[0] += 1;
		} else if (direction === "DOWN") {
			part[1] += 1;
		}

		// Добавляем клетку к голове

		snake.unshift(part);

		// Змея сьела яблоко?

		let eated = false;
		for (let i = 0; i < snake.length; i++) {
			if (snake[i][0] === apple[0] && snake[i][1] === apple[1]) {
				eated = true;

				apple = generateApple();
			}
		}

		// Если змея не сьела яблоко, хвост тоже двигается

		if (!eated) {
			snake.pop();
		}

		// Пересчитываем координаты змейки

		for (let i = 0; i < snake.length; i++) {
			snake[i][0] = (snake[i][0] + N) % N;
			snake[i][1] = (snake[i][1] + N) % N;
		}
	}

	draw() {
		// Рисуем

		const ctx = this.refs.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);

		const cellW = this.refs.canvas.width / N;
		const cellH = this.refs.canvas.height / N;

		ctx.lineWidth = 1;

		// Рисуем клетчатое поле

		for (let i = 0; i < N; i++) {
			for (let j = 0; j < N; j++) {
				ctx.strokeStyle = "#EDEDED";
				ctx.beginPath();
				ctx.rect(cellW * i, cellH * j, cellH, cellW);
				ctx.stroke();
			}
		}

		ctx.beginPath();
		ctx.rect(0, 0, cellH * N, cellW * N);
		ctx.stroke();

		// Рисуем яблоко

		ctx.fillStyle = "#EAA4B8";
		ctx.fillRect(cellW * apple[0], cellH * apple[1], cellH, cellW);

		// Рисуем змейку

		for (let i = 0; i < snake.length; i++) {
			ctx.fillStyle = "#77D6C0"; // 40B8EF
			ctx.fillRect(cellW * snake[i][0], cellH * snake[i][1], cellH, cellW);
		}
	}

	render() {
		return <canvas ref="canvas" width={400} height={400} />;
	}
}

export default App;
