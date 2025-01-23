export interface Order {
    name: string; 
    cartSummary: string; 
    total: number; 
    time: string; 
    paymentType: string;
    numBurgers: number;
};

export function splitOrders(orders: Order[]): { firstList: Order[]; secondList: Order[] } {
    const firstList: Order[] = [];
    const secondList: Order[] = [];
    const maxBurgers = 4;
    let totalBurgersInFirst = 0;
    let breakIndex = -1; // Track where the loop stops

    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const burgers = order.numBurgers;

        // Caveat 1: If the first order exceeds the max, it must go in the first list
        if (firstList.length === 0 && burgers > maxBurgers) {
            firstList.push(order);
            totalBurgersInFirst += burgers;
            breakIndex = i + 1;
            break;
        }

        // Add order to firstList if it doesn't exceed the max
        if (totalBurgersInFirst + burgers < maxBurgers) {
            firstList.push(order);
            totalBurgersInFirst += burgers;
        }
        // Stop the loop early if the max is reached
        else if (totalBurgersInFirst + burgers === maxBurgers) {
            firstList.push(order);
            totalBurgersInFirst += burgers;
            breakIndex = i + 1;
            break;
        } 
        else {
            // Add the order to secondList if it exceeds the max
            secondList.push(order);
        }
    }

    // Append the remaining orders to secondList if the loop breaks early
    if (breakIndex !== -1) {
        secondList.push(...orders.slice(breakIndex));
    }

    return { firstList, secondList };
  }

export function addToTable(table: Element | null, orders: Order[]) {
    const rows = orders.map( order => `
        <tr>
            <td class="transaction-cell">
                <div class="transaction-name">${order.name}</div>
                <div class="transaction-order">${order.cartSummary}</div>
                <div class="transaction-price">$${order.total.toFixed(2)}</div>
                <div class="transaction-time">${order.time}</div>
                <img src="/static/images/${order.paymentType}.svg">
                <button class="transaction-button">Finish</button>
            </td>
        </tr>
    `).join('');

    if (table) {
        table.innerHTML = rows;
    } else {
        console.error('Table body not found');
    }
}