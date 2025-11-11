/**
 * Service Request Form - Main orchestrator
 * Coordinates between UI, validation, and data management
 */

import { FormDataManager } from './form-data-manager';
import { FormUI } from './form-ui';
import { FormValidationState, FormValidator } from './form-validator';

class ServiceRequestForm {
  private currentStep = 1;
  private readonly totalSteps = 4;
  
  private ui: FormUI;
  private validator: FormValidator;
  private dataManager: FormDataManager;

  constructor() {
    this.ui = new FormUI();
    this.validator = new FormValidator();
    this.dataManager = new FormDataManager();
    
    this.init();
  }

  /**
   * Initialize form
   */
  private init(): void {
    this.ui.initServiceCardSelection();

    // Apply URL parameters first
    this.dataManager.applyUrlParameters();
    
    // Show initial step
    this.ui.showStep(this.currentStep, this.totalSteps);
    
    // Set up UI interactions
    this.dataManager.displayPreselectedPackage();
    this.dataManager.displayPreselectedManagedHosting();
    
    // Attach event listeners
    this.attachEventListeners();
  }

  /**
   * Attach event listeners to buttons
   */
  private attachEventListeners(): void {
    const buttons = this.ui.getButtons();
    
    buttons.next.addEventListener('click', () => this.handleNext());
    buttons.prev.addEventListener('click', () => this.handlePrev());
    
    const form = document.getElementById('service-request-form') as HTMLFormElement;
    form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Handle next button click
   */
  private handleNext(): void {
    const validationState = this.validator.validateStep(this.currentStep);
    
    if (!validationState.isValid()) {
      this.ui.showServiceToast(validationState.getFormattedErrors(), true, false);
      return;
    } else {
      this.ui.hideServiceToast();
    }
    
    // Move to next step
    this.currentStep++;
    this.ui.showStep(this.currentStep, this.totalSteps);
    
    // Populate review if on last step
    if (this.currentStep === this.totalSteps) {
      this.dataManager.populateReview();
    }
  }

  /**
   * Handle previous button click
   */
  private handlePrev(): void {
    this.currentStep--;
    this.ui.showStep(this.currentStep, this.totalSteps);
    this.ui.hideServiceToast();
  }

  /**
   * Handle form submission
   */
  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    const validation = new FormValidationState();

    
    try {
      await this.dataManager.submitForm();
      this.ui.showServiceToast('Your service request has been submitted successfully.', false, true);
      this.ui.hideButtons();
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your request. Please try again.');
      validation.addError('internal', 'There was an error submitting your request. Please try again.');
      this.ui.showServiceToast(validation.getFormattedErrors(), true, false);
    }
  }
}

// Initialize form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ServiceRequestForm();
});