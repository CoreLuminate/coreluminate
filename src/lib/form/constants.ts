import { Contact, FileText, Globe, Palette, Settings, ShoppingCart, TrendingUp, Wrench } from '@lucide/svelte';
import type { RangeOption, Service, Step } from './types';

export const TOTAL_STEPS = 5;

export const STEPS: Step[] = [
  {
    number: 1,
    name: "Services",
    icon: Globe,
  },
  {
    number: 2,
    name: "Project Details",
    icon: FileText,
  },
  {
    number: 3,
    name: "Contact Information",
    icon: Contact,
  },
];

export const SERVICES: Service[] = [
  {
    id: 1,
    name: "Website Design & Development",
    value: "website-design-development",
    description: "Custom websites built for performance and conversions.",
    icon: Globe,
  },
  {
    id: 2,
    name: "SEO & Analytics",
    value: "seo-analytics",
    description: "Get found online and track your success.",
    icon: TrendingUp,
  },
  {
    id: 3,
    name: "Brand & Logo Design",
    value: "brand-logo-design",
    description: "Create a memorable brand identiy.",
    icon: Palette,
  },
  {
    id: 4,
    name: "E-Commerce Solutions",
    value: "ecommerce-solutions",
    description: "Sell your products online with secure, user-friendly stores.",
    icon: ShoppingCart,
  },
  {
    id: 5,
    name: "Business Systems Setup",
    value: "business-systems-setup",
    description:
      "CRM, project management, accounting, and workflow automation.",
    icon: Settings,
  },
  {
    id: 6,
    name: "Website Updates & Add-Ons",
    value: "website-updates-add-ons",
    description: "Ongoing updates, additional pages or new features.",
    icon: Wrench,
  },
];

// 1. Budget Options
export const BUDGET_OPTIONS: RangeOption[] = [
    { label: 'Select Budget', value: '' },
    { label: '< $1,000', value: '1k' },
    { label: '$1,000 - $5,000', value: '1k-5k' },
    { label: '$5,000 - $15,000', value: '5k-15k' },
    { label: '$15,000 - $50,000', value: '15k-50k' },
    { label: '$50,000+', value: '50k+' },
];

// 2. Timeline Options
export const TIMELINE_OPTIONS: RangeOption[] = [
    { label: 'Select Timeline', value: '' },
    { label: '1 - 3 Weeks', value: '1-3w' },
    { label: '1 - 2 Months', value: '1-2m' },
    { label: '3 - 6 Months', value: '3-6m' },
    { label: '6+ Months', value: '6m+' },
];