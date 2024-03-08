<template>
  <div class="flex flex-col justify-center text-center w-64 mx-auto">
    <h1 class="text-3xl font-bold">Vue with TailwindCSS</h1>

    <button @click="increment" class="px-4 py-2 bg-green-300 my-3">
      Count is: {{ state.count }} Double is: {{ state.double }}
    </button>
  </div>
</template>

<script>
import { reactive, computed } from "vue";

export default {
  setup() {
    const state = reactive({
      count: 0,
      double: computed(() => state.count * 2),
    });

    function increment() {
      state.count++;
    }

    return {
      state,
      increment,
    };
  },
};
</script>
