<template>
<view class="play_minute_wrapper">
  <view class="play_minute_content">
    <view
      class="content_panel info_panel"
    >
      <info-panel
        v-if="!anmtCtrl.gameEndPageVisible"
        :anmtCtrl="anmtCtrl"
        :judgeCtrl="judgeCtrl"
        :currentCity="currentCity"
        :nextCity="nextCity"
      />
    </view>
    <earth
      class="content_panel earth_panel"
      ref="flyingEarth"
      @renderCompleted="showAllCoverViews"
      @changeAbstractVisibility="(t, a) => changeAbstractVisibility(t, a)"
      @clickedOneDirection="e => handleUserSelected(e)"
      :currentCity="currentCity"
      :nextCity="nextCity"
      :anmtCtrl="anmtCtrl"
      :judgeCtrl="judgeCtrl"
    />
    <!-- <view
      class="content_panel operation_panel"
    >
      <fly-control-cross-t
        v-show="anmtCtrl.crossTVisible"
        @clickedOneDirection="e => handleUserSelected(e)"
      />
      <fly-control-cross-x
        v-show="anmtCtrl.crossXVisible"
        @clickedOneDirection="e => handleUserSelected(e)"
      />
      <operation-panel
        :anmtCtrl="anmtCtrl"
        @clickedOneDirection="e => handleUserSelected(e)"
      />
    </view> -->
    <!-- <view v-if="anmtCtrl.gameEndPageVisible" class="content_panel end_panel">
      <view class="end_panel_content">
        <view>Game Over</view>
        <view>{{judgeCtrl.totalMiles.toFixed(0)}} km</view>
        <view @click="backToHome">回到首页</view>
      </view>
    </view> -->
    <!-- <start-page v-if="anmtCtrl.gameStartPageVisible" class="content_panel start_panel" /> -->
    
  </view>
</view>
</template>

