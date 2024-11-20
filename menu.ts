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

function add(itemId: string) {
    if (!cart[itemId]) {
        cart[itemId] = { ...menuItems[itemId], quantity: 0 }; // Prevent unintended mutations
    }
    cart[itemId].quantity++;
    updateOrCreateRow(itemId);
}

function updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity === 0) {
        remove(itemId);
    } else {
        cart[itemId].quantity = newQuantity;
        updateRow(itemId);
    }
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
