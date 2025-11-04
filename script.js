// ===== function buttons logic =====
// ===== Button logic are added to as they follow one another 
// as best as possible
const display = document.getElementById('current');
const previousDisplay = document.getElementById('previous');
const clearButton = document.querySelector('.clear');
const bracketButton = document.querySelector('.bracket');
const percentageButton = document.querySelector('.percent')
const numberButtons = document.querySelectorAll('.number-btn');
const plusButton = document.querySelector('.plus');
const minusButton = document.querySelector('.minus');
const multiplyButton = document.querySelector('.multiply');
const divideButton = document.querySelector('.divide');
const operatorButtons = document.querySelectorAll('.operator-btn');
const equalsButton = document.querySelector('.equals');




display.addEventListener('input', limitInputLength);
// Clear button
// Function to update clear button text based on display content
function updateClearButton() {
if (display.textContent === "0") {
    clearButton.textContent = 'C';
} else {
    clearButton.textContent = 'AC';
}
}
// Clear All
function clearAll() {
    display.textContent = '0';
    previousDisplay.style.display = 'none';
    previousDisplay.textContent = ''; 
    updateClearButton();
}

// helper function to update clear button text
function deletelast() {
 if (display.textContent !== '0') {
        display.textContent = display.textContent.slice(0, -1) || '0';
    }
  else {
        display.textContent = '0';
    }
    updateClearButton();
}

function handlePressStart(e) {
  e.preventDefault();
  clearPressTimer = setTimeout(() => {
    clearAll();
  }, 500); // 500ms for long press
}

function handlePressEnd(e) {
  e.preventDefault();
  clearTimeout(clearPressTimer);
  if (display.textContent === 'Error' && display.textContent.length !== "0") {
       clearAll();
        
} else if (display.textContent !== '0') {
    // Short press → delete last character
    display.textContent = display.textContent.slice(0, -1) || '0';
  } else {
    // If already 0, just stay at 0
    display.textContent = '0';
  }

  updateClearButton();
}

clearButton.addEventListener('mousedown', handlePressStart, { passive: false });
clearButton.addEventListener('mouseup', handlePressEnd, { passive: false });
// For mobile touch support
clearButton.addEventListener('touchstart', handlePressStart, { passive: false});
clearButton.addEventListener('touchend', handlePressEnd, { passive: false });


// if user moves mouse away while pressing
clearButton.addEventListener('mouseleave', () => {
  clearTimeout(clearPressTimer);
});

// Bracket button

// helpers
function lastCharOf(str) {
  return str.length === 0 ? "" : str.slice(-1);
}

function updateClearButton() {
  if (display.textContent === "0") clearButton.textContent = "C";
  else clearButton.textContent = "AC";
}

// bracket handler (replace previous logic)
let openBracketCount = 0;

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
    // If last is number or ")", close paren if open, else open new
    if (openBracketCount > 0) {
      display.textContent += ")";
      openBracketCount--;
    } else {
      display.textContent += "(";
      openBracketCount++;
    }
  } else {
    // Last is operator, start a new "("
    display.textContent += "(";
    openBracketCount++;
  }

  updateClearButton();
});


// Percentage button
percentageButton.addEventListener("click", () => {
    const currentValue = display.textContent;
    if (currentValue !== '' && /\d$/.test(currentValue)) {
        display.textContent += '/100';
        console.log(display.textContent);
        updateClearButton();
    }
})

// Helper functions for displaying
// Limit input length
function limitInputLength() {
  const maxLength = 18;
   if (display.textContent.length > maxLength) {
    console.log("Limit reached");
       display.textContent = display.textContent.slice(0, maxLength);
   }

  };
function appendToDisplay(value) {
  const operators = ['+', '-', 'x', '÷'];
  const content = display.textContent;
  const lastChar = content.slice(-1);

  // 1️⃣ Handle starting input
  if (content === "0") {
    if (value === '.') {
      display.textContent = "0."; // start with 0.
      return;
    }
    if (operators.includes(value) && value !== '-') return; // only allow "-" to start negative
    display.textContent = value;
    return;
  }

  // 2️⃣ Prevent multiple dots in the same number
  if (value === '.') {
    const currentNumber = content.split(/[\+\-\x÷]/).pop();
    if (currentNumber.includes('.')) return; // ignore extra dot
  }

  // 3️⃣ Prevent two operators in a row — replace old one instead
  if (operators.includes(lastChar) && operators.includes(value)) {
    // allow "-" to follow an operator if user wants negative number like "5 x -3"
    if (value === '-' && lastChar !== '-') {
      display.textContent += value;
      return;
    }
    // otherwise, replace previous operator
    display.textContent = content.slice(0, -1) + value;
    return;
  }

  // 4️⃣ Append new value normally
  display.textContent += value;
  updateClearButton();
  limitInputLength();
}




// Number buttons
// Digits
numberButtons.forEach(button => {
  
  button.addEventListener('click', () => appendToDisplay(button.textContent));
});

// Operators
plusButton.addEventListener('click', () => appendToDisplay('+'));
minusButton.addEventListener('click', () => appendToDisplay('-'));
multiplyButton.addEventListener('click', () => appendToDisplay('x'));
divideButton.addEventListener('click', () => appendToDisplay('÷'));



// Equals button
// Firstly to Keep a clean copy of whatever number is currently valid
let parseExpression = ''; 

equalsButton.addEventListener('click', () => {
  while (openBracketCount > 0) {
  display.textContent += ")";
  openBracketCount--;
}
  // Convert pretty symbols to math-safe operators
  let expression = display.textContent.replace(/x/g, '*').replace(/÷/g, '/').replace(/,/g, '');
  
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

    // --- Update both displays ---
    display.textContent = displayValue;
    parseExpression = result.toString(); // keeping clean raw result for new calculations

  } catch (error) {
    display.textContent = "Error";
    numberButtons.forEach(b => (b.disabled = true));
    operatorButtons.forEach(b => (b.disabled = true));
    clearButton.textContent = 'AC';
    clearButton.addEventListener('click', () => location.reload());
  }

  if (display.textContent.length > 15) {
    display.textContent = display.textContent.slice(0, 15);
  }
  


  updateClearButton();
});


const lastValue = display.dataset.rawValue || display.textContent;
// to be used in future functions 

// ===== End of function buttons logic =====
// Function to add commas to numbers and cap numbers at a trillion



// ===== Scientific buttons logic =====
const scDisplay = document.getElementById('scientific');
const scButtons = document.querySelectorAll('.sci-btn');
const scToggleButton = document.getElementById('scToggleButton');
const basicDisplay = document.getElementById('basic');
scDisplay.style.display = 'none';
function toggleScientific() {
  if (scDisplay.style.display === 'none') {
    scDisplay.style.display = 'grid';
    basicDisplay.classList.add('adaptToScDisplay');
  } else {
    scDisplay.style.display = 'none';
    basicDisplay.classList.remove('adaptToScDisplay');
  }
}

scToggleButton.addEventListener("click", toggleScientific)
// ===== End of scientific buttons logic =====