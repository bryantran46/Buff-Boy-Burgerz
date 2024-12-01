export interface FoodItem {
    name: string;
    price: number;
    image: string;
    quantity: number;
}
export type Cart = Record<string, FoodItem>;

export const menuItems: Record<string, FoodItem> = {
    combo: { name: "Combo", price: 10, image: "./logo.png", quantity: 0 },
    burger: { name: "Classic Smash Burger", price: 8, image: "./burger.png", quantity: 0 },
    cola: { name: "Cola", price: 2, image: "./pepsi.png", quantity: 0 },
    chips: { name: "Chips", price: 1, image: "./doritos.png", quantity: 0 },
};
export let cart: Cart = {};
let subtotal: number = 0;
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

// subtotal
export function getSubtotal() {
    return subtotal;
}

export function setSubtotal(newSubtotal: number) {
    subtotal = newSubtotal;
}

export function addToSubtotal(amount: number) {
    subtotal += amount;
}

// discounts
export function getDiscounts() {
    return discounts;
}

export function setDiscounts(newDiscounts: number) {
    discounts = newDiscounts;
}

// tip
export function getTip() {
    return tip;
}

export function setTip(newTip: number) {
    tip = newTip;
}

// total
export function getTotal() {
    return total;
}

export function setTotal(newTotal: number) {
    total = newTotal;
}

export function updateTotal() {
    total = subtotal + tip - discounts;
}





