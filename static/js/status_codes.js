export var PaymentStatusCode;
(function (PaymentStatusCode) {
    PaymentStatusCode[PaymentStatusCode["ACCEPTED"] = 1] = "ACCEPTED";
    PaymentStatusCode[PaymentStatusCode["UNDERPAID"] = 2] = "UNDERPAID";
    PaymentStatusCode[PaymentStatusCode["NONE_DETECTED"] = 3] = "NONE_DETECTED";
    PaymentStatusCode[PaymentStatusCode["AWAITING_CASH"] = 4] = "AWAITING_CASH";
})(PaymentStatusCode || (PaymentStatusCode = {}));
