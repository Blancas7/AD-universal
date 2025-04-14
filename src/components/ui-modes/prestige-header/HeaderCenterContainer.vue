<script>
import ArmageddonButton from "../../tabs/celestial-pelle/ArmageddonButton";
import RealityCurrencyHeader from "../../RealityCurrencyHeader";
import RewindCurrencyHeader from "../../RewindCurrencyHeader";

import HeaderTickspeedInfo from "../HeaderTickspeedInfo";

import RealityButton from "./RealityButton";
import RewindButton from "./RewindButton";

// This component contains antimatter and antimatter rate at the start of the game, as well as some additional
// information depending on the UI (tickspeed for Classic, game speed for Modern). Everything but antimatter is
// removed once Reality is unlocked, to make room for the reality button
export default {
  name: "HeaderCenterContainer",
  components: {
    RewindButton,
    RewindCurrencyHeader,
    HeaderTickspeedInfo,
    RealityCurrencyHeader,
    RealityButton,
    ArmageddonButton,
  },
  data() {
    return {
      shouldDisplay: true,
      isModern: false,
      hasRewindButton: false,
      hasRealityButton: false,
      isDoomed: false,
      antimatter: new Decimal(0),
      antimatterPerSec: new Decimal(0),
    };
  },
  methods: {
    update() {
      this.shouldDisplay = player.break || !Player.canCrunch;
      if (!this.shouldDisplay) return;

      this.isModern = player.options.newUI;
      this.isDoomed = Pelle.isDoomed;
      this.antimatter.copyFrom(Currency.antimatter);
      this.hasRealityButton = PlayerProgress.rewindUnlocked() || PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
      this.hasRewindButton = PlayerProgress.rewindUnlocked();
      if (!this.hasRealityButton) this.antimatterPerSec.copyFrom(Currency.antimatter.productionPerSecond);
    },
  },
};
</script>

<template>
  <div
    v-if="shouldDisplay"
    class="c-prestige-button-container"
  >
    <div
        v-if="hasRewindButton"
        class="c-rewind-container"
      >
      <RewindButton />
      <RewindCurrencyHeader />
    </div>
    <span>You have <span class="c-game-header__antimatter">{{ format(antimatter, 2, 1) }}</span> antimatter.</span>
    <div
      v-if="hasRealityButton"
      class="c-reality-container"
    >
      <RealityCurrencyHeader />
      <ArmageddonButton
        v-if="isDoomed"
        :is-header="true"
      />
      <RealityButton v-else />
    </div>
    <div v-else>
      You are getting {{ format(antimatterPerSec, 2) }} antimatter per second.
      <br>
      <HeaderTickspeedInfo />
    </div>
  </div>
</template>

<style scoped>
.c-reality-container,
.c-rewind-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
