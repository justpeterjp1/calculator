// ===== DOM Elements =====
const display = document.getElementById('current');
const previousDisplay = document.getElementById('previous');
const clearButton = document.querySelector('.clear');
const bracketButton = document.querySelector('.bracket');
const percentageButton = document.querySelector('.percent');
const numberButtons = document.querySelectorAll('.number-btn');
const plusButton = document.querySelector('.plus');
const minusButton = document.querySelector('.minus');
const multiplyButton = document.querySelector('.multiply');
const divideButton = document.querySelector('.divide');
const operatorButtons = document.querySelectorAll('.operator-btn');
const equalsButton = document.querySelector('.equals');

// Scientific elements
const scDisplay = document.getElementById('scientific');
const scButtons = document.querySelectorAll('.sci-btn');
const scToggleButton = document.getElementById('scToggleButton');
const basicDisplay = document.getElementById('basic');

// ===== Global Variables =====
let openBracketCount = 0;
let parseExpression = '';
let clearPressTimer;

// ===== Toggle Scientific Mode (FIXED) =====
function toggleScientific() {
  // Toggle the 'active' class for smooth animation
  scDisplay.classList.toggle('active');
  
  // Update button text
  if (scDisplay.classList.contains('active')) {
    scToggleButton.textContent = 'Basic';
  } else {
    scToggleButton.textContent = 'SC';
  }
}

scToggleButton.addEventListener("click", toggleScientific);

// ===== Helper Functions =====
function updateClearButton() {
  if (display.textContent === "0") {
    clearButton.textContent = 'C';
  } else {
    clearButton.textContent = 'AC';
  }
}

function lastCharOf(str) {
  return str.length === 0 ? "" : str.slice(-1);
}

function limitInputLength() {
  const maxLength = 18;
  if (display.textContent.length > maxLength) {
    console.log("Limit reached");
    display.textContent = display.textContent.slice(0, maxLength);
  }
}

// ===== Clear Button Logic =====
function clearAll() {
  display.textContent = '0';
  previousDisplay.style.display = 'none';
  previousDisplay.textContent = ''; 
  openBracketCount = 0;
  updateClearButton();
}

function deletelast() {
  if (display.textContent !== '0') {
    display.textContent = display.textContent.slice(0, -1) || '0';
  } else {
    display.textContent = '0';
  }
  updateClearButton();
}

function handlePressStart(e) {
  e.preventDefault();
  clearPressTimer = setTimeout(() => {
    clearAll();
  }, 500);
}

function handlePressEnd(e) {
  e.preventDefault();
  clearTimeout(clearPressTimer);
  
  if (display.textContent === 'Error') {
    clearAll();
    numberButtons.forEach(b => (b.disabled = false));
    operatorButtons.forEach(b => (b.disabled = false));
  } else if (display.textContent !== '0') {
    display.textContent = display.textContent.slice(0, -1) || '0';
  } else {
    display.textContent = '0';
  }

  updateClearButton();
}

clearButton.addEventListener('mousedown', handlePressStart, { passive: false });
clearButton.addEventListener('mouseup', handlePressEnd, { passive: false });
clearButton.addEventListener('touchstart', handlePressStart, { passive: false});
clearButton.addEventListener('touchend', handlePressEnd, { passive: false });
clearButton.addEventListener('mouseleave', () => {
  clearTimeout(clearPressTimer);
});

// ===== Bracket Button Logic =====
bracketButton.addEventListener("click", () => {
  let current = display.textContent.trim();
  const last = current.slice(-1);

  if (current === "0") {
    display.textContent = "(";
    openBracketCount = 1;
    updateClearButton();
    return;
  }

  if ((/\d|\)/).test(last)) {
    if (openBracketCount > 0) {
      display.textContent += ")";
      openBracketCount--;
    } else {
      display.textContent += "(";
      openBracketCount++;
    }
  } else {
    display.textContent += "(";
    openBracketCount++;
  }

  updateClearButton();
});

// ===== Percentage Button =====
percentageButton.addEventListener("click", () => {
  const currentValue = display.textContent;
  if (currentValue !== '' && /\d$/.test(currentValue)) {
    display.textContent += '/100';
    updateClearButton();
  }
});

// ===== Append to Display =====
function appendToDisplay(value) {
  const operators = ['+', '-', 'x', '÷', '×', '−'];
  const content = display.textContent;
  const lastChar = content.slice(-1);

  // Handle starting input
  if (content === "0") {
    if (value === '.') {
      display.textContent = "0.";
      return;
    }
    if (operators.includes(value) && value !== '-' && value !== '−') return;
    display.textContent = value;
    return;
  }

  // Prevent multiple dots in the same number
  if (value === '.') {
    const currentNumber = content.split(/[\+\-\x÷\×\−]/).pop();
    if (currentNumber.includes('.')) return;
  }

  // Prevent two operators in a row
  if (operators.includes(lastChar) && operators.includes(value)) {
    if ((value === '-' || value === '−') && lastChar !== '-' && lastChar !== '−') {
      display.textContent += value;
      return;
    }
    display.textContent = content.slice(0, -1) + value;
    return;
  }

  display.textContent += value;
  updateClearButton();
  limitInputLength();
}

