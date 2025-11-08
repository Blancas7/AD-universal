export const confirmationTypes = [
  {
    name: "Dimension Boost",
    option: "dimensionBoost",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || PlayerProgress.infinityUnlocked() || player.galaxies > 0 || player.dimensionBoosts > 0,
  }, {
    name: "Antimatter Galaxy",
    option: "antimatterGalaxy",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || PlayerProgress.infinityUnlocked() || player.galaxies > 0,
  }, {
    name: "Sacrifice",
    option: "sacrifice",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || Sacrifice.isVisible,
  }, {
    name: "Big Crunch",
    option: "bigCrunch",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || player.break || PlayerProgress.eternityUnlocked(),
  }, {
    name: "Challenges",
    option: "challenges",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || PlayerProgress.infinityUnlocked(),
  }, {
    name: "Exit Challenges",
    option: "exitChallenge",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || PlayerProgress.infinityUnlocked(),
  }, {
    name: "Replicanti Galaxy",
    option: "replicantiGalaxy",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || PlayerProgress.eternityUnlocked() || player.replicanti.unl,
  }, {
    name: "Eternity",
    option: "eternity",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || PlayerProgress.eternityUnlocked(),
  }, {
    name: "Dilation",
    option: "dilation",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || PlayerProgress.realityUnlocked() || !Currency.tachyonParticles.eq(0),
  }, {
    name: "Reset Reality",
    option: "resetReality",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || PlayerProgress.realityUnlocked(),
  }, {
    name: "Glyph Replace",
    option: "glyphReplace",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || PlayerProgress.realityUnlocked(),
  }, {
    name: "Glyph Sacrifice",
    option: "glyphSacrifice",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || GlyphSacrificeHandler.canSacrifice,
  }, {
    name: "Glyph Purge",
    option: "autoClean",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || GlyphSacrificeHandler.canSacrifice,
  }, {
    name: "Sacrifice All Glyphs",
    option: "sacrificeAll",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || GlyphSacrificeHandler.canSacrifice,
  }, {
    name: "Glyph Selection",
    option: "glyphSelection",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || Autobuyer.reality.isUnlocked,
  }, {
    name: "Glyph Undo",
    option: "glyphUndo",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || TeresaUnlocks.undo.canBeApplied,
  }, {
    name: "Switch Automator Editor",
    option: "switchAutomatorMode",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || Player.automatorUnlocked,
  }, {
    name: "Delete Glyph Preset",
    option: "deleteGlyphSetSave",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || EffarigUnlock.setSaves.isUnlocked,
  }, {
    name: "Glyph Refine",
    option: "glyphRefine",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
  }, {
    name: "Armageddon",
    option: "armageddon",
    isUnlocked: () => PlayerProgress.rewindUnlocked() || Pelle.isDoomed,
  }, {
    name: "Rewind",
    option: "rewind",
    isUnlocked: () => PlayerProgress.rewindUnlocked(),
  }, {
    name: "Respec Shop Purchases",
    option: "respecIAP",
    isUnlocked: () => Cloud.isAvailable
  }
];
