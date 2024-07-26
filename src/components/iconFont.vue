<template>
<view class="icon_font_wrap">
  <image
    class="icon_font_item"
    :src="`../static/${iconName}.svg`"
    :style="elementStyle"
  ></image>
</view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import Vue from 'vue';
export default Vue.extend({
  name: 'IconFont',
  props: {
    iconName: {
      type: String,
      default: '',
    },
    iconSize: {
      type: String,
      default: '1rem',
    },
    iconMargin: {
      type: String,
      default: '0',
    },
  },
  data() {
    return {
    }
  },
  computed: {
    elementStyle() {
      return `
        width: ${this.iconSize};
        height: ${this.iconSize};
        margin: 0 ${this.iconMargin};
      `
    },
  },
  created() {
  },
  methods: {
    init() {
    }
  }
})
</script>

<style scoped lang="scss">

.icon_font_wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // display: inline-block;
}
.icon_font_item {
  width: 1rem;
  height: 1rem;
}

</style>