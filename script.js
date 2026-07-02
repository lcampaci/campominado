// ================================
// CAMPO MINADO WINDOWS 98
// Parte 3.1
// ================================

const BEGINNER = {
    rows: 9,
    cols: 9,
    mines: 10
};

class Cell {

    constructor(row, col) {

        this.row = row;
        this.col = col;

        this.mine = false;
        this.open = false;
        this.flag = false;

        this.number = 0;

        this.element = document.createElement("div");
        this.element.className = "cell";
    }

}


const DIFFICULTIES = {

    beginner: { rows: 9, cols: 9, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 }

};

class Game {

    constructor(config) {

        this.rows = config.rows;
        this.cols = config.cols;
        this.totalMines = config.mines;

        this.board = [];

        this.firstClick = true;

        this.started = false;

        this.boardElement = document.getElementById("board");

        this.face = document.getElementById("face");

        this.mineCounter = document.getElementById("mineCounter");

        this.timer = document.getElementById("timer");

        this.face.onclick = () => this.restart();

        this.createBoard();

    }
	
	setDifficulty(level) {

		const config = DIFFICULTIES[level];

		this.rows = config.rows;
		this.cols = config.cols;
		this.totalMines = config.mines;

		this.restart();
	}

    restart() {

        clearInterval(this.interval);

        this.board = [];

        this.firstClick = true;

        this.started = false;

        this.seconds = 0;

        this.timer.textContent = "000";

        this.mineCounter.textContent =
            String(this.totalMines).padStart(3, "0");

        this.setFace("normal");

        this.createBoard();

    }

    createBoard() {

        this.boardElement.innerHTML = "";

        this.boardElement.style.gridTemplateColumns =
            `repeat(${this.cols},24px)`;

        this.board = [];

        for (let r = 0; r < this.rows; r++) {

            let line = [];

            for (let c = 0; c < this.cols; c++) {

                const cell = new Cell(r, c);

                this.installEvents(cell);

                line.push(cell);

                this.boardElement.appendChild(cell.element);

            }

            this.board.push(line);

        }

    }

    installEvents(cell) {

    let mouseDown = false;

    cell.element.addEventListener("click", () => {
        this.leftClick(cell);
    });

    cell.element.addEventListener("contextmenu", e => {
        e.preventDefault();
        this.rightClick(cell);
    });

    // 👇 pressionar
    cell.element.addEventListener("mousedown", (e) => {

        mouseDown = true;

        // botão esquerdo + direito (ou meio)
        if (e.buttons === 3) {
            this.chord(cell);
        }

        if (!cell.open)
            this.setFace("click");

    });

    cell.element.addEventListener("mouseup", () => {
        this.setFace("normal");
    });

}

    startTimer() {

    if (this.started) return;

    this.started = true;

    this.seconds = 0;

    this.interval = setInterval(() => {

        this.seconds++;

        if (this.seconds > 999)
            this.seconds = 999;

        this.timer.textContent =
            String(this.seconds).padStart(3, "0");

    }, 1000);
}

    leftClick(cell) {

        if (cell.flag) return;

        if (cell.open) return;

        if (this.firstClick) {

            this.firstClick = false;

            this.startTimer();

            this.placeMines(cell);

            this.calculateNumbers();

        }

        this.openCell(cell);

    }

    rightClick(cell) {

    if (cell.open)
        return;

    // alterna entre: vazio → bandeira
    cell.flag = !cell.flag;

    cell.element.textContent = cell.flag ? "🚩" : "";

    this.updateMineCounter();

    this.checkWin();
}

    updateMineCounter() {

    let flags = 0;

    for (let row of this.board) {

        for (let cell of row) {

            if (cell.flag)
                flags++;

        }
    }

    let value = this.totalMines - flags;

    if (value < -99)
        value = -99;

    this.mineCounter.textContent =
        String(value).padStart(3, "0");
}

    // ----------

    placeMines(firstCell) {

        // será implementado na Parte 3.2

    }

    calculateNumbers() {

        // será implementado na Parte 3.2

    }

    openCell(cell) {

        // será implementado na Parte 3.2

    }
	
