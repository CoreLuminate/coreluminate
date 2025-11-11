/**
 * FormUI - Handles all UI interactions for the service request form
 * Responsible for: step visibility, progress indicators, button states, styling
 */

// ===== STYLE CONSTANTS =====
// Centralized styling for easy theme changes

const PROGRESS_STYLES = {
  indicator: {
    completed: {
      background: 'bg-emerald-500',
      text: 'text-white'
    },
    active: {
      background: 'bg-blue-600',
      text: 'text-white'
    },
    upcoming: {
      background: 'bg-slate-200',
      text: 'text-slate-600'
    }
  },
  label: {
    completed: 'text-emerald-600',
    active: 'text-slate-900',
    upcoming: 'text-slate-400'
  },
  line: {
    completed: 'bg-emerald-500',
    upcoming: 'bg-slate-200'
  }
} as const;

const SERVICE_CARD_STYLES = {
  checked: {
    border: 'border-blue-300',
    background: 'bg-blue-50',
    checkmark: 'bg-blue-600'
  },
  unchecked: {
    border: 'border-slate-200',
    background: 'bg-white',
    checkmark: 'bg-slate-200'
  },
  hover: 'hover:border-blue-300'
} as const;

// ===== CLASS =====

export class FormUI {
  private steps: HTMLElement[];
  private indicators: HTMLElement[];
  private labels: HTMLElement[];
  private lines: HTMLElement[];
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private submitBtn: HTMLButtonElement;

  constructor() {
    this.steps = [
      document.getElementById('step-1') as HTMLElement,
      document.getElementById('step-2') as HTMLElement,
      document.getElementById('step-3') as HTMLElement,
      document.getElementById('step-4') as HTMLElement,
    ];
    
    this.indicators = [
      document.getElementById('indicator-1') as HTMLElement,
      document.getElementById('indicator-2') as HTMLElement,
      document.getElementById('indicator-3') as HTMLElement,
      document.getElementById('indicator-4') as HTMLElement,
    ];
    
    this.labels = [
      document.getElementById('label-1') as HTMLElement,
      document.getElementById('label-2') as HTMLElement,
      document.getElementById('label-3') as HTMLElement,
      document.getElementById('label-4') as HTMLElement,
    ];
    
    this.lines = [
      document.getElementById('line-1') as HTMLElement,
      document.getElementById('line-2') as HTMLElement,
      document.getElementById('line-3') as HTMLElement,
    ];

    this.prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
    this.nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
    this.submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  }

  /**
   * Show specific step and update all UI elements
   */
  showStep(step: number, totalSteps: number): void {
    this.updateStepVisibility(step);
    this.updateProgressIndicators(step);
    this.updateProgressLines(step);
    this.updateButtonVisibility(step, totalSteps);
  }

  /**
   * Update which step is visible
   */
  private updateStepVisibility(step: number): void {
    this.steps.forEach((stepEl) => stepEl?.classList.remove('active'));
    
    const currentStepEl = this.steps[step - 1];
    if (currentStepEl) {
      currentStepEl.classList.add('active');
    }
  }

  /**
   * Update progress indicators (circles) and labels
   */
  private updateProgressIndicators(step: number): void {
    this.indicators.forEach((indicator, index) => {
      const stepNum = index + 1;
      const numberEl = indicator?.querySelector('.step-number');
      const label = this.labels[index];

      // Remove all state classes first
      const allBgClasses = [
        PROGRESS_STYLES.indicator.completed.background,
        PROGRESS_STYLES.indicator.active.background,
        PROGRESS_STYLES.indicator.upcoming.background
      ];
      
      const allTextClasses = [
        PROGRESS_STYLES.indicator.completed.text,
        PROGRESS_STYLES.indicator.active.text,
        PROGRESS_STYLES.indicator.upcoming.text
      ];
      
      const allLabelClasses = [
        PROGRESS_STYLES.label.completed,
        PROGRESS_STYLES.label.active,
        PROGRESS_STYLES.label.upcoming
      ];

      indicator?.classList.remove(...allBgClasses);
      numberEl?.classList.remove(...allTextClasses);
      label?.classList.remove(...allLabelClasses);

      // Apply appropriate state classes
      if (stepNum < step) {
        // Completed state
        indicator?.classList.add(PROGRESS_STYLES.indicator.completed.background);
        numberEl?.classList.add(PROGRESS_STYLES.indicator.completed.text);
        label?.classList.add(PROGRESS_STYLES.label.completed);
      } else if (stepNum === step) {
        // Active state
        indicator?.classList.add(PROGRESS_STYLES.indicator.active.background);
        numberEl?.classList.add(PROGRESS_STYLES.indicator.active.text);
        label?.classList.add(PROGRESS_STYLES.label.active);
      } else {
        // Upcoming state
        indicator?.classList.add(PROGRESS_STYLES.indicator.upcoming.background);
        numberEl?.classList.add(PROGRESS_STYLES.indicator.upcoming.text);
        label?.classList.add(PROGRESS_STYLES.label.upcoming);
      }
    });
  }

  /**
   * Update progress lines between indicators
   */
  private updateProgressLines(step: number): void {
    this.lines.forEach((line, index) => {
      if (index < step - 1) {
        line?.classList.remove(PROGRESS_STYLES.line.upcoming);
        line?.classList.add(PROGRESS_STYLES.line.completed);
      } else {
        line?.classList.remove(PROGRESS_STYLES.line.completed);
        line?.classList.add(PROGRESS_STYLES.line.upcoming);
      }
    });
  }

