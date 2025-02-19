import { loadData, getTotal, getOrder, getSubtotal, getTip, getDiscounts, getNumBurgers, saveData, setTip, getSpecialInstructions } from './data.js';
import { renderReceipt, renderTotal } from "./receipt.js";
import { showPopup, hidePopup } from './popup.js';
import { displayLoadingScreen, displayResponse, displayResult } from './loader.js';

const popups = ["venmo", "zelle", "cash"];
const electronicTransactions = ["venmo", "zelle"]
// Connect to the WebSocket server
const socket = io('/kiosk');

loadData();
renderReceipt();
renderTotal();

document.querySelector(".back-button")!.addEventListener("click", () => {
    window.location.href = "./tip";
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
    document.querySelector(`#${method}-popup .confirm-button`)?.addEventListener("click", async () => {
        displayLoadingScreen();
        const orderInfo = {
            "paymentType": method, 
            "total": getTotal(), 
            "subtotal" : getSubtotal(),
            "tip" : getTip(),
            "discount" : getDiscounts(),
            "cart": getOrder(),
            "numBurgers": getNumBurgers(),
            "specialInstructions": getSpecialInstructions(),
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
    
            const status = await response.json();
            displayResult(status, method);
        } catch (error) {
            console.error("Error:", error);
            displayResponse('Failed to check payment.', `#${method}-popup`);
        }
    })
});


document.querySelector(`#cash-popup .confirm-button`)?.addEventListener("click", async () => {
    const nameField = document.querySelector('.name-field') as HTMLInputElement;
    if (!nameField) {
        console.error('Name field not found');
        return;
    }
    if (nameField.validity.valueMissing) {
        nameField.setCustomValidity("Fill this out, yo!");
        nameField.reportValidity();
    } 
    else if (nameField.validity.patternMismatch) {
        nameField.setCustomValidity("Only letters, yo!");
        nameField.reportValidity();
    }
    else {
        displayLoadingScreen();
        const name = nameField.value;
        const orderInfo = {
            'name': name,
            'paymentType': 'cash', 
            'total': getTotal(), 
            'subtotal': getSubtotal(),
            'tip': getTip(),
            'discount': getDiscounts(),
            'cart': getOrder(),
            'numBurgers': getNumBurgers(),
            "specialInstructions": getSpecialInstructions(),
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

            const status = await response.json();
            displayResult(status, 'cash');
        } catch (error) {
            console.error("Error:", error);
            displayResponse('Failed to check payment.', `#cash-popup`);
        }
    }
});

window.addEventListener('keydown',function(e) {
    if (e.key === 'Enter') {
        if (e.target && (e.target as Element).nodeName == 'INPUT' && (e.target as HTMLInputElement).type == 'text') {
            e.preventDefault();
            (e.target as HTMLElement).blur();
            return false;
        }
    }
}, true);


// Debug connection events
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});

socket.on('order-finished', () => {
    console.log('Order finished');
    window.location.href = '/end';
});

socket.on('decline-cash-order', (status: any) => {
    displayResult(status, 'cash');
});