<script>

export default {
  name: "CelestialMilestonesTab",
  data() {
    return {
      levels: {}
    };
  },
  computed: {
    hexGrid() {
      return [
          CelestialMilestones.all[0],
          CelestialMilestones.all[1],
          {},
          CelestialMilestones.all[5],
          CelestialMilestones.all[6],
          CelestialMilestones.all[2],
          CelestialMilestones.all[4],
          CelestialMilestones.all[3],
          {}
        ];
    },
  },
  methods: {
    update() {
      this.currentLevels = player.rewind.celestialMilestones;
    },
  }
};
</script>

<template>
  <div class="l-celestial-milestones-tab">
    <li
      v-for="(hex, hexId) in hexGrid"
      :key="hexId + '-celestial-milestone-hex'"
      :style="[hex.isRunButton ? {zIndex: 1} : {zIndex: 0}]"
    >
      <div
        v-if="hex.config"
        class="l-celestial-milestone-hexagon"
      >
        <p class="o-celestial-milestone-name">
          {{ hex.config.name }}
        </p>

        <p class="o-celestial-milestone-levels">
          <p
            v-for="(level, levelId) in hex.config.levels"
            :key="levelId + '-celestial-milestone-level'"
          >
            {{ typeof level.description === "string" ?  level.description : level.description() }}
          </p>
        </p>
      </div>
      <div v-else>
        <div class="l-celestial-milestone-hexagon l-placeholder-invisible" />
      </div>
    </li>
  </div>
</template>

<style scoped>
.l-placeholder-invisible {
  opacity: 0;
}
</style>
