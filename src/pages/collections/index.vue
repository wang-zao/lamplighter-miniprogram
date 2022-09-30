<template>
  <view class="collection_wrapper">
    <city-detail
      v-if="showCityDetail"
      :city="selectedCity"
      @closeCityDetail="closeCityDetail"
    />
    <view class="collection_body">
      <view class="overview_wrapper"
        :class="{
          'fadeInEnSmaller': enableOverview,
          'fadeOutEnlarge': !enableOverview,
        }">
        <view class="overview_city_item" 
          :class="{
            'overview_city_item_enlightened': i,
          }"
          v-for="(i, key) in overviewList"
          :key="key"
        >
        </view>
      </view>
      <view class="collection_title">
        <view class="collection_title_text">
          <icon-font iconName="city_fill" iconSize="2rem" iconMargin="5px"/>
          <icon-font iconName="book-city-fill" iconSize="2rem"  iconMargin="5px"/>
        </view>
        <view class="collection_unlock_count">
          <view class="collection_unlock_count_text" @click="switchViewChange">
            <!-- {{ unlockCount }}/{{ unlockTotal }}  -->
            <view class="collection_unlock_count_text_left">
              <icon-font iconName="dasuolvetuliebiao" iconSize="1.4rem" iconMargin="1.4rem"/>
            </view>
            <view class="collection_unlock_count_text_right">
              <icon-font iconName="xiaosuolvetu" iconSize="1.4rem" iconMargin="1.4rem"/>
            </view>
            <view class="collection_unlock_count_text_switch"
              :class="{ 'collection_unlock_count_text_switch_on': enableOverview }"
            ></view>
          </view>
        </view>
      </view>
      <!-- <view class="collection_mask_wrapper">
        <view class="collection_mask" />
      </view> -->
      <scroll-view
        class="collection_box"
        :class="{
          'fadeInEnlarge': !enableOverview,
          'fadeOutEnSmaller': enableOverview,
        }"
        scroll-y="true"
        @scrolltolower="changePageMultipleTimes(1, 2)"
      >
        <view class="collection_box_inner">
          <city-item
            v-for="(city, index) in collectionListFinal"
            :key="index"
            :city="city"
            class="collection_card_item fadeIn"
            @gotoDetail="e => gotoDetail(e)"
          />
        </view>
        <view class="collection_box_spinner_wrap" v-if="!reachedFinalPage">
          <image class="collection_box_spinner" src="@/static/spinner-solid.svg"></image>
        </view>
      </scroll-view>
      <!-- <view class="collection_pagination">
        <view 
          class="collection_pagination_button"
          @click="changeCollectionPage(-1)"
        >
          ←
        </view>
        <view 
          class="collection_pagination_text"
        >
          {{ currentPage + 1 }} / {{ maxiumPageIndex + 1 }}
        </view>
        <view 
          class="collection_pagination_button"
          @click="changeCollectionPage(1)"
        >
          →
        </view>
      </view> -->
    </view>
    <view class="collection_bottom_buttons">
      <button 
        class="collection_bottom_button_item"
        @click="emitRouteChange('home')"
      >
        <icon-font iconName="return" iconSize="1.3rem"/>
      </button>
      <button 
        class="collection_bottom_button_item"
        open-type="share" 
      >
        <icon-font iconName="share" iconSize="1.3rem"/>
      </button>
    </view>
  </view>
</template>

<script>

import Vue from 'vue';
import store from '@/store/index.js';
import {
  DATABASE,
} from '@/utils/constants';
import { GameModal, UserModel } from '@/api/index.js';
import IconFont from '@/components/iconFont.vue';
import cityItem from './components/city-item.vue'
import cityDetail from './components/city-detail.vue';

