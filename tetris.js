const width = 10;
const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
let score = document.querySelector('#score');
const startbtn = document.querySelector('#start-button');
const nextgrid = document.querySelectorAll('#next div');
let pts = 0;
const controls = document.querySelector('#controls');
let level = 0;
const displaylevel = document.querySelector('#lvl');

const svgs=document.querySelectorAll('svg');


const colors = ['rgb(250, 6, 250)', 'blue', 'red', 'green', 'orange'];

const ltetrimino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2, width * 2 + 1],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];

const ztetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
];

const ttetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
];

const otetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
];

const itetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
];

const tetriminos = [ltetrimino, ztetromino, ttetromino, otetromino, itetromino];
let tetritype;
let rot;
let selectedtetris;
let pos;
let nexttetritype;
let timerid = null;

init();

function init() {
    tetritype = Math.floor(Math.random() * 5);
    rot = 0;
    selectedtetris = tetriminos[tetritype][rot];
    pos = 4;
    nexttetritype = Math.floor(Math.random() * 5);
}

function draw() {
    for (let index of selectedtetris) {
        squares[pos + index].classList.add('tetri');
        squares[pos + index].style.backgroundColor = colors[tetritype];
    }
}

function undraw() {
    for (let index of selectedtetris) {
        squares[pos + index].classList.remove('tetri');
        squares[pos + index].style.backgroundColor = '';
    }
}

function movedown() {
    if (tofreeze()) {
        for (let index of selectedtetris) {
            squares[index + pos].classList.add('taken');
        }
        clearInterval(timerid);
        addscore();
        tetritype = nexttetritype;
        nexttetritype = Math.floor(Math.random() * 5);
        displaynext();
        rot = 0;
        selectedtetris = tetriminos[tetritype][rot];
        pos = 4;
        if (gameover()) {

            return;
        }
        draw();
        if (pts < 30) {
            timerid = setInterval(movedown, 1000);
        }
        else if (pts > 30 && level == 0) {
            level++;
            displaylevel.textContent = level;
            timerid = setInterval(movedown, 750);
        }
        else if (pts < 60) {
            timerid = setInterval(movedown, 750);
        }
        else if (pts > 60 && level == 1) {
            level++;
            displaylevel.textContent = level;
            timerid = setInterval(movedown, 500);
        }
        else if (pts < 100) {
            displaylevel.textContent = level;
            timerid = setInterval(movedown, 500);
        }
        else if (pts > 100 && level == 2) {
            level++;
            displaylevel.textContent = level;
            timerid = setInterval(movedown, 250);
        }
        else if (pts < 150) {
            displaylevel.textContent = level;
            timerid = setInterval(movedown, 250);
        }
        else if (pts >150 && level == 3) {
            level++;
            displaylevel.textContent = level;
            timerid = setInterval(movedown, 100);
        }
        else {
            displaylevel.textContent = level;
            timerid = setInterval(movedown, 100);
        }
    }
    undraw();
    pos += width;
    draw();
}

function usermovedown() {
    if (!tofreeze()) {
        undraw();
        pos += width;
        draw();
    }
}

function tofreeze() {
    for (let index of selectedtetris) {
        if (squares[index + pos + width].classList.contains('taken')) {
            return 1;
        }
    }
    return 0;
}

function control(e) {
    if (timerid === null) {
        return;
    }
    if (e.keyCode == 37) {
        moveleft();
    }
    else if (e.keyCode == 39) {
        moveright();
    }
    else if (e.keyCode == 40) {
        usermovedown();
    }
    else if (e.keyCode == 38) {
        rotate();
    }
}

document.addEventListener('keyup', control);

function rotate() {
    rot = (rot + 1) % 4;
    undraw();
    selectedtetris = tetriminos[tetritype][rot];
    draw();
}

function canmoveleft() {
    for (let index of selectedtetris) {
        if ((index + pos) % width === 0 || squares[index + pos - 1].classList.contains('taken')) {
            return 0;
        }
    }
    return 1;
}

function moveleft() {
    if (canmoveleft()) {
        undraw();
        pos -= 1;
        draw();
    }
}

function canmoveright() {
    for (let index of selectedtetris) {
        if ((index + pos) % width === 9 || squares[index + pos + 1].classList.contains('taken')) {
            return 0;
        }
    }
    return 1;
}

function moveright() {
    if (canmoveright()) {
        undraw();
        pos += 1;
        draw();
    }
}


function displaynext() {
    let width = 4; // local variable
    const next = [[1, width + 1, width * 2 + 1, 2], [0, width, width + 1, width * 2 + 1], [1, width, width + 1, width + 2], [0, 1, width, width + 1], [1, width + 1, width * 2 + 1, width * 3 + 1]];
    for (let cell of nextgrid) {
        cell.classList.remove('tetri');
        cell.style.backgroundColor = '';
    }
    for (let index of next[nexttetritype]) {
        nextgrid[index].classList.add('tetri');
        nextgrid[index].style.backgroundColor = colors[nexttetritype];
    }
}
startbtn.addEventListener('click', () => {
    if (startbtn.textContent == "GAME OVER") {
        level = 0;
        pts = 0;
        displaylevel.textContent = 0;
        score.textContent = 0;
        for (let i = 0; i < 200; ++i) {
            squares[i].classList.remove('taken');
            squares[i].classList.remove('tetri');
            squares[i].style.backgroundColor = '';
        }
        squares.forEach(cell => grid.appendChild(cell));
        init();
        displaynext();
        draw();
        timerid = setInterval(movedown, 1000);
        startbtn.textContent = 'Pause';
        startbtn.classList.add('btn-danger');
        startbtn.classList.remove('btn-primary');
    }
    else if (timerid) {
        clearInterval(timerid);
        timerid = null;
        startbtn.textContent = 'Start ';
         startbtn.classList.remove('btn-danger');
        startbtn.classList.add('btn-primary')
        startbtn.appendChild(svgs[1]);
    }
    else {
        displaynext();
        draw();
        timerid = setInterval(movedown, 1000);
        startbtn.textContent = 'Pause ';
        startbtn.classList.add('btn-danger');
        startbtn.classList.remove('btn-primary');
        svgs[3].style.visibility='visible';
        startbtn.appendChild(svgs[3]);
    }
}
)
function addscore() {
    let i = 0;
    for (i = 0; i < 200; i += width) {
        let rowdelete = 1;
        for (let j = i; j < i + width; ++j) {
            if (!squares[j].classList.contains('taken')) {
                rowdelete = 0;
                break;
            }
        }
        if (rowdelete) {
            pts += 10;
            score.textContent = pts;
            for (let j = i; j < i + width; ++j) {
                squares[j].classList.remove('taken');
                squares[j].classList.remove('tetri');
                squares[j].style.backgroundColor = '';
            }
            let removedsqs = squares.splice(i, width);
            squares = removedsqs.concat(squares);
            // appendchild moves node from its current pos to new pos if it has parent defined in html
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}
function gameover() {
    for (let index of selectedtetris) {
        if (squares[pos + index].classList.contains('taken')) {
            clearInterval(timerid);
            startbtn.textContent = 'GAME OVER';
            return 1;
        }
    }
    return 0;
}
let cntrl = document.querySelector('#control-details');


controls.addEventListener('click', () => {
    cntrl.style.display = 'block';
});

const clsbtn = document.querySelector('#close');

clsbtn.addEventListener('click', () => {
    cntrl.style.display = 'none';
})





