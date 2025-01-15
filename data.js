import { renderTotal } from "./receipt.js";
import { saveToStorage, getCartFromStorage, getFieldFromStorage } from "./storage.js";
export const menuItems = {
    combo: { name: "Combo", price: 10, image: "./images/combo.webp", quantity: 0 },
    burger: { name: "Classic Smash Burger", price: 8, image: "./images/burger.webp", quantity: 0 },
    cola: { name: "Cola", price: 2, image: "./images/pepsi.webp", quantity: 0 },
    chips: { name: "Chips", price: 1, image: "./images/doritos.webp", quantity: 0 },
};
export let cart = {};
let subtotal = 0;
let discounts = 0;
let tip = 0;
let total = 0;
// cart
export function emptyCart() {
    cart = {};
}
export function setCart(newCart) {
    cart = newCart;
}
export function getOrder() {
    const order = {};
    for (const item in cart) {
        order[item] = cart[item]['quantity'];
    }
    return order;
}
// subtotal
export function getSubtotal() {
    return subtotal;
}
export function setSubtotal(newSubtotal) {
    subtotal = newSubtotal;
    updateTotal();
}
export function addToSubtotal(amount) {
    subtotal += amount;
    updateTotal();
}
// discounts
export function getDiscounts() {
    return discounts;
}
export function setDiscounts(newDiscounts) {
    discounts = newDiscounts;
    updateTotal();
}
// tip
export function getTip() {
    return tip;
}
export function setTip(newTip) {
    tip = newTip;
    updateTotal();
}
// total
export function getTotal() {
    return total;
}
export function setTotal(newTotal) {
    total = newTotal;
}
export function updateTotal() {
    total = subtotal + tip - discounts;
    renderTotal();
}
export function saveData() {
    saveToStorage("cart", cart);
    saveToStorage("subtotal", subtotal);
    saveToStorage("discounts", discounts);
    saveToStorage("tip", tip);
    saveToStorage("total", total);
}
export function loadData() {
    cart = getCartFromStorage();
    subtotal = getFieldFromStorage("subtotal");
    discounts = getFieldFromStorage("discounts");
    tip = getFieldFromStorage("tip");
    total = getFieldFromStorage("total");
}
