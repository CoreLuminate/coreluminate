/**
 * FormDataManager - Handles all data operations for the service request form
 * Responsible for: URL parameters, data collection, review population, submission
 */

// Service mapping for URL parameters to form values and display names
// These values must match the service.value in request.astro
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

export class FormDataManager {
  private form: HTMLFormElement;

  constructor() {
    this.form = document.getElementById('service-request-form') as HTMLFormElement;
  }

  /**
   * Read URL parameters and pre-select form options
   */
  applyUrlParameters(): void {
    const params = new URLSearchParams(window.location.search);
    
    // Pre-select service
    const serviceParam = params.get('service');
    if (serviceParam && serviceParam in SERVICE_MAP) {
      const serviceValue = SERVICE_MAP[serviceParam as keyof typeof SERVICE_MAP].value;
      const checkbox = document.querySelector(
        `input[name="services"][value="${serviceValue}"]`
      ) as HTMLInputElement;
      
      if (checkbox) {
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
  displayPreselectedPackage(): void {
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
  }

  displayPreselectedManagedHosting(): void {
    // Display managed hosting if selected
    const managedHosting = sessionStorage.getItem('managedHosting');
    if (managedHosting === 'true') {
      const hostingCheckbox = document.getElementById(
        'managed-hosting-checkbox'
      ) as HTMLInputElement;
      if (hostingCheckbox) {
        hostingCheckbox.checked = true;
        hostingCheckbox.dispatchEvent(new Event('change', {bubbles: true}));
        console.log('preselect hosting');
      }
    }
  }

  /**
   * Populate review step with form data
   */
  populateReview(): void {
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

    let servicesHtml = selectedServices
      .map(
        (service) =>
          `<div class="flex items-center gap-2 text-slate-700">
            <div class="w-2 h-2 bg-blue-600 rounded-full shrink-0"></div>
            <span>${service}</span>
          </div>`
      )
      .join('');

      // Check if Managed Hosting was added and append it to the list
    const hostingCheckbox = document.getElementById(
      'managed-hosting-checkbox'
    ) as HTMLInputElement;
    if (hostingCheckbox && hostingCheckbox.checked) {
      servicesHtml += `
        <div class="flex items-center gap-2 text-slate-700">
          <div class="w-2 h-2 bg-emerald-600 rounded-full shrink-0"></div>
          <span>Managed Hosting (Add-On)</span>
        </div>
      `;
    }

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
   * Get all form data as FormData object
   */
  getFormData(): FormData {
    return new FormData(this.form);
  }

  /**
   * Get form data as plain object
   */
  getFormDataAsObject(): Record<string, any> {
    const formData = this.getFormData();
    const data: Record<string, any> = {};
    
    // Get all services
    const services: string[] = [];
    formData.getAll('services').forEach(service => {
      services.push(service as string);
    });
    data.services = services;
    
    // Get other fields
    formData.forEach((value, key) => {
      if (key !== 'services') {
        data[key] = value;
      }
    });
    
    return data;
  }

  /**
   * Submit form data
   * TODO: Integrate with Netlify Forms API
   */
  async submitForm(): Promise<void> {
    const formData = this.getFormData();
    
    // TODO: Integrate with Netlify Forms API
    console.log('Form submitted:', Object.fromEntries(formData));
    
  }
}