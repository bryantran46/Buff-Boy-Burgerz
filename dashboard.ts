import { Order, MAXBURGERS } from "./dashboard_config.js";
import { DashboardDisplay } from "./dashboard_display.js";

export class Dashboard {
    progressOrders: Map<number, Order>;
    queueOrders: Map<number, Order>;
    totalBurgersInFirst: number;

    dashboardDisplay: DashboardDisplay;

    constructor(socket: SocketIOClient.Socket, uncompletedOrders: Order[]) {
        this.progressOrders = new Map();
        this.queueOrders = new Map();
        this.totalBurgersInFirst = 0;
        this.dashboardDisplay = new DashboardDisplay(this, socket);
        this.addOrders(uncompletedOrders);
    }

    private addProgressOrders(id: number, order: Order): void {
        this.progressOrders.set(id, order);
        this.dashboardDisplay.addOrderToProgressTable(id, order);
    }

    private addQueueOrders(id: number, order: Order): void {
        this.queueOrders.set(id, order);
        this.dashboardDisplay.addOrderToQueueTable(id, order);
    }

    private removeQueueOrders(id: number): void {
        this.queueOrders.delete(id);
        this.dashboardDisplay.removeOrderFromTable(id);
    }

    private removeProgressOrders(id: number): void {
        this.progressOrders.delete(id);
        this.dashboardDisplay.removeOrderFromTable(id);
    }

    addOrders(orders: Order[]): void {
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
            } else if (this.totalBurgersInFirst + burgers === MAXBURGERS) {
                this.progressOrders.set(order.id, order);
                this.totalBurgersInFirst += burgers;
                breakIndex = i + 1;
                break;
            } else {
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

        if (this.totalBurgersInFirst === 0 && burgers > MAXBURGERS) {
            this.totalBurgersInFirst += burgers;
            this.addProgressOrders(id, order);
        } else if (this.totalBurgersInFirst + burgers <= MAXBURGERS) {
            this.totalBurgersInFirst += burgers;
            this.addProgressOrders(id, order);
        } else {
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
            } else if (this.totalBurgersInFirst + burgers === MAXBURGERS) {
                this.removeQueueOrders(id);
                this.addProgressOrders(id, order);
                this.totalBurgersInFirst += burgers;                
                break;
            } 
        }
    }

    removeOrder(id: number) {
        if (this.progressOrders.has(id)) {
            let numBurgers = this.progressOrders.get(id)?.numBurgers;
            this.totalBurgersInFirst -= numBurgers!;
            this.removeProgressOrders(id);
            this.updateInProgressOrders();
        } else if (this.queueOrders.has(id)) {
            this.removeQueueOrders(id);
        }
    }
}