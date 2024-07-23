<template>
  <view class="adding_city_wrapper_outer">
    <view class="adding_city_mask"></view>
    <view class="adding_city_window">
      <view class="close_window_icon" @click="closeWindow">X</view>
      <view class="adding_city_title">
        <view class="adding_city_title_text">
          选择你去过的城市
        </view>
      </view>
      <view class="adding_city_form_content">
        <view class="adding_city_form_item">
          <view class="item_key">地点</view>
          <view class="item_value"  @click="toggleSelectCityWindow(true)">
            <view class="select_city select_value">{{ selectedCities.length > 0 ? `已选${selectedCities.length}个城市` : '请选择' }}</view>
            <!-- <view class="edit_icon">//</view> -->
          </view>
        </view>
        <view class="adding_city_form_item">
          <view class="item_key">时长</view>
          <view class="item_value" @click="handleWantToSelectTime">
            <view class="select_time select_value">{{ selected_time ? selected_time : '请选择' }}</view>
            <!-- <view class="edit_icon">//</view> -->
          </view>
        </view>
        <!-- <view class="adding_city_form_item">
          <view class="item_key">情绪</view>
          <view class="item_value" @click="toggleSelectEmotionWindow(true)">
            <view class="select_emotion select_value">{{ selected_emotion ? selected_emotion : '请选择' }}</view>
            <view class="edit_icon">//</view>
          </view>
        </view> -->
      </view>
      <view class="adding_city_button">
        <view class="button_general" @click="handleAddCityConfirmed">确定</view>
      </view>
    </view>
    <choosing-city
      v-show="show_select_city_detail_window"
      @closeWindow="toggleSelectCityWindow(false)"
      :structuredCityData="structuredCityData"
      @selectedCitiesChanged="handleSelectedCitiesChanged"
    ></choosing-city>
    <choosing-time
      v-if="show_select_time_detail_window"
      @closeWindow="toggleSelectTimeWindow(false)"
      @itemSelected="handleTimeSelected"
      @timeSet="handleTimeSet"
      :selectedCities="selectedCities"
    ></choosing-time>
    <!-- <choosing-emotion v-show="show_select_emotion_detail_window" @closeWindow="toggleSelectEmotionWindow(false)" @itemSelected="handleEmotionSelected"></choosing-emotion> -->
  </view>
</template>

<script>
/**
 * @description 
 * @e/view>nction} click 
 */
import Vue from 'vue';
import ChoosingCity from './choosingCity.vue';
import ChoosingTime from './choosingTime.vue';
import ChoosingEmotion from './choosingEmotion.vue';
import { EventBus } from '@/utils/eventBus';
import { timeSpanOptions } from '@/utils/constants';
import { FootprintModal } from '@/api/index.js';

