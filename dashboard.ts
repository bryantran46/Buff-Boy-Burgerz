import { Order, MAXBURGERS } from "./dashboard_config.js";
import { DashboardDisplay } from "./dashboard_display.js";

export class Dashboard {
    progressOrders: Map<number, Order>;
    queueOrders: Map<number, Order>;
    totalBurgersInProgress: number;

    dashboardDisplay: DashboardDisplay;

    constructor(socket: SocketIOClient.Socket, uncompletedOrders: Order[]) {
        this.progressOrders = new Map();
        this.queueOrders = new Map();
        this.totalBurgersInProgress = 0;
        this.dashboardDisplay = new DashboardDisplay(this, socket);
        this.addOrders(uncompletedOrders);
    }

    private addProgressOrders(id: number, order: Order, burgers: number): void {
        this.progressOrders.set(id, order);
        this.totalBurgersInProgress += burgers;
        this.dashboardDisplay.addOrderToProgressTable(id, order);
    }

    private removeProgressOrders(id: number, burgers: number): void {
        this.progressOrders.delete(id);
        this.totalBurgersInProgress -= burgers;
        this.dashboardDisplay.removeOrderFromTable(id);
    }

    private addQueueOrders(id: number, order: Order): void {
        this.queueOrders.set(id, order);
        this.dashboardDisplay.addOrderToQueueTable(id, order);
    }

    private removeQueueOrders(id: number): void {
        this.queueOrders.delete(id);
        this.dashboardDisplay.removeOrderFromTable(id);
    }

    addOrders(orders: Order[]): void {
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
        this.dashboardDisplay.displayOrders(this.progressOrders, this.queueOrders);
    }

    addOrder(id: number, order: Order) {
        const burgers = order.numBurgers;

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
        this.progressOrders.clear();
        this.dashboardDisplay.clearProgressTable(this.progressOrders.keys());
        this.updateInProgressOrders();
    }

    removeOrder(id: number) {
        if (this.progressOrders.has(id)) {
            let numBurgers = this.progressOrders.get(id)?.numBurgers ?? 0;
            this.removeProgressOrders(id, numBurgers);
            this.updateInProgressOrders();
        } else if (this.queueOrders.has(id)) {
            this.removeQueueOrders(id);
        }
    }
}