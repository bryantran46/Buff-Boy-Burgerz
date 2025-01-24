import { Order } from './dashboard_config.js';
import { Dashboard } from './dashboard.js';

// Connect to the WebSocket server
const socket = io();
let dashboard: Dashboard;

socket.on('refresh', (orders: Order[] ) => {
    dashboard = new Dashboard(socket, orders);
});

// // Listen for 'new' events from the server
socket.on('newOrder', (order: Order ) => {
    console.log('New data received:', order);
    dashboard.addOrder(order.id, order);
});

// Debug connection events
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});