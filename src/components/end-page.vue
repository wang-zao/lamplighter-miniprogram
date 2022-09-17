<template>
  <view v-if="anmtCtrl.gameEndPageVisible" class="game_end_wrapper">
    <view class="end_panel_header">
      <view></view>
    </view>
    <view class="end_panel_score">
      <!-- <view>avatar</view>
      <view>王凿</view> -->
      <view>⭐️</view>
      <view class="score_number">{{rankScore}}</view>
      <view>称号：{{rankData.text}}</view>
    </view>
    <view class="end_panel_details">
      <!-- <view class="detail_title">本次学习成绩</view> -->
      <view class="details_flex">
        <!-- <view class="detail_item">
          <view class="detail_item_title">飞行距离</view>
          <view class="detail_item_value">{{judgeCtrl.totalDistance.toFixed(0)}}km</view>
        </view> -->
        <view class="detail_item">
          <view class="detail_item_title">点亮城市个数</view>
          <view class="detail_item_value">{{judgeCtrl.correctCityList.length}}</view>
        </view>
        <view class="detail_item">
          <view class="detail_item_title">新解锁城市</view>
          <view v-if="judgeCtrl.newlyUnlockedCityList.length === 0"  class="detail_item_value">无</view>
        </view>
        <view v-if="judgeCtrl.newlyUnlockedCityList.length > 0" class="detail_item_tag_wrap">
          <view class="detail_item_value_tag_item"
            v-for="(i, key) in judgeCtrl.newlyUnlockedCityList"
            :key="key"
            :style="{
              background: CITY_COLOR_HASHMAP[ i.id % 10],
            }"
          >
            {{i.name_chn}}
          </view>
        </view>
        <!-- <view class="detail_item">
          <view class="detail_item_title">平均方向误差</view>
          <view class="detail_item_value">{{averageBias}}</view>
        </view>
        <view class="detail_item">
          <view class="detail_item_title">平均单程得分</view>
          <view class="detail_item_value">{{averageScore}}</view>
        </view> -->
        <view class="detail_item_last" v-if="judgeCtrl.restTime > 0">
          从{{judgeCtrl.gameEndInfo.from}}飞往{{judgeCtrl.gameEndInfo.to}}
        </view>
        <view class="detail_item_last" v-if="judgeCtrl.restTime > 0">
          应该向{{judgeCtrl.gameEndInfo.correct}}，而不是向{{judgeCtrl.gameEndInfo.selected}}
        </view>
        <view class="detail_item_last" v-else >
          时间到！注意左上角倒计时哦
        </view>
        <view class="detail_item_abs" >
          {{judgeCtrl.gameEndInfo.toAbs}}
        </view>

        <!-- <view class="details_left">
          <view class="details_side_title">成功：</view>
          <view class="detail_tag_wrap">
            <view
              class="detail_tag"
              v-for="(city, index) in judgeCtrl.correctCityList"
              :key="index"
            >
              {{city}}
            </view>
          </view>
        </view>
        <view class="details_right">
          <view class="details_side_title">失败：</view>
          <view class="detail_tag_wrap">
            <view
              class="detail_tag"
              v-for="(city, index) in judgeCtrl.wrongCityList"
              :key="index"
            >
              {{city}}
            </view>
          </view>
        </view> -->
      </view>
    </view>
    <view class="end_panel_operations">
      <view>
        <button class="share_button" @click="playAgain">再学一次</button>
      </view>
      <view>
        <button class="share_button" open-type="share" aria-role="button"> 分享 </button>
      </view>
      <view>
        <button class="share_button" @click="backToHome">首页</button>
      </view>
    </view>
  </view>
</template>

