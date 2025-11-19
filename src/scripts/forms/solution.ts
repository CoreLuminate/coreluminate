import type { FormSubmissionResult } from '../../lib/formSubmission';
import { submitFormData } from '../../lib/formSubmission';

class SolutionForm {
  private form: HTMLFormElement;
  private submitBtn: HTMLButtonElement;

  constructor() {
    this.form = document.getElementById('solution-form') as HTMLFormElement;
    this.submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;

    this.init(); 
  }

  private init(): void {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    (window as any).onTurnstileSuccess = this.onTurnstileSuccess.bind(this);
    (window as any).onTurnstileError = this.onTurnstileError.bind(this);
  }

  private onTurnstileSuccess(token: string): void {
    console.log('Turnstile success, token:', token);
  }

  private onTurnstileError(): void {
    console.error('Turnstile error occurred.');
    this.showToast('There was an error with the verification. Please try again.', true, false);
  }

  private isFormValid(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const fields = this.form.querySelectorAll('input, select, textarea');

    fields.forEach((field) => {
      const value = (field as HTMLInputElement).value;
      const fieldName = field.getAttribute('name');

      if (field.getAttribute('required') !== null && (!value || value.trim() === '')) {
        errors.push(`${fieldName} is required.`);
      }

      if(!value) { return;  // Skip further validation if value is empty
      }
      
      if (fieldName === 'email' && !this.validateEmail(value)) {
        errors.push('Please enter a valid email address.');
      }
      if (fieldName === 'phone' && !this.validatePhone(value)) {
        errors.push('Please enter a valid 10-digit phone number.');
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePhone(phone: string): boolean {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Show toast message
   */
  private showToast(message: string, isError: boolean = false, autoHide: boolean = true): void {
    const classNormal = ['bg-blue-40', 'text-blue-600', 'border-blue-200'];
    const classError = ['bg-red-50', 'text-red-600', 'border-red-200'];
    const classSuccess = ['bg-emerald-50', 'text-emerald-600', 'border-emerald-200'];

    const toast = document.getElementById('form-toast') as HTMLDivElement;
    const toastMessage = document.getElementById('form-toast-message') as HTMLSpanElement;

    if (toast && toastMessage) {
      toast.classList.remove(...classNormal, ...classError, ...classSuccess);
      if (isError) {
        toast.classList.add(...classError);
      } else {
        toast.classList.add(...classSuccess);
      }

      toastMessage.textContent = message;
      toast.classList.remove('hidden');

      if (autoHide) {
        setTimeout(() => {
          toast.classList.add('hidden');
        }, 8000);
      }
    }
  }

  /**
   * Hide toast message
   */
  private hideToast(): void {
    const toast = document.getElementById('form-toast');
    if (toast) {
      toast.classList.add('hidden');
    }
  }
  
  /**
   * Handle form submission
   */
  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    
    const validation = this.isFormValid();

    if (!validation.isValid) {
      this.showToast(validation.errors.join(' '), true, false);
      return;
    }

    try {
      this.submitBtn.disabled = true;

      const rawData = new FormData(this.form);

      const result: FormSubmissionResult = await submitFormData(rawData, 'solution-request');
      if (!result.success) {
        this.showToast(result.message, true, false);
        return;
      } 

      this.showToast('Thank you for reaching out! We will get back to you shortly.', false, true);

      // Reset form
      this.form.reset();

      if((window as any).turnstile) {
        (window as any).turnstile.reset();
      }

    } catch (error) {
      console.error('Form submission error:', error);
      this.showToast('There was an error submitting the form. Please try again later.', true, false);
    } finally {
      this.submitBtn.disabled = false;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = new SolutionForm();
}); 