import { MAXBURGERS } from "./dashboard_config.js";
import { DashboardDisplay } from "./dashboard_display.js";
export class Dashboard {
    progressOrders;
    queueOrders;
    totalBurgersInFirst;
    dashboardDisplay;
    constructor(socket, uncompletedOrders) {
        this.progressOrders = new Map();
        this.queueOrders = new Map();
        this.totalBurgersInFirst = 0;
        this.dashboardDisplay = new DashboardDisplay(this, socket);
        this.addOrders(uncompletedOrders);
    }
    addProgressOrders(id, order) {
        this.progressOrders.set(id, order);
        this.dashboardDisplay.addOrderToProgressTable(id, order);
    }
    addQueueOrders(id, order) {
        this.queueOrders.set(id, order);
        this.dashboardDisplay.addOrderToQueueTable(id, order);
    }
    removeQueueOrders(id) {
        this.queueOrders.delete(id);
        this.dashboardDisplay.removeOrderFromTable(id);
    }
    removeProgressOrders(id) {
        this.progressOrders.delete(id);
        this.dashboardDisplay.removeOrderFromTable(id);
    }
    addOrders(orders) {
        let breakIndex = -1;
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const burgers = order.numBurgers;
            if (this.totalBurgersInFirst === 0 && burgers > MAXBURGERS) {
                this.progressOrders.set(order.id, order);
                this.totalBurgersInFirst += burgers;
                breakIndex = i + 1;
                break;
            }
            if (this.totalBurgersInFirst + burgers < MAXBURGERS) {
                this.progressOrders.set(order.id, order);
                this.totalBurgersInFirst += burgers;
            }
            else if (this.totalBurgersInFirst + burgers === MAXBURGERS) {
                this.progressOrders.set(order.id, order);
                this.totalBurgersInFirst += burgers;
                breakIndex = i + 1;
                break;
            }
            else {
                this.queueOrders.set(order.id, order);
            }
        }
        if (breakIndex !== -1) {
            orders.slice(breakIndex).forEach(order => this.queueOrders.set(order.id, order));
        }
        this.dashboardDisplay.displayOrders(this.progressOrders, this.queueOrders);
    }
    addOrder(id, order) {
        const burgers = order.numBurgers;
        if (this.totalBurgersInFirst === 0 && burgers > MAXBURGERS) {
            this.totalBurgersInFirst += burgers;
            this.addProgressOrders(id, order);
        }
        else if (this.totalBurgersInFirst + burgers <= MAXBURGERS) {
            this.totalBurgersInFirst += burgers;
            this.addProgressOrders(id, order);
        }
        else {
            this.addQueueOrders(id, order);
        }
    }
    updateInProgressOrders() {
        for (const [id, order] of structuredClone(this.queueOrders)) {
            const burgers = order.numBurgers;
            if (this.totalBurgersInFirst === 0 && burgers > MAXBURGERS) {
                this.removeQueueOrders(id);
                this.addProgressOrders(id, order);
                this.totalBurgersInFirst += burgers;
                break;
            }
            if (this.totalBurgersInFirst + burgers < MAXBURGERS) {
                this.removeQueueOrders(id);
                this.addProgressOrders(id, order);
                this.totalBurgersInFirst += burgers;
            }
            else if (this.totalBurgersInFirst + burgers === MAXBURGERS) {
                this.removeQueueOrders(id);
                this.addProgressOrders(id, order);
                this.totalBurgersInFirst += burgers;
                break;
            }
        }
    }
    removeOrder(id) {
        if (this.progressOrders.has(id)) {
            let numBurgers = this.progressOrders.get(id)?.numBurgers;
            this.totalBurgersInFirst -= numBurgers;
            this.removeProgressOrders(id);
            this.updateInProgressOrders();
        }
        else if (this.queueOrders.has(id)) {
            this.removeQueueOrders(id);
        }
    }
}
