import { MAXBURGERS } from "./dashboard_config.js";
import { DashboardDisplay } from "./dashboard_display.js";
import { saveToStorage, getNumFromStorage, getCashOrderFromStorage, removeCashOrderPrompt } from "./storage.js";
export class Dashboard {
    progressOrders;
    queueOrders;
    totalBurgersInProgress;
    totalBurgersSold;
    cashOrder;
    dashboardDisplay;
    constructor(socket, uncompletedOrders) {
        this.progressOrders = new Map();
        this.queueOrders = new Map();
        this.totalBurgersInProgress = 0;
        this.totalBurgersSold = getNumFromStorage("totalBurgersSold");
        this.cashOrder = getCashOrderFromStorage();
        this.dashboardDisplay = new DashboardDisplay(this, socket);
        this.addOrders(uncompletedOrders);
        this.cashOrderPrompt(this.cashOrder);
    }
    addProgressOrders(id, order, burgers) {
        this.progressOrders.set(id, order);
        this.totalBurgersInProgress += burgers;
        this.dashboardDisplay.addOrderToProgressTable(id, order);
    }
    removeProgressOrders(id, burgers) {
        this.progressOrders.delete(id);
        this.totalBurgersInProgress -= burgers;
        this.dashboardDisplay.removeOrderFromTable(id);
    }
    addQueueOrders(id, order) {
        this.queueOrders.set(id, order);
        this.dashboardDisplay.addOrderToQueueTable(id, order);
    }
    removeQueueOrders(id) {
        this.queueOrders.delete(id);
        this.dashboardDisplay.removeOrderFromTable(id);
    }
    addOrders(orders) {
        let breakIndex = -1;
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const burgers = order.numBurgers;
            if (this.totalBurgersInProgress === 0 && burgers > MAXBURGERS) {
                this.progressOrders.set(order.id, order);
                this.totalBurgersInProgress += burgers;
                breakIndex = i + 1;
                break;
            }
            if (this.totalBurgersInProgress + burgers < MAXBURGERS) {
                this.progressOrders.set(order.id, order);
                this.totalBurgersInProgress += burgers;
            }
            else if (this.totalBurgersInProgress + burgers === MAXBURGERS) {
                this.progressOrders.set(order.id, order);
                this.totalBurgersInProgress += burgers;
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
        this.dashboardDisplay.display(this.progressOrders, this.queueOrders, this.totalBurgersSold);
    }
    cashOrderPrompt(order) {
        if (order !== null) {
            saveToStorage('cashOrder', order);
            console.log(typeof order);
            console.log(order);
            this.dashboardDisplay.cashOrderPrompt(order);
        }
    }
    deleteCashOrderPrompt() {
        removeCashOrderPrompt();
    }
    addOrder(id, order) {
        const burgers = order.numBurgers;
        this.totalBurgersSold += burgers;
        saveToStorage("totalBurgersSold", this.totalBurgersSold);
        this.dashboardDisplay.updateNumBurgersSold(this.totalBurgersSold);
        if (this.totalBurgersInProgress === 0 && burgers > MAXBURGERS) {
            this.addProgressOrders(id, order, burgers);
        }
        else if (this.totalBurgersInProgress + burgers <= MAXBURGERS) {
            this.addProgressOrders(id, order, burgers);
        }
        else {
            this.addQueueOrders(id, order);
        }
    }
    updateInProgressOrders() {
        for (const [id, order] of structuredClone(this.queueOrders)) {
            const burgers = order.numBurgers;
            if (this.totalBurgersInProgress === 0 && burgers > MAXBURGERS) {
                this.removeQueueOrders(id);
                this.addProgressOrders(id, order, burgers);
                break;
            }
            if (this.totalBurgersInProgress + burgers < MAXBURGERS) {
                this.removeQueueOrders(id);
                this.addProgressOrders(id, order, burgers);
            }
            else if (this.totalBurgersInProgress + burgers === MAXBURGERS) {
                this.removeQueueOrders(id);
                this.addProgressOrders(id, order, burgers);
                break;
            }
        }
    }
    clearProgressOrders() {
        this.totalBurgersInProgress = 0;
        let progressOrderIds = Array.from(this.progressOrders.keys());
        this.progressOrders.clear();
        this.dashboardDisplay.clearProgressTable(progressOrderIds);
        this.updateInProgressOrders();
        return progressOrderIds;
    }
    removeOrder(id) {
        if (this.progressOrders.has(id)) {
            let numBurgers = this.progressOrders.get(id)?.numBurgers ?? 0;
            this.removeProgressOrders(id, numBurgers);
            this.updateInProgressOrders();
        }
        else if (this.queueOrders.has(id)) {
            this.removeQueueOrders(id);
        }
    }
}
