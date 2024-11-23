interface FoodItem {
    name: string;
    price: number;
    image: string;
    quantity: number;
}

const menuItems: Record<string, FoodItem> = {
    combo: { name: "Combo", price: 10, image: "./logo.png", quantity: 0 },
    burger: { name: "Classic Smash Burger", price: 8, image: "./burger.png", quantity: 0 },
    cola: { name: "Cola", price: 2, image: "./pepsi.png", quantity: 0 },
    chips: { name: "Chips", price: 1, image: "./doritos.png", quantity: 0 },
};

let cart: Record<string, FoodItem> = {};
let subtotal = 0;
let discounts = 0;
let tip = 0;
let total = 0;

function add(itemId: string) {
    if (!cart[itemId]) {
        cart[itemId] = { ...menuItems[itemId], quantity: 0 }; // Prevent unintended mutations
    }
    cart[itemId].quantity++;
    subtotal += cart[itemId].price;
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
    subtotal += (newQuantity - oldQuantity) * price;
    calculateTotal();
}

function remove(itemId: string) {
    delete cart[itemId];
    const row = getRowById(itemId);
    if (row) row.remove();
}

function clear() {
    cart = {};
    const receiptTableBody = document.getElementById("receipt-table-body")!;
    receiptTableBody.replaceChildren(); // Clear all rows
    subtotal = 0;
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
    total = subtotal + tip - discounts;
    renderTotal();
}

function renderTotal() {
    document.getElementById("subtotal-field")!.innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById("discounts-field")!.innerText = `$${discounts.toFixed(2)}`;
    document.getElementById("tip-field")!.innerText = `$${tip.toFixed(2)}`;
    document.getElementById("total-field")!.innerText = `$${total.toFixed(2)}`;
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
