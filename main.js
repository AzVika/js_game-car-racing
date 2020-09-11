const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100;

const score = document.querySelector('.score'),
	start = document.querySelector('.start'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div');

const audio = document.createElement('embed');
audio.src = 'audio.mp3';
audio.style.cssText = 'position: absolute; top: -1000;';

car.classList.add('car');

const countSection = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM);
gameArea.style.heigth = countSection * HEIGHT_ELEM;

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false
};

const setting = {
	start: false,
	score: 0,
	speed: 3,
	traffic: 3
}

function getCountElements(heightElement) {
	return gameArea.offsetHeight / heightElement + 1;
}

function startGame() {
	start.classList.add('hide');
	gameArea.innerHTML = '';

	for(let i = 0; i < getCountElements(HEIGHT_ELEM); i++) {
		const line = document.createElement('div');
		line.classList.add('line');
		line.style.top = (i * HEIGHT_ELEM) + 'px';
		line.style.heigth = (HEIGHT_ELEM / 2) + 'px';
		line.y = i * HEIGHT_ELEM;
		gameArea.append(line);
	}

	for(let i = 0; i < getCountElements(HEIGHT_ELEM * setting.traffic); i++) {
		const enemy = document.createElement('div');
		const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
		enemy.classList.add('enemy');
		enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);

		enemy.style.top = enemy.y + 'px';
		gameArea.appendChild(enemy);
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetHeight)) + 'px';
		enemy.style.background = `transparent url('image/enemy${randomEnemy}.png') center / cover no-repeat`;
		
	}

	setting.score = 0;
	setting.start = true;
	gameArea.append(car);
	gameArea.append(audio);
	car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
	car.style.top = 'auto';
	car.style.bottom = '10px';
	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;
	requestAnimationFrame(playGame);
}

function playGame() {
	// console.log('Play game!');
	if(setting.start) {
		setting.score += setting.speed;
		score.textContent = 'SCORE:' + setting.score;
		moveRoad();
		moveEnemy();
		if(keys.ArrowLeft && setting.x > 0) {
			setting.x -=setting.speed;
		}

		if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
			setting.x +=setting.speed;
		}

		if(keys.ArrowUp && setting.y > 0) {
			setting.y -=setting.speed;
		}

		if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight - 5)) {
			setting.y +=setting.speed;
		}

		car.style.left = setting.x + 'px';
		car.style.top = setting.y + 'px';

		requestAnimationFrame(playGame);
	} else {
		audio.remove();
	}
}

function startRun(e) {
	if(keys.hasOwnProperty(e.key)) {
		e.preventDefault();
		keys[e.key] = true;
	}
	
}

function stopRun(e) {
	if(keys.hasOwnProperty(e.key)) {
		e.preventDefault();
		keys[e.key] = false;
	}
}

function moveRoad() {
	let lines = document.querySelectorAll('.line');
	lines.forEach(function(line) {
		line.y += setting.speed;
		line.style.top = line.y + 'px';

		if(line.y >= document.documentElement.clientHeight) {
			line.y = -HEIGHT_ELEM;
		}
	});
}

function moveEnemy() {
	let enemy = document.querySelectorAll('.enemy');
	enemy.forEach(function(item) {
		let carRect = car.getBoundingClientRect();
		let enemyRect = item.getBoundingClientRect();

		if(carRect.top + 5 <= enemyRect.bottom &&
			carRect.right - 5 >= enemyRect.left &&
			carRect.left + 5 <= enemyRect.right &&
			carRect.bottom - 5 >= enemyRect.top ) {
			setting.start = false;
			audio.remove();
			console.warn('DTP');
			start.classList.remove('hide');
			start.style.top = score.offsetHeight;
		}

		item.y += setting.speed / 2;
		item.style.top = item.y + 'px';

		if(item.y >= gameArea.offsetHeight) {
			const checkTop = [...enemy].every(item => item.offsetTop > HEIGHT_ELEM);

			if(checkTop) {
				item.y = -HEIGHT_ELEM * setting.traffic;
			}

			item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth-item.offsetWidth)) + 'px';	
		}
	
	});
}


start.addEventListener('click', startGame);

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);