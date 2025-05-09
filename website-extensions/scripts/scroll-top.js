document.addEventListener('DOMContentLoaded', function() {
    const scrollTopButton = document.querySelector('[scroll-top="button"]');
    if(!scrollTopButton) return;
    
    // Set initial styles
    scrollTopButton.style.opacity = '0';
    scrollTopButton.style.visibility = 'hidden';
    scrollTopButton.style.transition = 'opacity 0.5s, visibility 0.5s';

    // Variables to track scroll behavior
    let lastScrollTop = 0;
    let scrollDirection = 'none';
    let scrollAmount = 0;
    
    // Function to check scroll position and toggle button visibility
    function toggleButtonVisibility() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Determine scroll direction
        if (currentScrollTop > lastScrollTop) {
            // Scrolling down
            if (scrollDirection !== 'down') {
                // Direction changed from up to down
                scrollDirection = 'down';
                scrollAmount = 0;
            } else {
                // Continue scrolling down
                scrollAmount += (currentScrollTop - lastScrollTop);
            }
            
            // Hide button after scrolling down 50px
            if (scrollAmount > 50) {
                scrollTopButton.style.opacity = '0';
                scrollTopButton.style.visibility = 'hidden';
            }
        } else if (currentScrollTop < lastScrollTop) {
            // Scrolling up
            if (scrollDirection !== 'up') {
                // Direction changed from down to up
                scrollDirection = 'up';
                scrollAmount = 0;
            } else {
                // Continue scrolling up
                scrollAmount += (lastScrollTop - currentScrollTop);
            }
            
            // Show button after scrolling up 100px, but hide if near top (300px from top)
            if (scrollAmount > 100 && currentScrollTop > 300) {
                scrollTopButton.style.opacity = '1';
                scrollTopButton.style.visibility = 'visible';
            } else if (currentScrollTop <= 300) {
                scrollTopButton.style.opacity = '0';
                scrollTopButton.style.visibility = 'hidden';
            }
        }
        
        lastScrollTop = currentScrollTop;
    }

    // Initial check on page load
    toggleButtonVisibility();

    // Check on scroll
    window.addEventListener('scroll', toggleButtonVisibility);

    // Scroll to top when button is clicked
    scrollTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});