<template>
  <view class="destination-wrap">
    <view class="destination-left">
      <view class="destination-title"
        :class="{
          'disappearing': animateData.showDisappearing,
          'appearing': animateData.showAppearing,
        }">{{name_chn}}</view>
      <view class="destination-subtitle"
        :class="{
          'disappearing': animateData.showDisappearing,
          'appearing': animateData.showAppearing,
        }">
        {{upper_admin_name}}
      </view>
    </view>
    <view class="destination-right">
      <view class="destination-eng"
        :class="{
          'disappearing': animateData.showDisappearing,
          'appearing': animateData.showAppearing,
        }">{{name_eng}}</view>
      <view class="destination-lat-lon"
        :class="{
          'disappearing': animateData.showDisappearing,
          'appearing': animateData.showAppearing,
        }">{{latitude}}, {{longitude}}</view>
    </view>
  </view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import Vue from 'vue';
import { EventBus } from '@/utils/eventBus';
export default Vue.extend({
  name: 'TopDestination',
  props: {
    // anyprops: {
    //   type: String,
    //   default: '',
    // },
  },
  data() {
    return {
      name_chn: '迪利然',
      name_eng: 'Dilijan',
      upper_admin_name: '亚美尼亚',
      latitude: 40.74,
      longitude: 44.85,
      animateData: {
        showDisappearing: false,
        showAppearing: false,
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.watchUpdateData();
    },
    watchUpdateData() {
      EventBus.$on('updateRandomJumppedCityData', (payload) => {
        console.log('received payload', payload)
        const { name_chn, name_eng, upper_admin_name, latitude, longitude } = payload;
        // show animation before changing data
        this.animateData.showDisappearing = true;
        setTimeout(() => {
          this.name_chn = name_chn;
          this.name_eng = name_eng;
          this.upper_admin_name = upper_admin_name;
          this.latitude = latitude;
          this.longitude = longitude;
          this.animateData.showAppearing = true;
          setTimeout(() => {
            this.animateData.showDisappearing = false;
            this.animateData.showAppearing = false;
          }, 600);
        }, 600);
      });
    }
  }
})
</script>

<style scoped lang="scss">

@keyframes appearing {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes disappearing {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.destination-wrap {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: #ffffff55;
  border-radius: 5px;
  width: 80vw;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.destination-title {
  font-size: 20px;
}

.apprearing {
  animation: appearing .6s forwards;
}

.disappearing {
  animation: disappearing .6s forwards;
}
</style>