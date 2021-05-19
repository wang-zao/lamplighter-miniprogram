<template>
<view class="play_minute_wrapper">
  <view class="play_minute_content">
    <view class="content_panel mile_panel">{{judgeCtrl.totalMiles.toFixed(0)}}</view>
    <view class="content_panel info_panel">{{judgeCtrl.restTime}}</view>
    <view class="content_panel ufo_pnnel">
			<!-- <fly-ufo-showcase /> -->
			<fly-ufo-responsive
        :currentCity="currentCity"
        :nextCity="nextCity"
        :judgeCtrl="judgeCtrl"
      />
    </view>
    <view class="content_panel operation_panel">
      <fly-control-cross-t
        v-show="anmtCtrl.crossTVisible"
        @clickedOneDirection="e => handleUserSelected(e)"
      />
      <fly-control-cross-x
        v-show="anmtCtrl.crossXVisible"
        @clickedOneDirection="e => handleUserSelected(e)"
      />
    </view>
    <view v-if="anmtCtrl.gameEndPageVisible" class="content_panel end_panel">
      <view class="end_panel_content">
        <view>Game Over</view>
        <view>{{judgeCtrl.totalMiles.toFixed(0)}} km</view>
      </view>
    </view>
  </view>
</view>
</template>

<script>
	import Vue from 'vue';
  import FlyUfoResponsive from '@/components/fly-ufo-responsive.vue';
  import FlyControlCrossT from '@/components/fly-control-cross-t.vue';
  import FlyControlCrossX from '@/components/fly-control-cross-x.vue';
	import { falseCityData } from '@/utils/data';
	import { calc_shortest_dis, calc_next_direction } from '@/utils/common';
	export default Vue.extend({
		data() {
			return {
				currentCity: {},
				nextCity: {},
        anmtCtrl: {
          crossTVisible: false,
          crossXVisible: false,
          gameEndPageVisible: false,
        },
				judgeCtrl: {
					correctDirection: '',
					distance: '',
          totalMiles: 0,
          restTime: 60,
					userSelect: '',
					isCorrect: false,
          isUserSelected: false,
				},
        cityList: [],
			}
		},
		onLoad() {
      this.init();
		},
		methods: {
      async init() {
        console.log('initing')
        await this.getCityData();
        this.cityQueuePopOne();
        this.cityQueuePopOne();
        this.calcAnswer();
        this.startTimeLoop();
        console.log('init fiinised')
      },
      getCityData() {
        this.cityList = falseCityData;
      },
      gameEnd() {
        this.anmtCtrl.gameEndPageVisible = true;
      },
      startTimeLoop() {
        const clock = setInterval(() => {
          if (this.judgeCtrl.restTime > 0) {
            this.judgeCtrl.restTime -= 1;
          } else if (this.judgeCtrl.restTime <= 0) {
            clearInterval(clock)
            console.log('stop!!!')
            this.gameEnd();
          }
        }, 1000)
      },
      calcAnswer() {
        const c = this.currentCity;
        const n = this.nextCity;
        this.judgeCtrl.distance = calc_shortest_dis(c.lng, c.lat, n.lng, n.lat);
        this.judgeCtrl.correctDirection = calc_next_direction(c.lng, c.lat, n.lng, n.lat);
        this.allowUserInput();
      },
      allowUserInput() {
        console.log('judding');
        const dir = this.judgeCtrl.correctDirection;
        if (['north', 'east', 'west', 'south'].includes(dir)) {
          this.anmtCtrl.crossTVisible = true;
          this.anmtCtrl.crossXVisible = false;
        } else if (['northeast', 'southeast', 'northwest', 'southwest'].includes(dir)) {
          this.anmtCtrl.crossTVisible = false;
          this.anmtCtrl.crossXVisible = true;
        }
      },
      cityQueuePopOne() {
        this.currentCity = this.nextCity;
        this.nextCity = { ...this.cityList.pop(0) };
      },
      cityQueueBrokeOne() {
        this.nextCity = { ...this.cityList.pop(0) };
      },
      handleUserSelected(direction) {
        console.log('clicked button', direction)
        if (direction === this.judgeCtrl.correctDirection) {
          this.judgeCtrl.totalMiles += this.judgeCtrl.distance;
          this.cityQueuePopOne();
          this.calcAnswer();
        } else {
          this.cityQueueBrokeOne();
          this.calcAnswer();
        }
      }
		},
		components: {
			FlyUfoResponsive,
			FlyControlCrossT,
			FlyControlCrossX,
		},
	});
</script>

<style scoped lang="scss">

$general-paddng: 1rem;

.play_minute_wrapper {
	background: $dark-mode-bg;
  width: 100vw;
  height: 100vh;
}

.play_minute_content {
  .content_panel {
    width: 100%;
    position: fixed;
    display: flex;
  }
  .mile_panel {
    top: 0;
    justify-content: left;
  }
  .info_panel {
    top: 0;
    justify-content: center;
  }
  .ufo_pnnel {
    top: 4rem;
    justify-content: center;
    align-items: center;
  }
  .operation_panel {
    bottom: 0;
    justify-content: center;
  }
  .end_panel {
    top: 0;
    left: 0;
    background: $dark-mode-mask;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .end_panel_content {
      text-align: center;
      color: #fff;
    }
  }
}

</style>