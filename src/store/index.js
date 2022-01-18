import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        screenWidth: 414,
        screenHeight: 896,
        globalCloudEnv: '',
        selectedGameId: '',
        systemInfo: {
            windowHeight: 896,
            windowWidth: 414,
            pixelRatio: 2,
        },
        anmtCtrl: {
          crossTVisible: false,
          crossXVisible: false,
          gameEndPageVisible: false,
          gameStartPageVisible: false,
          answerCorrectAnimationStep1: false,
          answerCorrectAnimationStep2: false,
          answerWrongAnimation: false,
          isPlanePausing: true,
          isPlaneShaking: false,
          showingAbstractModal: false,
          switchCityTime: 700,
          operationPanelDisabled: false,
        },
        judgeCtrl: {
          correctDirection: '',
          correctDeg: 0,
          distance: '',
          totalMiles: 0,
          restTime: 10,
          countdownStartTime: 10,
          userSelect: '',
          isCorrect: false,
          isUserSelected: false,
          correctCityList: [],
          wrongCityList: [],
        },
    },
    mutations: {
        add(state) {
            // 变更状态
            state.count += 2
        },
        updateEnv(state, env) {
            state.globalCloudEnv = env;
        },
        updateSelectedGameId(state, id) {
            state.selectedGameId = id;
        },
        updateSystemInfo(state, res) {
            state.systemInfo = res;
        },
        initAnmtCtrl(state) {
            state.anmtCtrl = {
                crossTVisible: false,
                crossXVisible: false,
                gameEndPageVisible: false,
                gameStartPageVisible: false,
                answerCorrectAnimationStep1: false,
                answerCorrectAnimationStep2: false,
                answerWrongAnimation: false,
                isPlanePausing: true,
                isPlaneShaking: false,
                showingAbstractModal: false,
                switchCityTime: 700,
                operationPanelDisabled: false,
            }
        },
        initJudgeCtrl(state) {
            state.judgeCtrl = {
                correctDirection: '',
                correctDeg: 0,
                distance: '',
                totalMiles: 0,
                restTime: 10,
                countdownStartTime: 10,
                userSelect: '',
                isCorrect: false,
                isUserSelected: false,
                correctCityList: [],
                wrongCityList: [],
            }
        },
        setAnmtCtrl(state, settings) {
            state.anmtCtrl = Object.assign(state.anmtCtrl, settings);
        },
        setJudgeCtrl(state, settings) {
            state.judgeCtrl = Object.assign(state.judgeCtrl, settings);
        }
    }
});
export default store;