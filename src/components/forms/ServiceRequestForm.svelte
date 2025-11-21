<script lang="ts">
  import { ArrowLeft, ArrowRight, Check, SendHorizontal } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { SERVICES } from "../../lib/form/constants";
  import { serviceFormStore } from "../../lib/form/service-form-store";
  import type { Service } from "../../lib/form/types";
  import { validateStep } from "../../lib/form/validation";
  import {
    submitFormData,
    type FormSubmissionResult,
  } from "../../lib/formSubmission";
  import ProgressIndicator from "./ProgressIndicator.svelte";
  import Step1 from "./Step1.svelte";
  import Step2 from "./Step2.svelte";
  import Step3 from "./Step3.svelte";

  let { turnstileSiteKey } = $props<{
    turnstileSiteKey: string;
  }>();

  let form = $state<HTMLFormElement | undefined>();
  const totalSteps = 3;
  let currentStep = $state(1);
  let isSubmitting = $state(false);
  let submitSuccess = $state(false);
  let errorMessage = $state("");

  onMount(() => {
    const params = new URLSearchParams(window.location.search);

    const serviceParam = params.get("service");
    if (serviceParam) {
      const service = SERVICES.find((s) => s.value === serviceParam);
      if (service) {
        serviceFormStore.addService(service);
      }
    }

    const packageParam = params.get("package");
    if (packageParam) {
      serviceFormStore.setPackage(packageParam);
    }

    const addonParam = params.get("addon");
    if (addonParam) {
      serviceFormStore.setAddon(addonParam);
    }
  });

  function handleNext() {
    const store = $serviceFormStore;
    const validation = validateStep(currentStep, store);
    if (validation.isValid) {
      errorMessage = "";
      currentStep += 1;
    } else {
      errorMessage = validation.errors.join("<br/>");
    }
  }

  function handlePrev() {
    if (currentStep > 1) {
      currentStep -= 1;
      errorMessage = "";
    }
  }

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const store = $serviceFormStore;
    const validation = validateStep(currentStep, store);
    if (!validation.isValid) {
      errorMessage = validation.errors.join("<br/>");
      return;
    }

    if (!form) {
      errorMessage =
        "There was an error trying to submit form. Please try again. If the problem persists, contact us directly.";
      return;
    }

    const formData = get(serviceFormStore);
    const turnstileResponse = form.querySelector(
      'input[name="cf_turnstile_response"]'
    ) as HTMLInputElement;

    if (!turnstileResponse || !turnstileResponse.value) {
      errorMessage = "Please complete the CAPTCHA challenge.";
      return;
    }

    const payload = new FormData();
    payload.append("cf_turnstile_response", turnstileResponse.value);
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "services") {
        payload.append(key, value.map((item: Service) => item.name).join(", "));
      } else if (value !== null && value !== undefined) {
        payload.append(key, value.toString());
      }
    });

    try {
      isSubmitting = true;
      errorMessage = "";
      const submission: FormSubmissionResult = await submitFormData(
        payload,
        "service-request"
      );

      if (!submission.success) {
        isSubmitting = false;
        errorMessage =
          submission.message || "Form submission failed. Please try again.";
        return;
      }

      isSubmitting = false;
      submitSuccess = true;
      serviceFormStore.reset();
      // Reset the Turnstile widget
      if ((window as any).turnstile) {
        (window as any).turnstile.reset();
      }
    } catch (error) {
      errorMessage =
        "An error occurred while submitting the form. Please try again.";
      return;
    } finally {
      isSubmitting = false;
    }
  };
</script>

<div class="max-w-5xl mx-auto">
  {#if submitSuccess}
    <!-- Success Message -->
    <div class="flex flex-col items-center text-center p-12">
      <div
        class="bg-emerald-50 rounded-2xl p-8 border-2 border-emerald-200 mb-6"
      >
        <div
          class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Check class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-slate-900">
          Request Submitted Successfully!
        </h3>
        <p class="text-lg text-slate-600">
          Thank you for your request. We'll review your information and get back
          to you within 1-2 business days.
        </p>
      </div>
      <a
        href="/"
        class="px-6 py-3 rounded-full shadow-sm hover:shadow-md flex text-center font-medium bg-blue-500 text-white hover:bg-blue-700 focus:ring-blue-500 border border-blue-600"
      >
        Return to Home
      </a>
    </div>
  {:else}
    <!-- Progress Indicator -->
    <ProgressIndicator {currentStep} />

    <!-- Form -->
    <form
      id="service-request-form"
      bind:this={form}
      onsubmit={handleSubmit}
      class="space-y-8 mt-12"
    >
      <input
        type="hidden"
        name="subject"
        value="New Service Request Submission"
      />
      {#if currentStep === 1}
        <Step1 />
      {:else if currentStep === 2}
        <Step2 />
      {:else if currentStep === 3}
        <Step3 />
      {/if}

      <!-- Error Message -->
      {#if errorMessage}
        <div
          class="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center"
        >
          <p class="text-sm text-red-600">{@html errorMessage}</p>
        </div>
      {/if}

      <!-- Navigation Buttons -->
      <div class="flex justify-between items-center pt-8">
        {#if currentStep > 1}
          <button
            type="button"
            onclick={handlePrev}
            class="px-6 py-3 gap-2 rounded-full shadow-sm hover:shadow-md flex items-center justify-center cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 bg-slate-400 text-white hover:bg-slate-700 focus:ring-slate-500 border border-slate-600"
          >
            <ArrowLeft class="w-4 h-4" />
            Back
          </button>
        {:else}
          <div></div>
        {/if}

        {#if currentStep < totalSteps}
          <button
            type="button"
            onclick={handleNext}
            class="px-6 py-3 gap-2 rounded-full shadow-sm hover:shadow-md flex items-center justify-center cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-700 focus:ring-blue-500 border border-blue-600"
          >
            Continue
            <ArrowRight class="w-4 h-4" />
          </button>
        {:else}
          <button
            type="submit"
            disabled={isSubmitting}
            class="px-6 py-3 gap-2 rounded-full shadow-sm hover:shadow-md flex items-center justify-center cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-700 focus:ring-blue-500 border border-blue-600"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
            <SendHorizontal class="w-4 h-4" />
          </button>
        {/if}
      </div>
      <div
        class="cf-turnstile"
        data-sitekey={turnstileSiteKey}
        data-theme="light"
        data-size="normal"
        data-response-field-name="cf_turnstile_response"
      ></div>
      <script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      ></script>
    </form>
  {/if}
</div>
