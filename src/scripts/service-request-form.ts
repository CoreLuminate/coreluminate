/**
 * Service Request Form - Multi-step form handler
 * Manages form navigation, validation, and submission
 */

// Service mapping for URL parameters to form values and display names
const SERVICE_MAP = {
  'website-design-development': {
    value: 'website-design-development',
    name: 'Website Design & Development'
  },
  'seo-analytics': {
    value: 'seo-analytics',
    name: 'SEO & Analytics'
  },
  'brand-logo-design': {
    value: 'brand-logo-design',
    name: 'Brand & Logo Design'
  },
  'ecommerce-solutions': {
    value: 'ecommerce-solutions',
    name: 'E-commerce Solutions'
  },
  'business-systems-setup': {
    value: 'business-systems-setup',
    name: 'Business Systems Setup'
  },
  'website-updates-add-ons': {
    value: 'website-updates-add-ons',
    name: 'Website Updates & Add-Ons'
  }
} as const;

// Package mapping for display names
const PACKAGE_MAP: Record<string, string> = {
  'starter': 'Starter Package',
  'pro': 'Pro Package',
  'custom': 'Custom Package',
  'audit': 'SEO Audit',
  'one-time': 'One-Time SEO Setup',
  'bundle': 'SEO Bundle',
  'logo-only': 'Logo Design Only',
  'full-brand': 'Full Brand Identity',
  'brand-materials': 'Brand Materials',
  'simple-store': 'Simple Store',
  'growing-store': 'Growing Store',
  'custom-store': 'Custom E-commerce',
  'content-update': 'Content Update',
  'new-feature': 'New Feature Addition',
  'bug-fix': 'Bug Fix',
  'performance': 'Performance Optimization'
};

interface FormElements {
  form: HTMLFormElement;
  prevBtn: HTMLButtonElement;
  nextBtn: HTMLButtonElement;
  submitBtn: HTMLButtonElement;
  steps: HTMLElement[];
  indicators: HTMLElement[];
  labels: HTMLElement[];
  lines: HTMLElement[];
}

class ServiceRequestForm {
  private currentStep = 1;
  private readonly totalSteps = 4;
  private elements: FormElements;

  constructor() {
    this.elements = this.getElements();
    this.init();
  }

  /**
   * Get all form elements by ID for performance
   */
  private getElements(): FormElements {
    return {
      form: document.getElementById('service-request-form') as HTMLFormElement,
      prevBtn: document.getElementById('prev-btn') as HTMLButtonElement,
      nextBtn: document.getElementById('next-btn') as HTMLButtonElement,
      submitBtn: document.getElementById('submit-btn') as HTMLButtonElement,
      steps: [
        document.getElementById('step-1') as HTMLElement,
        document.getElementById('step-2') as HTMLElement,
        document.getElementById('step-3') as HTMLElement,
        document.getElementById('step-4') as HTMLElement,
      ],
      indicators: [
        document.getElementById('indicator-1') as HTMLElement,
        document.getElementById('indicator-2') as HTMLElement,
        document.getElementById('indicator-3') as HTMLElement,
        document.getElementById('indicator-4') as HTMLElement,
      ],
      labels: [
        document.getElementById('label-1') as HTMLElement,
        document.getElementById('label-2') as HTMLElement,
        document.getElementById('label-3') as HTMLElement,
        document.getElementById('label-4') as HTMLElement,
      ],
      lines: [
        document.getElementById('line-1') as HTMLElement,
        document.getElementById('line-2') as HTMLElement,
        document.getElementById('line-3') as HTMLElement,
      ],
    };
  }

  /**
   * Initialize form - set up event listeners
   */
  private init(): void {
    this.applyUrlParameters();
    this.showStep(this.currentStep);
    this.attachEventListeners();
    this.initServiceCardSelection();
    this.displayPreselectedPackage();
  }

