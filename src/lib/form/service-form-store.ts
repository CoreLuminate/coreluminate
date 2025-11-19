import { writable } from "svelte/store";
import type { Service, ServiceFormData } from "./types";

const initialFormData: ServiceFormData = {
  services: [],
  projectDescription: "",
  budget: "",
  timeline: "",
  websiteUrl: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  companyName: "",
};

function createServiceFormStore() {
  const { subscribe, set, update } = writable<ServiceFormData>(initialFormData);

  return {
    subscribe,
    updateField<K extends keyof ServiceFormData>(
      field: K,
      value: ServiceFormData[K]
    ) {
      update((formData) => ({
        ...formData,
        [field]: value,
      }));
    },
    addService(service: Service) {
      update((formData) => ({
        ...formData,
        services: [...formData.services, service],
      }));
    },
    removeService(serviceId: number) {
      update((formData) => ({
        ...formData,
        services: formData.services.filter(
          (service) => service.id !== serviceId
        ),
      }));
    },
    toggleService(service: Service) {
      update((formData) => {
        const exists = formData.services.find((s) => s.id === service.id);
        let updatedServices: Service[];
        if (exists) {
          updatedServices = formData.services.filter(
            (s) => s.id !== service.id
          );
        } else {
          updatedServices = [...formData.services, service];
        }
        return {
          ...formData,
          services: updatedServices,
        };
      });
    },
    setPackage: (packageName: string) =>
      update((formData) => ({
        ...formData,
        package: packageName,
      })),
      setAddon: (addon: string) =>
      update((formData) => ({
        ...formData,
        addon: addon,
      })),
    reset: () => set(initialFormData),
  };
}

export const serviceFormStore = createServiceFormStore();