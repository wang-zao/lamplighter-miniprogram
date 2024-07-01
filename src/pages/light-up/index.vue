<template>
  <view class="light_up_wrap">
    <view class="light_up_buttons">
      <view class="button_general" @click="goToHome">
        返回
      </view>
      <view class="button_general button_main" @click="toggleAddCityWindow(true)">
        +
      </view>
      <view class="button_general">
        完成
      </view>
    </view>
    <view class="light_up_add_city_dialog" v-if="showingAddCityWindow">
      <adding-city
        @closeWindow="toggleAddCityWindow(false)"
        @changeCurrentPoint="changeCurrentPoint"
        :structuredCityData="structuredCityData"
        :currentPoint="currentPoint"
      ></adding-city>
    </view>
  </view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import Vue from 'vue';
import AddingCity from './components/addingCity.vue';
import { parsedCityData } from '@/static/data/city500';
export default Vue.extend({
  name: 'LightUp',
  components: {
    AddingCity,
  },
  props: {
    // anyprops: {
    //   type: String,
    //   default: '',
    // },
  },
  data() {
    return {
      showingAddCityWindow: false,
      // further data structure:
      // structuredCityData: {
      //   domestic: {
      //     '北京': [{}, {}, {}],
      //     '上海': [{}, {}, {}],
      //   },
      //   foreign: {
      //     '东京': [{}, {}, {}],
      //     '首尔': [{}, {}, {}],
      //   },
      // },
      // city data structure:
      // {
      //   city_name: '北京',
      //   upper_admin_name: '北京',
      //   f_or_d: 'd',
      //   latitude: 39.9042,
      //   longitude: 116.4074,
      // }
      structuredCityData: {
        foreign: {},
        domestic: {},
      },
      currentPoint: {
        lat: 40,
        lng: 116,
      },
    }
  },
  mounted() {
    this.fetchCsv();
  },
  methods: {
    init() {
    },
    goToHome() {
      this.$emit('routeChange', 'home');
    },
    toggleAddCityWindow(target) {
      this.showingAddCityWindow = target;
    },
    changeCurrentPoint(point) {
      this.currentPoint.lat = point.lat || point.latitude;
      this.currentPoint.lng = point.lng || point.longitude;
    },
    async fetchCsv() {
      let start_time = new Date().getTime();
      console.log('start processed at time:', start_time)
      const groupByUpperAdmin = (city, collection) => {
        // make lat and lon to number
        city.latitude = parseFloat(city.latitude);
        city.longitude = parseFloat(city.longitude);
        if (city.upper_admin_name in collection) {
          collection[city.upper_admin_name].push(city);
        } else {
          collection[city.upper_admin_name] = [city];
        }
      }
      console.log('req....', parsedCityData)
      parsedCityData.forEach((city) => {
        if (city.f_or_d === 'd') {
          groupByUpperAdmin(city, this.structuredCityData.domestic);
        } else if (city.f_or_d === 'f') {
          groupByUpperAdmin(city, this.structuredCityData.foreign);
        }
      });
      console.log('process completed at time:', new Date().getTime())
      console.log('how many ms passed?', new Date().getTime() - start_time)
      console.log('this.structuredCityData', this.structuredCityData)
    },
  }
})

</script>

<style scoped lang="scss">

.light_up_wrap {
  color: #fff;

  .light_up_buttons {
    position: fixed;
    bottom: 10vh;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    align-items: bottom;

    .button_general {
      text-align: center;
      border-radius: 2rem;
      color: #fff;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      font-weight: bold;
      box-shadow: 0 0 25px #ffffff33 inset;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #52a8ff44;
    }

    .button_main {
      transform: scale(1.5);
    }
  }
}

</style>