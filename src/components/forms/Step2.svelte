<script lang="ts">
  import { BUDGET_OPTIONS, TIMELINE_OPTIONS } from "../../lib/form/constants";
  import { serviceFormStore } from "../../lib/form/service-form-store";

  const store = $serviceFormStore;
</script>

<div class="space-y-8">
  <div class="text-center">
    <h2 class="text-3xl font-bold text-slate-900 mb-3">
      Tell us about your project
    </h2>
    <p class="text-lg text-slate-600">
      The more details you share, the better we can help.
    </p>
  </div>

  <div class="space-y-6 max-w-2xl mx-auto">
    <div>
      <label
        class="block font-medium text-slate-900 mb-2"
        for="project-description"
      >
        Project Description <span class="text-red-600">*</span>
      </label>
      <textarea
        id="project-description"
        class="w-full p-3 border-2 border-slate-200 rounded-xl shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        rows="6"
        required
        placeholder="Tell us about your project, business, goals, and what you're looking to accomplish."
        bind:value={store.projectDescription}
      >
      </textarea>
    </div>

    <div>
      <label class="block font-medium text-slate-900 mb-2" for="website-url"
        >Website URL (if any)</label
      >
      <input
        id="website-url"
        type="url"
        class="w-full p-3 border-2 border-slate-200 rounded-xl shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        placeholder="https://example.com"
        bind:value={store.websiteUrl}
      />
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block font-medium text-slate-900 mb-2" for="budget-range">
          Budget Range
        </label>
        <select
          id="budget-range"
          class="w-full p-3 border-2 border-slate-200 rounded-xl shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          bind:value={store.budget}
        >
          {#each BUDGET_OPTIONS as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>

      <div>
        <label
          class="block font-medium text-slate-900 mb-2"
          for="timeline-range">Timeline</label
        >
        <select
          id="timeline-range"
          class="w-full p-3 border-2 border-slate-200 rounded-xl shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          bind:value={store.timeline}
        >
          {#each TIMELINE_OPTIONS as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
</div>
