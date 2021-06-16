<template>
	<view
		class="info_panel_wrapper"
	>
    <view class="info_1_scores">
      <view class="info_grade">{{judgeCtrl.totalMiles.toFixed(0)}}</view>
      <view class="info_resttime">{{judgeCtrl.restTime}}</view>
    </view>
    <view class="info_2_cities">
      <view class="canvas_cover_cityname">
        <ticket
          v-if="!anmtCtrl.gameStartPageVisible && !anmtCtrl.showingAbstractModal"
          class="cover_ticket cover_ticke_left"
          :class="{
            fadeOutLeft: anmtCtrl.answerCorrectAnimationStep1,
          }"
          :cityInfo="currentCity"
          reminder="当前在"
          @changeAbstractVisibility="(city) => changeAbstractVisibility(city, true)"
        />
        <ticket
          v-if="!anmtCtrl.gameStartPageVisible && !anmtCtrl.showingAbstractModal"
          class="cover_ticket cover_ticke_right"
          :class="{
            moveLeftTemperorally: anmtCtrl.answerCorrectAnimationStep1,
            fadeInRight: anmtCtrl.answerCorrectAnimationStep2,
          }"
          :cityInfo="nextCity"
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
  .info_1_scores {
    width: 100vw;
    display: flex;
    justify-content: space-between;
  }
  .info_2_cities {
    .canvas_cover_cityname {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 70vh;
      color: #000;
      width: 90vw;
      padding: 0 10vw;
      display: flex;
      justify-content: space-between;
      .cover_ticket {
      animation-duration: .8s;

      }
    }
  }
}

</style>