<script>
	import Vue from 'vue';
  import store from '@/store/index.js'    
  import { GameModal } from '../../api/index';
  import InfoPanel from './components/info-panel.vue';
  import OperationPanel from './components/operation-panel.vue';
  // import FlyUfoResponsive from '@/components/fly-ufo-responsive.vue';
  // import FlyControlCrossT from '@/components/fly-control-cross-t.vue';
  // import FlyControlCrossX from '@/components/fly-control-cross-x.vue';
  import StartPage from '@/components/start-page.vue';
  import Earth from '@/components/earth.vue';
	import { falseCityData } from '@/utils/data';
	import {
    calc_shortest_dis,
    calc_next_direction,
    getPenaltyTimeWhenWrong,
    getScoreWhenCorrect,
  } from '@/utils/common';
	export default Vue.extend({
		components: {
			// FlyUfoResponsive,
			// FlyControlCrossT,
			// FlyControlCrossX,
			StartPage,
			InfoPanel,
			OperationPanel,
			Earth,
		},
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
          switchCityTime: 700,
          operationPanelDisabled: false,
        },
				judgeCtrl: {
					correctDirection: '',
					distance: '',
          totalMiles: 0,
          restTime: 60,
          startAnswerCurQuestionTime: 60,
					userSelect: '',
					isCorrect: false,
          isUserSelected: false,
          correctCityList: [],
          wrongCityList: [],
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
          this.currentCity.lon,
        )
        this.calcAnswer();
        console.log('init fiinised')
      },
      async getCityData() {
        try {
          const gameId = store.state.selectedGameId;
          const { list } = await GameModal.getGameQuestions(gameId);
          console.log('getGameQuestionsgetGameQuestions', list)
          list.forEach(i => {
            this.cityList.push(i);
          });
          //  = list;
        } catch (e) {
          
        }
        // this.cityList = falseCityData;
      },
      checkRestCityDataCapacity() {
        if (this.cityList && this.cityList.length <= 5) {
          this.getCityData();
        }
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
            this.gameEnd();
          }
        }, 1000);
      },
      calcAnswer() {
        const c = this.currentCity;
        const n = this.nextCity;
        this.judgeCtrl.distance = calc_shortest_dis(c.lon, c.lat, n.lon, n.lat);
        this.judgeCtrl.correctDirection = calc_next_direction(c.lon, c.lat, n.lon, n.lat);
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
        // this.anmtCtrl.operationPanelDisabled = true;
        setTimeout(() => {
          this.anmtCtrl.answerCorrectAnimationStep1 = false;
          this.anmtCtrl.answerCorrectAnimationStep2 = true;
          this.currentCity = this.nextCity;
          this.nextCity = { ...this.cityList.pop(0) };
          this.calcAnswer();
        }, 600);
        setTimeout(() => {
          this.anmtCtrl.answerCorrectAnimationStep2 = false;
        }, 1200);
        
      },
      cityQueueBrokeOne() {
        this.nextCity = { ...this.cityList.pop(0) };
        this.calcAnswer();
      },
      showAllCoverViews() {
        setTimeout(() => {
          console.log('showing all cover views !')
          this.anmtCtrl.showCoverViews = true;
        }, 1000);
      },
      // backToHome() {
			// 	uni.navigateTo({
			// 		url: '/pages/index/index'
			// 	});
      // },
      async handleUserSelected(direction) {
        if (this.anmtCtrl.operationPanelDisabled) {
          return;
        }
        this.anmtCtrl.operationPanelDisabled = true;
        const userAnswerTime = this.judgeCtrl.startAnswerCurQuestionTime - this.judgeCtrl.restTime;
        this.anmtCtrl.showingAbstractModal = false;
        if (direction === this.judgeCtrl.correctDirection) {
          // 1.两秒防抖
          setTimeout(() => {
            this.anmtCtrl.operationPanelDisabled = false;
          }, this.anmtCtrl.switchCityTime);
          // 2.计算得分
          this.judgeCtrl.totalMiles += getScoreWhenCorrect(userAnswerTime);
          // 3.计入列表
          if (!this.judgeCtrl.correctCityList.includes(this.nextCity.point_name)) {
            this.judgeCtrl.correctCityList.push(this.nextCity.point_name);
          }
          // 4.进行飞翔
          this.$refs.flyingEarth.flyFromOneToAnother(
            this.currentCity.lat,
            this.currentCity.lon,
            this.nextCity.lat,
            this.nextCity.lon,
          )
          this.anmtCtrl.answerCorrectAnimation = true;
          // 5.切换城市
          this.cityQueuePopOne(false);
          // this.calcAnswer();
          this.checkRestCityDataCapacity();
        } else {
          // 1.两秒防抖
          setTimeout(() => {
            this.anmtCtrl.operationPanelDisabled = false;
          }, this.anmtCtrl.switchCityTime);
          this.judgeCtrl.restTime -= getPenaltyTimeWhenWrong(userAnswerTime);
          if (!this.judgeCtrl.wrongCityList.includes(this.nextCity.point_name)) {
            this.judgeCtrl.wrongCityList.push(this.nextCity.point_name);
          }
          this.cityQueueBrokeOne();
          // this.calcAnswer();
        }
        // 重设开始答题时间，这个还需要调整，引入switch_time之后
        this.judgeCtrl.startAnswerCurQuestionTime = this.judgeCtrl.restTime;
      },
      changeAbstractVisibility(target, abstract) {
        this.anmtCtrl.showingAbstractModal = target;
        this.anmtCtrl.abstractContent = abstract;
      },
		},
	});
</script>

<style scoped lang="scss">

$general-paddng: 1rem;
$section-1-info-height: 40vh;
$section-2-earth-height: 60vh;
$section-3-operation-height: 0vh;

.play_minute_wrapper {
	background: $dark-mode-bg;
  width: 100vw;
  height: 100vh;
}

.play_minute_content {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  // .content_panel {
    // position: fixed;
    // display: flex;
  // }
  .info_panel {
    // top: 5rem;
    // left: 0;
    // right: 0;
    height: $section-1-info-height;
    // padding: $general-paddng;
    font-size: 2rem;
    justify-content: space-between;
    // background: blue;
  }
  .earth_panel {
    height: $section-2-earth-height;
    // background: yellowgreen;
    // top: 0;
    // left: 0;
  }
  .operation_panel {
    height: $section-3-operation-height;
    // background: green;
  }
  // .end_panel {
  //   top: 0;
  //   left: 0;
  //   background: $uni-bg-color-mask;
  //   width: 100vw;
  //   height: 100vh;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   flex-direction: column;
  //   .end_panel_content {
  //     text-align: center;
  //     color: #fff;
  //     margin-bottom: 60vh;
  //   }
  // }
  .test_nothing {
    color: #bbe6ff;
    color: #072d43;
  }
}

</style>