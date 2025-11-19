// script.js
document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button');
    const width = 10; // Lebar grid (10 kolom)
    let squares = []; // Array untuk menyimpan semua elemen div (sel)
    let score = 0;
    let timerId;
    
    // --- 1. MEMBUAT GRID ---
    function createGrid() {
        for (let i = 0; i < 200; i++) {
            const square = document.createElement('div');
            gridContainer.appendChild(square);
            squares.push(square);
        }
        // Menambahkan 10 sel 'invisible' sebagai lantai/dasar
        for (let i = 0; i < width; i++) {
            const floor = document.createElement('div');
            floor.classList.add('taken'); // Tandai sebagai sudah terisi
            gridContainer.appendChild(floor);
            squares.push(floor);
        }
    }
    
    createGrid();

    // --- 2. DEFINISI BENTUK TETRIS (Tetrominoes) ---
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];
    
    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ];
    
    // ... (Tambahkan definisi bentuk I, O, T, J, S lainnya di sini, ini hanya contoh)
    
    const theTetrominoes = [lTetromino, zTetromino /*, I, O, T, J, S ... */]; // Tambahkan semua bentuk
    
    let currentPosition = 4; // Balok dimulai dari kolom ke-5
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let currentRotation = 0;
    let current = theTetrominoes[random][currentRotation];
    
    // --- 3. FUNGSI MENGGAMBAR BALOK ---
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('block');
            // Menambahkan class warna berdasarkan index balok
            squares[currentPosition + index].classList.add(`tetromino-${random}`); 
        });
    }

    // FUNGSI MENGHAPUS BALOK
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('block');
            squares[currentPosition + index].classList.remove(`tetromino-${random}`);
        });
    }

    // --- 4. FUNGSI JATUH (GAME LOOP) ---
    function moveDown() {
        undraw();
        currentPosition += width; // Pindah ke baris di bawahnya (y+1)
        draw();
        freeze(); // Cek apakah balok harus berhenti
    }
    
    // --- 5. FUNGSI MEMBEKUKAN BALOK (Collision Detection) ---
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            
            // Mulai balok baru
            random = Math.floor(Math.random() * theTetrominoes.length);
            currentRotation = 0;
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4; 
            draw();
            // Cek Game Over
            if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
                 scoreDisplay.innerHTML = 'Game Over';
                 clearInterval(timerId); // Hentikan Game Loop
            }
        }
    }
    
    // --- 6. KONTROL GERAKAN (Kiri, Kanan, Putar) ---
    function control(e) {
        if (e.keyCode === 37) { // Kiri
            moveLeft();
        } else if (e.keyCode === 38) { // Atas (Putar)
            rotate();
        } else if (e.keyCode === 39) { // Kanan
            moveRight();
        } else if (e.keyCode === 40) { // Bawah (Jatuh Cepat)
            moveDown();
        }
    }
    
    document.addEventListener('keydown', control); // Hanya berfungsi di PC, perlu tombol di HP

    // --- 7. START/PAUSE GAME ---
    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId); // Pause
            timerId = null;
        } else {
            draw(); // Mulai menggambar balok
            timerId = setInterval(moveDown, 1000); // Game Loop: Jatuh setiap 1 detik
        }
    });

    // Panggil draw dan moveDown untuk menguji logika awal
    // draw(); // Dihilangkan, akan dipanggil saat klik Mulai
});
