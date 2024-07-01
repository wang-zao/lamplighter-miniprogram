<template>
  <view class="choosing_wrap">
    <view class="choosing_mask" @click="closeWindow"></view>
    <view class="choosing_window">
      <view class="close_window_icon" @click="closeWindow">X</view>
      <view class="choosing_title">情绪</view>
      <view class="choosing_content">
        <view class="choosing_option_item" v-for="(option, index) in options" :key="index" @click="handleItemSelected(option)">{{ option.name_chn }} {{ option.emoji }}</view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import Vue from 'vue';
export default Vue.extend({
  name: 'ChoosingEmotion',
  props: {
  },
  data() {
    return {
      options: [
      {
        id: 1,
        name_chn: '开心',
        emoji: '😄',
        group: 'positive',
      },
      {
        id: 2,
        name_chn: '浪漫',
        emoji: '😍',
        group: 'positive',
      },
      {
        id: 3,
        name_chn: '悲伤',
        emoji: '😢',
        group: 'negative',
      },
      {
        id: 4,
        name_chn: '疲惫',
        emoji: '😩',
        group: 'negative',
      },
      {
        id: 5,
        name_chn: '怀念',
        emoji: '😌',
        group: 'neutral',
      },
      {
        id: 6,
        name_chn: '惊叹',
        emoji: '😲',
        group: 'positive',
      },
      {
        id: 7,
        name_chn: '失落',
        emoji: '😞',
        group: 'negative',
      },
      {
        id: 8,
        name_chn: '兴奋',
        emoji: '🤩',
        group: 'positive',
      },
      {
        id: 9,
        name_chn: '孤独',
        emoji: '😔',
        group: 'negative',
      },
      {
        id: 10,
        name_chn: '平静',
        emoji: '😌',
        group: 'neutral',
      }
      ]
    }
  },
  created() {
  },
  methods: {
    init() {
    },
    closeWindow() {
      this.$emit('closeWindow');
    },
    handleItemSelected(option) {
      this.$emit('itemSelected', option);
      this.closeWindow();
    },
  }
})
</script>

<style scoped lang="scss">

.choosing_mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
}

.choosing_window {
  position: fixed;
  width: 70vw;
  height: 30vh;
  left: 15vw;
  top: 35vh;
  backdrop-filter: blur(10px);
  border: 2px solid #fff;
  border-radius: 10px;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .close_window_icon {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
  .choosing_title {
    font-size: 1.5rem;
    text-align: center;
    line-height: 3rem;
  }
  .choosing_content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    max-height: calc(60vh - 40px - 3rem);
    overflow-y: scroll;
    .choosing_option_item {
      width: fit-content;
      max-width: 90%;
      white-space: pre-wrap;
      padding: 2px 5px;
      margin-bottom: 5px;
      background: #ffffff33;
      border-radius: 0.5rem;
      text-align: center;
    }
    .choosing_option_item:active {
      background: #ffffff77;
    }
  }
}
</style>