import { loadData, setTip } from './data.js';
import { hidePopup, showPopup } from './popup.js';
import { renderTotal, add, clear, renderReceipt } from "./receipt.js";
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
document.querySelector(`#tip-popup button`)?.addEventListener("click", () => hidePopup(`tip-popup`, () => {
    const newTip = parseInt(document.querySelector(".slider").value, 10);
    setTip(newTip);
}));
const slider = document.querySelector(".slider");
slider.addEventListener("input", (event) => {
    const sliderValue = document.querySelector(".value");
    const target = event.target; // Cast target to HTMLInputElement
    const tempSliderValue = Number(target.value);
    sliderValue.textContent = `$${tempSliderValue}`;
    const max = Number(target.max); // Get max value of the slider
    const progress = (tempSliderValue / max) * 100;
    slider.style.background = `linear-gradient(to right, #30b1e6 ${progress}%, #ccc ${progress}%)`;
});
// Event listeners for the food items
document.querySelectorAll(".food-item").forEach((element) => {
    element.addEventListener("click", () => add(element.dataset.id));
});
// Event listener for the cancel button
document.querySelector(".cancel-button").addEventListener("click", clear);
// Event listener for the pay button
document.querySelector(".pay-button").addEventListener("click", () => {
    window.location.href = "./pay.html";
});
