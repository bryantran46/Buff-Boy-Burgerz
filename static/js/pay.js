import { loadData, getTotal, getOrder } from './data.js';
import { renderReceipt, renderTotal } from "./receipt.js";
import { showPopup, hidePopup } from './popup.js';
const popups = ["venmo", "zelle", "cash"];
const electronicTransactions = ["venmo", "zelle"];
loadData();
renderReceipt();
renderTotal();
document.querySelector(".back-button").addEventListener("click", () => {
    window.location.href = "./order";
});
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
            "order": getOrder()
        };
        try {
            const response = await fetch("/check-payment", {
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
