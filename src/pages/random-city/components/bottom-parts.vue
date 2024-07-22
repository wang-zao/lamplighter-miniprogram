<template>
  <view class="bottom_parts_buttons">
    <view class="button_general" @click="goToHome">
      <image class="button_new_icon_img" src="@/static/return.svg"></image>

    </view>
    <view class="button_general button_main" @click="getRandomCity">
      <image class="button_new_icon_img" src="@/static/dice.svg"></image>
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
  name: 'BottomParts',
  props: {
    // anyprops: {
    //   type: String,
    //   default: '',
    // },
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    init() {
    },
    goToHome() {
      this.$emit('routeChange', 'home');
    },
    getRandomCity() {
      this.$emit('getRandomCity');
    }
  }
})
</script>

<style scoped lang="scss">

.bottom_parts_buttons {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.button_general {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #52a8ff44;
  margin: 0 5vw 10vh;

  .button_new_icon_img {
    width: 55%;
    height: 55%;
    opacity: .8;
  }
}
.button_main {
      transform: scale(1.25);
    }
  
</style>