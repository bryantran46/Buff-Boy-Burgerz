export const menuItems = {
    combo: { name: "Combo", price: 10, image: "./logo.png", quantity: 0 },
    burger: { name: "Classic Smash Burger", price: 8, image: "./burger.png", quantity: 0 },
    cola: { name: "Cola", price: 2, image: "./pepsi.png", quantity: 0 },
    chips: { name: "Chips", price: 1, image: "./doritos.png", quantity: 0 },
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
// subtotal
export function getSubtotal() {
    return subtotal;
}
export function setSubtotal(newSubtotal) {
    subtotal = newSubtotal;
}
export function addToSubtotal(amount) {
    subtotal += amount;
}
// discounts
export function getDiscounts() {
    return discounts;
}
export function setDiscounts(newDiscounts) {
    discounts = newDiscounts;
}
// tip
export function getTip() {
    return tip;
}
export function setTip(newTip) {
    tip = newTip;
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
}
