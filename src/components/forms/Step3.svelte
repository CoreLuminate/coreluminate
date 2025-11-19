<script lang="ts">
  import { serviceFormStore } from "../../lib/form/service-form-store";

  const store = $serviceFormStore;
</script>

<div class="space-y-8">
  <div class="text-center">
    <h2 class="text-3xl font-bold text-slate-900 mb-3">
      How can we reach you?
    </h2>
    <p class="text-lg text-slate-600">
      We'll send you a custom proposal within 1-2 business days.
    </p>
  </div>

  <div class="space-y-6 max-w-2xl mx-auto">
    <!-- Name Fields -->
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label
          for="first-name"
          class="block text-sm font-semibold text-slate-900 mb-2"
        >
          First Name <span class="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="first-name"
          required
          bind:value={store.firstName}
          placeholder="John"
          class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-slate-900"
        />
      </div>

      <div>
        <label
          for="last-name"
          class="block text-sm font-semibold text-slate-900 mb-2"
        >
          Last Name <span class="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="last-name"
          required
          bind:value={store.lastName}
          placeholder="Doe"
          class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-slate-900"
        />
      </div>
    </div>

    <!-- Email -->
    <div>
      <label
        for="email"
        class="block text-sm font-semibold text-slate-900 mb-2"
      >
        Email Address <span class="text-red-600">*</span>
      </label>
      <input
        type="email"
        id="email"
        required
        bind:value={store.email}
        placeholder="john@example.com"
        class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-slate-900"
      />
    </div>

    <!-- Phone -->
    <div>
      <label
        for="phone"
        class="block text-sm font-semibold text-slate-900 mb-2"
      >
        Phone Number
      </label>
      <input
        type="tel"
        id="phone"
        bind:value={store.phone}
        placeholder="(555) 123-4567"
        class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-slate-900"
      />
    </div>

    <!-- Business Name -->
    <div>
      <label
        for="business-name"
        class="block text-sm font-semibold text-slate-900 mb-2"
      >
        Business Name
      </label>
      <input
        type="text"
        id="business-name"
        bind:value={store.companyName}
        placeholder="Acme Inc."
        class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-slate-900"
      />
    </div>
  </div>
</div>
