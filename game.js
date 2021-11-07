class Game {
    constructor() {
        this.n = 3;
        this.grid = this.make2dArray(this.n);
        this.players = ["X", "O"];
        this.player = this.players[0];
        this.scores = [0, 0];
        this.scoreElements = [...document.querySelectorAll(".score")];
        this.cells = document.querySelectorAll(".cell");
        this.playable = true;
        this.switchTurn = this.switchTurn.bind(this);
        this.render = this.render.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeys = this.handleKeys.bind(this);
        this.reset = this.reset.bind(this);
        this.checkWinner = this.checkWinner.bind(this);
        this.weHaveAWinner = this.weHaveAWinner.bind(this);
        this.checkTie = this.checkTie.bind(this);
        this.cells.forEach(
            cell => cell.addEventListener("click", this.handleClick)
        );
        document.addEventListener("keyup", this.handleKeys);
    }
    make2dArray(n) {
        let arr = [];
        for (let i = 0; i < n; i++) {
            let newArr = [];
            for (let i = 0; i < n; i++) {
                newArr.push("");
            }
            arr.push(newArr);
        }
        return arr;
    }
    render() {
        let n = this.grid.length;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const cell = document.getElementById(`${i}-${j}`);
                cell.textContent = this.grid[i][j];
            }
        }
        this.scores.forEach(
            (score, i) =>
                this.scoreElements[i].textContent = `${this.players[i]}: ${score}`
        )
        document.querySelector(".player").textContent = this.player;
    }
    switchTurn() {
        this.player = this.player === this.players[0] ? this.players[1] : this.players[0];
    }
    handleClick(event) {
        const cell = event.target;
        if (!this.playable) {
            this.reset();
            this.playable = true;    
        }
        this.checkTie();
        if (cell.textContent !== "") {
            return
        }
        const [i, j] = cell.id.split("-");
        this.grid[i][j] = this.player;
        cell.textContent = this.player;
        cell.classList.add("played");
        cell.classList.add(this.player.toLowerCase());
        this.checkWinner();
        this.switchTurn();
        this.render();
    }
    checkTie() {
        let sum = 0;
        for (let row of this.grid) {
            for (let cell of row) {
                if (cell !== "") sum++;
            }
        }
        if (sum === this.n ** 2) this.reset();
    }
    handleKeys(event) {
        if (event.key === "R" || event.key === "r") this.reset();
    }
    reset() {
        this.grid = this.make2dArray(this.n);
        this.cells.forEach(cell => {
            cell.className = "cell";
            cell.style.filter = "";
            });
        this.render();
        this.playable = true;
    }
    checkWinner() {
        let sum;
        let otherSum;
        function checkSum(g) {
            if (sum === g.n || otherSum === g.n) {
                g.weHaveAWinner();
            }
            sum = 0;
            otherSum = 0;
        }
        for (let i = 0; i < this.n; i++) {
            sum = 0;
            otherSum = 0;
            for (let j = 0; j < this.n; j++) {
                if (this.grid[i][j] === this.player) sum++;
                if (this.grid[j][i] === this.player) otherSum++;
            }
            checkSum(this);
        }
        sum = 0;
        for (let i = 0; i < this.n; i++) {
            if (this.grid[i][i] === this.player) sum++;
            if (this.grid[this.n-1-i][i] === this.player) otherSum++;
        }
        checkSum(this);
    }
    weHaveAWinner() {
        const index = this.players.indexOf(this.player);
        this.scores[index]++;
        this.render();
        this.playable = false;
        this.cells.forEach(cell => cell.style.filter = "brightness(1.5)");
    }
}
let game = new Game();
game.render();
