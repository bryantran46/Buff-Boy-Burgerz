import { loadData, saveData, setTip, setApplyDiscounts, cartSize } from './data.js';
import { hidePopup, showPopup } from './popup.js';
import { renderTotal, add, clear, renderReceipt } from "./receipt.js";
import { initializeSlider, reloadSlider } from './slider.js';
const popups = ["follower", "tip"];
loadData();
renderReceipt();
renderTotal();
// Show the popup and disable main content
popups.forEach((method) => {
    document.getElementById(`${method}-card`)?.addEventListener("click", () => showPopup(`${method}-popup`));
});
// Hide the popup and re-enable main content
document.querySelector(`#follower-popup button`)?.addEventListener("click", () => hidePopup(`follower-popup`));
document.querySelector(`#tip-popup button`)?.addEventListener("click", () => hidePopup(`tip-popup`, () => reloadSlider()));
// Set follower discount
document.querySelector(`#follower-popup .follow-button`)?.addEventListener("click", () => hidePopup(`follower-popup`, () => {
    setApplyDiscounts(true);
    saveData();
}));
// Set tip amount
document.querySelector(`#tip-popup .tip-button`)?.addEventListener("click", () => hidePopup(`tip-popup`, () => {
    const newTip = parseInt(document.querySelector(".slider").value, 10);
    setTip(newTip);
    saveData();
}));
// slider logic
initializeSlider();
// Event listeners for the food items
document.querySelectorAll(".food-item").forEach((element) => {
    element.addEventListener("click", () => add(element.dataset.id));
});
// Event listener for the cancel button
document.querySelector(".cancel-button").addEventListener("click", clear);
// Event listener for the pay button
document.querySelector(".pay-button").addEventListener("click", () => {
    if (cartSize() === 0) {
        alert('Please add items to order');
    }
    else {
        window.location.href = "./pay";
    }
});
