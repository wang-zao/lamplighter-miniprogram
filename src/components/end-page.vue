<template>
  <cover-view v-if="anmtCtrl.gameEndPageVisible" class="game_end_wrapper">
    <cover-view class="end_panel_header">
      <cover-view>小程序：东南西北</cover-view>
    </cover-view>
    <cover-view class="end_panel_score">
      <cover-view>avatar</cover-view>
      <cover-view>王凿</cover-view>
      <cover-view class="score_number">{{judgeCtrl.totalMiles.toFixed(0)}} km</cover-view>
      <cover-view>飞行评分：75</cover-view>
      <cover-view>称号：路痴本痴</cover-view>
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
      <cover-view>再来一局</cover-view>
      <cover-view>分享</cover-view>
      <cover-view @click="backToHome">首页</cover-view>
    </cover-view>
    <cover-view class="end_panel_footer">
      <cover-view>小程序：东南西北</cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
	/**
	 * @description 
	 * @event {Function} click 
	 */
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
		created() {
      this.startTimeLoop();
		},
		methods: {
			onClick(direction) {
				// this.$emit('clickedOneDirection', direction)
			},
      backToHome() {
				uni.navigateTo({
					url: '/pages/index/index'
				});
      },
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
  }
  .end_panel_score {
    text-align: center;
    height: $score-panel-height;
    max-height: $score-panel-height;
    min-height: $score-panel-height;
    // background: green;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-end;
    .score_number {
      font-size: 2rem;
    }
  }
  .end_panel_details {
    // // display: flex;
    // align-items: center;
    // flex-direction: column;
    // justify-content: center;
    height: $detail-panel-height;
    max-height: $detail-panel-height;
    min-height: $detail-panel-height;
    width: $general-panel-width;
    // background: $uni-bg-color-mask;
    overflow-y: scroll;
    padding: 0 1rem 1rem 1rem;
    .details_flex {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      height: 100%;
      width: 100%;
      background: $uni-bg-color-mask;
      // word-break: break-all;
      // word-wrap:break-word;
      // white-space:pre-line;
    }
    .detail_title {
      padding: 1rem;
      // padding: 0 0 1rem;
      background: $uni-bg-color-mask;
      width: $general-panel-width;
      min-width: $general-panel-width;
      max-width: $general-panel-width;
      // width: 100%;
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
      // height: 100%;
      width: 100%;
      // background: yellow;
      display: flex;
      flex-wrap: wrap;
      // justify-content: flex-start;
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
  }
  .end_panel_footer {
    font-size: 1rem;
  }
}
</style>