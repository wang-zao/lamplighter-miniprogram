<template>
  <view
    class="info_panel_wrapper"
  >
    <view class="info_1_scores">
      <view class="info_grade">⭐️ {{judgeCtrl.totalMiles.toFixed(0)}}</view>
      <view class="info_resttime" :class="{
        'info_resttime_redlight': judgeCtrl.restTime <= 3,
        'info_resttime_yellowlight': judgeCtrl.restTime <= 6 && judgeCtrl.restTime > 3,
      }">⏰ {{judgeCtrl.restTime}}</view>
    </view>
    <view class="info_2_cities">
      <view class="canvas_cover_cityname" v-show="!anmtCtrl.gameStartPageVisible">
        <ticket
          class="cover_ticket cover_ticke_left"
          :class="{
            fadeOutLeft: anmtCtrl.answerCorrectAnimationStep1,
            fadeInRight: anmtCtrl.answerCorrectAnimationStep2,
          }"
          :showAbstract="false"
          :cityInfo="currentCity"
          :anmtCtrl="anmtCtrl"
          reminder="当前在"
          @changeAbstractVisibility="(city) => changeAbstractVisibility(city, true)"
        />
        <ticket
          v-show="!anmtCtrl.gameStartPageVisible && !anmtCtrl.showingAbstractModal"
          class="cover_ticket cover_ticke_right"
          :showAbstract="true"
          :class="{
            moveLeftTemperorally: anmtCtrl.answerCorrectAnimationStep1,
            fadeInRight: anmtCtrl.answerCorrectAnimationStep2,
          }"
          :cityInfo="nextCity"
          :name_chn="nextCity.name_chn"
          :anmtCtrl="anmtCtrl"
          reminder="下一站"
          @changeAbstractVisibility="(city) => changeAbstractVisibility(city, true)"
        />
      </view>
    </view>
  </view>
</template>

<script>
  /**
   * info panel 选择世界的世界单元
   * @description 用于展示选择世界的世界单元
   * @event {Function} click 点击触发事件
   */

import store from '@/store/index.js';
  import Ticket from '@/components/ticket.vue';

  export default {
    name: 'InfoPanel',
    components: {
      Ticket,
    },
    props: {
      currentCity: {
        type: Object,
        default: {},
      },
      nextCity: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
      }
    },
    computed: {
      anmtCtrl() {
        return store.state.anmtCtrl;
      },
      judgeCtrl() {
        return store.state.judgeCtrl;
      },
    },
    methods: {
      onClickEmit(e) {
        this.$emit('clicked')
      },
      changeAbstractVisibility(city, target) {
        // this.abstractContent = city.abstract;
        this.$emit('changeAbstractVisibility', target, city.abstract)
      },
    }
  }
</script>


<style scoped lang="scss">
@import '@/utils/customAnimate.wxss';

@keyframes flashingRedFontColor {
  0% { color: #fff; }
  50% { color: #dd524d; }
  100% { color: #fff; }
}
@keyframes flashingYellowFontColor {
  0% { color: #fff; }
  50% { color: #f0ad4e; }
  100% { color: #fff; }
}
  
.info_panel_wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  color: #fff;
  .info_1_scores {
    width: 100vw;
    display: flex;
    align-items: flex-end;
    padding: 3vh 0;
    height: 10vh;
    .info_grade {
      margin-left: 5vw;

    }
    .info_resttime {
      margin-left: 2rem;
    }
    .info_resttime_redlight {
      animation: flashingRedFontColor .5s infinite;
    }
    .info_resttime_yellowlight {
      animation: flashingYellowFontColor 1s infinite;
    }
  }
  .info_2_cities {
    height: 30vh;
    .canvas_cover_cityname {
      color: #fff;
      width: 90vw;
      padding: 0 10vw;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      .cover_ticket {
        animation-duration: .61s;
        animation-timing-function: linear;
        background: $general-bright-button-blue;
        border-radius: 1rem;
      }
    }
  }
}

</style>