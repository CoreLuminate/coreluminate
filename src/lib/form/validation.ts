import type { ServiceFormData } from './types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate a specific step
 */
export function validateStep(step: number, data: ServiceFormData): ValidationResult {
  const errors: string[] = [];

  switch (step) {
    case 1:
      validateServiceSelection(data, errors);
      break;
    case 2:
      validateProjectInfo(data, errors);
      break;
    case 3:
      validateContactInfo(data, errors);
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Step 1: Service Selection
 */
function validateServiceSelection(data: ServiceFormData, errors: string[]): void {
  if (data.services.length === 0) {
    errors.push('Please select at least one service.');
  }
}

/**
 * Step 2: Project Info
 */
function validateProjectInfo(data: ServiceFormData, errors: string[]): void {
  if (data.projectDescription.trim() === '') {
    errors.push('Project description is required.');
  }

  if (data.budget === '') {
    errors.push('Please select a budget range.');
  }

  if (data.timeline === '') {
    errors.push('Please select a timeline.');
  }

  // URL is optional, but if provided, validate format
  if (data.websiteUrl.trim() !== '' && !isValidUrl(data.websiteUrl)) {
    errors.push('Please enter a valid URL (e.g., https://example.com).');
  }
}

/**
 * Step 3: Contact Info
 */
function validateContactInfo(data: ServiceFormData, errors: string[]): void {
  if (data.firstName.trim() === '') {
    errors.push('First name is required.');
  }

  if (data.lastName.trim() === '') {
    errors.push('Last name is required.');
  }

  if (data.email.trim() === '') {
    errors.push('Email address is required.');
  } else if (!isValidEmail(data.email)) {
    errors.push('Please enter a valid email address.');
  }

  // Phone is optional, but if provided, validate
  if (data.phone.trim() !== '' && !isValidPhone(data.phone)) {
    errors.push('Please enter a valid 10-digit phone number.');
  }
}

/**
 * Email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Phone validation
 */
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * URL validation
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize form data before submission
 */
export function sanitizeFormData(data: ServiceFormData): ServiceFormData {
  return {
    services: data.services,
    projectDescription: sanitizeHtml(data.projectDescription.trim()),
    websiteUrl: data.websiteUrl.trim(),
    budget: data.budget,
    timeline: data.timeline,
    firstName: sanitizeHtml(data.firstName.trim()),
    lastName: sanitizeHtml(data.lastName.trim()),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    companyName: sanitizeHtml(data.companyName.trim()),
    packageName: data.packageName,
    addon: data.addon
  };
}

/**
 * Basic HTML sanitization (remove tags)
 */
function sanitizeHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}