export default Vue.extend({
  name: 'AddingCity',
  components: {
    ChoosingCity,
    ChoosingTime,
    ChoosingEmotion,
  },
  props: {
    structuredCityData: {
      type: Object,
      default: {
        domestic: {},
        foreign: {},
      },
    },
    currentPoint: {
      type: Object,
      default: {
        lat: 0,
        lng: 0,
      },
    },
    // anyprops: {
    //   type: String,
    //   default: '',
    // },
  },
  data() {
    return {
      selected_city: '',
      show_select_city_detail_window: false,
      selected_time: '',
      show_select_time_detail_window: false,
      selected_emotion: '',
      show_select_emotion_detail_window: false,
      selectedCities: [],
      point_to_ignite: {
        city_name: '',
        time_id: '',
        time_text: '',
        emotion: '',
        lat: 0,
        lng: 0,
      },
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
    toggleSelectCityWindow(target) {
      this.show_select_city_detail_window = target;
    },
    toggleSelectTimeWindow(target) {
      this.show_select_time_detail_window = target;
    },
    toggleSelectEmotionWindow(target) {
      this.show_select_emotion_detail_window = target;
    },
    handleAddCityConfirmed() {
      // TODO: add city
      // check if all fields are filled
      // if (!this.point_to_ignite.city_name || !this.point_to_ignite.lat || !this.point_to_ignite.lng) {
      //   wx.showModal({
      //     title: '请填写完整信息',
      //     content: JSON.stringify(this.point_to_ignite),
      //     cancelText: '返回',
      //     confirmText: '知道了',
      //   });
      //   return;
      // }
      if (this.selectedCities.length === 0) {
        wx.showToast({
          title: '请先选择地点',
          icon: 'none',
        });
        return;
      }
      // 进行飞翔
      // this.flyAllCity();
      // 并不进行飞翔，我们这次直接生成一个列表
      this.showResultScreen();
      this.closeWindow();
    },
    async getCityFootprint(id) {
      const res = await FootprintModal.getFootprintCityById(id);
      console.log('getCityFootprint', res);
      return res;
    },
    showResultScreen() {
      this.$emit('showResultScreen');
      setTimeout(() => {
        console.log('event fired calculateResultsOfVisitedCities', this.selectedCities)
        EventBus.$emit('calculateResultsOfVisitedCities', this.selectedCities);
      }, 1000);
    },
    flyAllCity() {
      // fly to all city one by one, sorting by longtitude, start from 180E to 180W
      const sortedCities = this.selectedCities.sort((a, b) => b.longitude - a.longitude);
      let currentPoint = {
        latitude: this.currentPoint.lat,
        longitude: this.currentPoint.lng,
      }
      sortedCities.forEach((city, index) => {
        setTimeout(() => {
          console.log('fly to city', city)
          this.getCityFootprint(city.id);
          const flyConfig = {
            fromLat: currentPoint.latitude,
            fromLon: currentPoint.longitude,
            toLat: city.latitude,
            toLon: city.longitude,
            isDrawOrbit: true,
            score: city.time_id * 3,
            cameraHeight: 600,
          };
          EventBus.$emit(
            'flyFromOneToAnother',
            flyConfig,
          );
          // update the current point
          currentPoint = {
            latitude: city.latitude,
            longitude: city.longitude,
          }
        }, index * 1000);
      });
    },
    changeCurrentPoint(point) {
      this.$emit('changeCurrentPoint', point);
    },
    handleTimeSelected(timeObj) {
      this.selected_time = timeObj.name_chn;
      this.point_to_ignite.time_id = timeObj.time_span_id;
      this.point_to_ignite.time_text = timeObj.name_chn;
    },
    handleEmotionSelected(emotionObj) {
      this.selected_emotion = emotionObj.name_chn + ' ' + emotionObj.emoji
      this.point_to_ignite.emotion = emotionObj.name_chn;
    },
    handleCitySelected(cityObj) {
      this.selected_city = cityObj.name_chn;
      this.point_to_ignite.city_name = cityObj.name_chn;
      this.point_to_ignite.lat = cityObj.latitude;
      this.point_to_ignite.lng = cityObj.longitude;
    },
    handleSelectedCitiesChanged(cityObjList) {
      // add city to selectedCities
      cityObjList.forEach((cityObj) => {
        if (!this.selectedCities.some((city) => city.name_chn === cityObj.name_chn && city.latitude === cityObj.latitude && city.longitude === cityObj.longitude)) {
          this.selectedCities.push({ ...cityObj, time_id: 1, time_text: '短短几天', emotion: '', });
        }
      });
      // remove selectedCities if not in cityObjList
      this.selectedCities = this.selectedCities.filter((city) => cityObjList.some((cityObj) => city.name_chn === cityObj.name_chn && city.latitude === cityObj.latitude && city.longitude === cityObj.longitude));
    },
    handleWantToSelectTime() {
      if (this.selectedCities.length === 0) {
        wx.showToast({
          title: '请先选择地点',
          icon: 'none',
        });
        return;
      }
      this.toggleSelectTimeWindow(true);
    },
    handleTimeSet(city, time_id) {
      this.selectedCities = this.selectedCities.map((c) => {
        if (c.name_chn === city.name_chn && c.latitude === city.latitude && c.longitude === city.longitude) {
          c.time_id = time_id;
          c.time_text = timeSpanOptions.find((option) => option.time_span_id === time_id).name_chn;
        }
        return c;
      });
    },
  }
})
</script>

<style scoped lang="scss">

.adding_city_window {
  position: fixed;
  width: 80vw;
  min-height: 40vh;
  left: 10vw;
  top: 30vh;
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
  .adding_city_title {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .adding_city_title_text {
      font-size: 20px;
    }
  }
  .adding_city_form_content {
    width: 100%;
    .adding_city_form_item {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      .item_key {
        font-size: 16px;
        width: 35%;
        max-width: 35%;
        min-width: 35%;
        margin-left: 20px;
        box-sizing:border-box;
      }
      .item_value {
        box-sizing:border-box;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 60%;
        max-width: 60%;
        min-width: 60%;
        .select_value {
          box-sizing: border-box;
          background: #ffffff66;
          border-radius: 3px;
          padding: 0 5px;
        }
        .edit_icon {
          margin-left: 10px;
        }
      }
    }
  }
}

.adding_city_button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
}

.adding_city_mask {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4;
}
</style>