<template>
<view class="play_minute_wrapper">
  <view class="play_minute_content">
    <view
      class="content_panel info_panel"
    >
      <info-panel
        v-show="!anmtCtrl.gameEndPageVisible"
        :currentCity="currentCity"
        :nextCity="nextCity"
      />
    </view>
    <view
      class="content_panel operation_panel"
    >
    </view>
  </view>
</view>
</template>

<script>
import Vue from 'vue';
import store from '@/store/index.js';
import API from '@/api/index.ts';
import { GameModal, UserModel } from '@/api/index.js';
import InfoPanel from './components/info-panel.vue';
import EarthGlobe from '@/components/earth-globe.vue';
import {
  calc_shortest_dis,
  calc_next_direction,
  calc_next_direction_chn,
  calc_azimuth,
  getScoreFromDegreeDistance,
  isDegreeWithinRange,
} from '@/utils/common';
import {
  DATABASE,
  RANDOM_SWAP_P,
  RANDOM_SHIFT_P,
  PLAYING_MAX_SCORE_PER_QUESTION,
} from '@/utils/constants';
import { EventBus } from '@/utils/eventBus';

  export default Vue.extend({
    name: 'PlayMinute',
    components: {
      InfoPanel,
      EarthGlobe,
    },
    props: {
      currentRoute: {
        type: String,
        default: 'home',
      },
    },
    data() {
      return {
        currentCity: {},
        nextCity: {},
        pageCtrl: {
          currentPage: 0,
          pageSize: 20,
        },
        cityList: [],
        clocks: {
          countDown: -1,
        }
      }
    },
    mounted() {
      this.init();
      this.watchChooseDirection();
      this.watchPlayAgain();
      this.watchStartGameCountDown();
      // this.watchBackHome();
    },
    computed: {
      anmtCtrl() {
        return store.state.anmtCtrl;
      },
      judgeCtrl() {
        return store.state.judgeCtrl;
      },
      userProfile() {
        return store.state.userProfile;
      },
      constants() {
        return store.state.constants;
      },
    },
    methods: {
      async init() {
        this.cityList = [];
        this.currentCity = {};
        this.nextCity = {};
        this.pageCtrl = {
          currentPage: 0,
          pageSize: 20,
        };
        EventBus.$emit('startPlayEarthAnimation', {
          lat: 40,
          lon: 116,
        });
        store.commit('initAnmtCtrl');
        store.commit('initJudgeCtrl');
        await this.getCityData();
        await this.cityQueuePopOne(true);
        await this.cityQueuePopOne(true);
        this.calcAnswer();
        if (!this.anmtCtrl.gameGuidePageVisible && this.currentRoute === 'play-minute') {
          EventBus.$emit('startGameCountDown');
        }
        // EventBus.$emit('playAudio', 'atmosphere');
      },
      async getCityData() {
        try {
          const colloctionName = DATABASE.QUESTION_COLLECTION_NAME;
          let list = await GameModal.getGameQuestions(colloctionName, this.pageCtrl.currentPage, this.pageCtrl.pageSize);
          if (list.length === 0) {
            this.pageCtrl.currentPage = 0;
            list = await GameModal.getGameQuestions(colloctionName, this.pageCtrl.currentPage, this.pageCtrl.pageSize);
          }
          list
            .sort((a, b) => Number(a.id) - Number(b.id))
            .forEach(item => {
              this.cityList.push(item);
            });
        } catch (e) {
        }
      },
      randomJumpSomeCities() {
        // 依据用户选择的难度难度，随机拆掉n个城市
        if (this.cityList[0] && this.cityList[0].id === 1) {
          return;
        }
        const { jumpBase, jumpWeight } = this.constants.gameCurrentSettings;
        const jumpNum = jumpBase + Math.round((0.5 - Math.random()) * jumpWeight);
        console.log('jumpNum', jumpNum)

        for (let i = 0; i < jumpNum; i++) {
          this.cityList.shift();
        }
      },
      randomSwitchFirstTwoCities() {
        // 随机交换第一个城市和第二个城市
        if (this.cityList[0] && this.cityList[0].id === 1) {
          return;
        }
        if (Math.random() > RANDOM_SWAP_P) {
          let tmp1 = this.cityList.shift();
          let tmp2 = this.cityList.shift();
          this.cityList.unshift(tmp1);
          this.cityList.unshift(tmp2);
        }
      },
      async checkRestCityDataCapacity() {
        if (!this.cityList) {
          this.pageCtrl.currentPage = 0;
          await this.getCityData();
        }
        if (this.cityList && this.cityList.length <= 20) {
          this.pageCtrl.currentPage += 1;
          await this.getCityData();
        }
      },
      showStartPage() {
        setTimeout(() => {
          store.commit('setAnmtCtrl', {
            gameStartPageVisible: false,
          });
        }, 1000);
      },
      async gameEnd() {
        if (!this.currentRoute === 'play-minute') {
          return;
        }
        // 1. show failed city point
        const cityConfig = {
          fromLat: this.currentCity.lat,
          fromLon: this.currentCity.lon,
          toLat: this.nextCity.lat,
          toLon: this.nextCity.lon,
        };
        EventBus.$emit(
          'showFailedCityPoint',
          cityConfig,
        );
        // 2. show game end page
        setTimeout(async () => {
          store.commit('setAnmtCtrl', {
            gameEndPageVisible: true,
          });
          // update unlocked cities
          store.commit('getUnlockedCities');
          let update = false;
          if (this.judgeCtrl.isUnlockedNew) {
            await UserModel.updateUnlockedCities(this.judgeCtrl.unlockedCitiesParam);
            update = true;
          }
          // update total miles
          if (this.judgeCtrl.totalMiles > this.userProfile.score) {
            await UserModel.updateScore(this.judgeCtrl.totalMiles);
            update = true;
          }
          if (update) {
            const profile = await UserModel.getExistingUserProfile();
            store.commit('updateUserProfile', profile);
          }
        }, 1300);
        // 3. freeze the countdown timer
        clearInterval(this.clocks.countDown);
      },
      startTimeLoop() {
        clearInterval(this.clocks.countDown);
        this.clocks.countDown = setInterval(() => {
          if (this.judgeCtrl.restTime > 0) {
            store.commit('setJudgeCtrl', {
              restTime: this.judgeCtrl.restTime - 1,
            });
          } else if (this.judgeCtrl.restTime <= 0) {
            clearInterval(this.clocks.countDown);
            store.commit('setJudgeCtrl', {
              gameEndInfo: {
                from: this.currentCity.name_chn,
                to: this.nextCity.name_chn,
                toAbs: this.nextCity.abs_chn,
                correct: '',
                selected: '',
              } });
            this.gameEnd();
          }
        }, 1000);
      },
      calcAnswer() {
        const c = this.currentCity;
        const n = this.nextCity;
        store.commit('setJudgeCtrl', {
          distance: calc_shortest_dis(c.lon, c.lat, n.lon, n.lat),
          correctDirection: calc_next_direction(c.lon, c.lat, n.lon, n.lat),
          correctDeg: calc_azimuth(c.lon, c.lat, n.lon, n.lat),
        });
        this.allowUserInput();
      },
      allowUserInput() {
        const dir = this.judgeCtrl.correctDirection;
        if (['north', 'east', 'west', 'south'].includes(dir)) {
          store.commit('setAnmtCtrl', {
            crossTVisible: true,
            crossXVisible: false,
          });
        } else if (['northeast', 'southeast', 'northwest', 'southwest'].includes(dir)) {
          store.commit('setAnmtCtrl', {
            crossTVisible: false,
            crossXVisible: true,
          });
        }
      },
      async cityQueuePopOne(withoutAnimation = true) {
        await this.checkRestCityDataCapacity();
        if (withoutAnimation) {
          this.currentCity = { ...this.nextCity };
          if (this.currentCity.id === 1) {
            store.commit('setJudgeCtrl', {
              correctCityList: [...this.judgeCtrl.correctCityList, this.currentCity],
            });
          }
          this.randomJumpSomeCities();
          this.randomSwitchFirstTwoCities();
          this.nextCity = { ...this.cityList.shift() };
          this.checkRestCityDataCapacity();
          return;
        }
        store.commit('setAnmtCtrl', {
          answerCorrectAnimationStep1: true,
          answerCorrectAnimationSwitching: true,
        });
        setTimeout(() => {
          this.anmtCtrl.answerCorrectAnimationStep1 = false;
          this.anmtCtrl.answerCorrectAnimationStep2 = true;
          
          store.commit('setAnmtCtrl', {
            answerCorrectAnimationStep1: false,
            answerCorrectAnimationStep2: true,
          });
          this.currentCity = { ...this.nextCity };
          this.randomJumpSomeCities();
          this.randomSwitchFirstTwoCities();
          this.nextCity = { ...this.cityList.shift() };
          this.calcAnswer();
        }, 600);
        setTimeout(() => {
          store.commit('setAnmtCtrl', {
            answerCorrectAnimationSwitching: false,
          });
        }, 800);
        setTimeout(() => {
          store.commit('setAnmtCtrl', {
            answerCorrectAnimationStep2: false,
          });
        }, 1200);
        this.checkRestCityDataCapacity();
      },
      cityQueueBrokeOne() {
        setTimeout(() => {
          this.nextCity = { ...this.cityList.shift() };
          this.calcAnswer();
        }, 600);
      },
      async handleUserSelected(selectedDegree) {
        if (this.anmtCtrl.operationPanelDisabled) {
          return;
        }
        store.commit('setAnmtCtrl', {
          operationPanelDisabled: true,
          showingAbstractModal: false,
        });
        if (isDegreeWithinRange(selectedDegree, this.judgeCtrl.correctDeg)) {
          // 1.两秒防抖
          setTimeout(() => {
            store.commit('setAnmtCtrl', {
              operationPanelDisabled: false,
            });
          }, this.anmtCtrl.switchCityTime);
          // 2.计算得分
          const score = getScoreFromDegreeDistance(selectedDegree, this.judgeCtrl.correctDeg);
          // 2.展示动画
          EventBus.$emit('addScore', {
            score, deg: this.judgeCtrl.correctDeg,
          });
          // 3.计入列表
          store.commit('setJudgeCtrl', {
            totalMiles: this.judgeCtrl.totalMiles + score,
            totalDistance: this.judgeCtrl.totalDistance + this.judgeCtrl.distance,
            correctCityList: [...this.judgeCtrl.correctCityList, this.nextCity],
          });
          // 4.进行飞翔
          const flyConfig = {
            fromLat: this.currentCity.lat,
            fromLon: this.currentCity.lon,
            toLat: this.nextCity.lat,
            toLon: this.nextCity.lon,
            isDrawOrbit: true,
            score,
            cameraHeight: 600,
          };
          EventBus.$emit(
            'flyFromOneToAnother',
            flyConfig,
          );
          store.commit('setAnmtCtrl', {
            answerCorrectAnimation: true,
          });
          // 5.切换城市
          await this.cityQueuePopOne(false);
          // 6.重设开始答题时间，这个还需要调整，引入switch_time之后
          store.commit('setJudgeCtrl', {
            restTime: this.judgeCtrl.countdownStartTime,
          });
          // 7.播放音效
          EventBus.$emit('playAudio', `audioJumpSuccess${Math.floor((score - 0.01) / PLAYING_MAX_SCORE_PER_QUESTION * 10)}`);
        } else {
          // 1.两秒防抖
          setTimeout(() => {
            store.commit('setAnmtCtrl', {
              operationPanelDisabled: false,
            });
          }, this.anmtCtrl.switchCityTime);
          // 2.展示动画
          EventBus.$emit('addScore', {
            score: 0, deg: this.judgeCtrl.correctDeg,
          });
          // 3.计入列表
          store.commit('setJudgeCtrl', {
            wrongCityList: [...this.judgeCtrl.wrongCityList, this.nextCity.name_chn],
            gameEndInfo: {
              from: this.currentCity.name_chn,
              to: this.nextCity.name_chn,
              toAbs: this.nextCity.abs_chn,
              correct: calc_next_direction_chn(this.judgeCtrl.correctDeg),
              selected: calc_next_direction_chn(selectedDegree),
            },
          });
          // 4.播放音效
          EventBus.$emit('playAudio', 'audioJumpFail');
          // this.cityQueueBrokeOne();
          this.gameEnd();
        }
      },
      watchChooseDirection() {
        EventBus.$on('onChooseDirection', (deg) => {
          this.handleUserSelected(deg);
        });
      },
      watchPlayAgain() {
        EventBus.$on('playAgain', () => {
          this.init();
        });
      },
      watchBackHome() {
        EventBus.$on('onBackHome', () => {
          store.commit('initAnmtCtrl');
          store.commit('initJudgeCtrl');
        });
      },
      watchStartGameCountDown() {
        EventBus.$on('startGameCountDown', () => {
          store.commit('setAnmtCtrl', {
            gameGuidePageVisible: false,
          });
          this.startTimeLoop();
        });
      },
    },
  });
</script>

<style scoped lang="scss">

$general-paddng: 1rem;
$section-1-info-height: 50vh;
$section-2-earth-height: 60vh;
$section-3-operation-height: 25vh;

.play_minute_wrapper {
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