  /**
   * Update button visibility based on current step
   */
  private updateButtonVisibility(step: number, totalSteps: number): void {
    if (step === 1) {
      this.prevBtn.classList.add('hidden');
    } else {
      this.prevBtn.classList.remove('hidden');
    }

    if (step === totalSteps) {
      this.nextBtn.classList.add('hidden');
      this.submitBtn.classList.remove('hidden');
    } else {
      this.nextBtn.classList.remove('hidden');
      this.submitBtn.classList.add('hidden');
    }
  }

  public hideButtons(): void {
    this.submitBtn.classList.add('hidden');
    this.prevBtn.classList.add('hidden');
    this.nextBtn.classList.add('hidden');
  }

  /**
   * Initialize service card selection styling and listeners
   */
  initServiceCardSelection(): void {
    document.querySelectorAll('.service-checkbox').forEach((checkbox) => {
      const inputEl = checkbox as HTMLInputElement;
      
      // 1. Initial Styling: Only apply styles if checked AND NOT the managed hosting checkbox.
      // Managed hosting styling relies purely on the change event which fires after the 
      // container is unhidden by the website-design-development change event.
      if (inputEl.checked && inputEl.id !== 'managed-hosting-checkbox') {
        this.updateServiceCardStyling(inputEl, true);
      }
      
      // 2. Listeners: Attach the change listener for future clicks AND programmatic updates
      checkbox.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        this.updateServiceCardStyling(target, target.checked);
        
        // Conditional Logic: Toggle visibility on change
        if(target.name === 'services' && target.value === 'website-design-development') {
          this.toggleManagedHostingOption(target.checked);
        }
      });
    });
  }

  private toggleManagedHostingOption(show: boolean): void {
    const container = document.getElementById('managed-hosting-option-container');
    const checkbox = document.getElementById('managed-hosting-checkbox') as HTMLInputElement;

    if(show) {
      container?.classList.remove('hidden');
      // No need to explicitly call updateServiceCardStyling here anymore, 
      // as the FormDataManager dispatches the 'change' event when it's preselected,
      // and the listener attached in initServiceCardSelection will handle the styling.
    } else {
      container?.classList.add('hidden');

      if(checkbox && checkbox.checked) {
        checkbox.checked = false;
        
        // Dispatching change event updates the styling via the listener attached in initServiceCardSelection
        checkbox.dispatchEvent(new Event('change', {bubbles: true}));
      }
    }
  }

  /**
   * Update service card styling based on checked state
   */
  private updateServiceCardStyling(checkbox: HTMLInputElement, isChecked: boolean): void {
    const cardContent = checkbox.nextElementSibling;
    const checkmark = cardContent?.querySelector('.service-checkmark');

    if (isChecked) {
      // Remove unchecked styles
      cardContent?.classList.remove(
        SERVICE_CARD_STYLES.unchecked.border,
        SERVICE_CARD_STYLES.unchecked.background
      );
      checkmark?.classList.remove(SERVICE_CARD_STYLES.unchecked.checkmark);
      
      // Add checked styles
      cardContent?.classList.add(
        SERVICE_CARD_STYLES.checked.border,
        SERVICE_CARD_STYLES.checked.background
      );
      checkmark?.classList.add(SERVICE_CARD_STYLES.checked.checkmark);
    } else {
      // Remove checked styles
      cardContent?.classList.remove(
        SERVICE_CARD_STYLES.checked.border,
        SERVICE_CARD_STYLES.checked.background
      );
      checkmark?.classList.remove(SERVICE_CARD_STYLES.checked.checkmark);
      
      // Add unchecked styles
      cardContent?.classList.add(
        SERVICE_CARD_STYLES.unchecked.border,
        SERVICE_CARD_STYLES.unchecked.background
      );
      checkmark?.classList.add(SERVICE_CARD_STYLES.unchecked.checkmark);
    }
  }

  showServiceToast(message: string, isError: boolean = false, isSuccess: boolean = false) {
    const serviceNotification = document.getElementById('service-toast');
    const serviceMessage = document.getElementById('service-message');
    const classNormal = ["bg-blue-50", "text-blue-600"];
    const classError = ["bg-red-50", "text-red-600"];
    const classSuccess = ["bg-green-50", "text-green-600"];

    if (isError) {
      serviceNotification?.classList.remove(...classNormal, ...classSuccess);
      serviceNotification?.classList.add(...classError);
    } else if (isSuccess) {
      serviceNotification?.classList.remove(...classNormal, ...classError);
      serviceNotification?.classList.add(...classSuccess);
    } else {
      serviceNotification?.classList.remove(...classError, ...classSuccess);
      serviceNotification?.classList.add(...classNormal);
    }

    if(!serviceMessage){
      return;
    }

    serviceMessage.innerHTML = message;
    serviceNotification?.classList.remove('hidden');
  }

  hideServiceToast(): void {
    const serviceNotification = document.getElementById('service-toast');
    serviceNotification?.classList.add('hidden');
  }

  /**
   * Get button elements for attaching event listeners
   */
  getButtons() {
    return {
      prev: this.prevBtn,
      next: this.nextBtn,
      submit: this.submitBtn,
    };
  }
}