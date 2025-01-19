export function saveToStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getCartFromStorage<Cart>(): Cart {
    const item = localStorage.getItem("cart");
    return item ? JSON.parse(item) : {};
}

export function getNumFromStorage(key: string): number {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : 0;
}

export function getBoolFromStorage(key: string): boolean {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : false;
}