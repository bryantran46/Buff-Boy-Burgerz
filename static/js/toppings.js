import { getNumBurgers } from "./data.js";
import { hidePopup, showPopup } from "./popup.js";
import { saveToStorage, loadFromStorage, removeFromStorage } from "./storage.js";
const toppingCard = document.getElementById("toppings-card");
const toppingsPopup = document.getElementById("toppings-popup");
const burgerFormsContainer = document.getElementById("burger-forms");
const resultDisplay = toppingsPopup?.querySelector("#result");
const submitButton = toppingsPopup?.querySelector("#submit");
let states = {};
const toppings = [
    "Everything",
    "Toasted Buns",
    "Garlic Aoili",
    "Butter-braised Onions",
    "American Cheese",
    "Smashed Patties",
];
export function initializeToppingsPopup() {
    toppingCard?.addEventListener("click", () => showPopup("toppings-popup", displayForms));
    toppingsPopup?.querySelector(".close-button")?.addEventListener("click", () => hidePopup("toppings-popup"));
    burgerFormsContainer?.addEventListener("change", handleCheckboxChange);
    submitButton?.addEventListener("click", submit);
}
/**
 * Loads checkbox states from storage and applies them.
 */
function loadCheckboxState() {
    const states = loadFromStorage("checkboxState") || {};
    for (let burgerFormId in states) {
        let checkboxes = states[burgerFormId];
        for (let id in checkboxes) {
            const checkbox = document.getElementById(id);
            if (checkbox)
                checkbox.checked = checkboxes[id];
        }
    }
    ;
}
/**
 * Saves all checkbox states to storage.
 */
function saveCheckboxState() {
    const burgerForms = document.querySelectorAll(".burger-form");
    burgerForms.forEach(burgerForm => {
        const burgerFormId = burgerForm.id;
        const checkboxes = burgerForm.querySelectorAll(".topping");
        const state = {};
        checkboxes.forEach(cb => {
            state[cb.id] = cb.checked;
        });
        states[burgerFormId] = state;
    });
    saveToStorage("checkboxState", states);
}
export function updateCheckboxState(numBurgers) {
    const statesLength = Object.keys(states).length + 1;
    for (let i = numBurgers + 1; i < statesLength; i++) {
        delete states[`burger-${i}`];
    }
    saveToStorage("checkboxState", states);
}
export function delCheckboxState() {
    removeFromStorage("checkboxState");
}
/**
 * Generates and displays burger forms dynamically.
 */
function displayForms() {
    const numBurgers = getNumBurgers();
    burgerFormsContainer.innerHTML = ""; // Clear existing forms
    for (let i = 1; i <= numBurgers; i++) {
        const form = document.createElement("form");
        form.id = `burger-${i}`;
        form.className = `burger-form`;
        form.innerHTML = `<h3>Burger ${i}</h3>`;
        toppings.forEach((topping, index) => {
            form.innerHTML += `
                <input type="checkbox" id="burger-${i}-topping-${index + 1}" class="topping" data-burger="${i}" data-topping="${topping}" checked>
                <label for="burger-${i}-topping-${index + 1}">${topping}</label><br>
            `;
        });
        burgerFormsContainer.appendChild(form);
    }
    loadCheckboxState(); // Restore saved checkbox states
}
/**
 * Handles checkbox changes, including "Everything" checkbox logic.
 */
function handleCheckboxChange(event) {
    const target = event.target;
    if (!target || !target.classList.contains("topping"))
        return;
    const burgerId = target.dataset.burger;
    const form = document.getElementById(`burger-${burgerId}`);
    if (!form)
        return;
    const checkboxes = form.querySelectorAll(".topping");
    const everythingCheckbox = Array.from(checkboxes).find(cb => cb.dataset.topping === "Everything");
    updateEverythingCheckbox(target, everythingCheckbox, checkboxes);
}
/**
 * Updates "Everything" checkbox based on other toppings.
 */
function updateEverythingCheckbox(target, everythingCheckbox, checkboxes) {
    if (target.dataset.topping === "Everything") {
        // Toggle all checkboxes when "Everything" is checked/unchecked
        checkboxes.forEach(cb => (cb.checked = target.checked));
    }
    else {
        // Uncheck "Everything" if any other topping is unchecked
        if (!target.checked)
            everythingCheckbox.checked = false;
        // Check "Everything" if all toppings are checked
        const allChecked = Array.from(checkboxes)
            .filter(cb => cb.dataset.topping !== "Everything")
            .every(cb => cb.checked);
        if (allChecked)
            everythingCheckbox.checked = true;
    }
}
/**
 * Gets unchecked toppings for a given burger.
 */
function getUncheckedToppings(checkboxes) {
    return Array.from(checkboxes)
        .filter(cb => !cb.checked && cb.dataset.topping !== "Everything")
        .map(cb => cb.dataset.topping);
}
/**
 * Handles submit button click and displays selected toppings.
 */
function submit() {
    const numBurgers = getNumBurgers();
    let result = "";
    for (let i = 1; i <= numBurgers; i++) {
        const form = document.getElementById(`burger-${i}`);
        if (!form)
            return;
        const checkboxes = form.querySelectorAll(".topping");
        const everythingCheckbox = Array.from(checkboxes).find(cb => cb.dataset.topping === "Everything");
        const everythingChecked = everythingCheckbox?.checked ?? false;
        if (!everythingChecked) {
            const uncheckedToppings = getUncheckedToppings(checkboxes);
            if (uncheckedToppings.length > 0) {
                result += `Burger ${i}: no ${uncheckedToppings.join(", ")}\n`;
            }
        }
    }
    resultDisplay.textContent = result || "All burgers have all toppings selected.";
    saveCheckboxState();
    hidePopup("toppings-popup");
}
