import { IntervaledAutobuyerState } from "./autobuyer";

export class StellarDimensionAutobuyerState extends IntervaledAutobuyerState {
  get tier() {
    return this.id;
  }

  get name() {
    return StellarDimension(this.tier).shortDisplayName;
  }

  get fullName() {
    return `${this.name} Stellar Dimension`;
  }

  get data() {
    return player.auto.stellarDims.all[this.tier - 1];
  }

  get interval() {
    return 1000;
  }

  get isUnlocked() {
    return false;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.REWIND;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    const tier = this.tier;
    if (!StellarDimension(tier).isAvailableForPurchase) return;
    super.tick();
    if (Currency.unityPoints.exponent >= 10) {
      buyMaxStellarDimension(tier, 1, true);
    } else {
      buySingleStellarDimension(tier, true);
    }
  }

  static get entryCount() { return 8; }
  static get autobuyerGroupName() { return "Stellar Dimension"; }
  static get isActive() { return player.auto.stellarDims.isActive; }
  static set isActive(value) { player.auto.stellarDims.isActive = value; }
}
