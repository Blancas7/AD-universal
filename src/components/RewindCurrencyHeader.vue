<script>
export default {
  name: "RewindCurrencyHeader",
  data() {
    return {
      currencyValue: new Decimal(),
      currencyName: "",
    };
  },
  methods: {
    update() {
      const up = Currency.unityPoints.value;
      this.currencyValue = format(up, 2);
      this.currencyName = pluralize("Unity Point", up);
    },
    resourceClass() {
      return {
        "c-rewind-tab__unity-points": true,
      };
    }
  }
};
</script>

<template>
  <div class="c-rewind-currency">
    You have
    <b :class="resourceClass()">
      {{ currencyValue }}
    </b>
    {{ currencyName }}.
  </div>
</template>

<style scoped>
.c-rewind-currency {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
</style>
