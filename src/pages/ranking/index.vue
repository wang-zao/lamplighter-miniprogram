<template>
  <cover-view class="ranking_wrapper">
    <cover-view class="ranking_body">
      <cover-view class="ranking_title">
        <cover-view class="ranking_title_text">
          世界排行
        </cover-view>
      </cover-view>
      <cover-view class="ranking_box">
        <ranking-card
          v-for="(user, index) in rankingList"
          :key="index"
          :userProfile="user"
          :rankingNumber="user.rankingNumber"
          class="ranking_card_list"
        />
      </cover-view>
      <cover-view class="your_box">
        <ranking-card
          class="ranking_card_yours"
          :userProfile="userProfile"
          :rankingNumber="userRankingNumber"
        />
      </cover-view>
      <cover-view class="ranking_card_all_count">
        <cover-view class="count_line">
          <cover-view class="count_span">截止</cover-view>
          <cover-view class="count_span_highlight">{{ dateYear }}年{{ dateMonth }}月{{ dateDay }}日</cover-view>
        </cover-view>
        <cover-view class="count_line">
          <cover-view class="count_span">已有</cover-view>
          <cover-view class="count_span_highlight">{{ allUserCount }}</cover-view>
          <cover-view class="count_span">名点灯人在这里飞驰</cover-view>
        </cover-view>
        <cover-view class="count_line">
          <cover-view class="count_span">努力点亮更远的远方</cover-view>
        </cover-view>
      </cover-view>
    </cover-view>
    <cover-view class="ranking_bottom">
      <cover-view 
        class="ranking_bottom_button"
        @click="emitRouteChange('home')"
      >
        返回
      </cover-view>
      <cover-view 
        class="center_group"
      >
        <cover-view 
          class="ranking_bottom_button"
          @click="changeRankingPage(-1)"
        >
          上一页
        </cover-view>
        <cover-view 
          class="ranking_bottom_button"
          @click="changeRankingPage(1)"
        >
          下一页
        </cover-view>
      </cover-view>
      <cover-view 
        class="ranking_bottom_button ranking_bottom_button_share"
        open-type='share'
      >
        <button class="ranking_bottom_button_inner" open-type="share">
        分享
        </button>
      </cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
  import { UserModel } from '@/api/index.js';
  import RankingCard from './components/ranking-card.vue';
  import store from '@/store/index.js';
  /**
   * @description 
   * @event {Function} click 
   */
  export default {
    name: 'Ranking',
    props: {
    },
    components: {
      RankingCard,
    },
    data() {
      return {
        currentPage: 0,
        currentSize: 5,
        maxiumPageIndex: 0,
        rankingList: [],
        userRankingNumber: '-',
        allUserCount: '-',
      }
    },
    computed: {
      userProfile() {
        return store.state.userProfile;
      },
      dateYear() {
        return new Date().getFullYear();
      },
      dateMonth() {
        return new Date().getMonth() + 1;
      },
      dateDay() {
        return new Date().getDate();
      },
    },
    created() {
      this.init();
    },
    onShareAppMessage(){
      console.log('share')
      return {
        title:'light'
      }
    },
    methods: {
      init() {
        this.loadRankings();
        this.getAllUserCount();
        this.getUserRankingNumber();
      },
      getRankingNumber(index) {
        return this.currentPage * this.currentSize + index + 1;
      },
      async loadRankings() {
        // TODO: The ranking list can be cached for better performance.
        const rankingList = await UserModel.loadRankings(
          this.currentPage, this.currentSize,
        );
        rankingList.forEach((user, index) => {
          user.rankingNumber = this.getRankingNumber(index);
        });
        this.rankingList = rankingList;
      },
      async getAllUserCount() {
        const allUserCount = await UserModel.getAllUserCount();
        this.allUserCount = allUserCount;
        this.maxiumPageIndex = Math.ceil(this.allUserCount / this.currentSize) - 1;
      },
      async getUserRankingNumber() {
        this.userRankingNumber = await UserModel.binarySearchUserRankingNumber(this.userProfile.score);
      },
      changeRankingPage(direction) {
        if (direction === -1 && this.currentPage === 0) {
          return;
        } else if (direction === 1 && this.currentPage === this.maxiumPageIndex) {
          return;
        }
        this.currentPage += direction;
        this.loadRankings();
      },
      emitRouteChange(route) {
        this.$emit('routeChange', route);
      },
    }
  }
</script>

<style scoped lang="scss">

$ranking-body-height: 80vh;
$ranking-bottom-height: 20vh;
$ranking-margin-top: 0.5rem;

$ranking-item-inner-height: 4rem;
$ranking-item-inner-padding: 0.5rem;
$ranking-item-height: $ranking-item-inner-height + $ranking-item-inner-padding * 2;

$ranking-box-inner-height: $ranking-item-inner-height * 5 + $ranking-item-inner-padding * 4;
$ranking-box-inner-padding: 0.5rem;
$ranking-box-height: $ranking-box-inner-height + $ranking-box-inner-padding * 2;


.ranking_wrapper {
  width: 90vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  .ranking_body {
    width: 100%;
    height: $ranking-body-height;
    margin-top: $ranking-margin-top;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .ranking_title_text {
      font-size: 1.5rem;
      padding: 1rem 0;
    }
    .ranking_box {
      height: $ranking-box-height;
      background: #ffffff11;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .ranking_card_list {
        width: 100%;
        margin-top: $ranking-item-inner-padding;
      }
    }
    .your_box {
      margin-top: 5%;
      height: $ranking-item-height;
      background: #ffffff11;
      display: flex;
      .ranking_card_yours {
        width: 100%;
        margin-top: $ranking-item-inner-padding;
      }
    }
    .ranking_card_all_count {
      margin-top: $ranking-item-inner-padding;
      .count_line {
        display: flex;
        justify-content: center;
        margin-top: $ranking-item-inner-padding;
        .count_span {
          opacity: 0.5;
        }
        .count_span_highlight {
          opacity: 0.8;
          font-weight: bold;
          margin: 0 0.3rem;
        }
      }
    }
  }
  .ranking_bottom {
    width: 100%;
    height: $ranking-bottom-height;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    .center_group {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .ranking_bottom_button {
      background: #ffffff44;
      text-align: center;
      border-radius: 2rem;
      color: #fff;
      padding: 0.5rem 0.7rem;
      margin: 0 0.3rem;
      font-size: 1rem;
      line-height: 1.2rem;
      .ranking_bottom_button_inner {
        background: none;
        border: none;
        font-size: 1rem;
        line-height: 1.2rem;
        color: #fff;
        ::after {
          border: none;
        }
      }
    }
    .ranking_bottom_button_share {
      border: 2px #fff solid;
    }
  }
}

</style>