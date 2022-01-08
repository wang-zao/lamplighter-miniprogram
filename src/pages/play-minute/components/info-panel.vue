<template>
  <view
    class="info_panel_wrapper"
  >
    <view class="info_1_scores">
      <view class="info_grade">⭐️ {{judgeCtrl.totalMiles.toFixed(0)}}</view>
      <view class="info_resttime">⏰ {{judgeCtrl.restTime}}</view>
    </view>
    <view class="info_2_cities">
      <view class="canvas_cover_cityname" v-if="!anmtCtrl.gameStartPageVisible">
        <ticket
          class="cover_ticket cover_ticke_left"
          :class="{
            fadeOutLeft: anmtCtrl.answerCorrectAnimationStep1,
          }"
          :showAbstract="false"
          :cityInfo="currentCity"
          :anmtCtrl="anmtCtrl"
          reminder="当前在"
          @changeAbstractVisibility="(city) => changeAbstractVisibility(city, true)"
        />
        <ticket
          v-if="!anmtCtrl.gameStartPageVisible && !anmtCtrl.showingAbstractModal"
          class="cover_ticket cover_ticke_right"
          :showAbstract="true"
          :class="{
            moveLeftTemperorally: anmtCtrl.answerCorrectAnimationStep1,
            fadeInRight: anmtCtrl.answerCorrectAnimationStep2,
          }"
          :cityInfo="nextCity"
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
      }
    },
    // computed: {
    //   isNextCityAbscractVisible() {
    //     return !this.anmtCtrl.answerCorrectAnimationStep1;
    //   },
    // },
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

.info_panel_wrapper {
  width: 100%;
  height: 25vh;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  color: #fff;
  .info_1_scores {
    width: 100vw;
    // height: 
    display: flex;
    // justify-content: ;
    // background: yellow;
    align-items: flex-end;
    padding: 3vh 0;
    // line-height: 20vh;
    height: 15vh;
    .info_grade {
      margin-left: 5vw;

    }
    .info_resttime {
      margin-left: 2rem;
    }
  }
  .info_2_cities {
    height: 10vh;
    .canvas_cover_cityname {
      // position: fixed;
      // left: 50%;
      // transform: translateX(-50%);
      // bottom: 70vh;
      color: #fff;
      width: 90vw;
      padding: 0 10vw;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      .cover_ticket {
      animation-duration: .8s;

      }
    }
  }
}

</style>