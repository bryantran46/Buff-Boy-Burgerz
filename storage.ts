export function saveToStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromStorage(key: string) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

export function removeFromStorage(key: string): void {
    localStorage.removeItem(key);
}

export function getCartFromStorage<Cart>(): Cart {
    const item = localStorage.getItem("cart");
    return item ? JSON.parse(item) : {};
}

export function getCashOrderFromStorage(): any {
    const item = localStorage.getItem("cashOrder");
    return item ? JSON.parse(item) : null;
}

export function removeCashOrderPrompt(): void {
    localStorage.removeItem("cashOrder");
}

export function getNumFromStorage(key: string): number {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : 0;
}

export function getBoolFromStorage(key: string): boolean {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : false;
}