<script>
  /**
   * @description 
   * @event {Function} click 
   */
  import store from '@/store/index.js'    
  import { EventBus } from '@/utils/eventBus';
  import {
    calc_fly_rank,
    getAverageBiasFromAverageScore,
  } from '@/utils/common';
  import { CITY_COLOR_HASHMAP } from '@/utils/constants';
  export default {
    name: 'EndPage',
    props: {
      anmtCtrl: {
        type: Object,
        default: {},
      },
      judgeCtrl: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        countDownTime: 3,
        showingNumbers: true,
        CITY_COLOR_HASHMAP: CITY_COLOR_HASHMAP,
      }
    },
    computed: {
      rankScore() {
        return this.judgeCtrl.totalMiles.toFixed(0);
      },
      rankData() {
        return calc_fly_rank(this.rankScore);
      },
      averageScore() {
        if (this.judgeCtrl.correctCityList.length === 0) {
          return 0;
        }
        return (this.judgeCtrl.totalMiles / this.judgeCtrl.correctCityList.length).toFixed(1);
      },
      averageBias() {
        if (this.averageScore === 0) {
          return '-';
        }
        return `±${getAverageBiasFromAverageScore(this.averageScore)}°`;
      },
    },
    created() {
    },
    methods: {
      backToHome() {
        EventBus.$emit('handleRouteChange', 'home');
      },
      playAgain() {
        EventBus.$emit('playAgain');
      }
    }
  }
</script>

<style scoped lang="scss">

$score-panel-height: 30vh;
$detail-panel-height: 30vh;
$operation-panel-height: 20vh;
$general-panel-width: 60vw;

.game_end_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  background: $uni-bg-color-mask;
  width: 100vw;
  height: 100vh;
  z-index: 102;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  color: #fff;
  .end_panel_header {
    font-size: 1rem;
    opacity: .6;
    line-height: 2rem;
    padding-top: 2rem
  }
  .end_panel_score {
    text-align: center;
    height: $score-panel-height;
    min-height: $score-panel-height;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-end;
    .score_number {
      font-size: 4rem;
      margin: 0.5rem 2rem;
      font-weight: bolder;
    }
  }
  .end_panel_details {
    height: $detail-panel-height;
    min-height: $detail-panel-height;
    width: $general-panel-width;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 0;
    .details_flex {
      box-sizing: border-box;
      padding: 1rem;
      display: flex;
      align-items: center;
      flex-direction: column;
      height: 100%;
      width: 100%;
      background: $uni-bg-color-mask;
      .detail_item {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: top;
        margin-bottom: 10px;
        .detail_item_title {
          line-height: 1rem;
          white-space: nowrap;
          opacity: .7;
        }
        .detail_item_value {
          line-height: 1rem;
          margin-left: 1rem;
          font-weight: bolder;
          white-space: pre-wrap;
        }
      }
      .detail_item_tag_wrap {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        margin-bottom: 1.5rem;
        .detail_item_value_tag_item {
          border-radius: 5px;
          margin: 5px 0 0 5px;
          padding: 0 5px;
        }
      }
      .detail_item_last {
        background: #ffffff22;
      }
      .detail_item_abs {
        margin-top: 1rem;
        white-space: pre-wrap;
        font-size: .7rem;
        line-height: 1.6;

      }
    }
    .detail_title {
      padding: 1rem;
      box-sizing: border-box;
      background: $uni-bg-color-mask;
      width: $general-panel-width;
      min-width: $general-panel-width;
      max-width: $general-panel-width;
      border-bottom: 1px solid #fff;
      text-align: center;
    }

  }
  .end_panel_operations {
    height: $operation-panel-height;
    max-height: $operation-panel-height;
    min-height: $operation-panel-height;
    display: flex;
    justify-content: space-between;
    width: $general-panel-width;
    .share_button {
      height: 2rem;
      background: #ffffff44;
      text-align: center;
      border-radius: 1rem;
      border: 1px #fff solid;
      color: #fff;
      padding: 0.5rem 0.5rem;
      font-size: 1rem;
      line-height: 1rem;
      ::after {
        padding: none;
        border: none;
      }
    }
  }
  .end_panel_footer {
    font-size: 1rem;
    opacity: .8;
    line-height: 2rem;
    padding-bottom: 4rem
  }
}
</style>