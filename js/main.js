const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100;

const btnFirstStart = document.getElementById('firstStart'),
	startInfo = document.querySelector('.start_info'),
	score = document.querySelector('.score'),
	start = document.querySelector('.start'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div'),
	topScore = document.getElementById('topScore'),
	imgCrash = document.createElement('div'),
	leftArrow = document.querySelector('.btn_left_arrow'),
	rigthArrow = document.querySelector('.btn_rigth_arrow');

const audioStart = document.createElement('audio');
audioStart.src = 'audio/audio.mp3';
audioStart.loop = true;
audioStart.volume = 0.5;
audioStart.style.cssText = 'position: absolute; top: -1000;';


const crash = document.createElement('audio');
crash.src = 'audio/crash.mp3';
crash.volume = 0.2;
crash.style.cssText = 'position: absolute; top: -2000;';


car.classList.add('car');
imgCrash.classList.add('img_crash');


const countSection = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM);
gameArea.style.heigth = countSection * HEIGHT_ELEM;

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false	
};

const btns = {
	btnLeft: false,
	btnRigth: false
}

const setting = {
	start: false,
	score: 0,
	speed: 3,
	traffic: 3,
	level: 0
}

let level = setting.level;

const resultScore = parseInt(localStorage.getItem('racing_score', setting.score)) || 0;
topScore.textContent = resultScore ? resultScore : 0;

function addLocalStorage () {
	const result = parseInt(localStorage.getItem('racing_score', setting.score)) || 0;
	if(result < setting.score) {
		localStorage.setItem('racing_score', setting.score);
		topScore.textContent = setting.score;
	}
} 


function getCountElements(heightElement) {
	return gameArea.offsetHeight / heightElement + 1;
}


function startGame(e) {
	startInfo.classList.add('hide');
	const target = e.target;

	if(target === start) return;

	switch(target.id) {
		case 'easy', 'firstStart':
			setting.speed = 3;
			setting.traffic = 4;
			break;
		case 'medium':
			setting.speed = 5;
			setting.traffic = 3;
			break;
		case 'hard':
			setting.speed = 8;
			setting.traffic = 2;
			break;
	}


	start.classList.add('hide');
	gameArea.innerHTML = '';
	imgCrash.remove();

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
	
	if(document.documentElement.clientWidth < 780) {
		leftArrow.classList.remove('hide');
		rigthArrow.classList.remove('hide');
	}
	

	setting.score = 0;
	setting.start = true;
	gameArea.append(car);
	audioStart.play();
	car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
	car.style.top = 'auto';
	car.style.bottom = '10px';
	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;
	requestAnimationFrame(playGame);
}


function playGame() {
	setting.level = Math.floor(setting.score / 4000);

	if(setting.level !== level) {
		level = setting.level;
		setting.speed++;
	}

	if(setting.start) {
		setting.score += setting.speed;
		score.textContent = 'SCORE:' + setting.score;
		moveRoad();
		moveEnemy();
		if((keys.ArrowLeft && setting.x > 0) || (btns.btnLeft && setting.x > 0) ) {
			setting.x -=setting.speed;
		}

		if( (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) ||
			(btns.btnRigth && setting.x < (gameArea.offsetWidth - car.offsetWidth)) ) {
			setting.x +=setting.speed;
		}

		if(keys.ArrowUp && setting.y > 0) {
			setting.y -=setting.speed;
		}

		if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight - 5)) {
			setting.y +=setting.speed;
		}

		if(keys.btnLeft) {
			setting.x -=setting.speed;
		}

		car.style.left = setting.x + 'px';
		car.style.top = setting.y + 'px';

		requestAnimationFrame(playGame);
	} else {
			audioStart.remove();
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

function startRunArrow(e) {
	const btnArrow = e.target.closest('.btn_arrow');
	if(btnArrow) {
		const btnId = btnArrow.getAttribute('id');
		if(btns.hasOwnProperty(btnId)) {
			btns[btnId] = true;
		}
	}
	
}

function stopRunArrow(e) {
	const btnArrow = e.target.closest('.btn_arrow');
	if(btnArrow) {
		const btnId = btnArrow.getAttribute('id');
		if(btns.hasOwnProperty(btnId)) {
			btns[btnId] = false;
		}
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
			carRect.right >= enemyRect.left &&
			carRect.left + 5 <= enemyRect.right &&
			carRect.bottom >= enemyRect.top ) {
			setting.start = false;
			car.append(imgCrash);
			audioStart.pause();
			crash.play();
			addLocalStorage();
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

btnFirstStart.addEventListener('click', startGame);

start.addEventListener('click', startGame);

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
document.addEventListener('mousedown', startRunArrow);
document.addEventListener('mouseup', stopRunArrow);
document.addEventListener('touchstart', startRunArrow);
document.addEventListener('touchend', stopRunArrow);