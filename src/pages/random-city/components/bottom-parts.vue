<template>
  <view class="bottom_parts_buttons">
    <view class="button_general" @click="goToHome">
      返回
    </view>
    <view class="button_general button_main" @click="getRandomCity">
      随机
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
  width: 150px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #f0f0f0;
  border-radius: 10px;
  color: #333;
  font-size: 16px;
}

.button_main {
  background-color: #ff4d4f;
  color: #fff;
}
  
</style>