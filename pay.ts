import { loadData, saveData, setTip } from './data.js';
import { renderReceipt, renderTotal } from "./receipt.js";

loadData();
renderReceipt();
renderTotal();

document.querySelector(".back-button")!.addEventListener("click", ()=> {
    window.location.href = "./menu.html";
});

// Show the popup and disable main content
document.getElementById("venmo-card")?.addEventListener("click", () => {
    document.getElementById("venmo-popup")!.classList.remove("hidden");
    document.querySelector(".main-screen")!.classList.add("disabled");
});

document.getElementById("zelle-card")?.addEventListener("click", () => {
    document.getElementById("zelle-popup")!.classList.remove("hidden");
    document.querySelector(".main-screen")!.classList.add("disabled");
});

document.getElementById("cash-card")?.addEventListener("click", () => {
    document.getElementById("cash-popup")!.classList.remove("hidden");
    document.querySelector(".main-screen")!.classList.add("disabled");
});

// Hide the popup and re-enable main content
document.querySelector("#venmo-popup button")?.addEventListener("click", () => {
    document.getElementById("venmo-popup")!.classList.add("hidden");
    document.querySelector(".main-screen")!.classList.remove("disabled");
});

document.querySelector("#zelle-popup button")?.addEventListener("click", () => {
    document.getElementById("zelle-popup")!.classList.add("hidden");
    document.querySelector(".main-screen")!.classList.remove("disabled");
});

document.querySelector("#cash-popup button")?.addEventListener("click", () => {
    document.getElementById("cash-popup")!.classList.add("hidden");
    document.querySelector(".main-screen")!.classList.remove("disabled");
});