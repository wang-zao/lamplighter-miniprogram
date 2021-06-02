<template>
<view class="play_minute_wrapper">
  <view class="play_minute_content">
    <view
      class="content_panel info_panel"
    >
      <view class="info_grade">{{judgeCtrl.totalMiles.toFixed(0)}}</view>
      <view class="info_resttime">{{judgeCtrl.restTime}}</view>
    </view>
    <view class="content_panel ufo_pnnel">
			<!-- <fly-ufo-showcase /> -->
			<!-- <fly-ufo-responsive
        :currentCity="currentCity"
        :nextCity="nextCity"
        :judgeCtrl="judgeCtrl"
      /> -->
    </view>
    <view class="content_panel operation_panel">
      <!-- <fly-control-cross-t
        v-show="anmtCtrl.crossTVisible"
        @clickedOneDirection="e => handleUserSelected(e)"
      />
      <fly-control-cross-x
        v-show="anmtCtrl.crossXVisible"
        @clickedOneDirection="e => handleUserSelected(e)"
      /> -->
    </view>
    <view v-if="anmtCtrl.gameEndPageVisible" class="content_panel end_panel">
      <view class="end_panel_content">
        <view>Game Over</view>
        <view>{{judgeCtrl.totalMiles.toFixed(0)}} km</view>
        <view @click="backToHome">回到首页</view>
      </view>
    </view>
    <start-page v-if="anmtCtrl.gameStartPageVisible" class="content_panel start_panel" />
    <earth
      class="content_panel earth_panel"
      ref="flyingEarth"
      @renderCompleted="showAllCoverViews"
      @clickedOneDirection="e => handleUserSelected(e)"
      @changeAbstractVisibility="(t, a) => changeAbstractVisibility(t, a)"
      :currentCity="currentCity"
      :nextCity="nextCity"
      :anmtCtrl="anmtCtrl"
    />
  </view>
</view>
</template>

<script>
	import Vue from 'vue';
  import FlyUfoResponsive from '@/components/fly-ufo-responsive.vue';
  import FlyControlCrossT from '@/components/fly-control-cross-t.vue';
  import FlyControlCrossX from '@/components/fly-control-cross-x.vue';
  import StartPage from '@/components/start-page.vue';
  import Earth from '@/components/earth.vue';
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
          gameStartPageVisible: true,
          showCoverViews: false,
          answerCorrectAnimationStep1: false,
          answerCorrectAnimationStep2: false,
          answerWrongAnimation: false,
          isPlanePausing: true,
          isPlaneShaking: false,
          showingAbstractModal: false,
          abstractContent: '',
        },
				judgeCtrl: {
					correctDirection: '',
					distance: '',
          totalMiles: 0,
          restTime: 20,
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
        this.showStartPage();
        // this.startTimeLoop();
        await this.getCityData();
        this.cityQueuePopOne(true);
        this.cityQueuePopOne(true);
        this.$refs.flyingEarth.flyFromOneToAnother(
          0,
          0,
          this.currentCity.lat,
          this.currentCity.lng,
        )
        this.calcAnswer();
        console.log('init fiinised')
      },
      getCityData() {
        this.cityList = falseCityData;
      },
      showStartPage() {
        setTimeout(() => {
          this.anmtCtrl.gameStartPageVisible = false;
          this.startTimeLoop();
        }, 3000);
      },
      gameEnd() {
        this.anmtCtrl.gameEndPageVisible = true;
      },
      startTimeLoop() {
        const clock = setInterval(() => {
          if (this.judgeCtrl.restTime > 0) {
            this.judgeCtrl.restTime -= 1;
          } else if (this.judgeCtrl.restTime <= 0) {
            clearInterval(clock);
            // this.gameEnd();
          }
        }, 1000);
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
      cityQueuePopOne(withoutAnimation = true) {
        if (withoutAnimation) {
          this.currentCity = this.nextCity;
          this.nextCity = { ...this.cityList.pop(0) };
          return;
        }
        this.anmtCtrl.answerCorrectAnimationStep1 = true;
        setTimeout(() => {
          this.anmtCtrl.answerCorrectAnimationStep1 = false;
          this.anmtCtrl.answerCorrectAnimationStep2 = true;
          this.currentCity = this.nextCity;
          this.nextCity = { ...this.cityList.pop(0) };
        }, 600);
        setTimeout(() => {
          this.anmtCtrl.answerCorrectAnimationStep2 = false;
        }, 1200);
        
      },
      cityQueueBrokeOne() {
        this.nextCity = { ...this.cityList.pop(0) };
      },
      showAllCoverViews() {
        setTimeout(() => {
          console.log('showing all cover views !')
          this.anmtCtrl.showCoverViews = true;
        }, 1000);
      },
      backToHome() {
				uni.navigateTo({
					url: '/pages/index/index'
				});
      },
      handleUserSelected(direction) {
        // console.log('clicked button', direction)
        this.anmtCtrl.showingAbstractModal = false;
        if (direction === this.judgeCtrl.correctDirection) {
          this.judgeCtrl.totalMiles += this.judgeCtrl.restTime;
          this.judgeCtrl.restTime = 20
          this.$refs.flyingEarth.flyFromOneToAnother(
            this.currentCity.lat,
            this.currentCity.lng,
            this.nextCity.lat,
            this.nextCity.lng,
          )
          this.anmtCtrl.answerCorrectAnimation = true;
          this.cityQueuePopOne(false);
          this.calcAnswer();
        } else {
          this.cityQueueBrokeOne();
          this.calcAnswer();
        }
      },
      changeAbstractVisibility(target, abstract) {
        this.anmtCtrl.showingAbstractModal = target;
        this.anmtCtrl.abstractContent = abstract;
      },
		},
		components: {
			FlyUfoResponsive,
			FlyControlCrossT,
			FlyControlCrossX,
			StartPage,
			Earth,
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
    position: fixed;
    display: flex;
  }
  .info_panel {
    top: 5rem;
    left: 0;
    right: 0;
    padding: $general-paddng;
    font-size: 2rem;
    justify-content: space-between;
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
      color: #000;
    }
  }
  .earth_panel {
    top: 0;
    left: 0;
  }
  .test_nothing {
    color: #bbe6ff;
    color: #072d43;
  }
}

</style>