export default Vue.extend({
  name: 'Collections',
  props: {
  },
  components: {
    IconFont,
    cityItem,
    cityDetail,
  },
  data() {
    return {
      unlockTotal: 0,
      currentPage: 0,
      pageSize: 20,
      pageLoading: false,
      collectionList: [],
      collectionListFinal: [],
      tempList: [],
      maxiumPageIndex: 10,
      showCityDetail: false,
      selectedCity: {},
      itemCountPerRow: 6,
      loadingList: false,
      enableOverview: false,
      overviewList: [],
      reachedFinalPage: false,
    }
  },
  computed: {
    previousUnlockedCitiesDict() {
      const previousUnlockedCities = JSON.parse(store.state.userProfile.unlockedCities);
      if (!previousUnlockedCities || previousUnlockedCities === '') {
        return {};
      }
      return previousUnlockedCities;
    },
    unlockCount() {
      return Object.keys(this.previousUnlockedCitiesDict).length;;
    },
    // overviewList() {
    //   const overviewList = []
    //   for (let i = 1; i <= this.unlockTotal; i ++) {
    //     if (i in this.previousUnlockedCitiesDict) {
    //       overviewList.push(true);
    //     } else {
    //       overviewList.push(false);
    //     }
    //   }
    //   return overviewList;
    // },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getAllQuestionCount();
      await this.loadCollectionList();
      await this.changePageMultipleTimes(1, 2);
    },
    async loadCollectionList() {
      if (this.loadingList) {
        console.log('nothign loaded')
        return false;
      }
      this.loadingList = true;
      const colloctionName = DATABASE.QUESTION_COLLECTION_NAME;
      let list = await GameModal.getGameQuestions(colloctionName, this.currentPage, this.pageSize);
      // this.collectionList = [ ...this.collectionList, ...list ];
      await this.updateCollectionList(list);
      this.loadingList = false;
      // console.log('collectionList', list);
      return true;
    },
    switchViewChange() {
      this.enableOverview = !this.enableOverview;
    },
    async updateCollectionList(list) {
      let newList = [
        ...this.collectionList,
        ...this.tempList,
        ...list,
      ];
      this.tempList = [];
      const overflow = newList.length % this.itemCountPerRow;
      if (overflow > 0 && this.currentPage < this.maxiumPageIndex) {
        this.tempList = newList.slice(newList.length - overflow);
        newList = newList.slice(0, newList.length - overflow);
      }
      if (this.currentPage === this.maxiumPageIndex) {
        for (let i = 0; i < this.itemCountPerRow - overflow; i++) {
          newList.push({ ...newList[0], is_placeholder: true });
        }
      }
      this.collectionList = newList;
      return;
    },
    async getAllQuestionCount() {
      let count = await GameModal.getAllQuestionCount();
      this.unlockTotal = count;
      this.maxiumPageIndex = Math.ceil(count / this.pageSize) - 1;
      // console.log('unlockTotal', count);
      this.getOverviewList();
    },
    getOverviewList() {
      const overviewList = []
      for (let i = 1; i <= this.unlockTotal; i ++) {
        if (i in this.previousUnlockedCitiesDict) {
          overviewList.push(true);
        } else {
          overviewList.push(false);
        }
      }
      this.overviewList = overviewList;
    },
    async changeCollectionPage(direction) {
        if (direction === -1 && this.currentPage === 0) {
          return;
        } else if (direction === 1 && this.currentPage === this.maxiumPageIndex) {
          this.reachedFinalPage = true;
          return;
        }
        this.currentPage += direction;
        const res = await this.loadCollectionList();
        if (!res) {
          this.currentPage -= direction;
        }
    },
    async changePageMultipleTimes(direction, times) {
      this.pageLoading = true;
      for (let i = 0; i < times; i++) {
        await this.changeCollectionPage(direction);
      }
      this.collectionListFinal = [...this.collectionList];
      this.pageLoading = false;
    },
    gotoDetail(city) {
      // console.log('gotoDetail', city);
      this.selectedCity = city;
      this.showCityDetail = true;
    },
    closeCityDetail() {
      this.showCityDetail = false;
    },
    emitRouteChange(route) {
      this.$emit('routeChange', route);
    },
  }
})
</script>

<style scoped lang="scss">


$collection-body-height: 95vh;
$collection-bottom-height: 20vh;
$collection-margin-top: 0.5rem;
$collection-box-height: 60vh;

$collection-item-inner-height: 4rem;
$collection-item-inner-padding: 0.5rem;
$collection-item-height: $collection-item-inner-height + $collection-item-inner-padding * 2;

$collection-box-inner-height: $collection-item-inner-height * 6 + $collection-item-inner-padding * 4;
$collection-box-inner-padding: 0.5rem;


@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.fadeIn { animation: fadeIn .4s ease-in-out forwards; }

