class BottomButtonState {
  constructor(config) {
    this.config = config;
    this.sticky = false;
    this.held = false;
  }

  get name() {
    return this.config.name;
  }

  get action() {
    return this.config.action;
  }

  get isHidden() {
    return !(typeof this.config.condition == 'undefined' || this.config.condition());
  }

  get isUnlocked() {
    return this.config.condition === undefined || this.config.condition();
  }

  get isAvailable() {
    return !this.isHidden && this.isUnlocked;
  }

  get key() {
    return this.config.key;
  }
}

export const BottomButton = GameDatabase.bottomButtons.mapToObject(
  config => config.key,
  config => new BottomButtonState(config)
);

export const BottomButtons = (function() {
  return {
    all: Object.values(BottomButton),
  };
}());

export const removeAllStickyBottomButton = (keyToKeep) => {
  for(let idx in Object.keys(BottomButtons.all)) {
    if(BottomButtons.all[idx] instanceof BottomButtonState && (typeof keyToKeep == 'undefined' || keyToKeep != BottomButtons.all[idx].key)) {
      BottomButtons.all[idx].sticky = false;
    }
  }
};
