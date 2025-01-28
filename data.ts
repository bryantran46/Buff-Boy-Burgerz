import { renderTotal } from "./receipt.js";
import { saveToStorage, getCartFromStorage, getNumFromStorage, getBoolFromStorage } from "./storage.js";

export interface FoodItem {
    name: string;
    price: number;
    image: string;
    quantity: number;
}
export type Cart = Record<string, FoodItem>;

export const menuItems: Record<string, FoodItem> = {
    combo: { name: "Combo", price: 10, image: "static/images/combo.webp", quantity: 0 },
    burger: { name: "Classic Smash Burger", price: 8, image: "static/images/burger.webp", quantity: 0 },
    cola: { name: "Cola", price: 2, image: "static/images/pepsi.webp", quantity: 0 },
    chips: { name: "Chips", price: 1, image: "static/images/doritos.webp", quantity: 0 },
};
export let cart: Cart = {};
let numBurgers: number = 0;
let subtotal: number = 0;
let applyDiscounts: boolean = false;
let discounts: number = 0;
let tip: number = 0;
let total: number = 0;

// cart
export function emptyCart() {
    cart = {};
}

export function setCart(newCart: Cart) {
    cart = newCart;
}

export function cartSize() {
    return Object.keys(cart).length;
}

export function getOrder() {
    const order: Record<string, number> = {};
    for (const item in cart) {
        order[item] = cart[item]['quantity'];
    }
    return order;
}

export function getNumBurgers() {
    return numBurgers;
}

export function setNumBurgers(newNumBurgers: number) {
    numBurgers = newNumBurgers;
    updateDiscounts();
}

export function addNumBurgers(quantity: number) {
    numBurgers += quantity;
    updateDiscounts();
}

// subtotal
export function getSubtotal() {
    return subtotal;
}

export function setSubtotal(newSubtotal: number) {
    subtotal = newSubtotal;
    updateTotal();
}

export function addToSubtotal(amount: number) {
    subtotal += amount;
    updateTotal();
}

export function getApplyDiscounts() {
    return applyDiscounts;
}

export function setApplyDiscounts(newApplyDiscounts: boolean) {
    applyDiscounts = newApplyDiscounts;
    updateDiscounts();
}

// discounts
export function getDiscounts() {
    return discounts;
}

export function setDiscounts(newDiscounts: number) {
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

export function setTip(newTip: number) {
    tip = newTip;
    updateTotal();
}

// total
export function getTotal() {
    return total;
}

export function setTotal(newTotal: number) {
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




