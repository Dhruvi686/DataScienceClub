/**
 * Generic Auto Slider / Carousel for Team and Alumni
 */

class AutoSlider {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.track = this.container.querySelector('.slider-track');
        this.slides = Array.from(this.track.children);
        
        // Options
        this.autoRotateInterval = options.interval || 3000;
        this.slideWidth = options.slideWidth || 300; // Approximate card width + gap
        this.gap = options.gap || 24;
        this.autoRotate = options.autoRotate !== false;
        
        this.currentIndex = 0;
        this.isHovered = false;
        this.intervalId = null;

        this.init();
    }

    init() {
        // Clone slides for infinite loop illusion
        // We clone enough to fill the view
        const slidesToClone = this.slides.length; 
        for(let i=0; i < slidesToClone; i++) {
             const clone = this.slides[i].cloneNode(true);
             this.track.appendChild(clone);
        }

        // Mouse pause
        this.container.addEventListener('mouseenter', () => {
            this.isHovered = true;
            this.pause();
        });
        
        this.container.addEventListener('mouseleave', () => {
             this.isHovered = false;
             this.play();
        });

        // Controls
        const prevBtn = this.container.querySelector('.prev-btn');
        const nextBtn = this.container.querySelector('.next-btn');

        if(prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if(nextBtn) nextBtn.addEventListener('click', () => this.next());

        this.play();
    }

    play() {
        if (!this.autoRotate || this.intervalId) return;
        this.intervalId = setInterval(() => {
            if (!this.isHovered) {
                this.next();
            }
        }, this.autoRotateInterval);
    }

    pause() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    next() {
        this.currentIndex++;
        this.updatePosition();
    }

    prev() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
             // Jump to end without transition for seamless loop (simplified)
             this.currentIndex = this.slides.length - 1;
        }
        this.updatePosition();
    }

    updatePosition() {
        const slideTotalWidth = this.slideWidth + this.gap;
        
        // Reset if we've scrolled past the original set
        if (this.currentIndex >= this.slides.length) {
            // Disable transition for instant jump back
            this.track.style.transition = 'none';
            this.currentIndex = 0;
            this.track.style.transform = `translateX(0px)`;
            
            // Force reflow
            void this.track.offsetHeight;
            
            // Re-enable transition and move to next
            this.track.style.transition = 'transform 0.5s ease-out';
            this.currentIndex = 1; // Move to the *next* logical slide
        }

        const translateX = -(this.currentIndex * slideTotalWidth);
        this.track.style.transform = `translateX(${translateX}px)`;
    }
}

// Initialize Sliders when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Alumni Slider (Faster Auto Rotation)
    if (document.getElementById('alumni-slider')) {
        new AutoSlider('alumni-slider', {
            interval: 2000, 
            slideWidth: 320,
            gap: 24,
            autoRotate: true
        });
    }

    // Previous Team Slider 2024
    if (document.getElementById('slider-2024')) {
        new AutoSlider('slider-2024', {
            interval: 4000,
            slideWidth: 280, 
            gap: 24,
            autoRotate: false
        });
    }


});
