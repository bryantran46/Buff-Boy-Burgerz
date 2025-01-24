export class DashboardDisplay {
    idToRow;
    progressTable;
    queueTable;
    dashboard;
    socket;
    constructor(dashboard, socket) {
        this.idToRow = new Map();
        this.progressTable = document.querySelector(`#in-progress-table tbody`);
        this.queueTable = document.querySelector(`#queue-table tbody`);
        this.initializeProgressTableFinishButton();
        this.dashboard = dashboard;
        this.socket = socket;
    }
    initializeProgressTableFinishButton() {
        document.querySelector("#in-progress-table .transaction-header-cell button").addEventListener("click", () => {
            this.dashboard.clearProgressOrders();
        });
    }
    displayOrders(progressOrders, queueOrders) {
        this.addOrdersToTable(this.progressTable, progressOrders);
        this.addOrdersToTable(this.queueTable, queueOrders);
    }
    addOrdersToTable(table, orders) {
        if (table !== null) {
            orders.forEach((order, id) => {
                this.addOrderToTable(table, id, order);
            });
        }
        else {
            console.error("Table body not found");
        }
    }
    addOrderToProgressTable(id, order) {
        this.addOrderToTable(this.progressTable, id, order);
    }
    addOrderToQueueTable(id, order) {
        this.addOrderToTable(this.queueTable, id, order);
    }
    addOrderToTable(table, id, order) {
        const row = document.createElement("tr");
        this.idToRow.set(id, row);
        row.innerHTML = `
            <td class="transaction-cell">
                <div class="transaction-name">${order.name}</div>
                <div class="transaction-order">${order.cartSummary}</div>
                <div class="transaction-price">$${order.total.toFixed(2)}</div>
                <div class="transaction-time">${order.time}</div>
                <img src="/static/images/${order.paymentType}.svg">
                <button class="transaction-button">Finish</button>
            </td>
        `;
        const transactionButton = row.querySelector(".transaction-button");
        transactionButton.addEventListener("click", () => {
            table.removeChild(row);
            this.idToRow.delete(id);
            this.dashboard.removeOrder(id);
            this.socket.emit("orderComplete", id);
        });
        table.appendChild(row);
    }
    clearProgressTable(ids) {
        this.progressTable.innerHTML = "";
        for (const id of ids) {
            this.idToRow.delete(id);
        }
    }
    removeOrderFromTable(id) {
        const row = this.idToRow.get(id);
        if (row) {
            row.remove();
        }
        this.idToRow.delete(id);
    }
}
