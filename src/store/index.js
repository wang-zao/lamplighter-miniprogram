import Vue from 'vue'
import Vuex from 'vuex'
import { GUIDE_SHOW_MAX_SCORE } from '@/utils/constants';

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
          gameGuidePageVisible: true,
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
        userProfile: {
            openid: '',
            nickName: '0',
            country: '',
            province: '',
            city: '',
            avatarUrl: '',
            gender: 0,
            score: 0,
            createDate: '',
            scoreLastUpdateDate: '',
            notes: '',
            language: '',
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
                gameGuidePageVisible: true,
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
            store.commit('checkWhetherShowGuidePage');
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
        },
        updateUserProfile(state, profile) {
            state.userProfile = Object.assign(state.userProfile, profile);
            store.commit('checkWhetherShowGuidePage');
        },
        checkWhetherShowGuidePage(state) {
            if (state.userProfile.score >= GUIDE_SHOW_MAX_SCORE) {
                state.anmtCtrl.gameGuidePageVisible = false;
            }
        }
    }
});
export default store;