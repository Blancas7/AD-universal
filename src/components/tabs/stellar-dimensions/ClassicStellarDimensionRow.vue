<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ClassicStellarDimensionRow",
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
      bought: new Decimal(0),
      rateOfChange: new Decimal(0),
      cost: new Decimal(0),
      isAvailableForPurchase: false,
      isAutobuyerOn: false,
      requirementReached: false,
      realityUnlocked: false
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
      return `Purchased ${quantifyInt("stellar", this.bought)}`;
    },
    showRow() {
      return this.rewindUnlocked;
    },
    formattedUPCost() {
      return this.isCapped ? "Capped" : `${this.showCostTitle ? "Cost: " : ""}${format(this.cost, 2)} UP`;
    },
    hasLongText() {
      return this.buttonContents.length > 20;
    },
    showCostTitle() {
      return his.cost.max(1).log10().lte(1e6);
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
      this.realityUnlocked = PlayerProgress.realityUnlocked();
    },
    buyStellarDimension() {
      buySingleStellarDimension(this.tier);
    },
    buyMaxStellarDimension() {
      buyMaxStellarDimension(this.tier);
    },
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-single-row"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 1)"
      :amount-text="format(amount, 2)"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container">
      <PrimaryButton
        enabled
        class="o-primary-btn--buy-sd o-primary-btn--buy-dim c-dim-tooltip-container"
        :class="{ 'l-dim-row-small-text': hasLongText }"
        @click="buyStellarDimension"
      >
        {{ buttonContents }}
        <div class="c-dim-purchase-count-tooltip">
          <span v-html="tooltipContents" />
        </div>
      </PrimaryButton>
      <PrimaryToggleButton
        v-if="areAutobuyersUnlocked"
        v-model="isAutobuyerOn"
        class="o-primary-btn--buy-sd-auto"
        label="Auto:"
      />
      <PrimaryButton
        v-else
        enabled
        class="o-primary-btn--buy-sd-auto"
        @click="buyMaxStellarDimension"
      >
        Buy Max
      </PrimaryButton>
    </div>
  </div>
</template>
