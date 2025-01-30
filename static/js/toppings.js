// import { getNumBurgers } from "./data.js";
// import { hidePopup, showPopup } from "./popup.js";
// import { saveToStorage } from "./storage.js";
// const toppingCard = document.getElementById("toppings-card");
// const burgerFormsContainer = document.getElementById("burger-forms");
// const resultDisplay = burgerFormsContainer?.querySelector("#result");
// const submitButton = burgerFormsContainer?.querySelector("#submit");
// const toppings = [
//     "Everything",
//     "Toasted Buns",
//     "Garlic Aoili",
//     "Butter-braised Onions",
//     "American Cheese",
//     "Smashed Patties",
// ];
// export function initializeToppingsPopup() {
//     toppingCard?.addEventListener("click", () => showPopup(`toppings-popup`, () => display()));
//     burgerFormsContainer?.querySelector(`.close-button`)?.addEventListener("click", () => hidePopup(`toppings-popup`));
//     burgerFormsContainer?.addEventListener("change", (event) => checkboxes(event));
//     submitButton?.addEventListener("click", () => submit());
// }
// function saveCheckboxState() {
//     const states: { [key: string]: boolean } = {};
//     const checkboxes = document.querySelectorAll(".topping");
//     checkboxes.forEach(cb => {
//         states[cb.id] = (cb as HTMLInputElement).checked;
//     });
//     saveToStorage("checkboxState", states);
// }
// function display() {
//     const numBurgers = getNumBurgers();
//     // Create forms for each burger
//     for (let i = 1; i <= numBurgers; i++) {
//         const form = document.createElement("form");
//         form.id = `burger-${i}`;
//         form.innerHTML = `<h3>Burger ${i}</h3>`;
//         toppings.forEach((topping, index) => {
//             form.innerHTML += `
//                 <input type="checkbox" id="burger-${i}-topping-${index + 1}" class="topping" data-burger="${i}" data-topping="${topping}" checked>
//                 <label for="burger-${i}-topping-${index + 1}">${topping}</label><br>
//             `;
//         });
//         if (burgerFormsContainer) {
//             burgerFormsContainer.appendChild(form);
//         }
//     }
// }
// export function checkboxes(event: any) {
//     // Add event listeners to handle "Everything" checkbox logic
//     const target = event.target as HTMLElement;
//     if (target && target.classList.contains("topping")) {
//         const burgerId = target.dataset.burger;
//         const toppingName = target.dataset.topping;
//         const form = document.getElementById(`burger-${burgerId}`);
//         if (!form) return;
//         const checkboxes = form.querySelectorAll(".topping");
//         const everythingCheckbox = Array.from(checkboxes).find(cb => (cb as HTMLInputElement).dataset.topping === "Everything") as HTMLInputElement;
//         if (toppingName === "Everything") {
//             // If "Everything" is checked/unchecked, sync all checkboxes
//             checkboxes.forEach(cb => (cb as HTMLInputElement).checked = everythingCheckbox.checked);
//         } else {
//             // If any topping other than "Everything" is unchecked, uncheck "Everything"
//             if (!(target as HTMLInputElement).checked) everythingCheckbox.checked = false;
//             // If all toppings except "Everything" are checked, check "Everything"
//             const allChecked = Array.from(checkboxes)
//                 .filter(cb => (cb as HTMLInputElement).dataset.topping !== "Everything")
//                 .every(cb => (cb as HTMLInputElement).checked);
//             if (allChecked) everythingCheckbox.checked = true;
//         }
//     }
// }
// // Handle submit button click
// function submit() {
//     const numBurgers = getNumBurgers();
//     let result = "";
//     for (let i = 1; i <= numBurgers; i++) {
//         const form = document.getElementById(`burger-${i}`);
//         if (!form) return;
//         const checkboxes = form.querySelectorAll(".topping");
//         const everythingCheckbox = Array.from(checkboxes).find(cb => (cb as HTMLInputElement).dataset.topping === "Everything") as HTMLInputElement;
//         const everythingChecked = everythingCheckbox ? everythingCheckbox.checked : false;
//         if (!everythingChecked) {
//             const uncheckedToppings = Array.from(checkboxes)
//                 .filter(cb => !(cb as HTMLInputElement).checked && (cb as HTMLInputElement).dataset.topping !== "Everything")
//                 .map(cb => (cb as HTMLInputElement).dataset.topping);
//             if (uncheckedToppings.length > 0) {
//                 result += `Burger ${i}: no ${uncheckedToppings.join(", ")}\n`;
//             }
//         }
//     }
//     if (resultDisplay) {
//         resultDisplay.textContent = result || "All burgers have all toppings selected.";
//     }
// }
import { getNumBurgers } from "./data.js";
import { hidePopup, showPopup } from "./popup.js";
import { saveToStorage, loadFromStorage } from "./storage.js";
const toppingCard = document.getElementById("toppings-card");
const toppingsPopup = document.getElementById("toppings-popup");
const burgerFormsContainer = document.getElementById("burger-forms");
const resultDisplay = toppingsPopup?.querySelector("#result");
const submitButton = toppingsPopup?.querySelector("#submit");
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
    Object.entries(states).forEach(([id, checked]) => {
        const checkbox = document.getElementById(id);
        if (checkbox)
            checkbox.checked = checked;
    });
}
/**
 * Saves all checkbox states to storage.
 */
function saveCheckboxState() {
    const states = {};
    const checkboxes = document.querySelectorAll(".topping");
    checkboxes.forEach(cb => {
        states[cb.id] = cb.checked;
    });
    saveToStorage("checkboxState", states);
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
