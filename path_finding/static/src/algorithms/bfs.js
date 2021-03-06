const BaseAlgorithm = require('./base_algorithm');
const Queue = require('../utils/queue');

class BFS extends BaseAlgorithm {
    async run(callback) {
        const startNode = this.grid.getStartNode();
        startNode.totalCost = 0;
        const queue = new Queue();
        queue.push(startNode);

        while (!queue.isEmpty()) {
            const node = queue.pop();
            await this.visit(node);

            if (node.isEndNode()) {
                break;
            }

            for (let i = 0; i < this.dr.length; i++) {
                const row = node.row + this.dr[i];
                const col = node.col + this.dc[i];

                if (this.grid.isInvalidSpace(row, col)) {
                    continue;
                }

                const child = this.grid.getNode(row, col);
                const cost = node.totalCost + child.weight;
                if (child.totalCost > cost) {
                    await this.visiting(child, cost, node);
                    queue.push(child);
                }
            }
        }

        callback(this.grid.getEndNode().totalCost);
    }

    async visiting(node, cost, prevNode) {
        node.totalCost = cost;
        node.prev = prevNode;
        await super.visiting(node);
    }
}

module.exports = BFS;
