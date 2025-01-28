import { loadData, getTotal, getOrder, getSubtotal, getTip, getDiscounts, getNumBurgers, saveData, setTip } from './data.js';
import { renderReceipt, renderTotal } from "./receipt.js";
import { showPopup, hidePopup } from './popup.js';
import { initializeSlider, reloadSlider } from './slider.js';
const popups = ["venmo", "zelle", "cash"];
const electronicTransactions = ["venmo", "zelle"];
loadData();
renderReceipt();
renderTotal();
document.querySelector(".back-button").addEventListener("click", () => {
    window.location.href = "./order";
});
// tip/slider logic
initializeSlider();
document.getElementById(`tip-card`)?.addEventListener("click", () => showPopup(`tip-popup`));
document.querySelector(`#tip-popup .tip-button`)?.addEventListener("click", () => hidePopup(`tip-popup`, () => {
    const newTip = parseInt(document.querySelector(".slider").value, 10);
    setTip(newTip);
    saveData();
}));
document.querySelector(`#tip-popup .close-button`)?.addEventListener("click", () => hidePopup(`tip-popup`, () => reloadSlider()));
// Attach event listeners for showing popups
popups.forEach((method) => {
    document.getElementById(`${method}-card`)?.addEventListener("click", () => showPopup(`${method}-popup`));
});
// Attach event listeners for hiding popups
popups.forEach((method) => {
    document.querySelector(`#${method}-popup .close-button`)?.addEventListener("click", () => hidePopup(`${method}-popup`));
});
electronicTransactions.forEach((method) => {
    document.querySelector(`#${method}-popup .paid-button`)?.addEventListener("click", async () => {
        const orderInfo = {
            "paymentType": method,
            "total": getTotal(),
            "subtotal": getSubtotal(),
            "tip": getTip(),
            "discount": getDiscounts(),
            "cart": getOrder(),
            "numBurgers": getNumBurgers(),
        };
        try {
            const response = await fetch("/check-e-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderInfo),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            const responseMessageElement = document.querySelector(`#${method}-popup .response-message`);
            if (responseMessageElement) {
                responseMessageElement.textContent = result.message;
            }
        }
        catch (error) {
            console.error("Error:", error);
            const responseMessageElement = document.querySelector(`#${method}-popup .response-message`);
            if (responseMessageElement) {
                responseMessageElement.textContent = "Failed to check payment";
            }
        }
    });
});
document.querySelector(`#cash-popup .paid-button`)?.addEventListener("click", async () => {
    const name = document.querySelector('.name-field').value;
    const orderInfo = {
        'name': name,
        'paymentType': 'cash',
        'total': getTotal(),
        'subtotal': getSubtotal(),
        'tip': getTip(),
        'discount': getDiscounts(),
        'cart': getOrder(),
        'numBurgers': getNumBurgers(),
    };
    try {
        const response = await fetch("/check-cash-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderInfo),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const responseMessageElement = document.querySelector(`#cash-popup .response-message`);
        if (responseMessageElement) {
            responseMessageElement.textContent = result.message;
        }
    }
    catch (error) {
        console.error("Error:", error);
        const responseMessageElement = document.querySelector(`#cash-popup .response-message`);
        if (responseMessageElement) {
            responseMessageElement.textContent = "Failed to check payment";
        }
    }
});
