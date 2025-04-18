import { DC } from "./constants";
import { resetStellarDimensions } from "./dimensions/stellar-dimension";
import { Glyphs, Teresa, Effarig, Enslaved, V, Ra, Laitela, Pelle } from "./globals";
import { ImaginaryUpgrade, ImaginaryUpgrades } from "./imaginary-upgrades";
import { RealityUpgrade, RealityUpgrades } from "./reality-upgrades";

export function isRewindAvailable() {
  return player.records.thisRewind.maxAM.gte(DC.BIMAX)/* && Pelle.isDoomed*/;
}

/**
 * Triggered when the user clicks the rewind button.
 */
export function requestManualRewind() {
  if (!isRewindAvailable()) return;
  if (GameEnd.creditsEverClosed) return;
  if (player.options.confirmations.rewind) {
    Modal.rewind.show();
    return;
  }
  startManualRewind();
}

export function startManualRewind(force) {
  if (player.options.animations.rewind) {
    // runRewindAnimation();
    // setTimeout(processManualRewind, 3000);
    processManualRewind(force);
  } else {
    processManualRewind(force);
  }
}

export function processManualRewind(force) {
  if (!isRewindAvailable() && !force) return;

  beginProcessRewind(getRewindProps(false));
}

// export function runRealityAnimation() {
//   document.getElementById("ui").style.userSelect = "none";
//   document.getElementById("ui").style.animation = "a-realize 10s 1";
//   document.getElementById("realityanimbg").style.animation = "a-realizebg 10s 1";
//   document.getElementById("realityanimbg").style.display = "block";
//   if (Theme.current().isDark()) document.getElementById("realityanimbg").style.filter = "invert(1)";
//   else document.getElementById("realityanimbg").style.filter = "";
//   setTimeout(() => {
//     document.getElementById("realityanimbg").play();
//     document.getElementById("realityanimbg").currentTime = 0;
//     document.getElementById("realityanimbg").play();
//   }, 2000);
//   setTimeout(() => {
//     document.getElementById("ui").style.userSelect = "auto";
//     document.getElementById("ui").style.animation = "";
//     document.getElementById("realityanimbg").style.animation = "";
//     document.getElementById("realityanimbg").style.display = "none";
//   }, 10000);
// }

export function getRewindProps(isReset) {
  const defaults = {};
  if (isReset) return Object.assign(defaults, {
    reset: true,
  });
  return Object.assign(defaults, {
    reset: false,
    gainedUP: DC.D1,
  });
}

export function autoRewind() {
  if (!isRewindAvailable()) return;
  beginProcessRewind(getRewindProps(false));
}

function updateRewindRecords(rewindProps) {
  const thisRunUPmin = rewindProps.gainedUP.div(Time.thisRewindRealTime.totalMinutes.clampMin(0.0005));
  if (player.records.bestRewind.UPmin.lt(thisRunUPmin)) {
    player.records.bestRewind.UPmin = thisRunUPmin;
  }
  player.records.bestRewind.time = player.records.thisRewind.time.clampMax(player.records.bestRewind.time);
  if (player.records.thisRewind.realTime.lt(player.records.bestRewind.realTime)) {
    player.records.bestRewind.realTime = player.records.thisRewind.realTime;
  }
  player.records.bestRewind.trueTime = Math.min(player.records.bestRewind.trueTime, player.records.thisRewind.trueTime)
}

function giveRewindRewards(rewindProps) {
  const gainedUP = rewindProps.gainedUP;
  Currency.unityPoints.add(gainedUP);
  updateRewindRecords(rewindProps);
  addRewindTime(
    player.records.thisRewind.trueTime,
    player.records.thisRewind.time,
    player.records.thisRewind.realTime,
    gainedUP,
    DC.D1);
  Currency.rewinds.add(1);
  Currency.celestialRemains.add(1);
  if (player.celestialMultiplier < 35) {
    player.celestialMultiplier += 1;
  }
}

export function beginProcessRewind(rewindProps) {
  if (rewindProps.reset) {
    finishProcessRewind(rewindProps);
    return;
  }
  EventHub.dispatch(GAME_EVENT.REWIND_RESET_BEFORE);

  finishProcessRewind(rewindProps);
}

