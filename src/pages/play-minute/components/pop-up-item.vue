<template>
  <view class="popup_item_wrap"
    :style="{
      background: CITY_COLOR_HASHMAP[ cityInfo.id % 10],
    }"
  >{{ lineText }}</view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import { CITY_COLOR_HASHMAP } from '@/utils/constants';

export default {
  name: 'PopUpItem',
  props: {
    cityInfo: {
      type: Object,
      default: {},
    },
    lineText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      CITY_COLOR_HASHMAP: CITY_COLOR_HASHMAP,
    }
  },
  created() {
  },
  methods: {
    init() {
    }
  }
}
</script>

<style scoped lang="scss">

.popup_item_wrap {
  color: #fff;
  font-size: 1rem;
  border-radius: 1rem;
  background: #ffffff66;
  white-space: nowrap;
  padding: 0.2rem 0.5rem;
  margin: 0 1rem 0.5rem 0;
}

</style>