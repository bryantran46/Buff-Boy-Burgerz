import { getTip } from './data.js';
const slider = document.querySelector(".slider");
const sliderValue = document.querySelector(".value");
const max = Number(slider.max);
export function getSlider() {
    return slider;
}
export function initializeSlider() {
    // Set initial slider values
    reloadSlider();
    // Add event listener for slider input
    slider.addEventListener("input", (event) => {
        const target = event.target; // Cast target to HTMLInputElement
        const tempSliderValue = Number(target.value);
        sliderValue.textContent = `$${tempSliderValue}`;
        // Update slider progress bar
        const progress = (tempSliderValue / max) * 100;
        slider.style.background = `linear-gradient(to right, #30b1e6 ${progress}%, #ccc ${progress}%)`;
    });
}
export function reloadSlider() {
    // Update slider visuals based on the current tip
    slider.value = getTip().toString();
    sliderValue.textContent = `$${getTip()}`;
    const progress = (getTip() / max) * 100;
    slider.style.background = `linear-gradient(to right, #30b1e6 ${progress}%, #ccc ${progress}%)`;
}
