const Grid = require('./grid');
const Dijkstra = require('./algorithms/dijkstra');
const BaseAlgorithm = require('./algorithms/base_algorithm');
const DFS = require('./algorithms/dfs');
const DFSShortestPath = require('./algorithms/dfssp');
const BFS = require('./algorithms/bfs');
const AStarSearch = require('./algorithms/astar');
const GreedyBestFirstSearch = require('./algorithms/greedy-bfs');
const BidirectionalSearch = require('./algorithms/bidirectional');

class GridController {
    constructor(nRows, nCols, startRow, startCol, endRow, endCol, alg) {
        this.grid = new Grid(nRows, nCols, startRow, startCol, endRow, endCol);
        this.alg = alg;
        this.isAlgRunning = false;
        this.grid.draw();
    }

    addEventListeners() {
        this.addUpdateGridEventListener()
            .addUpdateGridEventListenerOnKeyPress()
            .addUpdateAlgorithmEventListener()
            .addRunAlgorithmEventListener()
            .addResetEventListener()
            .addResetPathButtonEventListener();
    }

    addUpdateGridEventListener() {
        document.getElementById('submitButton').addEventListener('click', () => this._handleUpdateGrid());

        return this;
    }

    addUpdateGridEventListenerOnKeyPress() {
        document
            .getElementById('dimensionsInput')
            .addEventListener('keypress', (event) => this._handleUpdateGridOnKeyPress(event));

        return this;
    }

    addRunAlgorithmEventListener() {
        document.getElementById('runButton').addEventListener('click', () => this._handleRunAlgorithm());

        return this;
    }

    addUpdateAlgorithmEventListener() {
        document.getElementById('algorithmSelect').addEventListener('change', () => this._handleUpdateAlgorithm());

        return this;
    }

    addResetEventListener() {
        document.getElementById('resetButton').addEventListener('click', () => this._handleReset());

        return this;
    }

    addResetPathButtonEventListener() {
        document.getElementById('resetPathButton').addEventListener('click', () => this._handleResetPath());

        return this;
    }

    _handleUpdateGrid() {
        this._callbackWrapper(() => {
            const [nRows, nCols] = this._parseInput(document.getElementById('dimensionsInput'));
            if (nRows > 0 && nCols > 0 && nRows * nCols > 1) {
                this.grid.reset(nRows, nCols);
                this._removeAlgorithmCompleteMessages();
            } else {
                this._handleGridInputError();
            }
        });
    }

    _handleUpdateAlgorithm() {
        this.alg = document.getElementById('algorithmSelect').value;
        document.getElementById('algorithmSelectErrorMessage').hidden = true;
        document.getElementById('algorithmSelect').className = '';
        this._displayHeuristicSelect();
    }

    _handleRunAlgorithm() {
        this._callbackWrapper(() => {
            this.isAlgRunning = true;
            this.grid.isAlgRunning = true;
            this._algorithmFromString().run((cost) => this._handleCompleteAlgorithm(cost));
        });
    }

    _handleGridInputError() {
        document.getElementById('gridErrorMessage').hidden = false;
    }

    _handleUpdateGridOnKeyPress(event) {
        this._callbackWrapper(() => {
            if (event.keyCode === 13) {
                this._handleUpdateGrid();
            } else {
                document.getElementById('gridErrorMessage').hidden = true;
            }
        });
    }

    _parseInput(element) {
        return element.value.split(',').map((value) => parseInt(value));
    }

    _algorithmFromString() {
        if (this.alg == 'dijkstra') {
            return new Dijkstra(this.grid);
        } else if (this.alg == 'dfs') {
            return new DFS(this.grid);
        } else if (this.alg == 'dfssp') {
            return new DFSShortestPath(this.grid);
        } else if (this.alg == 'bfs') {
            return new BFS(this.grid);
        } else if (this.alg == 'a*') {
            return new AStarSearch(this.grid);
        } else if (this.alg == 'greedy-bfs') {
            return new GreedyBestFirstSearch(this.grid);
        } else if (this.alg == 'bidirectional') {
            return new BidirectionalSearch(this.grid);
        } else {
            return new BaseAlgorithm(this.grid);
        }
    }

    _handleCompleteAlgorithm(cost) {
        this.grid.drawPath();
        this.isAlgRunning = false;
        this.grid.isAlgRunning = false;
        document.getElementById('algComplete').hidden = false;
        const costElement = document.getElementById('cost');
        costElement.hidden = false;
        costElement.textContent = cost;
    }

    _handleReset() {
        this._callbackWrapper(() => {
            this._removeAlgorithmCompleteMessages();
            this.grid.clear();
            this.grid.draw();
        });
    }

    _handleResetPath() {
        this._callbackWrapper(() => {
            this._removeAlgorithmCompleteMessages();
            this.grid.clearPath();
        });
    }

    _removeAlgorithmCompleteMessages() {
        document.getElementById('algComplete').hidden = true;
        document.getElementById('cost').hidden = true;
    }

    _callbackWrapper(callback) {
        if (!this.isAlgRunning) {
            callback();
        }
    }

    _displayHeuristicSelect() {
        if (
            this.alg == 'dijkstra' ||
            this.alg == 'dfs' ||
            this.alg == 'dfssp' ||
            this.alg == 'bfs' ||
            this.alg == 'bidirectional'
        ) {
            document.getElementById('heuristicSelect').hidden = true;
        } else if (this.alg == 'a*' || this.alg == 'greedy-bfs') {
            document.getElementById('heuristicSelect').hidden = false;
        }
    }
}

module.exports = GridController;
