"use strict";
const menuItems = {
    combo: { name: "Combo", price: 10, image: "./logo.png", quantity: 0 },
    burger: { name: "Classic Smash Burger", price: 8, image: "./burger.png", quantity: 0 },
    cola: { name: "Cola", price: 2, image: "./pepsi.png", quantity: 0 },
    chips: { name: "Chips", price: 1, image: "./doritos.png", quantity: 0 },
};
let cart = {};
let subtotal = 0;
let discounts = 0;
let tip = 0;
let total = 0;
function add(itemId) {
    if (!cart[itemId]) {
        cart[itemId] = { ...menuItems[itemId], quantity: 0 }; // Prevent unintended mutations
    }
    cart[itemId].quantity++;
    subtotal += cart[itemId].price;
    calculateTotal();
    updateOrCreateRow(itemId);
}
function updateQuantity(itemId, newQuantity) {
    let oldQuantity = cart[itemId].quantity;
    let price = cart[itemId].price;
    if (newQuantity === 0) {
        remove(itemId);
    }
    else {
        cart[itemId].quantity = newQuantity;
        updateRow(itemId);
    }
    subtotal += (newQuantity - oldQuantity) * price;
    calculateTotal();
}
function remove(itemId) {
    delete cart[itemId];
    const row = getRowById(itemId);
    if (row)
        row.remove();
}
function clear() {
    cart = {};
    const receiptTableBody = document.getElementById("receipt-table-body");
    receiptTableBody.replaceChildren(); // Clear all rows
    subtotal = 0;
    calculateTotal();
}
function updateOrCreateRow(itemId) {
    const row = getRowById(itemId);
    if (row) {
        updateRow(itemId);
    }
    else {
        createRow(itemId);
    }
}
function updateRow(itemId) {
    const foodItem = cart[itemId];
    const row = getRowById(itemId);
    if (row) {
        row.querySelector(".item-quantity").textContent = `Quantity: ${foodItem.quantity}`;
        row.querySelector(".item-price").textContent = `$${(foodItem.price * foodItem.quantity).toFixed(2)}`;
    }
}
function createRow(itemId) {
    const foodItem = cart[itemId];
    const receiptTableBody = document.getElementById("receipt-table-body");
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
    const editButton = newRow.querySelector(".edit-button");
    editButton.addEventListener("click", () => {
        const newQuantity = parseInt(prompt("Enter new quantity (0 to remove):") || "0", 10);
        if (!isNaN(newQuantity)) {
            updateQuantity(itemId, newQuantity);
        }
    });
    receiptTableBody.appendChild(newRow);
}
function getRowById(itemId) {
    return document.querySelector(`tr[data-id="${itemId}"]`);
}
function calculateTotal() {
    total = subtotal + tip - discounts;
    renderTotal();
}
function renderTotal() {
    document.getElementById("subtotal-field").innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById("discounts-field").innerText = `$${discounts.toFixed(2)}`;
    document.getElementById("tip-field").innerText = `$${tip.toFixed(2)}`;
    document.getElementById("total-field").innerText = `$${total.toFixed(2)}`;
}
// Event listeners for the food items
document.querySelectorAll(".food-item").forEach((element) => {
    element.addEventListener("click", () => {
        const itemId = element.dataset.id;
        if (itemId) {
            add(itemId);
        }
    });
});
// Event listener for the cancel button
document.querySelector(".cancel-button").addEventListener("click", clear);
