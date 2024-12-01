import { getCartFromStorage, getFieldFromStorage } from "./storage.js";
import * as data from './data.js';
data.setCart(getCartFromStorage());
data.setSubtotal(getFieldFromStorage("subtotal"));
data.setDiscounts(getFieldFromStorage("discounts"));
data.setTip(getFieldFromStorage("tip"));
data.setTotal(getFieldFromStorage("total"));
function createPayRow(itemId) {
    const foodItem = data.cart[itemId];
    const receiptTableBody = document.getElementById("receipt-table-body");
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", itemId);
    newRow.innerHTML = `
        <td class="receipt-cell">
            <div class="item-container">
                <img src="${foodItem.image}" alt="${foodItem.name}" class="food-image">
                <div class="item-quantity">Quantity: ${foodItem.quantity}</div>
                <div class="item-name">${foodItem.name}</div>
                <div class="item-price">$${(foodItem.price * foodItem.quantity).toFixed(2)}</div>
            </div>
        </td>
    `;
    receiptTableBody.appendChild(newRow);
}
function renderPayTotal() {
    document.getElementById("subtotal-field").innerText = `$${data.getSubtotal().toFixed(2)}`;
    document.getElementById("discounts-field").innerText = `$${data.getDiscounts().toFixed(2)}`;
    document.getElementById("tip-field").innerText = `$${data.getTip().toFixed(2)}`;
    document.getElementById("total-field").innerText = `$${data.getTotal().toFixed(2)}`;
}
document.querySelector(".back-button").addEventListener("click", () => {
    window.location.href = "./menu.html";
});
renderPayTotal();
for (const foodItem in data.cart) {
    createPayRow(foodItem);
}
