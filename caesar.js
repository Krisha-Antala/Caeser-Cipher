// Get the element from DOM
const form = document.getElementById("controls");
const hInput = document.querySelector("#heading-input");
const hOutput = document.querySelector("#heading-output");
const selectEncodeOrDecode = document.getElementsByName("code");
const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const shiftKey = document.getElementById("shift-input");
const modulo = document.getElementById("mod-input");
const alphabet = document.getElementById("alphabet-input");
const letterCase = document.getElementById("letter-case");
const foreignChars = document.getElementById("foreign-chars");

// Change the heading title and clear the content depending on whether to encode or decode
selectEncodeOrDecode.forEach((option) => {
    option.addEventListener("click", () => {
        if (option.value === "encode") {
            hInput.textContent = "Plaintext";
            hOutput.textContent = "Ciphertext";
            inputText.value = "";
            outputText.textContent = "";
        } else if (option.value === "decode") {
            hInput.textContent = "Ciphertext";
            hOutput.textContent = "Plaintext";
            inputText.value = "";
            outputText.textContent = "";
        }
    });
});

// Enhanced error handling with Bootstrap alerts
function displayError(message) {
    const status = document.getElementById("status");
    status.innerHTML = `<div class='alert alert-danger' role='alert'>${message}</div>`;
}

function displaySuccess(message) {
    const status = document.getElementById("status");
    status.innerHTML = `<div class='alert alert-success' role='alert'>${message}</div>`;
}

// When the click submit it will perform caesar cipher
form.addEventListener("submit", (event) => {
    console.log("Submit button clicked.");
    event.preventDefault();

    const inputTextValue = inputText.value;
    console.log("Input text:", inputTextValue);

    const selectedOption = Array.from(selectEncodeOrDecode).find((option) => option.checked);
    console.log("Selected operation:", selectedOption.value);

    const shiftValue = parseInt(shiftKey.value);
    const moduloValue = parseInt(modulo.value);
    console.log("Shift key:", shiftValue, "Modulo:", moduloValue);

    if (!validateInput(shiftValue, moduloValue)) {
        displayError("Invalid shift key or modulo value. Please correct and try again.");
        console.log("Validation failed for shift key or modulo.");
        return;
    }

    if (!inputTextValue.trim()) {
        displayError("Input text cannot be empty.");
        console.log("Validation failed for input text.");
        return;
    }

    const alphabetValue = alphabet.value;
    const letterCaseValue = letterCase.value;
    const foreignCharsValue = foreignChars.value;
    console.log("Alphabet:", alphabetValue, "Letter case:", letterCaseValue, "Foreign characters:", foreignCharsValue);

    let cipherOutput = caesarCipher(selectedOption.value, inputTextValue, shiftValue, moduloValue, alphabetValue, foreignCharsValue);

    if (letterCaseValue == 2) {
        cipherOutput = cipherOutput.toLowerCase();
    } else if (letterCaseValue == 3) {
        cipherOutput = cipherOutput.toUpperCase();
    }

    console.log("Cipher output:", cipherOutput);
    outputText.textContent = cipherOutput;
    displaySuccess("Operation completed successfully!");
});

function caesarCipher(decode, text, shift, mod, charset, foreignChars) {
    // If decode is equal to decode then reverse the sign of the shift value.
    if (decode == "decode") {
        shift = -shift;
    }
    // If foreignChars is equal to 1 then remove foreign characters
    if (foreignChars == 1) {
        text = removeForeignChars(text);
    }
    // Make the character set a lowercase
    charset = charset.toLowerCase();
    // Store the results
    let result = "";
    for (let i = 0; i < text.length; i++) {
        let char = text.charAt(i);
        // Find the index of the character in the character set, ignoring case
        const index = charset.indexOf(char.toLowerCase());
        // If the character is in the set, perform the shift operation
        if (index !== -1) {
            let newIndex = (index + shift) % mod;
            // If the new index is negative, add the modulus to wrap around to the correct position
            if (newIndex < 0) {
                newIndex += mod;
            }
            // Convert the new character to uppercase if the original character was uppercase
            char = char === char.toLowerCase() ? charset[newIndex] : charset[newIndex].toUpperCase();
        }
        // Add the character to the result string
        result += char;
    }
    return result;
}


function removeForeignChars(input) {
    // Regular expression to match non-letter and non-digit characters
    const regex = /[^a-zA-Z0-9 ]/g;
    // Replace all non-letter and non-digit characters with an empty string
    return input.replace(regex, "");
}

// Validate user input
function validateInput(shift, mod) {
    let isValid = true;

    if (isNaN(shift) || shift < 0) {
        displayError("Shift key must be a non-negative number.");
        isValid = false;
    }

    if (isNaN(mod) || mod <= 0) {
        displayError("Modulo must be a positive number.");
        isValid = false;
    }

    return isValid;
}

// Copy to Clipboard functionality
const copyButton = document.getElementById("copy-button");
copyButton.addEventListener("click", () => {
    console.log("Copy button clicked.");
    const output = outputText.textContent;
    console.log("Output text to copy:", output);
    navigator.clipboard.writeText(output).then(() => {
        console.log("Text copied successfully.");
        showToast("Text copied to clipboard!", "success");
    }).catch((err) => {
        console.error("Failed to copy text:", err);
        showToast("Failed to copy text.", "danger");
    });
});

// Function to show Bootstrap toast
function showToast(message, type) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    const toastBody = document.createElement("div");
    toastBody.className = "d-flex";

    const toastText = document.createElement("div");
    toastText.className = "toast-body";
    toastText.textContent = message;

    const closeButton = document.createElement("button");
    closeButton.className = "btn-close me-2 m-auto";
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("data-bs-dismiss", "toast");
    closeButton.setAttribute("aria-label", "Close");

    toastBody.appendChild(toastText);
    toastBody.appendChild(closeButton);
    toast.appendChild(toastBody);
    toastContainer.appendChild(toast);

    const bootstrapToast = new bootstrap.Toast(toast);
    bootstrapToast.show();

    // Remove toast after it disappears
    toast.addEventListener("hidden.bs.toast", () => {
        toast.remove();
    });
}
