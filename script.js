const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let plateText = ['', '']; // First element for the letter, second for numbers
const maxNumberLength = 6; // Maximum number of digits for the plate
let cursorVisible = true;
const cursorInterval = 500; // Cursor blinking interval in ms
let currentField = 0; // 0 for letter, 1 for number
const img = new Image();
img.src = 'nummerplate_bg.png'; // Ensure this is the correct path to your plate image

img.onload = function () {
    drawLicensePlate();
};

// Function to draw the license plate image, text, and cursor
function drawLicensePlate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Set the font and color for the text
    ctx.font = '600 85px Arial'; // Semi-bold font
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'middle';

    // Draw the letter on the left side
    ctx.textAlign = 'left';
    const letterX = 110; // X position for the letter
    const letterY = canvas.height / 2.1;
    ctx.fillText(plateText[0], letterX, letterY);

    // Draw the numbers on the right side
    ctx.textAlign = 'left';
    const numberX = 210; // X position for the numbers
    ctx.fillText(plateText[1], numberX, letterY);

    // Draw the cursor if visible
    if (cursorVisible) {
        let cursorX;
        if (currentField === 0) {
            // Position cursor next to the letter
            cursorX = letterX + ctx.measureText(plateText[0]).width + 5;
        } else {
            // Position cursor next to the numbers
            cursorX = numberX + ctx.measureText(plateText[1]).width + 5;
        }
        ctx.fillRect(cursorX, letterY - 25, 2, 50); // Draw cursor as a small rectangle
    }
}

// Event listener to capture keyboard input when the canvas is focused
canvas.addEventListener('keydown', function (event) {
    if (currentField === 0 && /^[a-zA-Z]$/.test(event.key)) {
        plateText[0] = event.key.toUpperCase();
        currentField = 1; // Move to number input after entering a letter
    } else if (currentField === 1 && /^[0-9]$/.test(event.key) && plateText[1].length < maxNumberLength) {
        plateText[1] += event.key;
    } else if (event.key === 'Backspace') {
        if (currentField === 1 && plateText[1].length > 0) {
            plateText[1] = plateText[1].slice(0, -1);
        } else if (currentField === 1 && plateText[1].length === 0) {
            currentField = 0; // Move back to letter input
            plateText[0] = ''; // Reset the letter
        }
    }

    drawLicensePlate();
});

// Automatically focus the canvas on page load
window.onload = function () {
    canvas.focus();
};

// Set focus on the canvas when clicked
canvas.addEventListener('click', function () {
    canvas.focus();
});

// Event listener for the search icon click
document.getElementById('searchIcon').addEventListener('click', function () {
    // Trigger form submission manually by creating and dispatching a 'submit' event
    if (plateText[0].length === 1 && plateText[1].length > 0) {
        document.getElementById('codedesc').value = plateText[0]; // Set codedesc to the letter
        document.getElementById('actualnb').value = plateText[1]; // Set actualnb to the numbers
        
        console.log("Form submitted with codedesc:", plateText[0], "and actualnb:", plateText[1]); // Debugging

        // Manually submit the form
        document.getElementById('plateForm').submit();
    } else {
        alert('Invalid input. Please enter a valid code and number.');
    }
});

// Blinking cursor effect
setInterval(function () {
    cursorVisible = !cursorVisible;
    drawLicensePlate();
}, cursorInterval);
