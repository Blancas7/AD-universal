import { DC } from "../constants";

import { DimensionState } from "./dimension";

export function buySingleStellarDimension(tier, auto = false) {
  const dim = StellarDimension(tier);
  if (Currency.unityPoints.lt(dim.cost)) return false;
  
  Currency.unityPoints.subtract(dim.cost);
  dim.amount = dim.amount.add(1);
  dim.bought = dim.bought.add(1);
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function resetStellarDimensions() {
  for (const dim of StellarDimensions.all) dim.amount = new Decimal(dim.bought);
  updateStellarDimensionCosts();
}

export function fullResetStellarDimensions() {
  for (const dim of StellarDimensions.all) {
    dim.cost = new Decimal(dim.baseCost);
    dim.amount = DC.D0;
    dim.bought = DC.D0;
  }
}

export function toggleAllStellarDims() {
  const areEnabled = Autobuyer.stellarDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.stellarDimension(i).isActive = !areEnabled;
  }
}

export function buyMaxStellarDimension(tier, portionToSpend = 1, isMaxAll = false) {
  const canSpend = Currency.unityPoints.value.times(portionToSpend);
  const dim = StellarDimension(tier);
  if (canSpend.lt(dim.cost)) return false;

  const costScaling = new LinearCostScaling(
    Currency.unityPoints.value,
    this.cost,
    this.costMultiplier
  );

  if (costScaling.purchases.lte(0)) return false;

  Currency.unityPoints.subtract(costScaling.totalCost);
  dim.amount = dim.amount.plus(costScaling.purchases);
  dim.bought = dim.bought.add(costScaling.purchases);
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function maxAllStellarDimensions() {
  // Try to buy single from the highest affordable new dimensions
  for (let i = 8; i > 0 && StellarDimension(i).bought.eq(0); i--) {
    buySingleStellarDimension(i, true);
  }

  // Buy everything costing less than 1% of initial UP
  for (let i = 8; i > 0; i--) {
    buyMaxStellarDimension(i, 0.01, true);
  }

  // Loop buying the cheapest dimension possible; explicit infinite loops make me nervous
  const purchasableDimensions = StellarDimensions.all;
  for (let stop = 0; stop < 1000; stop++) {
    const cheapestDim = purchasableDimensions.reduce((a, b) => (b.cost.gte(a.cost) ? a : b));
    if (!buySingleStellarDimension(cheapestDim.tier, true)) break;
  }
}

export function stellarDimensionCommonMultiplier() {
  let mult = new Decimal(1);

  mult = mult.times(player.celestialMultiplier);

  return mult;
}

export function updateStellarDimensionCosts() {
  for (let i = 1; i <= 8; i++) {
    const dim = StellarDimension(i);
    dim.cost = dim.nextCost(dim.bought);
  }
}

class StellarDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.stellar, tier);
    const BASE_COSTS = [null, DC.D1, DC.D5, DC.E2, DC.E3, DC.E5, DC.E8, DC.E11, DC.E15];
    this._baseCost = BASE_COSTS[tier];
    const COST_MULTS = [null, 3, 9, 27, 81, 243, 729, 2187, 6561].map(e => (e ? new Decimal(e) : null));
    this._costMultiplier = COST_MULTS[tier];
  }

  /** @returns {Decimal} */
  get cost() {
    return this.data.cost;
  }

  /** @param {Decimal} value */
  set cost(value) { this.data.cost = value; }

  nextCost(bought) {
    let base = this.costMultiplier;
    const exponent = bought;
    const cost = Decimal.pow(base, exponent).times(this.baseCost);

    return cost;
  }

  get isUnlocked() {
    return true;
  }

  get isAvailableForPurchase() {
    return this.isAffordable;
  }

  get isAffordable() {
    return Currency.unityPoints.gte(this.cost);
  }

  get multiplier() {
    const tier = this._tier;

    if (EternityChallenge(11).isRunning) return DC.D1;
    let mult = GameCache.stellarDimensionCommonMultiplier.value;
    // let mult = GameCache.stellarDimensionCommonMultiplier.value
    //   .timesEffectsOf(
    //     tier === 1 ? TimeStudy(11) : null,
    //     tier === 3 ? TimeStudy(73) : null,
    //     tier === 4 ? TimeStudy(227) : null
    //   );

    const dim = StellarDimension(tier);
    const bought = dim.bought;
    mult = mult.times(Decimal.pow(dim.powerMultiplier, bought));

    // mult = mult.pow(getAdjustedGlyphEffect("timepow"));
    mult = mult.pow(getAdjustedGlyphEffect("effarigdimensions"));
    mult = mult.pow(getAdjustedGlyphEffect("curseddimensions"));
    // mult = mult.powEffectOf(AlchemyResource.time);
    mult = mult.pow(Ra.momentumValue);
    // mult = mult.pow(ImaginaryUpgrade(11).effectOrDefault(1));
    mult = mult.powEffectOf(PelleRifts.paradox);

    if (player.dilation.active || PelleStrikes.dilation.hasStrike) {
      mult = dilatedValueOf(mult);
    }

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(mult);
    } else if (V.isRunning) {
      mult = mult.pow(0.5);
    }
    

    return mult;
  }

  get productionPerSecond() {
    if (Laitela.isRunning && this.tier > Laitela.maxAllowedDimension) {
      return DC.D0;
    }
    if (EternityChallenge(11).isRunning) {
      return this.amount;
    }
    
    let production = this.amount.times(this.multiplier);
    // if (this._tier === 1 && !EternityChallenge(7).isRunning) {
    //   production = production.pow(getAdjustedGlyphEffect("timeshardpow"));
    // }
    return production;
  }

  get rateOfChange() {
    const tier = this._tier;
    if (tier === 8) {
      return DC.D0;
    }
    const toGain = StellarDimension(tier + 1).productionPerSecond;
    const current = Decimal.max(this.amount, 1);
    // return toGain.times(10).dividedBy(current).times(getGameSpeedupForDisplay());
    return toGain.times(10).dividedBy(current);
  }

  get isProducing() {
    const tier = this.tier;
    if (Laitela.isRunning && tier > Laitela.maxAllowedDimension) {
      return false;
    }
    return this.amount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    return this._costMultiplier;
  }

  get powerMultiplier() {
    return DC.D4;
  }

  get requirementReached() {
    return true;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {StellarDimensionState}
 */
export const StellarDimension = StellarDimensionState.createAccessor();


export const StellarDimensions = {
  /**
   * @type {StellarDimensionState[]}
   */
  all: StellarDimension.index.compact(),

  tick(diff) {
    for (let tier = 8; tier > 1; tier--) {
      StellarDimension(tier).produceDimensions(StellarDimension(tier - 1), diff.div(10));
    }

    StellarDimension(1).produceCurrency(Currency.stardust, diff);
  }
};
