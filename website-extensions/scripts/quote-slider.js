/**
 * Quote Slider
 * Automatically fades in/out quote slides every 3 seconds.
 * Pauses transition when hovering over the wrapper.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Get the slider wrapper and all slides
  const sliderWrapper = document.querySelector('.quote-slider---wrapper');
  const quoteSlides = document.querySelectorAll('.quote-slider---slide');
  const statusBarSlides = document.querySelectorAll('.quote-slider---status-bar---slide-status');
  
  if (!sliderWrapper || quoteSlides.length === 0) return;
  
  let currentSlideIndex = 0;
  let slideTimer = null;
  let isPaused = false;
  let isTransitioning = false;
  let tempPauseTimer = null;
  let animationStartTime = null;
  let remainingTime = null;
  let previousSlideIndex = null;
  const intervalTime = 3000; // 3 seconds
  const tempPauseTime = 5000; // 5 seconds pause after clicking on status bar
  
  // Initialize the slider
  function initSlider() {
    // Hide all slides except the first one
    quoteSlides.forEach((slide, index) => {
      slide.style.opacity = index === 0 ? '1' : '0';
      slide.style.transition = 'opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
      slide.style.zIndex = index === 0 ? '1' : '0';
    });
    
    // Start the automatic transition
    startSlideTimer();
    
    // Add event listeners for mouse and touch events
    sliderWrapper.addEventListener('mouseenter', pauseSlider);
    sliderWrapper.addEventListener('mouseleave', resumeSlider);
    
    // Add touch events for mobile devices
    sliderWrapper.addEventListener('touchstart', pauseSlider);
    sliderWrapper.addEventListener('touchend', resumeSlider);
    
    // Add transition end event listener
    quoteSlides.forEach(slide => {
      slide.addEventListener('transitionend', handleTransitionEnd);
    });
    
    // Add click event listeners to status bar slides
    statusBarSlides.forEach(statusBarSlide => {
      statusBarSlide.addEventListener('click', handleStatusBarClick);
    });
  }
  
  // Handle click on status bar slide
  function handleStatusBarClick(event) {
    const clickedStatusBar = event.currentTarget;
    const statusValue = clickedStatusBar.getAttribute('data-status');
    
    if (!statusValue) return;
    
    // Find the corresponding slide with the same data-status value
    const targetSlide = Array.from(quoteSlides).find(slide => 
      slide.getAttribute('data-status') === statusValue
    );
    
    if (!targetSlide) return;
    
    // Get the index of the target slide
    const targetIndex = Array.from(quoteSlides).indexOf(targetSlide);
    
    if (targetIndex === -1 || targetIndex === currentSlideIndex) return;
    
    // Store the previous slide index for status reset
    previousSlideIndex = currentSlideIndex;
    
    // Pause any ongoing transitions and timers
    pauseSlider();
    
    // Set a flag to prevent hover events from resuming the slider
    isPaused = true;
    isTransitioning = true;
    
    // Hide current slide
    quoteSlides[currentSlideIndex].style.opacity = '0';
    quoteSlides[currentSlideIndex].style.zIndex = '0';
    
    // Store the target slide index for the transition end handler
    sliderWrapper.dataset.nextSlideIndex = targetIndex;
  }
  
  // Function to move to the next slide
  function nextSlide() {
    if (isPaused || isTransitioning) return;
    
    // Set transitioning flag
    isTransitioning = true;
    
    // Clear any existing timer
    if (slideTimer) {
      clearTimeout(slideTimer);
      slideTimer = null;
    }
    
    // Store the previous slide index for status reset
    previousSlideIndex = currentSlideIndex;
    
    // Calculate the next slide index
    const nextSlideIndex = (currentSlideIndex + 1) % quoteSlides.length;
    
    // Store the next slide for reference in the transition end handler
    sliderWrapper.dataset.nextSlideIndex = nextSlideIndex;
    
    // Hide current slide
    quoteSlides[currentSlideIndex].style.opacity = '0';
    quoteSlides[currentSlideIndex].style.zIndex = '0';
  }
  
  // Reset the status bar of a slide
  function resetStatusBar(slideIndex) {
    if (slideIndex === null) return;
    
    const slide = quoteSlides[slideIndex];
    if (!slide) return;
    
    const statusValue = slide.getAttribute('data-status');
    if (!statusValue) return;
    
    // Find the corresponding status bar
    const statusBar = Array.from(statusBarSlides).find(statusBarSlide => 
      statusBarSlide.getAttribute('data-status') === statusValue
    );
    
    if (statusBar) {
      const statusBarStatus = statusBar.querySelector('.quote-slider---status-bar---slide-status---status');
      if (statusBarStatus) {
        // Reset the status bar without transition
        statusBarStatus.style.transition = 'none';
        statusBarStatus.style.width = '0%';
      }
    }
  }
  
  // Handle the transition end event
  function handleTransitionEnd(event) {
    // Only proceed if we're in a transitioning state and the event is for opacity
    if (!isTransitioning || event.propertyName !== 'opacity') return;
    
    // Only proceed if the opacity is now 0 (slide has finished hiding)
    if (parseFloat(event.target.style.opacity) !== 0) return;
    
    // Get the next slide index from the data attribute
    const nextSlideIndex = parseInt(sliderWrapper.dataset.nextSlideIndex);
    
    // Reset the status bar of the previous slide
    resetStatusBar(previousSlideIndex);
    
    // Move the next slide to the beginning of the parent container
    const parent = sliderWrapper;
    const nextSlide = quoteSlides[nextSlideIndex];
    parent.insertBefore(nextSlide, parent.firstChild);
    
    // First set opacity to 0 without transition
    nextSlide.style.transition = 'none';
    nextSlide.style.opacity = '0';
    nextSlide.style.zIndex = '1';
    
    // Force a reflow
    void nextSlide.offsetWidth;
    
    // Restore the transition and fade in
    nextSlide.style.transition = 'opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
    
    // Use setTimeout to ensure the browser has time to apply the transition
    setTimeout(() => {
      nextSlide.style.opacity = '1';
      
      // Update current slide index
      currentSlideIndex = nextSlideIndex;
      
      // Reset transitioning flag
      isTransitioning = false;
      
      // If this was triggered by a status bar click, set a temporary pause
      if (tempPauseTimer === null && isPaused) {
        tempPauseTimer = setTimeout(() => {
          // Only resume if the mouse is not over the slider
          if (!sliderWrapper.matches(':hover')) {
            isPaused = false;
            tempPauseTimer = null;
            startSlideTimer();
          }
        }, tempPauseTime);
      } else {
        // Start the timer for the new slide
        startSlideTimer();
      }
    }, 20);
  }
  
  // Start the timer for slide transitions
  function startSlideTimer() {
    // Clear any existing timer
    if (slideTimer) {
      clearTimeout(slideTimer);
      slideTimer = null;
    }
    
    // Reset and start the status bar animation
    const currentSlide = quoteSlides[currentSlideIndex];
    const currentStatusValue = currentSlide.getAttribute('data-status');
    
    if (currentStatusValue) {
      // Find the corresponding status bar
      const statusBar = Array.from(statusBarSlides).find(statusBarSlide => 
        statusBarSlide.getAttribute('data-status') === currentStatusValue
      );
      
      if (statusBar) {
        const statusBarStatus = statusBar.querySelector('.quote-slider---status-bar---slide-status---status');
        if (statusBarStatus) {
          // Reset the status bar
          statusBarStatus.style.transition = 'none';
          statusBarStatus.style.width = '0%';
          
          // Force a reflow
          void statusBarStatus.offsetWidth;
          
          // Set the transition to match exactly the interval time
          statusBarStatus.style.transition = `width ${intervalTime}ms linear`;
          
          // Start the status animation
          requestAnimationFrame(() => {
            statusBarStatus.style.width = '100%';
          });
          
          // Reset animation tracking variables
          animationStartTime = Date.now();
          remainingTime = intervalTime;
        }
      }
    }
    
    // Set the timer for the next slide
    if (!isPaused) {
      slideTimer = setTimeout(nextSlide, intervalTime);
    }
  }
  
  // Pause the slider on hover or touch
  function pauseSlider() {
    if (isPaused) return;
    
    isPaused = true;
    
    // Clear the slide timer
    if (slideTimer) {
      clearTimeout(slideTimer);
      slideTimer = null;
    }
    
    // Clear any temporary pause timer
    if (tempPauseTimer) {
      clearTimeout(tempPauseTimer);
      tempPauseTimer = null;
    }
    
    // Pause the status bar animation
    const currentSlide = quoteSlides[currentSlideIndex];
    const currentStatusValue = currentSlide.getAttribute('data-status');
    
    if (currentStatusValue) {
      // Find the corresponding status bar
      const statusBar = Array.from(statusBarSlides).find(statusBarSlide => 
        statusBarSlide.getAttribute('data-status') === currentStatusValue
      );
      
      if (statusBar) {
        const statusBarStatus = statusBar.querySelector('.quote-slider---status-bar---slide-status---status');
        if (statusBarStatus) {
          // Calculate the elapsed time and remaining time
          const elapsedTime = Date.now() - animationStartTime;
          remainingTime = intervalTime - elapsedTime;
          
          // Get the current width percentage
          const computedWidth = window.getComputedStyle(statusBarStatus).width;
          const parentWidth = statusBarStatus.parentElement ? window.getComputedStyle(statusBarStatus.parentElement).width : '100%';
          
          // Calculate the percentage width
          const widthValue = parseFloat(computedWidth);
          const parentWidthValue = parseFloat(parentWidth);
          const percentWidth = (widthValue / parentWidthValue) * 100;
          
          // Stop the transition and keep the current width
          statusBarStatus.style.transition = 'none';
          statusBarStatus.style.width = `${percentWidth}%`;
        }
      }
    }
  }
  
  // Resume the slider when mouse leaves or touch ends
  function resumeSlider() {
    if (!isPaused || tempPauseTimer) return;
    
    isPaused = false;
    
    // Resume the status bar animation
    const currentSlide = quoteSlides[currentSlideIndex];
    const currentStatusValue = currentSlide.getAttribute('data-status');
    
    if (currentStatusValue) {
      // Find the corresponding status bar
      const statusBar = Array.from(statusBarSlides).find(statusBarSlide => 
        statusBarSlide.getAttribute('data-status') === currentStatusValue
      );
      
      if (statusBar) {
        const statusBarStatus = statusBar.querySelector('.quote-slider---status-bar---slide-status---status');
        if (statusBarStatus) {
          // Get the current width percentage
          const computedWidth = window.getComputedStyle(statusBarStatus).width;
          const parentWidth = statusBarStatus.parentElement ? window.getComputedStyle(statusBarStatus.parentElement).width : '100%';
          
          // Calculate the percentage width
          const widthValue = parseFloat(computedWidth);
          const parentWidthValue = parseFloat(parentWidth);
          const percentWidth = (widthValue / parentWidthValue) * 100;
          
          // Calculate the remaining time based on the current width
          const timeRemaining = Math.round((100 - percentWidth) / 100 * intervalTime);
          
          // Set the transition to match exactly the remaining time
          statusBarStatus.style.transition = `width ${timeRemaining}ms linear`;
          
          // Continue the status animation
          requestAnimationFrame(() => {
            statusBarStatus.style.width = '100%';
          });
          
          // Update animation tracking variables
          animationStartTime = Date.now();
          remainingTime = timeRemaining;
          
          // Set the timer for the next slide with the remaining time
          slideTimer = setTimeout(nextSlide, timeRemaining);
        } else {
          // Fallback if no status bar status found
          slideTimer = setTimeout(nextSlide, remainingTime || intervalTime);
        }
      } else {
        // Fallback if no status bar found
        slideTimer = setTimeout(nextSlide, remainingTime || intervalTime);
      }
    } else {
      // Fallback if no status value found
      slideTimer = setTimeout(nextSlide, remainingTime || intervalTime);
    }
  }
  
  // Initialize the slider
  initSlider();
});