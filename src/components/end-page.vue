<template>
  <cover-view v-if="anmtCtrl.gameEndPageVisible" class="game_end_wrapper">
    <cover-view class="end_panel_content">
      <cover-view>Game Over</cover-view>
      <cover-view>{{judgeCtrl.totalMiles.toFixed(0)}} km</cover-view>
      <cover-view @click="backToHome">回到首页</cover-view>
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

.game_end_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  background: $uni-bg-color-mask;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .end_panel_content {
    text-align: center;
    color: #fff;
    margin-bottom: 60vh;
  }
}
</style>