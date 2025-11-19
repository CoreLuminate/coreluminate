<script lang="ts">
  import { Check } from "@lucide/svelte";
  import { SERVICES } from "../../lib/form/constants";
  import { serviceFormStore } from "../../lib/form/service-form-store";
  import type { Service } from "../../lib/form/types";

  const services: Service[] = SERVICES;
  function handleCheckboxChange(serviceValue: string) {
    const service = services.find((s) => s.value === serviceValue);
    if (service) {
      serviceFormStore.toggleService(service);
    }
  }

  function isSelected(service: Service): boolean {
    return $serviceFormStore.services.includes(service);
  }
</script>

<div class="space-y-8">
  <div class="text-center">
    <h2 class="text-2xl font-bold">Which services do you need?</h2>
    <p class="text-gray-600">
      Select all that apply. We'll build a custom package for you.
    </p>
  </div>
  <div class="grid md:grid-cols-2 gap-4">
    {#each services as service}
      {@const selected = isSelected(service)}
      {@const Icon = service.icon}
      <label class="relative cursor-pointer">
        <input
          type="checkbox"
          value={service.value}
          checked={selected}
          class="absolute opacity-0"
          onchange={() => handleCheckboxChange(service.value)}
        />
        <div
          class="p-6 border rounded-xl transition-all shadow-sm h-full
        {selected
            ? 'border-blue-300 bg-blue-50'
            : 'border-slate-200 bg-white hover:border-blue-200'}"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 bg-blue-400 rounded-sm flex items-center justify-center shrink-0"
            >
              <Icon class="w-6 h-6 text-white" />
            </div>
            <div class="grow">
              <h3 class="font-bold text-slate-900 mb-1">{service.name}</h3>
              <p class="text-sm text-slate-600">{service.description}</p>
            </div>
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 {selected
                ? 'bg-blue-400'
                : 'bg-slate-200'}"
            >
              <Check class="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </label>
    {/each}
  </div>
</div>
