<script>
import ModernSidebarCurrency from "./ModernSidebarCurrency";
import ModernTabButton from "./ModernTabButton";
import ModernBottomButton from "./ModernBottomButton";

export default {
  name: "ModernSidebar",
  components: {
    ModernSidebarCurrency,
    ModernTabButton,
    ModernBottomButton,
  },
  data() {
    return {
      isHidden: false,
      tabVisibilities: []
    };
  },
  computed: {
    tabs: () => Tabs.newUI,
    bottomButtons: () => BottomButtons.all
  },
  methods: {
    update() {
      this.isHidden = AutomatorData.isEditorFullscreen;
      this.tabVisibilities = Tabs.newUI.map(x => x.isAvailable);
    },
  },
};
</script>

<template>
  <div
    v-if="!isHidden"
    class="c-modern-sidebar"
  >
    <ModernSidebarCurrency />
    <template
      v-for="(tab, tabPosition) in tabs"
    >
      <ModernTabButton
        v-if="tabVisibilities[tabPosition]"
        :key="tab.name"
        :tab="tab"
        :tab-position="tabPosition"
      />
    </template>

    <div
      class="c-modern-bottom-buttons"
    >
      <template
        v-for="bottomButton in bottomButtons"
      >
        <ModernBottomButton
          :bottomButton="bottomButton"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>
