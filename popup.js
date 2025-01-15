export function showPopup(popupId) {
    document.getElementById(popupId)?.classList.remove("hidden");
    document.querySelector(".main-screen").classList.add("disabled");
}
export function hidePopup(popupId, action = () => { }) {
    document.getElementById(popupId)?.classList.add("hidden");
    document.querySelector(".main-screen").classList.remove("disabled");
    action();
}
