<template>
  <view class="choosing_wrap">
    <view class="choosing_mask" @click="closeWindow"></view>
    <view class="choosing_window">
      <view class="close_window_icon" @click="closeWindow">X</view>
      <view class="choosing_title">时长</view>
      <view class="choosing_content">
        <view class="choosing_time_item" v-for="(city, index) in selectedCities" :key="index" @click="handleTimeSet(city)">
          <view class="city_name">{{ city.name_chn }}</view>
          <view class="city_time_slider">
            <slider class="slider_body" :value="city.time_id"
              @changing="e => sliderChange(e, city)"
              @change="e => sliderChange(e, city)"
              :min="1" :max="timeSpanOptions.length"
            />
            <view class="slider_value">{{ timeSpanOptions[city.time_id - 1].name_chn }}</view>
          </view>
        </view>
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
import { timeSpanOptions } from '@/utils/constants';
export default Vue.extend({
  name: 'ChoosingTime',
  props: {
    selectedCities: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      timeSpanOptions,
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
    sliderChange(e, city) {
      // only emit the value if the value is different from the previous value
      if (city.time_id !== e.detail.value) {
        console.log('sliderChanged only diff', e, e.detail.value, city)
        this.$emit('timeSet', city, e.detail.value);
      }
    },
    handleTimeSet(city) {
      this.$emit('timeSet', city);
    },
  }
})
</script>

<style scoped lang="scss">


$modal-window-height: 75vh;
$modal-window-width: 90vw;
$modal-window-top-distance: calc(50vh - #{$modal-window-height} / 2);
$modal-window-left-distance: calc(50vw - #{$modal-window-width} / 2);


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
  width: $modal-window-width;
  height: $modal-window-height;
  left: $modal-window-left-distance;
  top: $modal-window-top-distance;
  background-color: #000;
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
    flex-direction: column;
    height: calc(75vh - 40px - 3rem);
    width: 100%;
    overflow-y: scroll;
    .choosing_time_item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .city_name {
        width: 30%;
        text-align: right;
      }
      .city_time_slider {
        display: flex;
        align-items: center;
        width: 70%;
        .slider_body {
          width: 50%;
        }
        .slider_value {
          width: 50%;
          text-align: left;
        }
      }
    }
    
  }
}
</style>