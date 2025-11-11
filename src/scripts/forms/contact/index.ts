/**
 * Contact Form Handler
 * Simple single-page contact form with validation
 */

class ContactForm {
  private form: HTMLFormElement;
  private submitBtn: HTMLButtonElement;

  constructor() {
    this.form = document.getElementById('contact-form') as HTMLFormElement;
    this.submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
    
    this.init();
  }

  /**
   * Initialize form
   */
  private init(): void {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Validate form fields
   */
  private validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Name validation
    const name = (document.getElementById('name') as HTMLInputElement).value;
    if (name.trim() === '') {
      errors.push('Name is required.');
    }

    // Email validation
    const email = (document.getElementById('email') as HTMLInputElement).value;
    if (email.trim() === '') {
      errors.push('Email address is required.');
    } else if (!this.validateEmail(email)) {
      errors.push('Please enter a valid email address.');
    }

    // Phone validation (optional but if provided, should be valid)
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    if (phone.trim() !== '' && !this.validatePhone(phone)) {
      errors.push('Please enter a valid 10-digit phone number.');
    }

    // Subject validation
    const subject = (document.getElementById('subject') as HTMLSelectElement).value;
    if (subject === '') {
      errors.push('Please select a subject.');
    }

    // Message validation
    const message = (document.getElementById('message') as HTMLTextAreaElement).value;
    if (message.trim() === '') {
      errors.push('Message is required.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email format
   */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  private validatePhone(phone: string): boolean {
    if (!phone || phone.trim() === '') return true; // Optional field
    
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  /**
   * Show toast notification
   */
  private showToast(message: string, isError: boolean = false, isSuccess: boolean = false): void {
    const toast = document.getElementById('contact-toast');
    const messageEl = document.getElementById('contact-message');
    
    if (!toast || !messageEl) return;

    const classNormal = ['bg-blue-50', 'text-blue-600', 'border-blue-200'];
    const classError = ['bg-red-50', 'text-red-600', 'border-red-200'];
    const classSuccess = ['bg-emerald-50', 'text-emerald-600', 'border-emerald-200'];

    // Remove all classes
    toast.classList.remove(...classNormal, ...classError, ...classSuccess);

    // Add appropriate classes
    if (isError) {
      toast.classList.add(...classError);
    } else if (isSuccess) {
      toast.classList.add(...classSuccess);
    } else {
      toast.classList.add(...classNormal);
    }

    messageEl.innerHTML = message;
    toast.classList.remove('hidden');

    // Auto-hide non-error toasts after 5 seconds
    if (isSuccess) {
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 5000);
    }
  }

  /**
   * Hide toast notification
   */
  private hideToast(): void {
    const toast = document.getElementById('contact-toast');
    toast?.classList.add('hidden');
  }

  /**
   * Handle form submission
   */
  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    // Validate form
    const validation = this.validate();
    
    if (!validation.isValid) {
      this.showToast(validation.errors.join('<br>'), true, false);
      return;
    }

    // Disable submit button
    this.submitBtn.disabled = true;
    const originalText = this.submitBtn.textContent;
    this.submitBtn.textContent = 'Sending...';

    try {
      // Get form data
      const formData = new FormData(this.form);
      
      // TODO: Integrate with Netlify Forms API
      console.log('Contact form submitted:', Object.fromEntries(formData));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      this.showToast(
        'Thank you for your message! We\'ll get back to you within 24 hours.',
        false,
        true
      );

      // Reset form
      this.form.reset();

    } catch (error) {
      console.error('Form submission error:', error);
      this.showToast(
        'There was an error sending your message. Please try again or contact us directly via email.',
        true,
        false
      );
    } finally {
      // Re-enable submit button
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = originalText;
    }
  }
}

// Initialize form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ContactForm();
});