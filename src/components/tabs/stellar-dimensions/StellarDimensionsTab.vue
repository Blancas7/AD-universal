<script>
import ClassicStellarDimensionsTab from "./ClassicStellarDimensionsTab";
import ModernStellarDimensionsTab from "./ModernStellarDimensionsTab";

export default {
  name: "StellarDimensionsTab",
  components: {
    ClassicStellarDimensionsTab,
    ModernStellarDimensionsTab
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI
        ? "ModernStellarDimensionsTab"
        : "ClassicStellarDimensionsTab";
    }
  }
};
</script>

<template>
  <component :is="activeComponent" />
</template>