// ===== Number Buttons =====
numberButtons.forEach(button => {
  button.addEventListener('click', () => appendToDisplay(button.textContent));
});

// ===== Operator Buttons =====
plusButton.addEventListener('click', () => appendToDisplay('+'));
minusButton.addEventListener('click', () => appendToDisplay('-'));
multiplyButton.addEventListener('click', () => appendToDisplay('x'));
divideButton.addEventListener('click', () => appendToDisplay('÷'));

// ===== Equals Button =====
equalsButton.addEventListener('click', () => {
  // Close any open brackets
  while (openBracketCount > 0) {
    display.textContent += ")";
    openBracketCount--;
  }
  
  let expression = display.textContent.replace(/x/g, '*').replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-').replace(/,/g, '');
  
  try {
    const prettyExpression = display.textContent.replace(/\*/g, '×').replace(/\//g, '÷');
    previousDisplay.style.display = 'block';
    previousDisplay.textContent = prettyExpression;

    let result = math.evaluate(expression);

    let displayValue;
    if (Math.abs(result) >= 1e15 || (Math.abs(result) < 1e-6 && result !== 0)) {
      displayValue = result.toExponential(6);
    } else {
      const absResult = Math.abs(result);
      if (absResult < 1) {
        displayValue = parseFloat(absResult.toPrecision(10)).toString();
      } else {
        displayValue = absResult.toLocaleString('en-US', { maximumFractionDigits: 10 });
      }
      displayValue = (result < 0 ? '-' : '') + displayValue;
    }

    display.textContent = displayValue;
    parseExpression = result.toString();

  } catch (error) {
    display.textContent = "Error";
    numberButtons.forEach(b => (b.disabled = true));
    operatorButtons.forEach(b => (b.disabled = true));
    clearButton.textContent = 'AC';
  }

  if (display.textContent.length > 15) {
    display.textContent = display.textContent.slice(0, 15);
  }

  updateClearButton();
});

// ===== Scientific Buttons Logic =====
document.querySelectorAll('[data-function]').forEach(button => {
  button.addEventListener('click', () => {
    const func = button.getAttribute('data-function');
    const currentValue = display.textContent;
    
    // Get numeric value (remove commas if present)
    let numValue = parseFloat(currentValue.replace(/,/g, ''));
    
    try {
      let result;
      
      switch(func) {
        // Trigonometric functions (degrees)
        case 'sin':
          result = Math.sin(numValue * Math.PI / 180);
          break;
        case 'cos':
          result = Math.cos(numValue * Math.PI / 180);
          break;
        case 'tan':
          result = Math.tan(numValue * Math.PI / 180);
          break;
          
        // Powers
        case 'square':
          result = Math.pow(numValue, 2);
          break;
        case 'cube':
          result = Math.pow(numValue, 3);
          break;
        case 'power':
          appendToDisplay('^');
          return; //  user needs to enter exponent
          
        // Inverse
        case 'inverse':
          result = 1 / numValue;
          break;
          
        // Logarithms
        case 'ln':
          result = Math.log(numValue);
          break;
        case 'log':
          result = Math.log10(numValue);
          break;
          
        // Constants
        case 'e':
          display.textContent = Math.E.toString();
          return;
        case 'pi':
          display.textContent = Math.PI.toString();
          return;
          
        // Roots
        case 'sqrt':
          result = Math.sqrt(numValue);
          break;
        case 'cbrt':
          result = Math.cbrt(numValue);
          break;
          
        // Absolute value
        case 'abs':
          result = Math.abs(numValue);
          break;
          
        // Factorial
        case 'factorial':
          if (numValue < 0 || !Number.isInteger(numValue)) {
            throw new Error("Factorial only works with positive integers");
          }
          result = 1;
          for (let i = 2; i <= numValue; i++) {
            result *= i;
          }
          break;
          
        // Exponential
        case 'exp':
          result = Math.exp(numValue);
          break;
          
        default:
          return;
      }
      
      // Format and display result
      if (Math.abs(result) >= 1e15 || (Math.abs(result) < 1e-6 && result !== 0)) {
        display.textContent = result.toExponential(6);
      } else {
        display.textContent = result.toLocaleString('en-US', { maximumFractionDigits: 10 });
      }
      
      updateClearButton();
      
    } catch (error) {
      display.textContent = "Error";
      console.error(error);
    }
  });
});

// ===== Initialize =====
display.addEventListener('input', limitInputLength);
updateClearButton();