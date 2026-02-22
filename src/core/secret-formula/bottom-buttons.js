export const bottomButtons = [
  {
    key: "m",
    name: "Max",
    type: "bindRepeatableHotkey",
    action: () => maxAll(),
    condition: () => true,
  },
  {
    key: "d",
    name: "Dim Boost",
    type: "bindRepeatableHotkey",
    action: () => manualRequestDimensionBoost(true),
    condition: () => true,
  },
  {
    key: "g",
    name: "Galaxy",
    type: "bindRepeatableHotkey",
    action: () => manualRequestGalaxyReset(true),
    condition: () => true,
  },
  {
    key: "c",
    name: "Crunch",
    type: "bindRepeatableHotkey",
    action: () => manualBigCrunchResetRequest(),
    condition: () => PlayerProgress.rewindUnlocked() || PlayerProgress.realityUnlocked() || PlayerProgress.eternityUnlocked() || PlayerProgress.infinityUnlocked(),
  },
  {
    key: "r",
    name: "R. Galaxy",
    type: "bindHotkey",
    action: () => replicantiGalaxyRequest(),
    condition: () => PlayerProgress.replicantiUnlocked() || PlayerProgress.rewindUnlocked(),
  },
  {
    key: "e",
    name: "Eternity",
    type: "bindRepeatableHotkey",
    action: () => eternityResetRequest(),
    condition: () => PlayerProgress.rewindUnlocked() || PlayerProgress.eternityUnlocked() || Player.canEternity,
  },
];
