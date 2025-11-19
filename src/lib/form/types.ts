export interface ServiceFormData {
  services: Service[];
  projectDescription: string;
  budget: string;
  timeline: string;
  websiteUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  addon?: string;
  packageName?: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  value: string;
  icon: any;
}

export type Step = {
  number: number;
  name: string;
  icon: any;
}

export interface RangeOption {
    label: string;
    value: string;
}