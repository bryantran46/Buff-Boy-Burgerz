import { setTip, saveData, loadData } from "./data.js";
import { renderReceipt, renderTotal } from "./receipt.js";
import { initializeSlider, reloadSlider } from "./slider.js";
loadData();
renderReceipt();
renderTotal();
initializeSlider();
document.querySelector(`.back-button`)?.addEventListener('click', () => {
    reloadSlider();
    window.location.href = './order';
});
document.querySelector(`.confirm-button`)?.addEventListener("click", () => {
    const newTip = parseInt(document.querySelector(".slider").value, 10);
    setTip(newTip);
    saveData();
    console.log('test');
    window.location.href = './pay';
});
