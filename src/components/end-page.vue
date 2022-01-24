<template>
  <cover-view v-if="anmtCtrl.gameEndPageVisible" class="game_end_wrapper">
    <cover-view class="end_panel_header">
      <cover-view>小程序：星球点灯人</cover-view>
    </cover-view>
    <cover-view class="end_panel_score">
      <!-- <cover-view>avatar</cover-view>
      <cover-view>王凿</cover-view> -->
      <cover-view>⭐️</cover-view>
      <cover-view class="score_number">{{rankScore}}</cover-view>
      <cover-view>飞行评分：{{rankData.rank}}</cover-view>
      <cover-view>称号：{{rankData.text}}</cover-view>
    </cover-view>
    <cover-view class="end_panel_details">
      <cover-view class="detail_title">本次战绩</cover-view>
      <cover-view class="details_flex">
        <cover-view class="details_left">
          <cover-view class="details_side_title">成功：</cover-view>
          <cover-view class="detail_tag_wrap">
            <cover-view
              class="detail_tag"
              v-for="(city, index) in judgeCtrl.correctCityList"
              :key="index"
            >
              {{city}}
            </cover-view>
          </cover-view>
        </cover-view>
        <cover-view class="details_right">
          <cover-view class="details_side_title">失败：</cover-view>
          <cover-view class="detail_tag_wrap">
            <cover-view
              class="detail_tag"
              v-for="(city, index) in judgeCtrl.wrongCityList"
              :key="index"
            >
              {{city}}
            </cover-view>
          </cover-view>
        </cover-view>
      </cover-view>
    </cover-view>
    <cover-view class="end_panel_operations">
      <cover-view>
        <button class="share_button" @click="playAgain">再来一局</button>
      </cover-view>
      <cover-view>
        <button class="share_button" open-type="share" aria-role="button"> 分享 </button>
      </cover-view>
      <cover-view>
        <button class="share_button" @click="backToHome">首页</button>
      </cover-view>
    </cover-view>
    <cover-view class="end_panel_footer">
      <cover-view>小程序：星球点灯人</cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
  /**
   * @description 
   * @event {Function} click 
   */
  import store from '@/store/index.js'    
  import { EventBus } from '@/utils/eventBus';

  import { calc_fly_rank } from '@/utils/common';
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
      }
    },
    computed: {
      rankScore() {
        return this.judgeCtrl.totalMiles.toFixed(0);
      },
      rankData() {
        return calc_fly_rank(this.rankScore);
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
    padding: 0 1rem 1rem 1rem;
    .details_flex {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      height: 100%;
      width: 100%;
      background: $uni-bg-color-mask;
    }
    .detail_title {
      padding: 1rem;
      background: $uni-bg-color-mask;
      width: $general-panel-width;
      min-width: $general-panel-width;
      max-width: $general-panel-width;
      border-bottom: 1px solid #fff;
      text-align: center;
    }
    .details_left {
      width: 48%;
      height: 100%;
    }
    .details_right {
      width: 48%;
      height: 100%;
    }
    .details_side_title {
      line-height: 2rem;
    }
    .detail_tag_wrap {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      line-height: 1.6rem;
      .detail_tag {
        background: $uni-bg-color-mask;
        height: 1.4rem;
        font-size: 1rem;
        padding: .2rem .5rem;
        margin-right: .2rem;
        margin-bottom: .2rem;
        border-radius: .4rem;
      }
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