<script lang="ts">
  import { Check } from "@lucide/svelte";
  import { STEPS } from "../../lib/form/constants";
  import type { Step } from "../../lib/form/types";

  let { currentStep = 1 }: { currentStep: number } = $props();
  const steps: Step[] = STEPS;

  function getStepStatus(
    stepNumber: number
  ): "completed" | "current" | "upcoming" {
    if (stepNumber < currentStep) {
      return "completed";
    } else if (stepNumber === currentStep) {
      return "current";
    } else {
      return "upcoming";
    }
  }
</script>

<div class="flex items-center justify-center mb-12">
  {#each steps as step, index}
    {@const isActive = getStepStatus(step.number) === "current"}
    {@const isCompleted = getStepStatus(step.number) === "completed"}
    {@const Icon = step.icon}

    <div class="flex items-center">
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center transition-all border-2
          {isCompleted ? 'bg-emerald-600 border-emerald-500 text-white' : ''}
          {isActive ? 'bg-blue-400 border-blue-300 text-white' : ''}
          {getStepStatus(step.number) === 'upcoming'
          ? 'bg-slate-200 border-slate-300 text-slate-500'
          : ''}"
      >
        {#if isCompleted}
          <Check class="w-6 h-6" />
        {:else}
          <Icon class="w-6 h-6" />
        {/if}
      </div>
      {#if index < steps.length - 1}
        <div
          class="flex-1 h-1 mx-4 w-24 md:w-32
          {isCompleted ? 'bg-emerald-600' : 'bg-slate-200'}"
        ></div>
      {/if}
    </div>
  {/each}
</div>
