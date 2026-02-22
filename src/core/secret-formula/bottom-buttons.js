export const bottomButtons = [
  {
    key: "m",
    name: "Max",
    type: "bindRepeatableHotkey",
    action: () => maxAll(),
    condition: () => true,
  },
  {
    key: "r",
    name: "R. Galaxy",
    type: "bindHotkey",
    action: () => replicantiGalaxyRequest(),
    condition: () => PlayerProgress.replicantiUnlocked() || PlayerProgress.rewindUnlocked(),
  }
];
