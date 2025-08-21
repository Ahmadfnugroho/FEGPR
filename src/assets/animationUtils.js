/**
 * Animation Utilities for GPR Website
 * This file contains utility functions for handling animations
 */

/**
 * Initializes scroll animations by adding event listeners and checking initial positions
 */
export function initScrollAnimations() {
  console.log('Initializing scroll animations');
  
  // Force initial check after a short delay to ensure DOM is fully rendered
  setTimeout(() => {
    const animatedElements = document.querySelectorAll(
      '.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .stagger-fade-in'
    );
    
    console.log('Found animated elements:', animatedElements.length);
    
    // Check initial positions
    checkElementsInViewport(animatedElements);
    
    // Initialize staggered animations
    initStaggerAnimations();
    
    // Add scroll event listener
    window.addEventListener('scroll', () => {
      checkElementsInViewport(animatedElements);
      initStaggerAnimations();
    });
    
    // Also check on resize (for responsive layouts)
    window.addEventListener('resize', () => {
      checkElementsInViewport(animatedElements);
      initStaggerAnimations();
    });
  }, 100); // Short delay to ensure DOM is ready
}

/**
 * Checks if elements are in viewport and adds 'visible' class accordingly
 * @param {NodeList} elements - Elements to check
 */
function checkElementsInViewport(elements) {
  elements.forEach(element => {
    if (isElementInViewport(element) && !element.classList.contains('visible')) {
      console.log('Element in viewport:', element);
      // Check if element has a delay attribute
      const delay = element.dataset.delay || 0;
      
      // Add visible class with delay if specified
      if (delay > 0) {
        setTimeout(() => {
          element.classList.add('visible');
          console.log('Added visible class with delay:', element);
        }, parseInt(delay));
      } else {
        element.classList.add('visible');
        console.log('Added visible class immediately:', element);
      }
    }
  });
}

/**
 * Initializes staggered animations for elements with stagger-item class
 */
function initStaggerAnimations() {
  // Find all stagger containers
  const staggerContainers = document.querySelectorAll('.stagger-fade-in');
  
  staggerContainers.forEach(container => {
    // Check if container is in viewport
    if (isElementInViewport(container)) {
      // Add visible class to container if not already visible
      if (!container.classList.contains('visible')) {
        container.classList.add('visible');
      }
      
      // Only process containers that haven't been processed yet
      if (!container.dataset.staggerProcessed) {
        const staggerItems = container.querySelectorAll('.stagger-item');
        const staggerDelay = parseInt(container.dataset.staggerdelay || 75); // Default 75ms between items
        
        staggerItems.forEach((item, index) => {
          // Use data-index if available, otherwise use the loop index
          const itemIndex = parseInt(item.dataset.index !== undefined ? item.dataset.index : index);
          const delay = itemIndex * staggerDelay;
          
          setTimeout(() => {
            item.classList.add('visible');
          }, delay);
        });
        
        // Mark container as processed to avoid re-processing
        container.dataset.staggerProcessed = 'true';
      }
    }
  });
}

/**
 * Determines if an element is in the viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - Whether element is in viewport
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  // Element is considered in viewport if it's at least partially visible
  return (
    rect.top <= windowHeight && 
    rect.bottom >= 0 &&
    rect.left <= windowWidth &&
    rect.right >= 0
  );
}

/**
 * Initializes parallax effect for elements with the 'parallax' class and 'parallax-bg' class
 */
export function initParallaxEffect() {
  // Classic parallax backgrounds
  const parallaxElements = document.querySelectorAll('.parallax');
  
  // Modern parallax elements with data-speed attribute
  const parallaxBgElements = document.querySelectorAll('.parallax-bg');
  
  if (parallaxElements.length === 0 && parallaxBgElements.length === 0) return;
  
  // Initial position
  updateParallaxPositions(parallaxElements);
  updateParallaxBgPositions(parallaxBgElements);
  
  // Update on scroll
  window.addEventListener('scroll', () => {
    updateParallaxPositions(parallaxElements);
    updateParallaxBgPositions(parallaxBgElements);
  });
  
  // Update on mouse move for subtle interactive parallax
  window.addEventListener('mousemove', (e) => {
    updateParallaxOnMouseMove(parallaxBgElements, e);
  });
}

