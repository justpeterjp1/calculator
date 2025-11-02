// ===== function buttons logic =====
// ===== Button logic are added to as they follow one another 
// as best as possible
const display = document.getElementById('display');
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
    updateClearButton();
}

// helper function to update clear button text
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
  }, 500); // 500ms for long press
}

function handlePressEnd(e) {
  e.preventDefault();
  clearTimeout(clearPressTimer);

  if (display.textContent !== '0') {
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
// Globals to track open parentheses
let openParenCount = 0;

// helpers
function lastCharOf(str) {
  return str.length === 0 ? "" : str.slice(-1);
}

function updateClearButton() {
  if (display.textContent === "0") clearButton.textContent = "C";
  else clearButton.textContent = "AC";
}

// bracket handler (replace previous logic)
bracketButton.addEventListener("click", () => {
  let current = display.textContent;

  // If display is initial "0", replace with "("
  if (current === "0") {
    display.textContent = "(";
    openParenCount = 1;
    updateClearButton();
    return;
  }

  const last = lastCharOf(current);

  // If last is digit or ')', prefer closing if there's an open '('
  if ((/\d|\)/).test(last)) {
    if (openParenCount > 0) {
      display.textContent += ")";
      openParenCount -= 1;
    } else {
      // No open paren to close, so open a new one instead
      display.textContent += "(";
      openParenCount += 1;
    }
  } else {
    // last is operator or '(' or whitespace — open a new paren
    display.textContent += "(";
    openParenCount += 1;
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
    if (display.textContent === "0" && value !== '.') {
        display.textContent = value;
    } else {
        display.textContent += value;
    }
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
equalsButton.addEventListener('click', () => {
    let expression = display.textContent.replace(/x/g, '*').replace(/÷/g, '/');
    try {
     console.log("Evaluating:", expression);
      let result = math.evaluate(expression);
      console.log("Result:", result);
      if (Math.abs(result) >= 1e15 || (Math.abs(result) < 1e-6 && result !== 0)) {
        display.textContent = result.toExponential(6);
      } else {
        const absResult = Math.abs(result);
        let formatted;
        if (absResult < 1) {
          formatted = parseFloat(absResult.toPrecision(10)).toString();
          
        } else {
          formatted = absResult
            .toLocaleString('en-US', { maximumFractionDigits: 10 })
        }
        display.textContent = (result < 0 ? '-' : '') + formatted;
      }
    } catch (error) {
          display.textContent = "Error";
          
          numberButtons.forEach(button => {
            button.disabled = true;
          });
          operatorButtons.forEach(button => {
            button.disabled = true;
          });
          clearButton.textContent = 'AC';
          clearButton.removeEventListener('mousedown', handlePressStart);
          clearButton.removeEventListener('mouseup', handlePressEnd);
          clearButton.removeEventListener('touchstart', handlePressStart);
          clearButton.removeEventListener('touchend', handlePressEnd);
          clearButton.addEventListener('click', () => {
            location.reload();
          });
        }
    if (display.textContent.length > 15) {
  display.textContent = display.textContent.slice(0, 15);
}

    updateClearButton();
});

// ===== End of function buttons logic =====

// Function to add commas to numbers and cap numbers at a trillion



// ===== Scientific buttons logic =====
// To be implemented
// ===== End of scientific buttons logic =====