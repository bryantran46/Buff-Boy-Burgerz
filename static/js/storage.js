export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
export function loadFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
export function getCartFromStorage() {
    const item = localStorage.getItem("cart");
    return item ? JSON.parse(item) : {};
}
export function getCashOrderFromStorage() {
    const item = localStorage.getItem("cashOrder");
    return item ? JSON.parse(item) : null;
}
export function removeCashOrderPrompt() {
    localStorage.removeItem("cashOrder");
}
export function getNumFromStorage(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : 0;
}
export function getBoolFromStorage(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : false;
}
