import { loadData, saveData, setApplyDiscounts, cartSize } from './data.js';
import { hidePopup, showPopup } from './popup.js';
import { renderTotal, add, clear, renderReceipt } from "./receipt.js";
import { initializeToppingsPopup } from './toppings.js';

loadData();
renderReceipt();
renderTotal();

// Show the popup and disable main content
document.getElementById(`follower-card`)?.addEventListener("click", () => showPopup(`follower-popup`));
// Hide the popup and re-enable main content
document.querySelector(`#follower-popup .close-button`)?.addEventListener("click", () => hidePopup(`follower-popup`));
// Set follower discount
document.querySelector(`#follower-popup .follow-button`)?.addEventListener("click", () => 
    hidePopup(`follower-popup`, () => {
        setApplyDiscounts(true);
        saveData();
    })
);

initializeToppingsPopup();

// Event listeners for the food items
document.querySelectorAll(".food-item").forEach((element) => {
    element.addEventListener("click", () => add((element as HTMLElement).dataset.id!));
});

// Event listener for the cancel button
document.querySelector(".cancel-button")!.addEventListener("click", clear);

// Event listener for the pay button
document.querySelector(".pay-button")!.addEventListener("click", ()=> {
    if (cartSize() === 0) {
        alert('Please add items to order');
    } 
    else {
        window.location.href = "./tip";
    }
});