  /**
   * Read URL parameters and pre-select form options
   */
  private applyUrlParameters(): void {
    const params = new URLSearchParams(window.location.search);
    
    // Pre-select service
    const serviceParam = params.get('service');
    console.log(serviceParam);
    if (serviceParam && serviceParam in SERVICE_MAP) {
      const serviceValue = SERVICE_MAP[serviceParam as keyof typeof SERVICE_MAP].value;
      console.log(serviceValue);
      const checkbox = document.querySelector(
        `input[name="services"][value="${serviceValue}"]`
      ) as HTMLInputElement;
      
      if (checkbox) {
        console.log(serviceParam);
        console.log(checkbox.value);
        checkbox.checked = true;
        // Manually trigger the change event to update styling
        const event = new Event('change', { bubbles: true });
        checkbox.dispatchEvent(event);
      }
    }

    // Store package/type for Step 2
    const packageParam = params.get('package');
    if (packageParam) {
      sessionStorage.setItem('selectedPackage', packageParam);
    }

    // Store hosting preference
    const hosting = params.get('hosting');
    if (hosting === 'true') {
      sessionStorage.setItem('managedHosting', 'true');
    }

    // Store add-on type
    const type = params.get('type');
    if (type) {
      sessionStorage.setItem('updateType', type);
    }
  }

  /**
   * Display preselected package info in Step 2
   */
  private displayPreselectedPackage(): void {
    const selectedPackage = sessionStorage.getItem('selectedPackage');
    if (selectedPackage) {
      const packageDisplay = document.getElementById('package-display');
      const packageName = document.getElementById('package-name');
      const packageInput = document.getElementById('package-input') as HTMLInputElement;
      
      if (packageDisplay && packageName && packageInput) {
        // Get formatted name from PACKAGE_MAP or format from key
        const formattedName = PACKAGE_MAP[selectedPackage] || 
          selectedPackage
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        packageName.textContent = formattedName;
        packageInput.value = selectedPackage;
        packageDisplay.classList.remove('hidden');
      }
    }

    // Display managed hosting if selected
    const managedHosting = sessionStorage.getItem('managedHosting');
    if (managedHosting === 'true') {
      const hostingDisplay = document.getElementById('hosting-display');
      if (hostingDisplay) {
        hostingDisplay.classList.remove('hidden');
      }
    }
  }

