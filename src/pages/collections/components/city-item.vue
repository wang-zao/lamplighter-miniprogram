<template>
  <view class="city_wrapper"
    @click="gotoDetail()"
    :class="{ 'opacity_not_new': !isNotViewed }"
  >
    <view v-if="city.is_placeholder"></view>
    <view class="city_unlocked" v-else-if="unlocked">
      <view class="city_unlocked_unread" v-if="isNotViewed"></view>
      <view class="city_unlocked_image_wrapper">
        <!-- <image
          :src="`cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/city_images/recast_300/pic_${city.id}_resize_300.jpg`"
          class="city_unlocked_image"
        /> -->
        <!-- <view class="city_unlocked_image_text" :style="textStyle">
          {{ city.abs_chn }}
        </view> -->
      </view>
      <view class="city_unlocked_mask_wrapper">
        <view class="city_unlocked_image_mask" :style="maskStyle" 
        :class="{ 'opacity_not_new': !isNotViewed }">
        </view>
      </view>
      <view class="city_unlocked_title">
        <view class="city_unlocked_title_text" :class="{
          'city_unlocked_title_text_smaller': city.name_chn.length >= 3,
          'city_unlocked_title_text_tiny': city.name_chn.length >= 4,
        }">
          {{ city.name_chn }}
        </view>
        <!-- <view class="city_unlocked_title_text_sub">
          {{ city.name }}
        </view> -->
      </view>
    </view>
    <view class="city_locked" v-else>
      <view class="city_locked_image_text">
        {{ city.name_chn }}
      </view>
      <image class="city_locked_mark" src="@/static/locked.svg"></image>
      <view class="city_locked_mask"></view>
      <view class="city_locked_mask"></view>
    </view>
  </view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import Vue from 'vue';
import store from '@/store/index.js';
import { CITY_COLOR_HASHMAP_NOOPACITY } from '@/utils/constants';
import { UserModel } from '@/api/index.js';
export default Vue.extend({
  name: 'cityItem',
  props: {
    city: {
      type: Object,
      default: '',
    },
  },
  data() {
    return {
    }
  },
  computed: {
    unlocked() {
      const previousUnlockedCities = JSON.parse(store.state.userProfile.unlockedCities);
      if (!previousUnlockedCities || previousUnlockedCities === '') {
        return false;
      }
      return this.city.id in previousUnlockedCities;
    },
    isNotViewed() {
      const previousUnlockedCities = JSON.parse(store.state.userProfile.unlockedCities);
      if (!previousUnlockedCities || previousUnlockedCities === '') {
        return false;
      }
      if (!(this.city.id in previousUnlockedCities)) {
        return false;
      }
      return !previousUnlockedCities[this.city.id].userViewed;
    },
    userProfile() {
      return store.state.userProfile;
    },
    commonColor() {
      return CITY_COLOR_HASHMAP_NOOPACITY[this.city.id  % 10];
    },
    textStyle() {
      return `color: ${this.commonColor};`;
    },
    maskStyle() {
      return `background: radial-gradient(${this.commonColor}33 30%, ${this.commonColor}50 70%);`;
    },
    // unlocked() {
    //   return Math.random() < 0.5;
    // },
  },
  created() {
  },
  methods: {
    init() {
    },
    async gotoDetail() {
      if (!this.unlocked) {
        return;
      }
      this.$emit('gotoDetail', this.city);
      this.markDetailViewed();
    },
    async markDetailViewed() {
      const previousUnlockedCities = JSON.parse(store.state.userProfile.unlockedCities);
      previousUnlockedCities[this.city.id].userViewed = true;
      await UserModel.updateUnlockedCities(previousUnlockedCities);
      this.autoGetUserInfo();

    },
    async autoGetUserInfo() {
      let profile = await UserModel.getExistingUserProfile();
      if (!profile) {
        await UserModel.registerAsTourist()
        profile = await UserModel.getExistingUserProfile();
      }
      store.commit('updateUserProfile', profile);
    },
  }
})
</script>

<style scoped lang="scss">

.opacity_not_new {
  opacity: 0.6;
  backdrop-filter: blur(5px);
}
.city_wrapper {
  // background: #ffffff44;
  height: 100%;
  width: 100%;
  border-radius: 2rem;
  box-sizing: border-box;
  backdrop-filter: blur(5px);
  .city_unlocked {
    height: 100%;
    width: 100%;
    overflow: show;
    position: relative;
    // border: 2px solid #e5e5e5;
    border-radius: 2rem;
    box-shadow: 0.3rem 0.4rem 1rem #ffffffaa inset;
    box-sizing: border-box;
    .city_unlocked_unread {
      position: absolute;
      top: -0.1rem;
      right: 0rem;
      color: #fff;
      width: 0.7rem;
      height: 0.7rem;
      background: #fd7878;
      border-radius: 50%;
      // padding: 0 3px;
      transform: rotate(20deg);
      z-index: 6;
    }
    .city_unlocked_image_wrapper {
      border-radius: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      transform: translate(-50%, -50%);
      overflow: hidden;
      z-index: 3;
      // padding: 0.8rem;
      .city_unlocked_image {
        border-radius: 1rem;
        width: 100%;
        height: 100%;
        opacity: .6;
      }
      .city_unlocked_image_text {
        margin: 1rem 1rem auto;
        font-size: .4rem;
        line-height: .6rem;
        opacity: .5;
      }
    }
    .city_unlocked_mask_wrapper {
      position: absolute;
      border-radius: 2rem;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 4;
      overflow: hidden;
      .city_unlocked_image_mask {
        width: 140%;
        height: 140%;
      }
    }
    .city_unlocked_title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 5;
      text-shadow: 0 0 15px #ffffff;
      width: 80%;
      height: 80%;
      overflow: hidden;
      .city_unlocked_title_text {
        font-size: 0.7rem;
        white-space: nowrap;
        width: 100%;
        opacity: .7;
      }
      .city_unlocked_title_text_smaller {
        font-size: 0.5rem;
      }
      .city_unlocked_title_text_tiny {
        font-size: 0.3rem;
      }
      .city_unlocked_title_text_sub {
        font-size: 10px;
        white-space: nowrap;
        width: 100%;
      }
    }
  }
  .city_locked {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
    background: #01071544;
    border-radius: 2rem;
    border: 1px solid #e5e5e533;
    .city_locked_image_text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      width: 80%;
      font-size: 0.7rem;
      line-height: 1.5rem;
      opacity: .2;
    }
    .city_locked_mark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      font-size: 2.5rem;
      z-index: 5;
      width: 1.5rem;
      height: 1.5rem;
      opacity: .5;
    }
    .city_locked_mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      background: transparent;
      box-shadow: 0 0 1rem #000 inset;
      z-index: 4;
    }
  }
}
</style>