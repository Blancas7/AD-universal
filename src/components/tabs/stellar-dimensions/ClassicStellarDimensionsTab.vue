<script>
import PrimaryButton from "@/components/PrimaryButton";
import StellarDimensionRow from "./ClassicStellarDimensionRow";

export default {
  name: "ClassicStellarDimensionsTab",
  components: {
    PrimaryButton,
    StellarDimensionRow
  },
  data() {
    return {
      stardust: new Decimal(0),
      galaxyMultiplier: 0,
      stardustPerSecond: new Decimal(0),
      incomeType: "",
      areAutobuyersUnlocked: false,
    };
  },
  methods: {
    update() {
      this.stardust.copyFrom(Currency.stardust);
      this.galaxyMultiplier = Math.log10(Math.max(this.stardust.max(1).log10(), 1)) / 20;
      this.incomeType = "Stardust";
      this.areAutobuyersUnlocked = Autobuyer.stellarDimension(1).isUnlocked;
    },
    maxAll() {
      maxAllStellarDimensions();
    },
    toggleAllAutobuyers() {
      toggleAllStellarDims();
    }
  }
};
</script>

<template>
  <div class="l-stellar-dim-tab l-centered-vertical-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
      <PrimaryButton
        v-if="areAutobuyersUnlocked"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        Toggle all autobuyers
      </PrimaryButton>
    </div>
    <div>
      <p>
        You have gained
        <span class="c-stellar-dim-description__accent">{{ format(stardust, 2, 1) }}</span> Stardust, translated to a
        <span class="c-stellar-dim-description__accent">{{ format(galaxyMultiplier * 100, 2, 1) }} %</span> boost to all galaxies.
      </p>
    </div>
    <div>
      You are getting {{ format(stardustPerSecond, 2, 0) }} {{ incomeType }} per second.
    </div>
    <div class="l-dimensions-container">
      <StellarDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
        :are-autobuyers-unlocked="areAutobuyersUnlocked"
      />
    </div>
    <div>
      Write stuff here
    </div>
  </div>
</template>