  /**
   * Attach event listeners to buttons
   */
  private attachEventListeners(): void {
    this.elements.nextBtn.addEventListener('click', () => this.handleNext());
    this.elements.prevBtn.addEventListener('click', () => this.handlePrev());
    this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Initialize service card selection styling
   */
  private initServiceCardSelection(): void {
    document.querySelectorAll('.service-checkbox').forEach((checkbox) => {
      const inputEl = checkbox as HTMLInputElement;
      
      // Apply initial styling if checkbox is already checked
      if (inputEl.checked) {
        this.updateServiceCardStyling(inputEl, true);
      }
      
      // Listen for future changes
      checkbox.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        this.updateServiceCardStyling(target, target.checked);
      });
    });
  }

  /**
   * Update service card styling based on checked state
   */
  private updateServiceCardStyling(checkbox: HTMLInputElement, isChecked: boolean): void {
    const cardContent = checkbox.nextElementSibling;
    const checkmark = cardContent?.querySelector('.service-checkmark');

    if (isChecked) {
      cardContent?.classList.remove('border-slate-200', 'bg-white');
      cardContent?.classList.add('border-blue-300', 'bg-blue-50');
      checkmark?.classList.remove('bg-slate-200');
      checkmark?.classList.add('bg-blue-600');
    } else {
      cardContent?.classList.remove('border-blue-300', 'bg-blue-50');
      cardContent?.classList.add('border-slate-200', 'bg-white');
      checkmark?.classList.remove('bg-blue-600');
      checkmark?.classList.add('bg-slate-200');
    }
  }

  /**
   * Show specific step
   */
  private showStep(step: number): void {
    // Hide all steps
    this.elements.steps.forEach((stepEl) => stepEl?.classList.remove('active'));

    // Show current step
    const currentStepEl = this.elements.steps[step - 1];
    if (currentStepEl) {
      currentStepEl.classList.add('active');
    }

    // Update progress indicators and labels
    this.updateProgressIndicators(step);

    // Update progress lines
    this.updateProgressLines(step);

    // Update button visibility
    this.updateButtonVisibility(step);

    // If on review step, populate review data
    if (step === this.totalSteps) {
      this.populateReview();
    }
  }

  /**
   * Update progress indicators and labels
   */
  private updateProgressIndicators(step: number): void {
    this.elements.indicators.forEach((indicator, index) => {
      const stepNum = index + 1;
      const numberEl = indicator?.querySelector('.step-number');
      const label = this.elements.labels[index];

      if (stepNum < step) {
        // Completed state
        indicator?.classList.remove('bg-blue-600', 'bg-slate-200');
        indicator?.classList.add('bg-emerald-500');
        numberEl?.classList.remove('text-slate-600', 'text-white');
        numberEl?.classList.add('text-white');
        label?.classList.remove('text-slate-400', 'text-slate-900');
        label?.classList.add('text-emerald-600');
      } else if (stepNum === step) {
        // Active state
        indicator?.classList.remove('bg-slate-200', 'bg-emerald-500');
        indicator?.classList.add('bg-blue-600');
        numberEl?.classList.remove('text-slate-600');
        numberEl?.classList.add('text-white');
        label?.classList.remove('text-slate-400', 'text-emerald-600');
        label?.classList.add('text-slate-900');
      } else {
        // Upcoming state
        indicator?.classList.remove('bg-blue-600', 'bg-emerald-500');
        indicator?.classList.add('bg-slate-200');
        numberEl?.classList.remove('text-white');
        numberEl?.classList.add('text-slate-600');
        label?.classList.remove('text-slate-900', 'text-emerald-600');
        label?.classList.add('text-slate-400');
      }
    });
  }

  /**
   * Update progress lines
   */
  private updateProgressLines(step: number): void {
    this.elements.lines.forEach((line, index) => {
      if (index < step - 1) {
        line?.classList.remove('bg-slate-200');
        line?.classList.add('bg-emerald-500');
      } else {
        line?.classList.remove('bg-emerald-500');
        line?.classList.add('bg-slate-200');
      }
    });
  }

  /**
   * Update button visibility based on current step
   */
  private updateButtonVisibility(step: number): void {
    if (step === 1) {
      this.elements.prevBtn.classList.add('hidden');
    } else {
      this.elements.prevBtn.classList.remove('hidden');
    }

    if (step === this.totalSteps) {
      this.elements.nextBtn.classList.add('hidden');
      this.elements.submitBtn.classList.remove('hidden');
    } else {
      this.elements.nextBtn.classList.remove('hidden');
      this.elements.submitBtn.classList.add('hidden');
    }
  }

  /**
   * Handle next button click
   */
  private handleNext(): void {
    if (this.validateStep(this.currentStep)) {
      this.currentStep++;
      this.showStep(this.currentStep);
    }
  }

  /**
   * Handle previous button click
   */
  private handlePrev(): void {
    this.currentStep--;
    this.showStep(this.currentStep);
  }

  /**
   * Validate current step
   */
  private validateStep(step: number): boolean {
    if (step === 1) {
      return this.validateServiceSelection();
    }

    if (step === 2) {
      return this.validateProjectDetails();
    }

    if (step === 3) {
      return this.validateContactInfo();
    }

    return true;
  }

  /**
   * Validate service selection (Step 1)
   */
  private validateServiceSelection(): boolean {
    const checkboxes = document.querySelectorAll(
      'input[name="services"]:checked'
    );
    const errorEl = document.getElementById('service-error');

    if (checkboxes.length === 0) {
      errorEl?.classList.remove('hidden');
      return false;
    }

    errorEl?.classList.add('hidden');
    return true;
  }

  /**
   * Validate project details (Step 2)
   */
  private validateProjectDetails(): boolean {
    const description = (
      document.getElementById('project-description') as HTMLTextAreaElement
    ).value;
    const budget = (document.getElementById('budget') as HTMLSelectElement)
      .value;
    const timeline = (document.getElementById('timeline') as HTMLSelectElement)
      .value;

    return (
      description.trim() !== '' && budget !== '' && timeline !== ''
    );
  }

  /**
   * Validate contact info (Step 3)
   */
  private validateContactInfo(): boolean {
    const firstName = (
      document.getElementById('first-name') as HTMLInputElement
    ).value;
    const lastName = (
      document.getElementById('last-name') as HTMLInputElement
    ).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;

    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.trim() !== ''
    );
  }

  /**
   * Populate review step with form data
   */
  private populateReview(): void {
    this.populateSelectedServices();
    this.populateProjectDetails();
    this.populateContactInfo();
  }

  /**
   * Populate selected services in review
   */
  private populateSelectedServices(): void {
    const selectedServices = Array.from(
      document.querySelectorAll('input[name="services"]:checked')
    ).map((checkbox) => {
      const label = (checkbox as HTMLInputElement)
        .closest('.service-card')
        ?.querySelector('h3')?.textContent;
      return label;
    });

    const servicesHtml = selectedServices
      .map(
        (service) =>
          `<div class="flex items-center gap-2 text-slate-700">
            <div class="w-2 h-2 bg-blue-600 rounded-full shrink-0"></div>
            <span>${service}</span>
          </div>`
      )
      .join('');

    const reviewServicesEl = document.getElementById('review-services');
    if (reviewServicesEl) {
      reviewServicesEl.innerHTML = servicesHtml;
    }
  }

  /**
   * Populate project details in review
   */
  private populateProjectDetails(): void {
    const description = (
      document.getElementById('project-description') as HTMLTextAreaElement
    ).value;
    const budget = document.getElementById('budget') as HTMLSelectElement;
    const timeline = document.getElementById('timeline') as HTMLSelectElement;

    const reviewDescriptionEl = document.getElementById('review-description');
    if (reviewDescriptionEl) {
      reviewDescriptionEl.textContent = description;
    }

    const reviewBudgetEl = document.getElementById('review-budget');
    if (reviewBudgetEl) {
      reviewBudgetEl.textContent =
        budget.options[budget.selectedIndex]?.text || '';
    }

    const reviewTimelineEl = document.getElementById('review-timeline');
    if (reviewTimelineEl) {
      reviewTimelineEl.textContent =
        timeline.options[timeline.selectedIndex]?.text || '';
    }
  }

  /**
   * Populate contact info in review
   */
  private populateContactInfo(): void {
    const firstName = (
      document.getElementById('first-name') as HTMLInputElement
    ).value;
    const lastName = (
      document.getElementById('last-name') as HTMLInputElement
    ).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    const company = (document.getElementById('company') as HTMLInputElement)
      .value;

    const reviewNameEl = document.getElementById('review-name');
    if (reviewNameEl) {
      reviewNameEl.textContent = `${firstName} ${lastName}`;
    }

    const reviewEmailEl = document.getElementById('review-email');
    if (reviewEmailEl) {
      reviewEmailEl.textContent = email;
    }

    const reviewPhoneEl = document.getElementById('review-phone');
    const reviewPhoneContainer = document.getElementById(
      'review-phone-container'
    );
    if (phone && reviewPhoneEl && reviewPhoneContainer) {
      reviewPhoneEl.textContent = phone;
      reviewPhoneContainer.classList.remove('hidden');
    } else if (reviewPhoneContainer) {
      reviewPhoneContainer.classList.add('hidden');
    }

    const reviewCompanyEl = document.getElementById('review-company');
    const reviewCompanyContainer = document.getElementById(
      'review-company-container'
    );
    if (company && reviewCompanyEl && reviewCompanyContainer) {
      reviewCompanyEl.textContent = company;
      reviewCompanyContainer.classList.remove('hidden');
    } else if (reviewCompanyContainer) {
      reviewCompanyContainer.classList.add('hidden');
    }
  }

  /**
   * Handle form submission
   */
  private handleSubmit(e: Event): void {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this.elements.form);
    
    // TODO: Integrate with Netlify Forms API
    console.log('Form submitted:', Object.fromEntries(formData));

    // For now, show success message and redirect
    alert(
      "Thank you! Your request has been submitted. We'll be in touch within 1-2 business days."
    );
    window.location.href = '/';
  }
}

// Initialize form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ServiceRequestForm();
});