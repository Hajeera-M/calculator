const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');

let currentInput = '0';
let firstOperand = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
    // Limit display length to prevent overflow issues
    const maxLength = 15; // Adjust as needed
    if (currentInput.length > maxLength) {
        display.textContent = parseFloat(currentInput).toExponential(9); // Use exponential notation for very long numbers
    } else {
        display.textContent = currentInput;
    }
}

function handleNumber(number) {
    if (currentInput === '0' || shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        // Prevent excessively long inputs
        if (currentInput.length < 15) {
             currentInput += number;
        }
    }
    updateDisplay();
}

function handleOperator(op) {
    if (operator !== null && !shouldResetDisplay) {
        handleEquals(); // Perform previous calculation if chaining operators
    }
    // Check if the current input is valid before setting the operand
    if (!isNaN(parseFloat(currentInput))) {
        firstOperand = parseFloat(currentInput);
        operator = op;
        shouldResetDisplay = true;
    } else {
        // Handle cases like "Error" display
        handleClear(); // Optionally clear if the display shows an error
    }
}


function handleEquals() {
    if (operator === null || firstOperand === null || shouldResetDisplay) return; // Avoid calculation if operator/operand missing or just set

    const secondOperand = parseFloat(currentInput);
    let result;

    // Ensure second operand is a valid number
    if (isNaN(secondOperand)) {
        // Maybe display an error or just return
        return;
    }


    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            if (secondOperand === 0) {
                result = 'Error'; // Handle division by zero
            } else {
                result = firstOperand / secondOperand;
            }
            break;
        default:
            return;
    }

    currentInput = String(result);
    operator = null;
    // Keep the result as the first operand for potential chaining
    // firstOperand = null; // Don't reset first operand here
    shouldResetDisplay = true; // Ready for new input after equals
    updateDisplay();
}

function handleDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (!currentInput.includes('.')) {
         // Prevent adding decimal if input is already too long
        if (currentInput.length < 15) {
            currentInput += '.';
        }
    }
    updateDisplay();
}

function handleClear() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function handlePlusMinus() {
    if (currentInput !== '0' && currentInput !== 'Error') { // Avoid changing sign of 0 or Error
        currentInput = String(parseFloat(currentInput) * -1);
        updateDisplay();
    }
}

function handlePercent() {
     if (currentInput !== 'Error') {
        currentInput = String(parseFloat(currentInput) / 100);
        updateDisplay();
     }
}


buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (!isNaN(value)) { // Check if it's a number
            handleNumber(value);
        } else if (value === '.') {
            handleDecimal();
        } else if (value === 'AC') {
            handleClear();
        } else if (value === '+/-') {
            handlePlusMinus();
        } else if (value === '%') {
            handlePercent();
        } else if (value === '=') {
            handleEquals();
        } else { // Operator (+, -, *, /)
            handleOperator(value);
        }
    });
});

// Initial display update
updateDisplay();