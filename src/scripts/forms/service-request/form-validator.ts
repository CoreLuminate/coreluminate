/**
 * FormValidator - Handles all validation logic for the service request form
 * Responsible for: step validation, field validation, error handling
 */

export interface ValidationResult {
  [fieldName: string]: string[] | undefined;
}

export class FormValidationState {
  private errors: ValidationResult = {};

  public isValid(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  public addError(fieldName: string, message: string): void {
    if (!this.errors[fieldName]) {
      this.errors[fieldName] = [];
    }

    this.errors[fieldName]?.push(message);
  }

  public getErrors(fieldName: string): string[] | undefined {
    return this.errors[fieldName];
  }

  public getAllErrors(): ValidationResult {
    return this.errors;
  }

  public getFormattedErrors(): string {
    const formattedMessages: string[] = [];

    for (const fieldName in this.errors) {
      if (this.errors.hasOwnProperty(fieldName)) {
        const fieldErrors = this.errors[fieldName];
        
        if (fieldErrors && fieldErrors.length > 0) {
          // Iterate over each error message for the current field
          for (const message of fieldErrors) {
            formattedMessages.push(message);
          }
        }
      }
    }

    return formattedMessages.join('<br>'); 
  }

  public clearErrors(): void {
    this.errors = {};
  }
}

export class FormValidator {
  /**
   * Validate specific step
   */
  validateStep(step: number): FormValidationState {
    const validationState = new FormValidationState();

    switch (step) {
      case 1:
        this.validateServiceSelection(validationState);
        break;
      case 2:
        this.validateProjectDetails(validationState);
        break;
      case 3:
        this.validateContactInfo(validationState);
        break;
      default:
        break;
    }

    return validationState;
  }

  /**
   * Validate service selection (Step 1)
   * Ensures at least one service is selected
   */
  private validateServiceSelection(validationState: FormValidationState): void {
    const checkboxes = document.querySelectorAll(
      'input[name="services"]:checked'
    );
    const isValid = checkboxes.length > 0;

    if (!isValid) {
      validationState.addError('services', 'Please select at least one service.')
    }
  }

  /**
   * Validate project details (Step 2)
   * Ensures required fields are filled
   */
  private validateProjectDetails(state: FormValidationState): void {
    const description = (document.getElementById('project-description') as HTMLTextAreaElement)?.value;
    const budget = (document.getElementById('budget') as HTMLSelectElement)?.value;
    const timeline = (document.getElementById('timeline') as HTMLSelectElement)?.value;

    if(description.trim() === '') {
      state.addError("project-description", "Project description is required.")
    }

    if (budget === '') {
      state.addError('budget', 'Please select a budget range.');
    }

    if (timeline === '') {
      state.addError('timeline', 'Please select a desired timeline.');
    }
  }

  /**
   * Validate contact info (Step 3)
   * Ensures required contact fields are filled
   */
private validateContactInfo(state: FormValidationState): void {
    
    const firstName = (document.getElementById('first-name') as HTMLInputElement)?.value || '';
    const lastName = (document.getElementById('last-name') as HTMLInputElement)?.value || '';
    const email = (document.getElementById('email') as HTMLInputElement)?.value || '';
    
    if (firstName.trim() === '') {
      state.addError('first-name', 'First name is required.');
    }

    if (lastName.trim() === '') {
      state.addError('last-name', 'Last name is required.');
    }

    // Check email requirement and format
    if (email.trim() === '') {
      state.addError('email', 'Email address is required.');
    } else if (!this.validateEmail(email)) {
      state.addError('email', 'Please enter a valid email address.');
    }
    
    // Phone validation (optional field, only add error if provided and invalid)
    const phone = (document.getElementById('phone') as HTMLInputElement)?.value || '';
    if (phone.trim() !== '' && !this.validatePhone(phone)) {
        state.addError('phone', 'Please enter a valid 10-digit phone number.');
    }
  }


  /**
   * Validate email format
   */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format (optional but if provided, should be valid)
   */
  private validatePhone(phone: string): boolean {
    if (!phone || phone.trim() === '') return true; // Optional field
    
    // Basic phone validation - digits, spaces, dashes, parentheses
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }
}