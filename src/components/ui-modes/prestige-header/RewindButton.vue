<script>
export default {
  name: "RewindButton",
  data() {
    return {
      canRewind: false,
      unityPointsGained: new Decimal(),
      rewindTime: 0,
    };
  },
  computed: {
    formatUPGained() {
      if (this.unityPointsGained.gt(0)) return `Unity Points gained: ${format(this.unityPointsGained, 2)}`;
      return "No Unity Points gained";
    },
    classObject() {
      return {
        "c-rewind-button--unlocked": this.canRewind,
        "c-rewind-button--locked": !this.canRewind,
      };
    }
  },
  methods: {
    update() {
      this.canRewind = isRewindAvailable();

      this.unityPointsGained = new Decimal(1);
      this.rewindTime = Time.thisRewindRealTime.totalMinutes;
    },
    handleClick() {
      if (this.canRewind) {
        requestManualRewind();
      }
    },
    formatScalingMultiplierText(resource, before, after) {
      return `${resource} ${formatX(before, 2, 2)} ➜ ${formatX(after, 2, 2)}`;
    },
    formatThresholdText(condition, threshold, resourceName) {
      if (condition) return "";
      return `(${format(threshold, 2, 2)} ${resourceName} to improve)`;
    },
  }
};
</script>

<template>
  <div class="l-rewind-button">
    <button
      class="c-rewind-button infotooltip"
      :class="classObject"
      @click="handleClick"
    >
      <div class="l-rewind-button__contents">
        <template v-if="canRewind">
          <div class="c-rewind-button__header">
            Rewind the Universe for {{ formatUPGained }}
          </div>
        </template>
        <template v-else>
          <div>There is no need for a rewind</div>
        </template>
      </div>
    </button>
  </div>
</template>

<style scoped>

</style>
