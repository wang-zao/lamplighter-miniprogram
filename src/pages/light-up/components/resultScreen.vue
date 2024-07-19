<template>
  <view class="result_screen_wrapper_outer">
    <view class="result_screen_mask"></view>
    <view class="result_screen_window">
      <view class="close_window_icon" @click="closeWindow">X</view>
      <view class="result_screen_title">
        <view class="result_screen_title_text">
          结果
        </view>
      </view>
      <view class="result_screen_form_content">
        <view class="result_screen_form_item" v-for="(item, index) in resultItems" :key="index">
            <span class="result_screen_form_item_title">
              {{ item.title }} :
            </span>
            <span class="result_screen_form_item_result">
              {{ item.resultMain }}
            </span>
            <span class="result_screen_form_item_number">
              {{ item.resultComment }}
            </span>
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
import { EventBus } from '@/utils/eventBus';

export default Vue.extend({
  name: 'resultScreen',
  props: {
    // anyprops: {
    //   type: String,
    //   default: '',
    // },
  },
  data() {
    return {
      resultItems: [
      {
        id: 7,
        code: 'visited_places_count',
        title: '我的所有踏足之地',
        resultMain: '',
        resultComment: '',
      },
      {
        id: 0,
        code: 'coldest',
        title: '差点没把我冻死的地方',
        resultMain: '',
        resultComment: '',
      },
      {
        id: 1,
        code: 'hottest',
        title: '热得我都要熔化了的地方',
        resultMain: '',
        resultComment: '',
      },
      {
        id: 5,
        code: 'eastest',
        title: '最早迎接朝阳的地方',
        resultMain: '',
        resultComment: '',
      },
      {
        id: 6,
        code: 'westest',
        title: '最晚告别日落的地方',
        resultMain: '',
        resultComment: '',
      },
      {
        id: 2,
        code: 'longest',
        title: '名字最难记住的地方',
        resultMain: '',
        resultComment: '',
      },
      {
        id: 3,
        code: 'farrest',
        title: '关系最疏远的两个地方',
        resultMain: '',
        resultComment: '',
      },
      {
        id: 8,
        code: 'nearest',
        title: '关系最亲近的两个地方',
        resultMain: '',
        resultComment: '',
      },
      {
        id: 4,
        code: 'love_most',
        title: '我永远的快乐老家',
        resultMain: '',
        resultComment: '',
      },
      {
        id: 10,
        code: 'love_least',
        title: '我曾经的走马观花',
        resultMain: '',
        resultComment: '',
      },
    ],
    }
  },
  created() {
    this.watchCalculateResultsOfVisitedCities();
  },
  methods: {
    init() {
    },
    closeWindow() {
      this.$emit('closeWindow');
    },
    calculateColdest(visitedCities, item) {
      // calculate by latitude. highest latitude is the coldest. use abosolute value to include both north and south
      let coldestCity = visitedCities[0];
      visitedCities.forEach((city) => {
        if (Math.abs(city.latitude) > Math.abs(coldestCity.latitude)) {
          coldestCity = city;
        }
      });
      // update the result
      item.resultMain = coldestCity.name_chn;
      item.resultComment = coldestCity.latitude;
    },
    calculateHottest(visitedCities, item) {
      // calculate by latitude. lowest latitude is the hottest. use abosolute value to include both north and south
      let hottestCity = visitedCities[0];
      visitedCities.forEach((city) => {
        if (Math.abs(city.latitude) < Math.abs(hottestCity.latitude)) {
          hottestCity = city;
        }
      });
      // update the result
      item.resultMain = hottestCity.name_chn;
      item.resultComment = hottestCity.latitude;
    },
    calculateNameLongest(visitedCities, item) {
      // calculate by name length. longest name is the longest. if duplicate, use all of them by concat with ','
      let longestNameCities = [];
      let longestNameLength = 0;
      visitedCities.forEach((city) => {
        if (city.name_chn.length > longestNameLength) {
          longestNameCities = [city];
          longestNameLength = city.name_chn.length;
        } else if (city.name_chn.length === longestNameLength) {
          longestNameCities.push(city);
        }
      });
      // update the result
      item.resultMain = longestNameCities.map((city) => city.name_chn).join(', ');
      item.resultComment = `长达${longestNameLength}个字`;
    },
    calculateFarrest(visitedCities, item) {
      // calculate by distance. use the distance formula to calculate the distance between two cities. Consider that earth is a globe with r=6371km. use km as distance unit
      let farrestCities = [];
      let farrestDistance = 0;
      visitedCities.forEach((city1, index1) => {
        visitedCities.forEach((city2, index2) => {
          if (index1 !== index2) {
            let distance = this.calculateDistance(city1, city2);
            if (distance > farrestDistance) {
              farrestCities = [city1, city2];
              farrestDistance = distance;
            }
          }
        });
      });
      // update the result
      item.resultMain = `${farrestCities[0].name_chn} 和 ${farrestCities[1].name_chn}`;
      item.resultComment = `相距${farrestDistance.toFixed(2)}km`;
    },
    calculateDistance(city1, city2) {
      const deg2rad = (deg) => deg * (Math.PI / 180);
      // calculate the distance between two cities
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(city2.latitude - city1.latitude);
      const dLon = deg2rad(city2.longitude - city1.longitude);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(city1.latitude)) * Math.cos(deg2rad(city2.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    },
    calculateLovestByTime(visitedCities, item) {
      // calculate by time. the city that you spent the most time is the love most city
      let loveMostCities = []
      let loveMostTime = 0;
      visitedCities.forEach((city) => {
        if (city.time_id > loveMostTime) {
          loveMostCities = [city];
          loveMostTime = city.time_id;
        } else if (city.time_id === loveMostTime) {
          loveMostCities.push(city);
        }
      });
      // update the result
      item.resultMain = loveMostCities.map((city) => city.name_chn).join(', ');
      item.resultComment = '';
    },
    calculateVisitCount(visitedCities, item) {
      // calculate by time. the city that you selected last is the last select city
      let visitCount = visitedCities.length;
      let visitCountDomestic = visitedCities.filter((city) => city.f_or_d === 'd').length;
      let visitCountForeign = visitedCities.filter((city) => city.f_or_d === 'f').length;
      let visitMajorCityCount = visitedCities.filter((city) => city.is_major === '1').length;
      let visitMinorCityCount = visitedCities.filter((city) => city.is_major === '0').length;
      // update the result
      item.resultMain = visitCount;
      item.resultComment = `国内${visitCountDomestic}个，国外${visitCountForeign}个，大城市${visitMajorCityCount}个，小城市${visitMinorCityCount}个`;
    },
    calculateNearrest(visitedCities, item) {
      // calculate by distance. use the distance formula to calculate the distance between two cities. Consider that earth is a globe with r=6371km. use km as distance unit
      let nearrestCities = [];
      let nearrestDistance = 1000000;
      visitedCities.forEach((city1, index1) => {
        visitedCities.forEach((city2, index2) => {
          if (index1 !== index2) {
            let distance = this.calculateDistance(city1, city2);
            if (distance < nearrestDistance) {
              nearrestCities = [city1, city2];
              nearrestDistance = distance;
            }
          }
        });
      });
      // update the result
      item.resultMain = `${nearrestCities[0].name_chn} 和 ${nearrestCities[1].name_chn}`;
      item.resultComment = `相距${nearrestDistance.toFixed(2)}km`;
    },
    calculateEastest(visitedCities, item) {
      // calculate by longitude. highest longitude is the eastest.
      let eastestCity = visitedCities[0];
      visitedCities.forEach((city) => {
        if (city.longitude > eastestCity.longitude) {
          eastestCity = city;
        }
      });
      // update the result
      item.resultMain = eastestCity.name_chn;
      item.resultComment = eastestCity.longitude;
    },
    calculateWestest(visitedCities, item) {
      // calculate by longitude. lowest longitude is the westest. 
      let westestCity = visitedCities[0];
      visitedCities.forEach((city) => {
        if (city.longitude < westestCity.longitude) {
          westestCity = city;
        }
      });
      // update the result
      item.resultMain = westestCity.name_chn;
      item.resultComment = westestCity.longitude;
    },
    calculateLoveLeast(visitedCities, item) {
      // calculate by time. the city that you selected last is the love least city
      let loveLeastCities = []
      let loveLeastTime = 1000000;
      visitedCities.forEach((city) => {
        if (city.time_id < loveLeastTime) {
          loveLeastCities = [city];
          loveLeastTime = city.time_id;
        } else if (city.time_id === loveLeastTime) {
          loveLeastCities.push(city);
        }
      });
      // update the result
      item.resultMain = loveLeastCities.map((city) => city.name_chn).join(', ');
      item.resultComment = '';
    },
    watchCalculateResultsOfVisitedCities() {
      EventBus.$on('calculateResultsOfVisitedCities', (visitedCities) => {
        console.log('event received calculateResultsOfVisitedCities', visitedCities)
        
        const newResults = this.resultItems.map((item) => {
          switch (item.code) {
            case 'coldest':
              this.calculateColdest(visitedCities, item);
              break;
            case 'hottest':
              this.calculateHottest(visitedCities, item);
              break;
            case 'longest':
              this.calculateNameLongest(visitedCities, item);
              break;
            case 'farrest':
              this.calculateFarrest(visitedCities, item);
              break;
            case 'love_most':
              this.calculateLovestByTime(visitedCities, item);
              break;
            case 'love_least':
              this.calculateLoveLeast(visitedCities, item);
              break;
            case 'visited_places_count':
              this.calculateVisitCount(visitedCities, item);
              break;
            case 'nearest':
              this.calculateNearrest(visitedCities, item);
              break;
            case 'eastest':
              this.calculateEastest(visitedCities, item);
              break;
            case 'westest':
              this.calculateWestest(visitedCities, item);
              break;
            default:
              break;
          }
          return item;
        });
        console.log('newResults', newResults)
        this.resultItems = newResults;
      });
    },
  }
})
</script>

<style scoped lang="scss">


.result_screen_window {
  position: fixed;
  width: 80vw;
  min-height: 80vh;
  left: 10vw;
  top: 10vh;
  backdrop-filter: blur(10px);
  border: 2px solid #fff;
  color: #fff;
  border-radius: 10px;
  padding: 20px 0;
  box-sizing: border-box;
  z-index: 5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .close_window_icon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 16px;
  }
  .result_screen_title {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .result_screen_title_text {
      font-size: 20px;
    }
  }
  .result_screen_form_content {
    width: 100%;
    height: 70vh;
    overflow-y: scroll;
    .result_screen_form_item {
      padding: 10px 20px;
      .result_screen_form_item_title {
        font-weight: bold;
      }
      .result_screen_form_item_result {
        margin: 0 10px;
        background: #ffffff66;
        padding: 0 3px;
        border-radius: 5px;
      }
      .result_screen_form_item_number {
        font-size: 14px;
      }
    }
  }
}


.result_screen_mask {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4;
}

</style>