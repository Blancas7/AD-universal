<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "RewindModal",
  components: {
    ResetModal
  },
  data() {
    return {
      gainedRewinds: 1,
      gainedCelestialRemains: 1,
      gainedUnityPoints: new Decimal(),
      startingAM: new Decimal(10),
    };
  },
  computed: {
    isFirstRewind() {
      return !PlayerProgress.rewindUnlocked() && !player.isGameEnd;
    },
    message() {
      const info = this.isFirstRewind ? this.firstRewindInfo : ``;
      return `Upon Rewind, everything will be reset except Challenge records and anything under the General header on the
        Statistics tab. The first ${formatInt(18)} rows of Achievements are also reset. ${info}`;
    },
    alternateMessage() {
      return `If you have already completed the game, you can start off with one Rewind to boost your progress.`;
    },
    firstRewindInfo() {
      return `In return, you gain an Unity Point (UP). This allows you to buy multiple upgrades that you can
        find in the Universe tab. You will also gain one Celestial Remain.`;
    },
    upGainInfo() {
      return `You will gain ${quantify("CelestialRemain", this.gainedCelestialRemains, 2, 0)}
        and ${quantify("Unity Point", this.gainedUnityPoints, 2, 0)}.`;
    },
  },
  methods: {
    update() {
      this.gainedCelestialRemains = 1;
      this.gainedUnityPoints = new Decimal(1);
    },
    handleYesClick() {
      startManualRewind(true);
    }
  },
};
</script>

<template>
  <ResetModal
    header="You are about to Rewind"
    :message="message"
    :gained-resources="upGainInfo"
    :confirm-fn="handleYesClick"
    :alternate-condition="isFirstRewind"
    :alternate-text="alternateMessage"
    :confirm-option="isFirstRewind ? undefined : 'rewind'"
  />
</template>
