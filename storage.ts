export function saveToStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
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