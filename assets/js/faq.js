// FAQ functionality with smooth animations
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Helper function to calculate content height
    function getContentHeight(element) {
        // Clone the element
        const clone = element.cloneNode(true);
        
        // Set the height to 'auto' and make it invisible
        clone.style.height = 'auto';
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.display = 'block';
        
        // Append to body, measure, then remove
        document.body.appendChild(clone);
        const height = clone.offsetHeight;
        document.body.removeChild(clone);
        
        return height;
    }
    
    // Reset all FAQs (close them)
    faqItems.forEach(item => {
        const answer = item.querySelector('.faq-answer');
        if (answer) {
            answer.style.height = '0px';
        }
        item.classList.remove('active');
    });
    
    // Add click listeners to all FAQ questions
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            // Clear existing event listeners by cloning and replacing
            const clone = question.cloneNode(true);
            question.parentNode.replaceChild(clone, question);
            
            // Add new event listener to the clone
            clone.addEventListener('click', function() {
                // Check if this FAQ is already open
                const isOpen = item.classList.contains('active');
                
                // Close all FAQs with animation
                faqItems.forEach(faq => {
                    const faqAnswer = faq.querySelector('.faq-answer');
                    if (faq.classList.contains('active')) {
                        faqAnswer.style.height = '0px';
                        setTimeout(() => {
                            faq.classList.remove('active');
                        }, 300); // Match transition time in CSS
                    }
                });
                
                // Open this FAQ if it was closed
                if (!isOpen) {
                    item.classList.add('active');
                    const contentHeight = answer.scrollHeight;
                    answer.style.height = contentHeight + 'px';
                    
                    // Listen for transition end to set height to auto
                    const transitionEnd = () => {
                        answer.style.height = 'auto';
                        answer.removeEventListener('transitionend', transitionEnd);
                    };
                    answer.addEventListener('transitionend', transitionEnd);
                }
            });
        }
    });
    
    // Open the first FAQ by default
    if (faqItems.length > 0) {
        const firstItem = faqItems[0];
        const firstAnswer = firstItem.querySelector('.faq-answer');
        
        firstItem.classList.add('active');
        if (firstAnswer) {
            setTimeout(() => {
                const contentHeight = firstAnswer.scrollHeight;
                firstAnswer.style.height = contentHeight + 'px';
                
                // Set to auto after transition
                setTimeout(() => {
                    firstAnswer.style.height = 'auto';
                }, 300);
            }, 10);
        }
    }
}); 