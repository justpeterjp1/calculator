// ===== function buttons logic =====
// ===== Button logic are added to as they follow one another 
// as best as possible
const display = document.getElementById('display');
const clearButton = document.querySelector('.clear');
const bracketButton = document.querySelector('.bracket');
const percentageButton = document.querySelector('.percent')
const numberButtons = document.querySelectorAll('.number-btn');

// Clear button
// Function to update clear button text based on display content
function updateClearButton() {
if (display.textContent === "0") {
    clearButton.textContent = 'C';
} else {
    clearButton.textContent = 'AC';
}
}

clearButton.addEventListener('click', () => {
    display.textContent = '0';
    updateClearButton();
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

  // If display is initial "0", replace it first
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
    }
})

// Number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (display.textContent === "0") {
            display.textContent = '';
            display.textContent = button.textContent;
        } else {
            display.textContent += button.textContent;
            console.log(display.textContent);
        }
        updateClearButton();
    }); 
});

// Operator buttons

