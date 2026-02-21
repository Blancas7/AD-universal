import { DC } from "../constants";

export const tabNotifications = {
  firstInfinity: {
    id: 0,
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "upgrades"
      },
      {
        parent: "challenges",
        tab: "normal"
      },
      {
        parent: "statistics",
        tab: "multipliers"
      }
    ],
    condition: () => !PlayerProgress.rewindUnlocked() &&
      !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() &&
      !PlayerProgress.infinityUnlocked(),
    events: [GAME_EVENT.BIG_CRUNCH_BEFORE]
  },
  breakInfinity: {
    id: 1,
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "break"
      }
    ],
    condition: () => !PlayerProgress.rewindUnlocked() &&
      !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && Autobuyer.bigCrunch.hasMaxedInterval
  },
  IDUnlock: {
    id: 2,
    tabsToHighLight: [
      {
        parent: "dimensions",
        tab: "infinity"
      }
    ],
    condition: () => !PlayerProgress.rewindUnlocked() &&
      !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && !InfinityDimension(2).isUnlocked
  },
  ICUnlock: {
    id: 3,
    tabsToHighLight: [
      {
        parent: "challenges",
        tab: "infinity"
      }
    ],
    condition: () => !PlayerProgress.rewindUnlocked() &&
      !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked()
  },
  replicanti: {
    id: 4,
    tabsToHighLight: [
      {
        parent: "infinity",
        tab: "replicanti"
      }
    ],
    condition: () => !PlayerProgress.rewindUnlocked() &&
      !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked() && Currency.infinityPoints.gte(DC.E140),
    events: [GAME_EVENT.BIG_CRUNCH_AFTER]
  },
  firstEternity: {
    id: 5,
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "studies"
      },
      {
        parent: "eternity",
        tab: "milestones"
      },
      {
        parent: "eternity",
        tab: "upgrades"
      },
      {
        parent: "dimensions",
        tab: "time"
      }
    ],
    condition: () => !PlayerProgress.rewindUnlocked() &&
      !PlayerProgress.realityUnlocked() &&
      !PlayerProgress.eternityUnlocked(),
    events: [GAME_EVENT.ETERNITY_RESET_BEFORE]
  },
  dilationAfterUnlock: {
    id: 6,
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "dilation"
      }
    ],
    condition: () => !PlayerProgress.rewindUnlocked() && !PlayerProgress.realityUnlocked()
  },
  realityUnlock: {
    id: 7,
    tabsToHighLight: [
      {
        parent: "eternity",
        tab: "studies"
      }
    ],
    condition: () => !PlayerProgress.rewindUnlocked() && !PlayerProgress.realityUnlocked() && TimeStudy.reality.canBeBought,
    events: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION,
      GAME_EVENT.OFFLINE_CURRENCY_GAINED, GAME_EVENT.ACHIEVEMENT_UNLOCKED]
  },
  blackHoleUnlock: {
    id: 8,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "hole"
      }
    ],
    condition: () => !PlayerProgress.rewindUnlocked() && !BlackHoles.areUnlocked && Currency.realityMachines.gte(100),
    events: [GAME_EVENT.REALITY_RESET_AFTER]
  },
  automatorUnlock: {
    id: 9,
    tabsToHighLight: [
      {
        parent: "automation",
        tab: "automator"
      }
    ],
    condition: () => !PlayerProgress.rewindUnlocked() && Player.automatorUnlocked,
    events: [GAME_EVENT.REALITY_RESET_AFTER]
  },
  teresaUnlock: {
    id: 10,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "celestial-navigation"
      },
      {
        parent: "celestials",
        tab: "teresa"
      }
    ],
    condition: () => !PlayerProgress.rewindUnlocked() && player.celestials.teresa.pouredAmount === 0 && Teresa.isUnlocked,
    events: [GAME_EVENT.REALITY_UPGRADE_BOUGHT]
  },
  alchemyUnlock: {
    id: 11,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "glyphs"
      },
      {
        parent: "reality",
        tab: "alchemy"
      }
    ],
    condition: () => !PlayerProgress.rewindUnlocked() && player.celestials.ra.pets.effarig.level >= 2,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  newAutobuyer: {
    id: 12,
    tabsToHighLight: [
      {
        parent: "automation",
        tab: "autobuyers"
      },
    ],
    // needs to be ignored in cel7 because they're unlocked differently
    condition: () => !PlayerProgress.rewindUnlocked() && !Pelle.isDoomed,
  },
  imaginaryMachineUnlock: {
    id: 13,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "imag_upgrades"
      }
    ],
    condition: () => !PlayerProgress.rewindUnlocked() && MachineHandler.isIMUnlocked,
    events: [GAME_EVENT.GAME_TICK_AFTER]
  },
  laitelaUnlock: {
    id: 14,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "laitela"
      },
    ],
    condition: () => !PlayerProgress.rewindUnlocked(),
  },
  pelleUnlock: {
    id: 15,
    tabsToHighLight: [
      {
        parent: "celestials",
        tab: "pelle"
      },
    ],
    condition: () => !PlayerProgress.rewindUnlocked(),
  },
  newGlyphCosmetic: {
    id: 16,
    tabsToHighLight: [
      {
        parent: "reality",
        tab: "glyphs",
      },
    ],
    // Always externally triggered
    condition: () => true,
  },
  rewindUnlock: {
    id: 17,
    tabsToHighLight: [
      {
        parent: "dimensions",
        tab: "stellar"
      },
      /*{
        parent: "rewind",
        tab: "rewind-upgrades"
      },*/
    ],
    // Always externally triggered
    condition: () => true,
    events: [GAME_EVENT.REWIND_RESET_BEFORE]
  },
};
