<script>
export default {
  name: "ModernBottomButton",
  props: {
    bottomButton: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      isAvailable: false,
      isHidden: false,
      isSticky: false,
      isHeld: false,
      action: null,
      holdTimeout: null,
      key: false,
      buttonName: ""
    };
  },
  computed: {
    classObject() {
      return {
        "o-btm-btn": true,
        "o-btm-btn--modern-btns": true,
        "o-btm-btn--held": this.isHeld,
        "o-btm-btn--sticky": this.isSticky,
      };
    },
  },
  methods: {
    update() {
      this.isAvailable = this.bottomButton.isAvailable;
      this.isHidden = this.bottomButton.isHidden;
      this.isSticky = this.bottomButton.sticky;
      this.action = this.bottomButton.action;
      this.buttonName = this.bottomButton.name;
      this.key = this.bottomButton.key;

      if(this.isSticky || this.isHeld) {
        this.action();
      }
    },

    startHold(e) {
      e.preventDefault();
      e.stopPropagation();

      let that = this;
      that.isHeld = true;
      that.holdTimeout = setTimeout(function() {
        that.holdTimeout = null;
        that.bottomButton.sticky = true;
      }, 1000);
    },

    endHold(e) {
      this.isHeld = false;
      removeAllStickyBottomButton(this.key);
      if(this.holdTimeout) {
        clearTimeout(this.holdTimeout);
        this.bottomButton.sticky = false;
      }
    }
  },
};
</script>

<template>
  <div
    v-if="!isHidden && isAvailable"
    :class="[classObject, bottomButton.config.UIClass]"
    @pointerdown="startHold"
    @pointerup="endHold"
    @pointercancel="endHold"
  >
    <div
      class="l-btm-btn-inner"
    >
      {{ buttonName }}
    </div>
  </div>
</template>

