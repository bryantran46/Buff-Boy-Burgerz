export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
export function getCartFromStorage() {
    const item = localStorage.getItem("cart");
    return item ? JSON.parse(item) : {};
}
export function getFieldFromStorage(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : 0;
}
