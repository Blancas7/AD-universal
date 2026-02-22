export const bottomButtons = [
  {
    key: "m",
    name: "Max",
    type: "bindRepeatableHotkey",
    action: () => maxAll(),
  },
  {
    key: "r",
    name: "R. Galaxy",
    type: "bindHotkey",
    action: () => replicantiGalaxyRequest(),
  }
];
