import { getNumBurgers } from "./data.js";
import { hidePopup, showPopup } from "./popup.js";
import { saveToStorage, loadFromStorage, removeFromStorage } from "./storage.js";

const toppingCard = document.getElementById("toppings-card");
const toppingsPopup = document.getElementById("toppings-popup");
const burgerFormsContainer = document.getElementById("burger-forms");
const resultDisplay = toppingsPopup?.querySelector("#result");
const submitButton = toppingsPopup?.querySelector("#submit");
let states: { [key: string]: { [key: string]: boolean } } = {};

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
        let checkboxes = states[burgerFormId]
        for (let id in checkboxes) {
            const checkbox = document.getElementById(id) as HTMLInputElement;
            if (checkbox) checkbox.checked = checkboxes[id] as boolean;
        }
    };
}

/**
 * Saves all checkbox states to storage.
 */
function saveCheckboxState() {
    const burgerForms = document.querySelectorAll(".burger-form");
    burgerForms.forEach( burgerForm => {
        const burgerFormId = burgerForm.id;
        const checkboxes = burgerForm.querySelectorAll(".topping");
        const state: { [key: string]: boolean } = {};
        checkboxes.forEach(cb => {
            state[cb.id] = (cb as HTMLInputElement).checked;
        });
        states[burgerFormId] = state;
    })
    saveToStorage("checkboxState", states);
}

export function updateCheckboxState(numBurgers: number) {
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
    burgerFormsContainer!.innerHTML = ""; // Clear existing forms

    for (let i = 1; i <= numBurgers; i++) {
        const form = document.createElement("form");
        form.id = `burger-${i}`;
        form.className = `burger-form`
        form.innerHTML = `<h3>Burger ${i}</h3>`;
        toppings.forEach((topping, index) => {
            form.innerHTML += `
                <label for="burger-${i}-topping-${index + 1}">
                    <input type="checkbox" id="burger-${i}-topping-${index + 1}" class="topping" data-burger="${i}" data-topping="${topping}" checked>
                    ${topping}
                </label>
                <br>
            `;
        });
        burgerFormsContainer!.appendChild(form);
    }
    
    loadCheckboxState(); // Restore saved checkbox states
}

/**
 * Handles checkbox changes, including "Everything" checkbox logic.
 */
function handleCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target || !target.classList.contains("topping")) return;

    const burgerId = target.dataset.burger;
    const form = document.getElementById(`burger-${burgerId}`);
    if (!form) return;

    const checkboxes = form.querySelectorAll(".topping") as NodeListOf<HTMLInputElement>;
    const everythingCheckbox = Array.from(checkboxes).find(cb => cb.dataset.topping === "Everything") as HTMLInputElement;

    updateEverythingCheckbox(target, everythingCheckbox, checkboxes);
}

/**
 * Updates "Everything" checkbox based on other toppings.
 */
function updateEverythingCheckbox(target: HTMLInputElement, everythingCheckbox: HTMLInputElement, checkboxes: NodeListOf<HTMLInputElement>) {
    if (target.dataset.topping === "Everything") {
        // Toggle all checkboxes when "Everything" is checked/unchecked
        checkboxes.forEach(cb => (cb.checked = target.checked));
    } else {
        // Uncheck "Everything" if any other topping is unchecked
        if (!target.checked) everythingCheckbox.checked = false;

        // Check "Everything" if all toppings are checked
        const allChecked = Array.from(checkboxes)
            .filter(cb => cb.dataset.topping !== "Everything")
            .every(cb => cb.checked);
        if (allChecked) everythingCheckbox.checked = true;
    }
}

/**
 * Gets unchecked toppings for a given burger.
 */
function getUncheckedToppings(checkboxes: NodeListOf<HTMLInputElement>): string[] {
    return Array.from(checkboxes)
        .filter(cb => !cb.checked && cb.dataset.topping !== "Everything")
        .map(cb => cb.dataset.topping!);
}

/**
 * Handles submit button click and displays selected toppings.
 */
function submit() {
    const numBurgers = getNumBurgers();
    let result = "";

    for (let i = 1; i <= numBurgers; i++) {
        const form = document.getElementById(`burger-${i}`);
        if (!form) return;

        const checkboxes = form.querySelectorAll(".topping") as NodeListOf<HTMLInputElement>;
        const everythingCheckbox = Array.from(checkboxes).find(cb => cb.dataset.topping === "Everything") as HTMLInputElement;
        const everythingChecked = everythingCheckbox?.checked ?? false;

        if (!everythingChecked) {
            const uncheckedToppings = getUncheckedToppings(checkboxes);
            if (uncheckedToppings.length > 0) {
                result += `Burger ${i}: no ${uncheckedToppings.join(", ")}\n`;
            }
        }
    }

    resultDisplay!.textContent = result || "All burgers have all toppings selected.";
    saveCheckboxState();
    hidePopup("toppings-popup");
}