// DOM Elements
const arrayContainer = document.getElementById('array-container');
const generateBtn = document.getElementById('generateBtn');
const sortBtn = document.getElementById('sortBtn');
const resetBtn = document.getElementById('resetBtn');
const speedRange = document.getElementById('speedRange');
const sizeRange = document.getElementById('sizeRange');

// Variables
let array = [];
let arrayBars = [];
let sortingInProgress = false;
let animationSpeed = 101 - speedRange.value; // Invert the speed value

// Initialize the application
window.onload = function() {
    generateNewArray();
    setupEventListeners();
};

// Set up event listeners for buttons and sliders
function setupEventListeners() {
    generateBtn.addEventListener('click', generateNewArray);
    sortBtn.addEventListener('click', startInsertionSort);
    resetBtn.addEventListener('click', resetArray);
    speedRange.addEventListener('input', updateAnimationSpeed);
    sizeRange.addEventListener('input', generateNewArray);
}

// Generate a new random array
function generateNewArray() {
    if (sortingInProgress) return;
    
    // Clear the existing array container
    arrayContainer.innerHTML = '';
    
    const arraySize = parseInt(sizeRange.value);
    array = [];
    arrayBars = [];
    
    // Generate random array values
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 100) + 5); // Values between 5 and 104
    }
    
    // Calculate bar width based on container size and array size
    const barWidth = (arrayContainer.clientWidth / arraySize) - 2;
    
    // Create visual representation of the array
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${array[i] * 3}px`;
        bar.dataset.index = i; // Store original index for reference
        bar.dataset.value = array[i]; // Store value for debugging
        arrayContainer.appendChild(bar);
        arrayBars.push(bar);
    }
}

// Reset the array to its original state
function resetArray() {
    if (sortingInProgress) return;
    
    generateNewArray();
}

// Update the animation speed based on the slider value
function updateAnimationSpeed() {
    animationSpeed = 101 - speedRange.value;
}

// Start the insertion sort algorithm
async function startInsertionSort() {
    if (sortingInProgress) return;
    
    sortingInProgress = true;
    disableControls(true);
    
    await insertionSort(array.slice());
    
    // Mark all bars as sorted when the algorithm is complete
    for (let i = 0; i < arrayBars.length; i++) {
        arrayBars[i].classList.add('sorted');
    }
    
    sortingInProgress = false;
    disableControls(false);
}

// Implementation of the insertion sort algorithm with visualization
async function insertionSort(arr) {
    // Create a copy of the array for tracking positions
    let positions = Array.from({ length: arr.length }, (_, i) => i);
    
    // Highlight the first element as already sorted
    arrayBars[0].classList.add('sorted');
    await sleep(animationSpeed);
    
    for (let i = 1; i < arr.length; i++) {
        // Current element to be compared
        let current = arr[i];
        let currentPosition = positions[i];
        let j = i - 1;
        
        // Store the original DOM element
        let currentBar = arrayBars[i];
        
        // Highlight current element being inserted
        currentBar.classList.add('current');
        await sleep(animationSpeed);
        
        // Save the starting left position of the element
        const barWidth = arrayContainer.clientWidth / arr.length;
        let moves = 0;
        
        while (j >= 0 && arr[j] > current) {
            // Highlight the elements being compared
            arrayBars[j].classList.add('comparing');
            await sleep(animationSpeed);
            
            // Move elements that are greater than current to one position ahead
            arr[j + 1] = arr[j];
            
            // Move the DOM element
            const sourceBar = arrayBars[j];
            const targetBar = arrayBars[j + 1];
            
            // Animate the swap
            sourceBar.style.transform = `translateX(${barWidth}px)`;
            targetBar.style.transform = `translateX(${-barWidth}px)`;
            
            await sleep(animationSpeed);
            
            // Reset animations and swap DOM elements
            sourceBar.style.transform = '';
            targetBar.style.transform = '';
            
            // Swap DOM elements in the arrayBars array
            arrayBars[j + 1] = sourceBar;
            arrayBars[j] = targetBar;
            
            // Update positions after swap
            const tempPos = positions[j];
            positions[j] = positions[j + 1];
            positions[j + 1] = tempPos;
            
            // Actually reorder the elements in the DOM
            if (j + 2 < arr.length) {
                arrayContainer.insertBefore(sourceBar, arrayBars[j + 2]);
            } else {
                arrayContainer.appendChild(sourceBar);
            }
            
            // Remove the comparing class
            sourceBar.classList.remove('comparing');
            
            moves++;
            j--;
            await sleep(animationSpeed / 2);
        }
        
        // Place the current element at its correct position
        arr[j + 1] = current;
        
        // Find where the currentBar should go in the DOM
        if (moves > 0) {
            // Find the insertion point in the DOM
            const insertionPoint = j + 1;
            
            if (insertionPoint < arr.length - 1) {
                arrayContainer.insertBefore(currentBar, arrayBars[insertionPoint]);
            } else {
                arrayContainer.appendChild(currentBar);
            }
            
            // Update the arrayBars array
            arrayBars = Array.from(arrayContainer.children);
        }
        
        // Update visual representation
        for (let k = 0; k < arr.length; k++) {
            arrayBars[k].style.height = `${arr[k] * 3}px`;
        }
        
        // Remove current class
        currentBar.classList.remove('current');
        
        // Mark all elements up to current as sorted
        for (let k = 0; k <= i; k++) {
            arrayBars[k].classList.add('sorted');
        }
        
        await sleep(animationSpeed);
    }
}

// Utility function for adding delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Enable/disable control buttons during sorting
function disableControls(disabled) {
    generateBtn.disabled = disabled;
    sortBtn.disabled = disabled;
    resetBtn.disabled = disabled;
    sizeRange.disabled = disabled;
}
