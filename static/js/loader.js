import { PaymentStatusCode } from "./status_codes.js";
const loadingScreen = document.getElementById(`loading-screen`);
export function displayLoadingScreen() {
    loadingScreen?.classList.remove("disabled");
}
export function displayResult(status, paymentType) {
    if (status['result'] === PaymentStatusCode.ACCEPTED) {
        window.location.href = '/end';
    }
    else if (status['result'] === PaymentStatusCode.NONE_DETECTED) {
        loadingScreen?.classList.add('disabled');
        displayResponse('No payment found, try again.', `#${paymentType}-popup`);
    }
    else if (status['result'] === PaymentStatusCode.UNDERPAID) {
        loadingScreen?.classList.add('disabled');
        displayResponse(`Missing payment: Pay an additional $${status['missingPayment']}.`, `#${paymentType}-popup`);
    }
    else if (status['result'] === PaymentStatusCode.AWAITING_CASH) {
        displayResponse(`Please give cash to cook.`, `#loading-screen`);
    }
}
export function displayResponse(response, element) {
    const responseMessage = document.querySelector(`${element} .response-message`);
    if (responseMessage) {
        responseMessage.textContent = response;
    }
}