// eslint-disable-next-line complexity
export function finishProcessRewind(rewindProps) {
  const finalAM = Currency.antimatter.value;
  if (player.records.bestRewind.bestAM.lt(finalAM)) {
    player.records.bestRewind.bestAM = new Decimal(finalAM);
  }

  const isReset = rewindProps.reset;
  if (!isReset) giveRewindRewards(rewindProps);
  
  if (player.options.automatorEvents.clearOnRewind) AutomatorData.clearEventLog();
  if (Player.automatorUnlocked && AutomatorBackend.state.forceRestart) {
    // Make sure to restart the current script instead of using the editor script - the editor script might
    // not be a valid script to run; this at best stops it from running and at worst causes a crash
    AutomatorBackend.start(AutomatorBackend.state.topLevelScript);
  }

  Currency.stardust.reset();
  resetStellarDimensions();

  player.realities = DC.D0;
  player.reality.perkPoints = DC.D0;
  player.partSimulatedReality = DC.D0;

  // for(let idx in Perks.all) {
  //   Perks.all[idx].isBought = false;
  //   Perks.all[idx].isEffectActive = false;
  // }
  player.reality.perks = new Set();

  Currency.realityMachines.reset();
  player.reality.maxRM = DC.D0;
  player.reality.rebuyables = {
    1: new Decimal(),
    2: new Decimal(),
    3: new Decimal(),
    4: new Decimal(),
    5: new Decimal(),
  };
  player.reality.upgradeBits = 0;
  player.reality.upgReqs = 0;

  Currency.imaginaryMachines.reset();
  player.reality.iMCap = DC.D0;
  player.reality.imaginaryRebuyables = {
    1: new Decimal(),
    2: new Decimal(),
    3: new Decimal(),
    4: new Decimal(),
    5: new Decimal(),
    6: new Decimal(),
    7: new Decimal(),
    8: new Decimal(),
    9: new Decimal(),
    10: new Decimal(),
  };
  player.reality.imaginaryUpgradeBits = 0;
  player.reality.imaginaryUpgReqs = 0;

  Glyphs.clearUndo();
  player.reality.glyphs.active = [];
  for (let index = 0; index < player.reality.glyphs.inventory.length; index++) {
    let glyph = player.reality.glyphs.inventory[index];
    if (glyph.type !== "companion") {
      Glyphs.removeFromInventory(glyph);
    }
  }
  // We remove the sacrifice after getting rid of all the glyphs, just in case
  for (const typeSac in player.reality.glyphs.sac) {
    player.reality.glyphs.sac[typeSac] = DC.D0;
  }

  for (const blackHoleKey in player.blackHole) {
    player.blackHole[blackHoleKey] = {
      id: blackHoleKey,
      intervalUpgrades: DC.D0,
      powerUpgrades: DC.D0,
      durationUpgrades: DC.D0,
      phase: DC.D0,
      active: false,
      unlocked: false,
      activations: DC.D0,
    }
  }

  player.blackHolePauseTime = DC.D0;
  player.blackHoleNegative = DC.D1;

  // Celestial resets
  Teresa.reset();
  Effarig.reset();
  Enslaved.reset();
  V.reset();
  Ra.reset();
  Laitela.reset();
  Pelle.reset();

  player.sacrificed = DC.D0;

  player.records.thisRewind.time = DC.D0;
  player.records.thisRewind.realTime = DC.D0;
  player.records.thisRewind.trueTime = 0;
  player.records.thisRewind.maxAM = DC.D0;
  player.records.thisRewind.maxIP = DC.D0;
  player.records.thisRewind.maxEP = DC.D0;
  player.records.thisRewind.maxRM = DC.D0;
  player.records.thisRewind.maxIM = DC.D0;
  player.records.thisRewind.bestRealitiesPerMs = DC.D0;
  player.records.thisRewind.maxReplicanti = DC.D0;
  player.records.thisRewind.maxDT = DC.D0;
  player.records.thisRewind.bestRSmin = DC.D0;
  player.records.thisRewind.bestRSminVal = DC.D0;

  player.records.bestReality.time = DC.BEMAX;
  player.records.bestReality.realTime = DC.BEMAX;
  player.records.bestReality.trueTime = 0;
  player.records.bestReality.glyphStrength = DC.D0;
  player.records.bestReality.RM = DC.D0;
  player.records.bestReality.RMSet = [];
  player.records.bestReality.RMmin = DC.D0;
  player.records.bestReality.RMminSet = [];
  player.records.bestReality.glyphLevel = DC.D0;
  player.records.bestReality.glyphLevelSet = [];
  player.records.bestReality.bestEP = DC.D0;
  player.records.bestReality.bestEPSet = [];
  player.records.bestReality.speedSet = [];
  player.records.bestReality.iMCapSet = [];
  player.records.bestReality.laitelaSet = [];

  lockAchievementsOnRewind();

  // Because initializeChallengeCompletions has some code that completes normal challenges with 2 eternities,
  // and we haven't reset eternities yet (and I'm nervous about changing the order of this code),
  // add a flag to indicate that this is a rewind reset.
  initializeChallengeCompletions(true);

  Currency.infinities.reset();
  Currency.infinitiesBanked.reset();
  player.records.bestInfinity.time = DC.BEMAX;
  player.records.bestInfinity.realTime = DC.BEMAX;
  player.records.thisInfinity.time = DC.D0;
  player.records.thisInfinity.lastBuyTime = DC.D0;
  player.records.thisInfinity.realTime = DC.D0;
  player.dimensionBoosts = DC.D0;
  player.galaxies = DC.D0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.break = false;
  player.IPMultPurchases = DC.D0;
  Currency.infinityPower.reset();
  Currency.timeShards.reset();
  Replicanti.reset(true);

  Currency.eternityPoints.reset();

  // This has to be reset before Currency.eternities to make the bumpLimit logic work correctly
  EternityUpgrade.epMult.reset();
  Currency.eternities.reset();
  player.records.thisEternity.time = DC.D0;
  player.records.thisEternity.realTime = DC.D0;
  player.records.bestEternity.time = DC.BEMAX;
  player.records.bestEternity.realTime = DC.BEMAX;
  player.eternityUpgrades.clear();
  player.totalTickGained = DC.D0;
  player.eternityChalls = {};
  player.reality.unlockedEC = 0;
  player.reality.lastAutoEC = DC.D0;
  player.reality.partEternitied = DC.D0;
  player.challenge.eternity.current = 0;
  player.challenge.eternity.unlocked = 0;
  player.challenge.eternity.requirementBits = 0;
  player.respec = false;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  Player.resetRequirements("rewind");
  player.records.thisReality.time = DC.D0;
  player.records.thisReality.realTime = DC.D0;
  player.records.thisReality.maxReplicanti = DC.D0;
  Currency.timeTheorems.reset();
  player.celestials.v.STSpent = 0;
  player.dilation.studies = [];
  player.dilation.active = false;

  player.dilation.upgrades.clear();
  player.dilation.rebuyables = {
    1: DC.D0,
    2: DC.D0,
    3: DC.D0,
    11: DC.D0,
    12: DC.D0,
    13: DC.D0
  };
  Currency.tachyonParticles.reset();
  player.dilation.nextThreshold = DC.E3;
  player.dilation.baseTachyonGalaxies = DC.D0;
  player.dilation.totalTachyonGalaxies = DC.D0;
  Currency.dilatedTime.reset();
  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisEternity.maxAM = DC.D0;
  player.records.thisReality.maxDT = DC.D0;
  player.dilation.lastEP = DC.DM1;
  Currency.antimatter.reset();
  Enslaved.autoReleaseTick = 0;
  player.celestials.enslaved.hasSecretStudy = false;
  player.celestials.laitela.entropy = DC.D0;

  playerInfinityUpgradesOnReset();
  resetInfinityRuns();
  resetEternityRuns();
  InfinityDimensions.fullReset();
  fullResetTimeDimensions();
  resetChallengeStuff();
  AntimatterDimensions.reset();
  secondSoftReset(false);
  player.celestials.ra.peakGamespeed = DC.D1;

  InfinityDimensions.resetAmount();
  player.records.thisInfinity.bestIPmin = DC.D0;
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
  player.records.bestEternity.bestEPminReality = DC.D0;
  player.records.thisReality.bestEternitiesPerMs = DC.D0;
  player.records.thisReality.bestRSmin = DC.D0;
  player.records.thisReality.bestRSminVal = DC.D0;
  resetTimeDimensions();
  resetTickspeed();
  AchievementTimers.marathon2.reset();
  Currency.infinityPoints.reset();

  Tab.dimensions.antimatter.show();

  Lazy.invalidateAll();
  ECTimeStudyState.invalidateCachedRequirements();
  EventHub.dispatch(GAME_EVENT.REWIND_RESET_AFTER);
}

function lockAchievementsOnRewind() {
  for (const achievement of Achievements.preRewind) {
    achievement.lock();
  }
  player.reality.achTimer = DC.D0;
}