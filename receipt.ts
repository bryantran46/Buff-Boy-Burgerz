import { menuItems, cart } from "./data.js";
import * as data from './data.js';

export function add(itemId: string) {
    if (!cart[itemId]) {
        cart[itemId] = { ...menuItems[itemId], quantity: 0 }; // Prevent unintended mutations
    }
    cart[itemId].quantity++;
    data.addToSubtotal(cart[itemId].price);
    updateOrCreateRow(itemId);
}

function updateQuantity(itemId: string, newQuantity: number) {
    const oldQuantity = cart[itemId].quantity;
    const price = cart[itemId].price;
    if (newQuantity === 0) {
        remove(itemId);
    } else {
        cart[itemId].quantity = newQuantity;
        updateRow(itemId);
    }
    data.addToSubtotal((newQuantity - oldQuantity) * price);
}

function remove(itemId: string) {
    delete cart[itemId];
    const row = getRowById(itemId);
    if (row) row.remove();
}

export function clear() {
    data.emptyCart();
    const receiptTableBody = document.getElementById("receipt-table-body")!;
    receiptTableBody.replaceChildren(); // Clear all rows
    data.setSubtotal(0);
}

function updateOrCreateRow(itemId: string) {
    const row = getRowById(itemId);
    if (row) {
        updateRow(itemId);
    } else {
        createRow(itemId);
    }
}

function updateRow(itemId: string) {
    const foodItem = cart[itemId];
    const row = getRowById(itemId);

    if (row) {
        row.querySelector(".item-quantity")!.textContent = `Quantity: ${foodItem.quantity}`;
        row.querySelector(".item-price")!.textContent = `$${(foodItem.price * foodItem.quantity).toFixed(2)}`;
    }
}

export function createRow(itemId: string) {
    const foodItem = cart[itemId];
    const receiptTableBody = document.getElementById("receipt-table-body")!;

    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", itemId);
    newRow.innerHTML = `
        <td class="receipt-cell">
            <div class="item-container">
                <img src="${foodItem.image}" alt="${foodItem.name}" class="food-image">
                <div class="item-quantity">Quantity: ${foodItem.quantity}</div>
                <button class="edit-button">Edit</button>
                <div class="item-name">${foodItem.name}</div>
                <div class="item-price">$${(foodItem.price * foodItem.quantity).toFixed(2)}</div>
            </div>
        </td>
    `;

    // Add event listener for the edit button
    const editButton = newRow.querySelector(".edit-button")!;
    editButton.addEventListener("click", () => {
        const newQuantity = parseInt(
            prompt("Enter new quantity (0 to remove):") || "0",
            10
        );
        if (!isNaN(newQuantity)) {
            updateQuantity(itemId, newQuantity);
        }
    });

    receiptTableBody.appendChild(newRow);
}

export function renderReceipt() {
    for (const foodItem in data.cart) {
        createRow(foodItem);
    }
}

function getRowById(itemId: string): HTMLElement | null {
    return document.querySelector(`tr[data-id="${itemId}"]`);
}

export function renderTotal() {
    document.getElementById("subtotal-field")!.innerText = `$${data.getSubtotal().toFixed(2)}`;
    document.getElementById("discounts-field")!.innerText = `$${data.getDiscounts().toFixed(2)}`;
    document.getElementById("tip-field")!.innerText = `$${data.getTip().toFixed(2)}`;
    document.getElementById("total-field")!.innerText = `$${data.getTotal().toFixed(2)}`;
}