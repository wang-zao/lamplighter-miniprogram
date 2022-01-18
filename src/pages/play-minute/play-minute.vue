<template>
<cover-view class="play_minute_wrapper">
  <cover-view class="play_minute_content">
    <cover-view
      class="content_panel info_panel"
    >
      <info-panel
        v-if="!anmtCtrl.gameEndPageVisible"
        :currentCity="currentCity"
        :nextCity="nextCity"
      />
    </cover-view>
    <cover-view
      class="content_panel operation_panel"
    >
    </cover-view>
  </cover-view>
</cover-view>
</template>

<script>
import Vue from 'vue';
import store from '@/store/index.js'    
import API from '@/api/index.ts';
import { GameModal } from '@/api/index.js';
import InfoPanel from './components/info-panel.vue';
import EarthGlobe from '@/components/earth-globe.vue';
import {
  calc_shortest_dis,
  calc_next_direction,
  calc_azimuth,
  getScoreFromDegreeDistance,
  isDegreeWithinRange,
} from '@/utils/common';
import {
  DATABASE,
} from '@/utils/constants';
import { EventBus } from '@/utils/eventBus';

  export default Vue.extend({
    name: 'PlayMinute',
    components: {
      InfoPanel,
      EarthGlobe,
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
      }
    },
    mounted() {
      this.init();
      this.watchChooseDirection();
      this.watchPlayAgain();
      // this.watchBackHome();
    },
    computed: {
      anmtCtrl() {
        return store.state.anmtCtrl;
      },
      judgeCtrl() {
        return store.state.judgeCtrl;
      },
    },
    methods: {
      async init() {
        // this.showStartPage();
        // this.startTimeLoop();
        this.cityList = [];
        this.currentCity = {};
        this.nextCity = {};
        this.pageCtrl = {
          currentPage: 0,
          pageSize: 20,
        };
        store.commit('initAnmtCtrl');
        store.commit('initJudgeCtrl');
        await this.getCityData();
        this.cityQueuePopOne(true);
        this.cityQueuePopOne(true);
        // this.$refs.flyingEarth.flyFromOneToAnother(
        //   0,
        //   0,
        //   this.currentCity.lat,
        //   this.currentCity.lon,
        // );
        this.calcAnswer();
        // this.$refs.flyingEarth.allowDrawOrbit();
      },
      async getCityData() {
        try {
          const colloctionName = DATABASE.QUESTION_COLLECTION_NAME;
          const list = await GameModal.getGameQuestions(colloctionName, this.pageCtrl.currentPage, this.pageCtrl.pageSize);
          // const gameId = store.state.selectedGameId;
          // const list = await API.getGameQuestions(gameId);
          list
            .sort((a, b) => Number(a.id) - Number(b.id))
            .forEach(item => {
              this.cityList.push(item);
            });
        } catch (e) {
        }
      },
      checkRestCityDataCapacity() {
        if (this.cityList && this.cityList.length <= 5) {
          this.pageCtrl.currentPage += 1;
          this.getCityData();
        }
      },
      showStartPage() {
        setTimeout(() => {
          store.commit('setAnmtCtrl', {
            gameStartPageVisible: false,
          });
          this.startTimeLoop();
        }, 1000);
      },
      gameEnd() {
        store.commit('setAnmtCtrl', {
          gameEndPageVisible: true,
        });
      },
      startTimeLoop() {
        const clock = setInterval(() => {
          if (this.judgeCtrl.restTime > 0) {
            store.commit('setJudgeCtrl', {
              restTime: this.judgeCtrl.restTime - 1,
            });
          } else if (this.judgeCtrl.restTime <= 0) {
            clearInterval(clock);
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
      cityQueuePopOne(withoutAnimation = true) {
        if (withoutAnimation) {
          this.currentCity = this.nextCity;
          this.nextCity = { ...this.cityList.shift() };
          return;
        }
        store.commit('setAnmtCtrl', {
          answerCorrectAnimationStep1: true,
        });
        setTimeout(() => {
          this.anmtCtrl.answerCorrectAnimationStep1 = false;
          this.anmtCtrl.answerCorrectAnimationStep2 = true;
          
          store.commit('setAnmtCtrl', {
            answerCorrectAnimationStep1: false,
            answerCorrectAnimationStep2: true,
          });
          this.currentCity = this.nextCity;
          this.nextCity = { ...this.cityList.shift() };
          this.calcAnswer();
        }, 600);
        setTimeout(() => {
          store.commit('setAnmtCtrl', {
            answerCorrectAnimationStep2: false,
          });
        }, 1200);
        
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
          // 3.计入列表
          store.commit('setJudgeCtrl', {
            totalMiles: this.judgeCtrl.totalMiles + getScoreFromDegreeDistance(selectedDegree, this.judgeCtrl.correctDeg),
            correctCityList: [...this.judgeCtrl.correctCityList, this.nextCity.name_chn],
          });
          // 4.进行飞翔
          const flyConfig = {
            fromLat: this.currentCity.lat,
            fromLon: this.currentCity.lon,
            toLat: this.nextCity.lat,
            toLon: this.nextCity.lon,
          };
          EventBus.$emit(
            'flyFromOneToAnother',
            flyConfig,
          );
          store.commit('setAnmtCtrl', {
            answerCorrectAnimation: true,
          });
          // 5.切换城市
          this.cityQueuePopOne(false);
          this.checkRestCityDataCapacity();
        } else {
          // 1.两秒防抖
          setTimeout(() => {
            store.commit('setAnmtCtrl', {
              operationPanelDisabled: false,
            });
          }, this.anmtCtrl.switchCityTime);
          // 3.计入列表
          store.commit('setJudgeCtrl', {
            wrongCityList: [...this.judgeCtrl.wrongCityList, this.nextCity.name_chn],
          });
          this.cityQueueBrokeOne();
          this.gameEnd();
        }
        // 重设开始答题时间，这个还需要调整，引入switch_time之后
        store.commit('setJudgeCtrl', {
          restTime: this.judgeCtrl.countdownStartTime,
        });
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
    },
  });
</script>

<style scoped lang="scss">

$general-paddng: 1rem;
$section-1-info-height: 50vh;
$section-2-earth-height: 60vh;
$section-3-operation-height: 25vh;

.play_minute_wrapper {
  // background: $dark-mode-bg;
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