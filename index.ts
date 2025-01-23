import { Order, splitOrders, addToTable } from "./dashboard.js";

// Connect to the WebSocket server
const socket = io();
let uncompletedOrders;
let inProgressOrders: Order[] = [];
let inQueueOrders: Order[] = [];

socket.on('refresh', (orders: Order[] ) => {
    uncompletedOrders = splitOrders(orders);
    inProgressOrders = uncompletedOrders.firstList;
    inQueueOrders = uncompletedOrders.secondList;

    // Dynamically add a new row to the in progress table
    const inProgressTable = document.querySelector(`#in-progress-table tbody`);
    addToTable(inProgressTable, inProgressOrders);

    // Dynamically add a new row to the in queue table
    const queueTable = document.querySelector(`#queue-table tbody`);
    addToTable(queueTable, inQueueOrders);
});

// // Listen for 'new' events from the server
socket.on('newOrder', (order: Order ) => {
    console.log('New data received:', order);
    console.log(order.name)

    // Dynamically add a new row to the table
    const tableBody = document.querySelector(`#in-progress-table tbody`);

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td class="transaction-cell">
            <div class="transaction-name">${order.name}</div>
            <div class="transaction-order">${order.cartSummary}</div>
            <div class="transaction-price">$${order.total.toFixed(2)}</div>
            <div class="transaction-time">${order.time}</div>
            <img src="/static/images/${order.paymentType}.svg">
            <button class="transaction-button">Finish</button>
        </td>
    `;
    if (tableBody) {
        tableBody.appendChild(newRow);
    } else {
        console.error('Table body not found');
    }
});

// Debug connection events
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});