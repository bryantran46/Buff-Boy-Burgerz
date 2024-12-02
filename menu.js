import { loadData, saveData, setTip } from './data.js';
import { renderTotal, add, clear, renderReceipt } from "./receipt.js";
loadData();
renderReceipt();
renderTotal();
// Show the popup and disable main content
document.getElementById("follower-card")?.addEventListener("click", () => {
    document.getElementById("follower-popup").classList.remove("hidden");
    document.querySelector(".main-screen").classList.add("disabled");
});
document.getElementById("tip-card")?.addEventListener("click", () => {
    document.getElementById("tip-popup").classList.remove("hidden");
    document.querySelector(".main-screen").classList.add("disabled");
});
// Hide the popup and re-enable main content
document.querySelector("#follower-popup button")?.addEventListener("click", () => {
    document.getElementById("follower-popup").classList.add("hidden");
    document.querySelector(".main-screen").classList.remove("disabled");
});
document.querySelector("#tip-popup button")?.addEventListener("click", () => {
    document.getElementById("tip-popup").classList.add("hidden");
    document.querySelector(".main-screen").classList.remove("disabled");
    const newTip = parseInt(document.querySelector(".slider").value);
    setTip(newTip);
});
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
    element.addEventListener("click", () => {
        const itemId = element.dataset.id;
        if (itemId) {
            add(itemId);
        }
    });
});
// Event listener for the cancel button
document.querySelector(".cancel-button").addEventListener("click", clear);
document.querySelector(".pay-button").addEventListener("click", () => {
    saveData();
    window.location.href = "./pay.html";
});
