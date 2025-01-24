import { Dashboard } from "./dashboard.js";
import { Order } from "./dashboard_config.js";

export class DashboardDisplay {
    idToRow: Map<number, Element>;
    progressTable: Element;
    queueTable: Element;
    
    dashboard: Dashboard;
    socket: SocketIOClient.Socket;

    constructor(dashboard: Dashboard, socket: SocketIOClient.Socket) {
        this.idToRow = new Map();
        this.progressTable = document.querySelector(`#in-progress-table tbody`)!;
        this.queueTable = document.querySelector(`#queue-table tbody`)!;
        
        this.dashboard = dashboard;
        this.socket = socket;
    }

    displayOrders(progressOrders: Map<number, Order>, queueOrders: Map<number, Order>) {
        this.addOrdersToTable(this.progressTable, progressOrders);
        this.addOrdersToTable(this.queueTable, queueOrders);
    }

    addOrdersToTable(table: Element | null, orders: Map<number, Order>) {
        if (table !== null) {
            orders.forEach((order, id) => {
                this.addOrderToTable(table, id, order);
            });
        } else {
            console.error("Table body not found");
        }
    }

    addOrderToProgressTable(id: number, order: Order) {
        this.addOrderToTable(this.progressTable, id, order);
    }

    addOrderToQueueTable(id: number, order: Order) {
        this.addOrderToTable(this.queueTable, id, order);
    }

    addOrderToTable(table: Element, id: number, order: Order) {
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

        const transactionButton = row.querySelector(".transaction-button")!;
        transactionButton.addEventListener("click", () => {
            table.removeChild(row);
            this.idToRow.delete(id);
            
            this.dashboard.removeOrder(id);
            this.socket.emit("orderComplete", id);
        });

        table.appendChild(row);
    }

    removeOrderFromTable(id: number) {
        const row = this.idToRow.get(id);
        if (row) {
            row.remove();
        }
        this.idToRow.delete(id);
    }
}