/**
 * Updates the background position of parallax elements based on scroll position
 * @param {NodeList} elements - Parallax elements to update
 */
function updateParallaxPositions(elements) {
  elements.forEach(element => {
    const scrollPosition = window.pageYOffset;
    const elementTop = element.offsetTop;
    const elementHeight = element.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // Only apply parallax if element is in view
    if (
      elementTop + elementHeight > scrollPosition &&
      elementTop < scrollPosition + viewportHeight
    ) {
      // Calculate how far the element is from the top of the viewport
      const distanceFromTop = elementTop - scrollPosition;
      // Calculate the parallax offset (adjust the 0.4 value to control the effect intensity)
      const parallaxOffset = distanceFromTop * 0.4;
      
      // Apply the parallax effect by adjusting the background position
      element.style.backgroundPositionY = `calc(50% + ${parallaxOffset}px)`;
    }
  });
}

/**
 * Updates the transform position of parallax-bg elements based on scroll position
 * @param {NodeList} elements - Parallax background elements to update
 */
function updateParallaxBgPositions(elements) {
  const scrollPosition = window.pageYOffset;
  
  elements.forEach(element => {
    // Get the parent container to determine position
    const container = element.closest('.parallax-container') || element.parentElement;
    const containerRect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Only apply parallax if container is in view
    if (
      containerRect.bottom > 0 &&
      containerRect.top < viewportHeight
    ) {
      // Get the parallax speed from data attribute or use default
      const speed = parseFloat(element.dataset.parallaxSpeed || -0.15);
      
      // Calculate the parallax offset based on how far the element is from the center of the viewport
      const viewportCenter = viewportHeight / 2;
      const elementCenter = containerRect.top + (containerRect.height / 2);
      const distanceFromCenter = elementCenter - viewportCenter;
      
      // Apply transform based on scroll position and speed
      element.style.transform = `translateY(${distanceFromCenter * speed}px)`;
    }
  });
}

/**
 * Updates parallax elements based on mouse movement for subtle interactive effect
 * @param {NodeList} elements - Parallax elements to update
 * @param {MouseEvent} event - Mouse move event
 */
function updateParallaxOnMouseMove(elements, event) {
  const mouseX = event.clientX / window.innerWidth - 0.5; // -0.5 to 0.5
  const mouseY = event.clientY / window.innerHeight - 0.5; // -0.5 to 0.5
  
  elements.forEach(element => {
    // Only apply mouse parallax if element has the interactive class
    if (element.classList.contains('parallax-interactive')) {
      const mouseMoveIntensity = parseFloat(element.dataset.mouseParallax || 15);
      element.style.transform = `translate(${mouseX * mouseMoveIntensity}px, ${mouseY * mouseMoveIntensity}px)`;
    }
  });
}

/**
 * Initializes typing animation for elements with the 'animate-typing' class
 */
export function initTypingAnimation() {
  const typingElements = document.querySelectorAll('.animate-typing');
  
  typingElements.forEach(element => {
    // Store the original text
    const originalText = element.textContent;
    // Clear the element
    element.textContent = '';
    // Set the element to be visible (in case it was hidden)
    element.style.width = '0';
    element.style.visibility = 'visible';
    
    // Add the animation class to start the typing effect
    element.classList.add('animate-typing');
  });
}

/**
 * Adds micro-interactions to interactive elements
 */
export function initMicroInteractions() {
  // Add click effect to buttons
  const buttons = document.querySelectorAll('button, .btn, [role="button"]');
  buttons.forEach(button => {
    button.classList.add('click-effect');
  });
  
  // Add hover effects to cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.classList.add('hover-lift');
  });
}

/**
 * Main initialization function to set up all animations
 */
export function initAllAnimations() {
  // Initialize all animations immediately
  initScrollAnimations();
  initParallaxEffect();
  initTypingAnimation();
  initMicroInteractions();
  
  console.log('All animations initialized');
}