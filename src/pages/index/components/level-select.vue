<template>
  <view class="select_wrap" @click="gotoNextLevel">
    <view class="select_item">学习难度：</view>
    <view class="select_item select_item_button">{{gameCurrentSettings.name}}</view>
  </view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import store from '@/store/index.js';

export default {
  name: 'LevelSelect',
  props: {
    // anyprops: {
    //   type: String,
    //   default: '',
    // },
  },
  data() {
    return {
      currentLevel: 0,
    }
  },
  computed: {
    gameCurrentSettings() {
      return store.state.constants.gameCurrentSettings;
    },
    gameHardLevel() {
      return store.state.constants.gameHardLevel;
    },
  },
  created() {
  },
  methods: {
    init() {
    },
    gotoNextLevel() {
      this.currentLevel = (this.currentLevel + 1) % this.gameHardLevel.length;;
      store.commit('setCurrentLevel', this.currentLevel);
    },
  }
}
</script>

<style scoped lang="scss">

.select_wrap {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  color: $dark-mode-bg;
  border-radius: 2rem;
  border: 2px $dark-mode-bg solid;
  padding: 0.1rem 1rem;
  box-sizing: border-box;
  .select_item {
    text-align: center;
  }
  .select_item_button {
    font-weight: bold;
  }
}

</style>