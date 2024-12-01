import { saveToStorage, getCartFromStorage, getFieldFromStorage } from "./storage.js";
import { menuItems, cart } from "./data.js";
import * as data from './data.js';

data.setCart(getCartFromStorage());
data.setSubtotal(getFieldFromStorage("subtotal"));
data.setDiscounts(getFieldFromStorage("discounts"));
data.setTip(getFieldFromStorage("tip"));
data.setTotal(getFieldFromStorage("total"));

for (const foodItem in data.cart) {
    createRow(foodItem);
}
renderTotal();

function add(itemId: string) {
    if (!cart[itemId]) {
        cart[itemId] = { ...menuItems[itemId], quantity: 0 }; // Prevent unintended mutations
    }
    cart[itemId].quantity++;
    data.addToSubtotal(cart[itemId].price);
    calculateTotal();
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
    calculateTotal();
}

function remove(itemId: string) {
    delete cart[itemId];
    const row = getRowById(itemId);
    if (row) row.remove();
}

function clear() {
    data.emptyCart();
    const receiptTableBody = document.getElementById("receipt-table-body")!;
    receiptTableBody.replaceChildren(); // Clear all rows
    data.setSubtotal(0);
    calculateTotal();
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

function createRow(itemId: string) {
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

function getRowById(itemId: string): HTMLElement | null {
    return document.querySelector(`tr[data-id="${itemId}"]`);
}

function calculateTotal() {
    data.updateTotal();
    renderTotal();
}

function renderTotal() {
    document.getElementById("subtotal-field")!.innerText = `$${data.getSubtotal().toFixed(2)}`;
    document.getElementById("discounts-field")!.innerText = `$${data.getDiscounts().toFixed(2)}`;
    document.getElementById("tip-field")!.innerText = `$${data.getTip().toFixed(2)}`;
    document.getElementById("total-field")!.innerText = `$${data.getTotal().toFixed(2)}`;
}

function saveData() {
    saveToStorage("cart", data.cart);
    saveToStorage("subtotal", data.getSubtotal());
    saveToStorage("discounts", data.getDiscounts());
    saveToStorage("tip", data.getTip());
    saveToStorage("total", data.getTotal());
}

// Show the popup and disable main content
document.getElementById("follower-card")?.addEventListener("click", () => {
    document.getElementById("follower-popup")!.classList.remove("hidden");
    document.querySelector(".main-screen")!.classList.add("disabled");
});

document.getElementById("tip-card")?.addEventListener("click", () => {
    document.getElementById("tip-popup")!.classList.remove("hidden");
    document.querySelector(".main-screen")!.classList.add("disabled");
});

// Hide the popup and re-enable main content
document.querySelector("#follower-popup button")?.addEventListener("click", () => {
    document.getElementById("follower-popup")!.classList.add("hidden");
    document.querySelector(".main-screen")!.classList.remove("disabled");
});
document.querySelector("#tip-popup button")?.addEventListener("click", () => {
    document.getElementById("tip-popup")!.classList.add("hidden");
    document.querySelector(".main-screen")!.classList.remove("disabled");
});


const slider = document.querySelector(".slider")! as HTMLInputElement;
slider.addEventListener("input", (event) => {
    const sliderValue = document.querySelector(".value")!;
    const target = event.target as HTMLInputElement; // Cast target to HTMLInputElement
    const tempSliderValue = Number(target.value); 
    sliderValue.textContent = `$${tempSliderValue}`; 

    const max = Number(target.max); // Get max value of the slider
    const progress = (tempSliderValue / max) * 100;

    slider.style.background = `linear-gradient(to right, #30b1e6 ${progress}%, #ccc ${progress}%)`;
});

// Event listeners for the food items
document.querySelectorAll(".food-item").forEach((element) => {
    element.addEventListener("click", () => {
        const itemId = (element as HTMLElement).dataset.id;
        if (itemId) {
            add(itemId);
        }
    });
});

// Event listener for the cancel button
document.querySelector(".cancel-button")!.addEventListener("click", clear);

document.querySelector(".pay-button")!.addEventListener("click", ()=> {
    saveData();
    window.location.href = "./pay.html";
});
