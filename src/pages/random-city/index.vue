<template>
  <view class="random-city-wrapper">
    <view class="random-city-top-group">
      <top-destination />
      <bullet-points />
    </view>
    <bottom-parts @getRandomCity="getRandomCity" @routeChange="routeChange" />
  </view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import Vue from 'vue';
import BulletPoints from './components/bullet-points.vue';
import BottomParts from './components/bottom-parts.vue';
import TopDestination from './components/top-destination.vue';
import { FootprintModal } from '@/api/index.js';
import { EventBus } from '@/utils/eventBus';

export default Vue.extend({
  name: 'RandomCity',
  components: {
    BulletPoints,
    BottomParts,
    TopDestination,
  },
  props: {
    // anyprops: {
    //   type: String,
    //   default: '',
    // },
  },
  data() {
    return {
      totalCityCount: 0,
      initialized: false,
      cityDetail: {
        f_or_d: "f",
        id: 829,
        is_major: 0,
        latitude: 40.74,
        longitude: 44.85,
        name_chn: "迪利然",
        name_eng: "Dilijan",
        upper_admin_name: "亚美尼亚",
        wiki_keywords: "亚美尼亚的瑞士|人口 17712|沙兰贝扬街|图芬基安遗产",
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this.getFootprintTotalCount();
      await this.getRandomCity();
    },
    async getFootprintTotalCount() {
      this.totalCityCount = await FootprintModal.getFootprintTotalCount();
    },
    async getRandomCity() {
      // record current lat and lon
      const previousLat = this.cityDetail.latitude;
      const previousLon = this.cityDetail.longitude;
      // get a random city by random index
      const randomCityIndex = Math.floor(Math.random() * this.totalCityCount);
      console.log('randomCityIndex', randomCityIndex);
      const randomCity = await FootprintModal.getFootprintCityById(randomCityIndex);
      console.log('randomCity', randomCity);
      const { f_or_d, id, is_major, latitude, longitude, name_chn, name_eng, upper_admin_name, wiki_keywords } = randomCity;
      this.cityDetail = { f_or_d, id, is_major, latitude, longitude, name_chn, name_eng, upper_admin_name, wiki_keywords };
      // emit the event to the child component
      EventBus.$emit('updateRandomJumppedCityData', this.cityDetail);
      // fly to the random city
      EventBus.$emit('flyFromOneToAnother', {
        fromLat: previousLat,
        fromLon: previousLon,
        toLat: latitude,
        toLon: longitude,
        isDrawOrbit: false,
        score: 0,
        cameraHeight: 600,
      });
    },
    routeChange(route) {
      this.$emit('routeChange', route);
    }

  }
})
</script>

<style scoped lang="scss">

.random-city-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  width: 100vw;
  padding: 40px 0;
  box-sizing: border-box;
}

</style>