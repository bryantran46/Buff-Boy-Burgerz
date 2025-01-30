import { renderTotal } from "./receipt.js";
import { saveToStorage, getCartFromStorage, getNumFromStorage, getBoolFromStorage } from "./storage.js";
import { updateCheckboxState } from "./toppings.js";
export const menuItems = {
    combo: { name: "Combo", price: 10, image: "static/images/combo.webp", quantity: 0 },
    burger: { name: "Classic Smash Burger", price: 8, image: "static/images/burger.webp", quantity: 0 },
    cola: { name: "Cola", price: 2, image: "static/images/pepsi.webp", quantity: 0 },
    chips: { name: "Chips", price: 1, image: "static/images/doritos.webp", quantity: 0 },
};
export let cart = {};
let numBurgers = 0;
let subtotal = 0;
let applyDiscounts = false;
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
export function cartSize() {
    return Object.keys(cart).length;
}
export function getOrder() {
    const order = {};
    for (const item in cart) {
        order[item] = cart[item]['quantity'];
    }
    return order;
}
export function getNumBurgers() {
    return numBurgers;
}
export function setNumBurgers(newNumBurgers) {
    numBurgers = newNumBurgers;
    updateCheckboxState(numBurgers);
    updateDiscounts();
}
export function addNumBurgers(quantity) {
    numBurgers += quantity;
    updateCheckboxState(numBurgers);
    updateDiscounts();
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
export function getApplyDiscounts() {
    return applyDiscounts;
}
export function setApplyDiscounts(newApplyDiscounts) {
    applyDiscounts = newApplyDiscounts;
    updateDiscounts();
}
// discounts
export function getDiscounts() {
    return discounts;
}
export function setDiscounts(newDiscounts) {
    discounts = newDiscounts;
    updateTotal();
}
export function updateDiscounts() {
    if (applyDiscounts) {
        discounts = -numBurgers;
        updateTotal();
    }
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
    total = subtotal + tip + discounts;
    renderTotal();
}
export function resetData() {
    emptyCart();
    numBurgers = 0;
    subtotal = 0;
    applyDiscounts = false;
    discounts = 0;
    tip = 0;
    total = 0;
    updateCheckboxState(numBurgers);
    saveData();
    renderTotal();
}
export function saveData() {
    saveToStorage("cart", cart);
    saveToStorage("numBurgers", numBurgers);
    saveToStorage("applyDiscounts", applyDiscounts);
    saveToStorage("subtotal", subtotal);
    saveToStorage("discounts", discounts);
    saveToStorage("tip", tip);
    saveToStorage("total", total);
}
export function loadData() {
    cart = getCartFromStorage();
    numBurgers = getNumFromStorage("numBurgers");
    applyDiscounts = getBoolFromStorage("applyDiscounts");
    subtotal = getNumFromStorage("subtotal");
    discounts = getNumFromStorage("discounts");
    tip = getNumFromStorage("tip");
    total = getNumFromStorage("total");
}
