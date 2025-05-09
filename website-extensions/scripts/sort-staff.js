/**
 * Sorts div elements based on their data-sort and data-sort2 attributes when corresponding buttons are clicked.
 * Elements with the matching data-sort or data-sort2 value will be moved to the top.
 */
function setupSortingByDataAttribute() {
  // Find all buttons that should trigger sorting
  const sortButtons = document.querySelectorAll('[data-sort-trigger]');
  
  // Find the container that holds the sortable elements
  const sortableContainer = document.querySelector('.sortable-container');
  
  if (!sortableContainer) {
    console.warn('No sortable container found. Add class "sortable-container" to the parent element that contains your sortable divs.');
    return;
  }
  
  // Add necessary CSS for animations
  addSortingStyles();
  
  // Add click event listeners to all sort buttons
  sortButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get the sort value from the button's data attribute
      const sortValue = this.getAttribute('data-sort-trigger');
      
      // Get all sortable elements and make a copy of the NodeList
      const sortableElements = Array.from(sortableContainer.querySelectorAll('[data-sort], [data-sort2]'));
      
      // Prepare for FLIP animation (First, Last, Invert, Play)
      // First: Get the initial positions
      const initialPositions = sortableElements.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          element: el,
          top: rect.top,
          left: rect.left,
          height: rect.height,
          width: rect.width
        };
      });
      
      // Sort the elements: matching elements first, then the rest
      sortableElements.sort((a, b) => {
        const aSort = a.getAttribute('data-sort');
        const bSort = b.getAttribute('data-sort');
        const aSort2 = a.getAttribute('data-sort2');
        const bSort2 = b.getAttribute('data-sort2');
        
        // Check if either data-sort or data-sort2 matches the sort value
        const aMatches = aSort === sortValue || aSort2 === sortValue;
        const bMatches = bSort === sortValue || bSort2 === sortValue;
        
        if (aMatches && !bMatches) {
          return -1; // a comes before b
        } else if (!aMatches && bMatches) {
          return 1; // b comes before a
        }
        return 0; // keep original order for elements with same status
      });
      
      // Remove all sortable elements from the DOM temporarily
      sortableElements.forEach(el => {
        el.remove();
      });
      
      // Add them back in the new order
      sortableElements.forEach(el => {
        sortableContainer.appendChild(el);
      });
      
      // Last: Get the final positions
      // We need to wait for the browser to calculate the new positions
      requestAnimationFrame(() => {
        const finalPositions = sortableElements.map(el => {
          const rect = el.getBoundingClientRect();
          return {
            element: el,
            top: rect.top,
            left: rect.left,
            height: rect.height,
            width: rect.width
          };
        });
        
        // Invert: Calculate the differences and apply transforms
        initialPositions.forEach((initial, i) => {
          const final = finalPositions.find(f => f.element === initial.element);
          if (!final) return; // Skip if not found
          
          const dx = initial.left - final.left;
          const dy = initial.top - final.top;
          
          if (dx !== 0 || dy !== 0) { // Only animate if position changed
            const el = initial.element;
            
            // Apply the inverted transform to make it appear at its initial position
            el.style.transform = `translate(${dx}px, ${dy}px)`;
            el.style.transition = 'none';
            
            // Force a reflow to ensure the transform is applied before the transition
            el.offsetHeight;
            
            // Play: Add the transition and remove the transform
            el.style.transition = 'transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
            
            requestAnimationFrame(() => {
              el.style.transform = '';
            });
          }
        });
        
        // Reset styles after animation completes
        setTimeout(() => {
          sortableElements.forEach(el => {
            el.style.transform = '';
            el.style.transition = '';
          });
        }, 600);
      });
      
      // Highlight the active button
      sortButtons.forEach(btn => btn.classList.remove('active-sort'));
      this.classList.add('active-sort');
    });
  });
  
  // Optional: Add a "Show All" button functionality if needed
  const showAllButton = document.querySelector('[data-sort-trigger="all"]');
  if (showAllButton) {
    showAllButton.addEventListener('click', function() {
      const sortableElements = Array.from(sortableContainer.querySelectorAll('[data-sort], [data-sort2]'));
      
      // Show all elements (they're already in the DOM, just need to be visible)
      sortableElements.forEach(el => {
        el.style.display = '';
        
        // Add a small animation
        el.style.transform = 'scale(0.98)';
        el.style.transition = 'all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
        
        setTimeout(() => {
          el.style.transform = '';
        }, 500);
      });
      
      // Highlight the active button
      sortButtons.forEach(btn => btn.classList.remove('active-sort'));
      this.classList.add('active-sort');
    });
  }
}

/**
 * Adds the necessary CSS styles for sorting animations
 */
function addSortingStyles() {
  // Check if styles already exist
  if (document.getElementById('sorting-styles')) {
    return;
  }
  
  // Create style element
  const styleEl = document.createElement('style');
  styleEl.id = 'sorting-styles';
  
  // Add CSS rules
  styleEl.textContent = `
    .sortable-container {
      position: relative;
    }
    
    .sortable-container > * {
      position: relative;
      z-index: 1;
      backface-visibility: hidden;
      will-change: transform;
    }
    
    .active-sort {
      color: #700029;
      font-weight: 400;
    }
  `;
  
  // Add to document head
  document.head.appendChild(styleEl);
}

// Initialize sorting functionality when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setupSortingByDataAttribute);