@keyframes fadeInEnlarge {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.fadeInEnlarge { animation: fadeInEnlarge .4s ease-in-out forwards; }

@keyframes fadeInEnSmaller {
  from {
    opacity: 0;
    transform: scale(1.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.fadeInEnSmaller { animation: fadeInEnSmaller .4s ease-in-out forwards; }

@keyframes fadeOutEnlarge {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(1.5);
  }
}
.fadeOutEnlarge { animation: fadeOutEnlarge .4s ease-in-out forwards; }

@keyframes fadeOutEnSmaller {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.5);
  }
}
.fadeOutEnSmaller { animation: fadeOutEnSmaller .4s ease-in-out forwards; }

@keyframes rotate{
  from{transform: rotate(0deg)}
  to{transform: rotate(359deg)}
}

.collection_wrapper {
  position: relative;
  width: 90vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  align-items: center;
  text-align: center;
  .collection_body {
    position: relative;
    width: 100%;
    height: $collection-body-height;
    margin-top: $collection-margin-top;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    .collection_title_text {
      font-size: 1.5rem;
      padding: 0 0 0.5rem;
      margin-top: 10vh;
      display: flex;
      justify-content: center;
    }
    .collection_unlock_count {
      // margin-top: $collection-item-inner-padding / 2;
      display: flex;
      justify-content: center;
      .collection_unlock_count_text {
        opacity: 0.5;
        position: relative;
        display: flex;
        justify-content: space-between;
        width: 10rem;
        height: 2rem;
        .collection_unlock_count_text_left {
          position: absolute;
          left: 0.5rem;
        }
        .collection_unlock_count_text_right {
          position: absolute;
          right: 0.5rem;
        }
        .collection_unlock_count_text_switch {
          position: absolute;
          left: 0;
          top: 0;
          width: 5rem;
          height: 1.5rem;
          border-radius: 1rem;
          background: #ffffff55;
          margin-left: 0;
          transition: .3s ease;
        }
        .collection_unlock_count_text_switch_on {
          margin-left: 5rem;
        }
      }
    }
    .collection_mask_wrapper {
      position: relative;
      width: 100%;
      height: 1px;
      .collection_mask {
        position: absolute;
        top: 1rem;
        left: 0;
        width: 100%;
        height: 5vw;
        background: linear-gradient(to bottom, #041536ff 10%, #04153600 100%);
        z-index: 6;
      }
    }
    .collection_box {
      margin-top: 1rem;
      height: $collection-box-height;
      // background: #ffffff11;
      // padding: $collection-box-inner-padding;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow-y: scroll;
      overflow-x: hidden;
      // border-bottom: 2px solid #e5e5e5;
      .collection_box_spinner_wrap {
        width: 100%;
        height: 2rem;
        display: flex;
        justify-content: center;
        .collection_box_spinner {
          width: 1.5rem;
          height: 1.5rem;
          animation: rotate 3s linear infinite;
        }
      }
      .collection_box_inner {
        padding-top: 5vw;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
      }
      .collection_card_item {
        position: relative;
        width: 13vw;
        height: 13vw;
        margin-bottom: 5vw;
      }
    }
    .overview_wrapper {
      position: absolute;
      left: 0;
      top: 18vh;
      width: 100%;
      height: $collection-box-height;
      display: flex;
      flex-wrap: wrap;
      overflow-y: scroll;
      padding: 1rem 0.5rem;
      // justify-content: space-around;
      // background: yellow;
      .overview_city_item {
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background: #ffffff22;
        margin: 3px;
      }
      .overview_city_item_enlightened {
        background: #ffffff99;
        box-shadow: 0 0 5px #ffffff;
      }
    }
  }
  .collection_pagination {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    margin-top: 1rem;
    .collection_pagination_button {
      background: #ffffff44;
      text-align: center;
      border-radius: 2rem;
      color: #fff;
      padding: 0.5rem 0.7rem;
      margin: 0 0.3rem;
      font-size: 1rem;
      line-height: 1.2rem;
    }
  }
  .collection_bottom_buttons {
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: $collection-bottom-height;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: center;
    .collection_bottom_button_item {
      background: #ffffff44;
      text-align: center;
      border-radius: 2rem;
      color: #fff;
      padding: 0.5rem 0.7rem;
      margin: 0 0.3rem;
      font-size: 1rem;
      line-height: 1.2rem;
    }
  }
}
</style>