	getNeighbors(cell) {

    const list = [];

    for (let dr = -1; dr <= 1; dr++) {

        for (let dc = -1; dc <= 1; dc++) {

            if (dr === 0 && dc === 0)
                continue;

            const nr = cell.row + dr;
            const nc = cell.col + dc;

            if (
                nr >= 0 &&
                nr < this.rows &&
                nc >= 0 &&
                nc < this.cols
            ) {

                list.push(this.board[nr][nc]);

            }

        }

    }

    return list;

}

// Coloca as minas evitando o primeiro clique
placeMines(firstCell) {

    let minesPlaced = 0;

    while (minesPlaced < this.totalMines) {

        const r = Math.floor(Math.random() * this.rows);
        const c = Math.floor(Math.random() * this.cols);

        const cell = this.board[r][c];

        if (cell.mine)
            continue;

        // nunca colocar na primeira casa clicada
        if (cell === firstCell)
            continue;

        // opcional: também evita colocar nas 8 casas ao redor,
        // deixando o início parecido com o Campo Minado moderno.
        if (this.getNeighbors(firstCell).includes(cell))
            continue;

        cell.mine = true;

        minesPlaced++;

    }

}


// ================================
// PARTE 3.2B
// Calcula os números
// ================================

calculateNumbers() {

    for (let r = 0; r < this.rows; r++) {

        for (let c = 0; c < this.cols; c++) {

            const cell = this.board[r][c];

            if (cell.mine)
                continue;

            let total = 0;

            const neighbors = this.getNeighbors(cell);

            for (const neighbor of neighbors) {

                if (neighbor.mine)
                    total++;

            }

            cell.number = total;

        }

    }

}

revealAllMines() {

    for (const row of this.board) {

        for (const cell of row) {

            if (cell.mine) {

                cell.element.textContent = "💣";
                cell.element.classList.add("open");

            }

        }

    }

}

gameOver() {

    clearInterval(this.interval);

    this.setFace("lose");

    this.revealAllMines();
}

checkWin() {

    let opened = 0;

    for (const row of this.board) {

        for (const cell of row) {

            if (cell.open)
                opened++;

        }

    }

    if (opened === this.rows * this.cols - this.totalMines) {

        clearInterval(this.interval);

        this.setFace("win");
	    alert("Parabéns! Você venceu!");
    }
}


// ================================
// PARTE 3.2C
// Abrir células + lógica principal
// ================================

openCell(cell) {

    if (cell.open || cell.flag)
        return;

    cell.open = true;

    cell.element.classList.add("open");

    // se for mina → game over
    if (cell.mine) {

        cell.element.textContent = "💣";
        cell.element.classList.add("exploded");

        this.gameOver();

        return;
    }

    // se tiver número, mostra ele
    if (cell.number > 0) {

        cell.element.textContent = cell.number;
        cell.element.classList.add("n" + cell.number);

    } else {

        // célula vazia → abre vizinhos automaticamente
        const neighbors = this.getNeighbors(cell);

        for (const neighbor of neighbors) {

            if (!neighbor.open) {

                this.openCell(neighbor);

            }

        }

    }

    // checa vitória após cada abertura
    this.checkWin();

}


chord(cell) {

    if (!cell.open)
        return;

    const neighbors = this.getNeighbors(cell);

    let flagged = 0;

    for (const n of neighbors) {

        if (n.flag)
            flagged++;

    }

    // só ativa se número bater com flags
    if (flagged !== cell.number)
        return;

    for (const n of neighbors) {

        if (!n.open && !n.flag) {

            this.openCell(n);

        }

    }

}

setFace(state) {

    switch (state) {

        case "normal":
            this.face.textContent = "🙂";
            break;

        case "click":
            this.face.textContent = "😮";
            break;

        case "win":
            this.face.textContent = "😎";
            break;

        case "lose":
            this.face.textContent = "😵";
            break;
    }
}

}

const game = new Game(DIFFICULTIES.beginner);


// ================================
// PARTE 3.2A
// ================================

// Retorna todas as células vizinhas

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then(() => console.log("Service Worker registrado"))
            .catch(err => console.error(err));
    });
}
