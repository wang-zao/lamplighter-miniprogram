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
    <earth-globe
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
    <view
      class="content_panel operation_panel"
    >
      <operation-panel
        :anmtCtrl="anmtCtrl"
        @clickedOneDirection="e => handleUserSelected(e)"
      />
    </view>
  </view>
</view>
</template>

<script>
  import Vue from 'vue';
  import store from '@/store/index.js'    
  import API from '@/api/index.ts';
  import { GameModal } from '@/api/index.js';
  import InfoPanel from './components/info-panel.vue';
  import OperationPanel from './components/operation-panel.vue';
  import StartPage from '@/components/start-page.vue';
  import EarthGlobe from '@/components/earth-globe.vue';
  import {
    calc_shortest_dis,
    calc_next_direction,
    calc_azimuth,
    getPenaltyTimeWhenWrong,
    getScoreWhenCorrect,
    getScoreFromDegreeDistance,
    isDegreeWithinRange,
  } from '@/utils/common';
  import {
    DATABASE,
  } from '@/utils/constants';

  export default Vue.extend({
    components: {
      StartPage,
      InfoPanel,
      OperationPanel,
      EarthGlobe,
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
          correctDeg: 0,
          distance: '',
          totalMiles: 0,
          restTime: 10,
          // startAnswerCurQuestionTime: 60,
          countdownStartTime:10,  //按每题计时
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
        console.log('initing-------------------------')
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
        );
        this.calcAnswer();
        // this.$refs.flyingEarth.allowDrawOrbit();
        console.log('init fiinised')
      },
      async getCityData() {
        try {
          const colloctionName = DATABASE.QUESTION_COLLECTION_NAME;
          const { list } = await GameModal.getGameQuestions(colloctionName);
          // const gameId = store.state.selectedGameId;
          // const list = await API.getGameQuestions(gameId);
          this.cityList = list.sort((a, b) => Number(a.id) - Number(b.id));
        } catch (e) {
        }
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
        }, 1000);
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
        this.judgeCtrl.correctDeg = calc_azimuth(c.lon, c.lat, n.lon, n.lat);
        this.allowUserInput();
      },
      allowUserInput() {
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
          this.nextCity = { ...this.cityList.shift() };
          return;
        }
        this.anmtCtrl.answerCorrectAnimationStep1 = true;
        // this.anmtCtrl.operationPanelDisabled = true;
        setTimeout(() => {
          this.anmtCtrl.answerCorrectAnimationStep1 = false;
          this.anmtCtrl.answerCorrectAnimationStep2 = true;
          this.currentCity = this.nextCity;
          this.nextCity = { ...this.cityList.shift() };
          this.calcAnswer();
        }, 600);
        setTimeout(() => {
          this.anmtCtrl.answerCorrectAnimationStep2 = false;
        }, 1200);
        
      },
      cityQueueBrokeOne() {
        setTimeout(() => {
          this.nextCity = { ...this.cityList.shift() };
          this.calcAnswer();
        }, 600);
      },
      showAllCoverViews() {
        setTimeout(() => {
          console.log('showing all cover views !')
          this.anmtCtrl.showCoverViews = true;
        }, 1000);
      },
      async handleUserSelected(selectedDegree) {
        console.log('handleUserSelected===', selectedDegree)
        if (this.anmtCtrl.operationPanelDisabled) {
          return;
        }
        this.anmtCtrl.operationPanelDisabled = true;
        // const userAnswerTime = this.judgeCtrl.startAnswerCurQuestionTime - this.judgeCtrl.restTime;
        this.anmtCtrl.showingAbstractModal = false;
        if (isDegreeWithinRange(selectedDegree, this.judgeCtrl.correctDeg)) {
          // 1.两秒防抖
          setTimeout(() => {
            this.anmtCtrl.operationPanelDisabled = false;
          }, this.anmtCtrl.switchCityTime);
          // 2.计算得分
          this.judgeCtrl.totalMiles += getScoreFromDegreeDistance(selectedDegree, this.judgeCtrl.correctDeg);
          // 3.计入列表
          this.judgeCtrl.correctCityList.push(this.nextCity.name_chn);
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
          this.checkRestCityDataCapacity();
        } else {
          // 1.两秒防抖
          setTimeout(() => {
            this.anmtCtrl.operationPanelDisabled = false;
          }, this.anmtCtrl.switchCityTime);
          // 3.计入列表
          this.judgeCtrl.wrongCityList.push(this.nextCity.name_chn);
          this.cityQueueBrokeOne();
          this.gameEnd();
        }
        // 重设开始答题时间，这个还需要调整，引入switch_time之后
        this.judgeCtrl.restTime = this.judgeCtrl.countdownStartTime;
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
$section-1-info-height: 35vh;
$section-2-earth-height: 60vh;
$section-3-operation-height: 25vh;

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
  .info_panel {
    height: $section-1-info-height;
    font-size: 2rem;
    justify-content: space-between;
  }
  .earth_panel {
    height: $section-2-earth-height;
  }
  .operation_panel {
    height: $section-3-operation-height;
  }
  .test_nothing {
    color: #bbe6ff;
    color: #072d43;
  }
}

</style>