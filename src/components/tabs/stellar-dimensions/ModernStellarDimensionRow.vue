<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ModernStellarDimensionRow",
  components: {
    GenericDimensionRowText,
    PrimaryButton,
    PrimaryToggleButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    },
    areAutobuyersUnlocked: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isCapped: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      bought: 0,
      rateOfChange: new Decimal(0),
      cost: new Decimal(0),
      isAvailableForPurchase: false,
      isAutobuyerOn: false,
      requirementReached: false,
      rewindUnlocked: false
    };
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    name() {
      return `${StellarDimension(this.tier).shortDisplayName} Stellar Dimension`;
    },
    buttonContents() {
      return this.formattedUPCost;
    },
    tooltipContents() {
      return `Purchased ${quantifyInt("time", this.bought)}`;
    },
    showRow() {
      return this.rewindUnlocked || this.isUnlocked || this.requirementReached;
    },
    formattedUPCost() {
      return this.isCapped ? "Capped" : `${this.showCostTitle ? "Cost: " : ""}${format(this.cost, 2)} UP`;
    },
    hasLongText() {
      return this.buttonContents.length > 20;
    },
    showCostTitle() {
      return this.cost.max(1).log10() <= 1e6;
    },
    timeEstimate() {
      return "";
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.stellarDimension(this.tier).isActive = newValue;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = StellarDimension(tier);
      
      this.isCapped = false;
      this.isUnlocked = true;
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.amount);
      this.bought = dimension.bought;
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPurchase = dimension.isAvailableForPurchase;

      this.requirementReached = dimension.requirementReached;
      this.isAutobuyerOn = Autobuyer.stellarDimension(this.tier).isActive;
      this.rewindUnlocked = PlayerProgress.rewindUnlocked();
    },
    buyStellarDimension() {
      buySingleStellarDimension(this.tier);
    },
    buyMaxStellarDimension() {
      buyMaxStellarDimension(this.tier);
    }
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-row-stellar-dim l-dimension-single-row"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 1)"
      :amount-text="format(amount, 2)"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container c-modern-dim-tooltip-container">
      <div class="c-modern-dim-purchase-count-tooltip">
        <span v-html="tooltipContents" />
      </div>
      <PrimaryButton
        :enabled="isAvailableForPurchase"
        class="o-primary-btn--buy-sd o-primary-btn o-primary-btn--new o-primary-btn--buy-dim"
        :class="{ 'l-dim-row-small-text': hasLongText }"
        @click="buyStellarDimension"
      >
        {{ buttonContents }}
      </PrimaryButton>
      <PrimaryToggleButton
        v-if="areAutobuyersUnlocked"
        v-model="isAutobuyerOn"
        class="o-primary-btn--buy-sd-auto"
        label="Auto:"
      />
      <PrimaryButton
        v-else
        :enabled="isAvailableForPurchase"
        class="o-primary-btn--buy-sd-auto"
        @click="buyMaxStellarDimension"
      >
        Buy Max
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.c-modern-dim-tooltip-container .c-modern-dim-purchase-count-tooltip {
  position: absolute;
  width: 20rem;
  top: 50%;
  font-size: 1.3rem;
  line-height: 1.6rem;
  color: white;
  background: black;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-width, 0.5rem);
  /* Buttons are 40rem wide, tooltip is 20rem */
  transform: translate(calc(-175% - 1rem), -50%);
  padding: 0.5rem;
  visibility: hidden;
}
</style>
