export function showPopup(popupId: string) {
    document.getElementById(popupId)?.classList.remove("hidden");
    document.querySelector(".main-screen")!.classList.add("disabled");
}

export function hidePopup(popupId: string, action: () => void = () => {}) {
    document.getElementById(popupId)?.classList.add("hidden");
    document.querySelector(".main-screen")!.classList.remove("disabled");
    action();
}