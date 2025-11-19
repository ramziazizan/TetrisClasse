// script.js (KODE TETRIS FINAL, LENGKAP DENGAN NEXT BLOCK DAN FUNGSI HAPUS BARIS)

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button');
    const nextGridContainer = document.getElementById('next-grid');

    // Deklarasi Elemen Tombol HP
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');
    const rotateButton = document.getElementById('rotate-button');
    const downButton = document.getElementById('down-button');

    const width = 10;
    const height = 20;
    const nextWidth = 4;
    let squares = [];
    let nextSquares = [];
    let score = 0;
    let timerId = null; 
    let dropInterval = 1000;
    let currentPosition = 4;
    let currentRotation = 0;
    let nextRandom = Math.floor(Math.random() * 7);
    let currentRandom = nextRandom; 
    
    // --- 1. MEMBUAT GRID UTAMA & NEXT GRID ---
    function createGrid(container, size, squaresArray) {
        for (let i = 0; i < size * size; i++) {
            const square = document.createElement('div');
            container.appendChild(square);
            squaresArray.push(square);
        }
        if (size === width) {
            for (let i = 0; i < width; i++) {
                const floor = document.createElement('div');
                floor.classList.add('taken');
                container.appendChild(floor);
                squaresArray.push(floor);
            }
        }
    }

    function createNextGrid() {
        for (let i = 0; i < nextWidth * nextWidth; i++) {
            const square = document.createElement('div');
            nextGridContainer.appendChild(square);
            nextSquares.push(square);
        }
    }
    
    createGrid(gridContainer, width, squares);
    createNextGrid();
    
    // --- 2. DEFINISI BENTUK TETRIS ---
    const lTetromino = [ [1, width+1, width*2+1, 2], [width, width+1, width+2, width*2+2], [1, width+1, width*2+1, width*2], [width, width*2, width*2+1, width*2+2] ];
    const jTetromino = [ [1, width+1, width*2+1, 0], [width, width+1, width+2, 2], [1, width+1, width*2+1, width*2+2], [width, width*2, width*2+1, width*2+2] ];
    const tTetromino = [ [1, width, width+1, width+2], [1, width+1, width+2, width*2+1], [width, width+1, width+2, width*2+1], [1, width, width+1, width*2+1] ];
    const oTetromino = [ [0, 1, width, width+1], [0, 1, width, width+1], [0, 1, width, width+1], [0, 1, width, width+1] ];
    const iTetromino = [ [1, width+1, width*2+1, width*3+1], [width, width+1, width+2, width+3], [1, width+1, width*2+1, width*3+1], [width, width+1, width+2, width+3] ];
    const sTetromino = [ [width, width+1, 1, 2], [1, width+1, width*2, width*2+1], [width, width+1, 1, 2], [1, width+1, width*2, width*2+1] ];
    const zTetromino = [ [0, width, width+1, width*2+1], [width+1, width+2, width*2, width*2+1], [0, width, width+1, width*2+1], [width+1, width+2, width*2, width*2+1] ];

    const theTetrominoes = [lTetromino, jTetromino, tTetromino, oTetromino, iTetromino, sTetromino, zTetromino];
    const classNames = ['tetromino-0', 'tetromino-1', 'tetromino-2', 'tetromino-3', 'tetromino-4', 'tetromino-5', 'tetromino-6'];
    
    // Bentuk untuk tampilan preview (posisi di grid 4x4)
    const displayShapes = [
        [1, nextWidth + 1, nextWidth * 2 + 1, 2], 
        [1, nextWidth + 1, nextWidth * 2 + 1, 0], 
        [1, nextWidth, nextWidth + 1, nextWidth + 2], 
        [0, 1, nextWidth, nextWidth + 1], 
        [1, nextWidth + 1, nextWidth * 2 + 1, nextWidth * 3 + 1], 
        [nextWidth, nextWidth + 1, 1, 2], 
        [0, nextWidth, nextWidth + 1, nextWidth * 2 + 1] 
    ];

    let current = theTetrominoes[nextRandom][currentRotation];
    
    // --- 3. FUNGSI MENGGAMBAR & MENGHAPUS BALOK ---
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('block', classNames[currentRandom]);
        });
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('block', ...classNames);
        });
    }

    // --- 4. NEXT BLOCK PREVIEW ---
    function displayNext() {
        nextSquares.forEach(square => {
            square.classList.remove('block', ...classNames); 
        });
        
        const shape = displayShapes[nextRandom];
        const className = classNames[nextRandom];

        shape.forEach(index => {
            nextSquares[index].classList.add('block', className);
        });
    }

    // --- 5. FUNGSI JATUH & MEMBEKUKAN BALOK ---
    function moveDown() {
        if (!timerId) return;
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }
    
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken', classNames[currentRandom]));
            
            // Atur balok berikutnya
            currentRandom = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            currentRotation = 0;
            currentPosition = 4;
            current = theTetrominoes[currentRandom][currentRotation];

            draw();
            displayNext(); 
            addScore(); 
            gameOver(); 
        }
    }

    // --- 6. FUNGSI GERAK KIRI, KANAN, & ROTASI ---
    function moveLeft() {
        if (!timerId) return;
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        const isBlocked = current.some(index => squares[currentPosition + index - 1].classList.contains('taken'));

        if (!isAtLeftEdge && !isBlocked) {
            currentPosition -= 1;
        }
        draw();
    }

    function moveRight() {
        if (!timerId) return;
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        const isBlocked = current.some(index => squares[currentPosition + index + 1].classList.contains('taken'));

        if (!isAtRightEdge && !isBlocked) {
            currentPosition += 1;
        }
        draw();
    }
    
    function rotate() {
        if (!timerId) return;
        undraw();
        currentRotation++;
        if(currentRotation === current.length) { 
            currentRotation = 0;
        }
        current = theTetrominoes[currentRandom][currentRotation];
        
        // Wall Kick Sederhana
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if (isAtLeftEdge && isAtRightEdge) {
            currentRotation--;
            if (currentRotation < 0) currentRotation = current.length - 1;
            current = theTetrominoes[currentRandom][currentRotation];
        }

        draw();
    }

    // --- 7. FUNGSI HAPUS BARIS & TAMBAH SCORE (Difficulty Scaling) ---
    function addScore() {
        let linesCleared = 0;

        for (let i = 0; i < width * height; i += width) {
            const row = [];
            for (let j = 0; j < width; j++) {
                row.push(i + j);
            }
            
            const isFull = row.every(index => squares[index].classList.contains('taken'));

            if (isFull) {
                linesCleared++;
                
                // Hapus kelas dari baris penuh
                row.forEach(index => {
                    squares[index].classList.remove('taken', 'block', ...classNames);
                });
                
                // Pindahkan baris di atasnya ke bawah
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => gridContainer.appendChild(cell));
            }
        }
        
        if (linesCleared > 0) {
            const scoreMultiplier = [0, 100, 300, 500, 800];
            score += scoreMultiplier[linesCleared];
            scoreDisplay.innerHTML = score;
            
            // TINGKATKAN KESULITAN (Speed Scaling)
            if (score % 500 === 0 && dropInterval > 200) { 
                dropInterval -= 50; 
                clearInterval(timerId);
                timerId = setInterval(moveDown, dropInterval);
            }
        }
    }

    // --- 8. FUNGSI GAME OVER ---
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = `GAME OVER! Score Akhir: ${score}`;
            clearInterval(timerId); 
            timerId = null;
            startButton.textContent = 'Mulai Baru';
            document.removeEventListener('keydown', control);
        }
    }

    // --- 9. KONTROL GERAKAN (Keyboard & Tombol HP) ---
    function control(e) {
        if (!timerId) return;
        if (e.keyCode === 37) moveLeft();
        else if (e.keyCode === 38) rotate();
        else if (e.keyCode === 39) moveRight();
        else if (e.keyCode === 40) moveDown();
    }
    document.addEventListener('keydown', control); 

    // Hubungkan Tombol HP menggunakan touchstart
    leftButton.addEventListener('touchstart', moveLeft);
    rightButton.addEventListener('touchstart', moveRight);
    rotateButton.addEventListener('touchstart', rotate);
    downButton.addEventListener('touchstart', moveDown);

    // --- 10. START/PAUSE GAME LOGIC ---
    startButton.addEventListener('click', () => {
        if (scoreDisplay.innerHTML.includes('GAME OVER')) {
            window.location.reload(); 
            return;
        }

        if (timerId) {
            clearInterval(timerId); 
            timerId = null;
            startButton.textContent = 'Lanjut';
        } else {
            // Game Loop Start
            timerId = setInterval(moveDown, dropInterval); 
            startButton.textContent = 'Jeda';
            draw();
            displayNext(); 
        }
    });

    // Tampilkan balok berikutnya saat halaman dimuat
    displayNext();
});
