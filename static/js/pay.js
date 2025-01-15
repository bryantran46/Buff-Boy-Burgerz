import { loadData } from './data.js';
import { renderReceipt, renderTotal } from "./receipt.js";
import { showPopup, hidePopup } from './popup.js';
const popups = ["venmo", "zelle", "cash"];
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
document.querySelector(`#venmo-popup .paid-button`)?.addEventListener("click", async () => {
    alert('Add stuff');
});
/*

id

typescript {
    payment method
    total
    cart
}
python {
    name
    time
}
*/ 
