import { DC } from "./constants";
import { resetStellarDimensions } from "./dimensions/stellar-dimension";
import { Glyphs, Teresa, Effarig, Enslaved, V, Ra, Laitela, Pelle } from "./globals";
import { ImaginaryUpgrade, ImaginaryUpgrades } from "./imaginary-upgrades";
import { RealityUpgrade, RealityUpgrades } from "./reality-upgrades";

export function isRewindAvailable() {
  return player.records.thisRewind.maxAM.gte(DC.E1E15)/* && Pelle.isDoomed*/;
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
  const thisRunUPmin = rewindProps.gainedUP.div(Math.clampMin(0.0005, Time.thisRewindRealTime.totalMinutes));
  if (player.records.bestRewind.UPmin.lt(thisRunUPmin)) {
    player.records.bestRewind.UPmin = thisRunUPmin;
  }
  player.records.bestRewind.time = Math.min(player.records.thisRewind.time, player.records.bestRewind.time);
  if (player.records.thisRewind.realTime < player.records.bestRewind.realTime) {
    player.records.bestRewind.realTime = player.records.thisRewind.realTime;
  }
}

function giveRewindRewards(rewindProps) {
  const gainedUP = rewindProps.gainedUP;
  Currency.unityPoints.add(gainedUP);
  updateRewindRecords(rewindProps);
  addRewindTime(
    player.records.thisRewind.time,
    player.records.thisRewind.realTime,
    gainedUP,
    1);
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

  player.realities = 0;
  player.reality.perkPoints = 0;
  player.partSimulatedReality = 0;

  // for(let idx in Perks.all) {
  //   Perks.all[idx].isBought = false;
  //   Perks.all[idx].isEffectActive = false;
  // }
  player.reality.perks = new Set();

  Currency.realityMachines.reset();
  player.reality.maxRM = DC.D0;
  player.reality.rebuyables = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  player.reality.upgradeBits = 0;
  player.reality.upgReqs = 0;

  Currency.imaginaryMachines.reset();
  player.reality.iMCap = 0;
  player.reality.imaginaryRebuyables = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
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
    player.reality.glyphs.sac[typeSac] = 0;
  }

  for (const blackHoleKey in player.blackHole) {
    player.blackHole[blackHoleKey] = {
      id: blackHoleKey,
      intervalUpgrades: 0,
      powerUpgrades: 0,
      durationUpgrades: 0,
      phase: 0,
      active: false,
      unlocked: false,
      activations: 0,
    }
  }

  player.blackHolePauseTime = 0;
  player.blackHoleNegative = 1;

  // Celestial resets
  Teresa.reset();
  Effarig.reset();
  Enslaved.reset();
  V.reset();
  Ra.reset();
  Laitela.reset();
  Pelle.reset();

  player.sacrificed = DC.D0;

  player.records.thisRewind.time = 0;
  player.records.thisRewind.realTime = 0;
  player.records.thisRewind.maxAM = DC.D0;
  player.records.thisRewind.maxIP = DC.D0;
  player.records.thisRewind.maxEP = DC.D0;
  player.records.thisRewind.maxRM = DC.D0;
  player.records.thisRewind.maxIM = DC.D0;
  player.records.thisRewind.bestRealitiesPerMs = DC.D0;
  player.records.thisRewind.maxReplicanti = DC.D0;
  player.records.thisRewind.maxDT = DC.D0;
  player.records.thisRewind.bestRSmin = 0;
  player.records.thisRewind.bestRSminVal = 0;

  player.records.bestReality.time = 999999999999;
  player.records.bestReality.realTime = 999999999999;
  player.records.bestReality.glyphStrength = 0;
  player.records.bestReality.RM = DC.D0;
  player.records.bestReality.RMSet = [];
  player.records.bestReality.RMmin = DC.D0;
  player.records.bestReality.RMminSet = [];
  player.records.bestReality.glyphLevel = 0;
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
  player.records.bestInfinity.time = 999999999999;
  player.records.bestInfinity.realTime = 999999999999;
  player.records.thisInfinity.time = 0;
  player.records.thisInfinity.lastBuyTime = 0;
  player.records.thisInfinity.realTime = 0;
  player.dimensionBoosts = 0;
  player.galaxies = 0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.break = false;
  player.IPMultPurchases = 0;
  Currency.infinityPower.reset();
  Currency.timeShards.reset();
  Replicanti.reset(true);

  Currency.eternityPoints.reset();

  // This has to be reset before Currency.eternities to make the bumpLimit logic work correctly
  EternityUpgrade.epMult.reset();
  Currency.eternities.reset();
  player.records.thisEternity.time = 0;
  player.records.thisEternity.realTime = 0;
  player.records.bestEternity.time = 999999999999;
  player.records.bestEternity.realTime = 999999999999;
  player.eternityUpgrades.clear();
  player.totalTickGained = 0;
  player.eternityChalls = {};
  player.reality.unlockedEC = 0;
  player.reality.lastAutoEC = 0;
  player.reality.partEternitied = DC.D0;
  player.challenge.eternity.current = 0;
  player.challenge.eternity.unlocked = 0;
  player.challenge.eternity.requirementBits = 0;
  player.respec = false;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  Player.resetRequirements("rewind");
  player.records.thisReality.time = 0;
  player.records.thisReality.realTime = 0;
  player.records.thisReality.maxReplicanti = DC.D0;
  Currency.timeTheorems.reset();
  player.celestials.v.STSpent = 0;
  player.dilation.studies = [];
  player.dilation.active = false;

  player.dilation.upgrades.clear();
  player.dilation.rebuyables = {
    1: 0,
    2: 0,
    3: 0,
    11: 0,
    12: 0,
    13: 0
  };
  Currency.tachyonParticles.reset();
  player.dilation.nextThreshold = DC.E3;
  player.dilation.baseTachyonGalaxies = 0;
  player.dilation.totalTachyonGalaxies = 0;
  Currency.dilatedTime.reset();
  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisEternity.maxAM = DC.D0;
  player.records.thisReality.maxDT = DC.D0;
  player.dilation.lastEP = DC.DM1;
  Currency.antimatter.reset();
  Enslaved.autoReleaseTick = 0;
  player.celestials.enslaved.hasSecretStudy = false;
  player.celestials.laitela.entropy = 0;

  playerInfinityUpgradesOnReset();
  resetInfinityRuns();
  resetEternityRuns();
  InfinityDimensions.fullReset();
  fullResetTimeDimensions();
  resetChallengeStuff();
  AntimatterDimensions.reset();
  secondSoftReset(false);
  player.celestials.ra.peakGamespeed = 1;

  InfinityDimensions.resetAmount();
  player.records.thisInfinity.bestIPmin = DC.D0;
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
  player.records.bestEternity.bestEPminReality = DC.D0;
  player.records.thisReality.bestEternitiesPerMs = DC.D0;
  player.records.thisReality.bestRSmin = 0;
  player.records.thisReality.bestRSminVal = 0;
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
  player.reality.achTimer = 0;
}