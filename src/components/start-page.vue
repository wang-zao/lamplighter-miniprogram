<template>
	<cover-view class="start_wrapper" >
		<cover-view class="start_reminder">连续飞跃正确，可以获得双倍里程哦</cover-view>
		<cover-view v-if="showingNumbers" class="start_count_down">{{countDownTime}}</cover-view>
		<cover-view v-else class="start_count_down">起飞！</cover-view>
	</cover-view>
</template>

<script>
	/**
	 * @description 
	 * @event {Function} click 
	 */
	export default {
		name: 'StartPage',
		props: {
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
			startTimeLoop() {
        const clock = setInterval(() => {
          if (this.countDownTime > 1) {
            this.countDownTime -= 1;
          } else if (this.countDownTime <= 1) {
            this.showingNumbers = false;
            clearInterval(clock);
          }
        }, 1000);
			}
		}
	}
</script>

<style scoped lang="scss">

.start_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  background: $dark-mode-mask;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .start_count_down {
    color: #000;
    text-align: center;
    font-size: 2rem;
  }
  .start_reminder {
    color: #000;
    font-size: 0.5rem;
    margin-bottom: 5rem;
  }
}
</style>