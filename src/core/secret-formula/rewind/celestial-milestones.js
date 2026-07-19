import { DC } from "../../constants";

export const celestialMilestones = [
  {
    id: 0,
    name: "Teresa",
    levels: [
      {
        id: 0,
        description: "Gain passive sacrifice based on your highest Glyph level in this Universe",
      },
      {
        id: 1,
        description: "Start with all Perks, all reality upgrade requirements completed, and the pre-Ra perk shop is maxed out when you unlock it",
      },
      {
        id: 2,
        description: "Start with all reality upgrades bought",
      },
      {
        id: 3,
        description: "Teresa's drain is maxed out, and the post-Ra perk shop is maxed out when you unlock it",
      },
      {
        id: 4,
        description: "Teresa's best antimatter is set to the square root of your bets antimatter in this Universe",
      },
    ],
  },
  {
    id: 1,
    name: "Effarig",
    levels: [
      {
        id: 0,
        description: () => `Start with all of Effarig's shop bought, and ${formatInt(5000)} alchemy when unlocked`,
      },
      {
        id: 1,
        description: () => `You gain Relic Shards passively, and start with ${formatInt(10000)} alchemy when unlocked`,
      },
      {
        id: 2,
        description: () => `Start with Effarig's infinity completed, and ${formatInt(15000)} alchemy when unlocked`,
      },
      {
        id: 3,
        description: () => `Start with Effarig's eternity completed, and ${formatInt(20000)} alchemy when unlocked`,
      },
      {
        id: 4,
        description: () => `Start with Effarig's reality completed, and ${formatInt(25000)} alchemy when unlocked`,
      },
    ],
  },
  {
    id: 2,
    name: "Nameless",
    levels: [
      {
        id: 0,
        description: () => `Real time storing efficiency is increased to ${formatInt(100)}%`,
      },
      {
        id: 1,
        description: "Start with both Nameless' upgrades unlocked and bought",
      },
      {
        id: 2,
        description: "Start with both permanent Black Holes",
      },
      {
        id: 3,
        description: "Unlock the Tesseract autobuyer",
      },
      {
        id: 4,
        description: "Start with Nameless' reality completed",
      },
    ],
  },
  {
    id: 3,
    name: "V",
    levels: [
      {
        id: 0,
        description: () => `Start with V unlocked, and ${formatInt(2)} levels of normal V-achievements completed`,
      },
      {
        id: 1,
        description: () => `Start with ${formatInt(4)} levels of normal V-achievements completed`,
      },
      {
        id: 2,
        description: "Start with all normal V-achievements completed",
      },
      {
        id: 3,
        description: () => `Start with ${formatInt(2)} levels of hard V-achievements completed`,
      },
      {
        id: 4,
        description: "Start with all hard V-achievements completed",
      },
    ],
  },
  {
    id: 4,
    name: "Ra",
    levels: [
      {
        id: 0,
        description: () => `All Ra's pets start at level ${formatInt(5)}`,
      },
      {
        id: 1,
        description: () => `All Ra's pets start at level ${formatInt(10)}, and unlocks autobuyers for pets upgrades`,
      },
      {
        id: 2,
        description: () => `All Ra's pets start at level ${formatInt(15)}`,
      },
      {
        id: 3,
        description: () => `All Ra's pets start at level ${formatInt(20)}`,
      },
      {
        id: 4,
        description: () => `All Ra's pets start at level ${formatInt(25)}, and start with all Charged Infinity Upgrades`,
      },
    ],
  },
  {
    id: 5,
    name: "Lai'tela",
    levels: [
      {
        id: 0,
        description: () => `Start with ${formatInt(1)} destabilization, and Vacuum Acceleration`,
      },
      {
        id: 1,
        description: () => `Start with ${formatInt(2)} destabilizations, and keep all Lai’tela’s autobuyers`,
      },
      {
        id: 2,
        description: () => `Start with ${formatInt(4)} destabilizations, removes all imaginary upgrades requirements and unlocks autobuyers for them`,
      },
      {
        id: 3,
        description: () => `Start with ${formatInt(6)} destabilizations, you passively gain the annihilation multiplier, and add a thresold to the Ascension autobuyer`,
      },
      {
        id: 4,
        description: () => `Start with ${formatInt(8)} destabilizations, and an autobuyer for Singularity threshold increase`,
      },
    ],
  },
  {
    id: 6,
    name: "Pelle",
    levels: [
      {
        id: 0,
        description: () => `Start with all Infinity upgrades, and the rifts and galaxy generator are ${formatInt(2)} times faster`,
      },
      {
        id: 1,
        description: () => `Start with all Break Infinity upgrades, keep the time theorems autobuyer, one more max active rifts, and the rifts and galaxy generator are ${formatInt(2)} times faster`,
      },
      {
        id: 2,
        description: () => `Start with ${formatInt(100)} eternities and IC completed, all the unique Pelle upgrades, one more active rift, and the rifts and galaxy generator are ${formatInt(2)} times faster`,
      },
      {
        id: 3,
        description: () => `You gain Remnants passively, get one more active rifts and all rifts start out active, and the rifts and galaxy generator are ${formatInt(2)} times faster`,
      },
      {
        id: 4,
        description: "Start with all ECs completed, and the rift and galaxy generator animations are instant",
      },
    ],
  },
];
