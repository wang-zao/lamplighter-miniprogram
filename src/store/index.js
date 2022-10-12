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
          answerCorrectAnimationSwitching: false,
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
          distance: 0,
          totalMiles: 0,
          totalDistance: 0,
          restTime: 15,
          countdownStartTime: 15,
          userSelect: '',
          isCorrect: false,
          isUserSelected: false,
          correctCityList: [],
          wrongCityList: [],
          newlyUnlockedCityList: [],
          unlockedCitiesParam: '',
          isUnlockedNew: false,
          scoreList: [],
          gameEndInfo: {
            from: '',
            to: '',
            toAbs: '',
            correct: '',
            selected: '',
          },
        },
        userProfile: {
            openid: '',
            nickName: '',
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
            unlockedCities: '',
        },
        constants: {
            gameCurrentSettings: {
                id: '0',
                name: '简单',
                iconCountList: [1],
                jumpBase: 0.5,
                jumpWeight: 2,
                timeLimit: 30,
            },
            gameHardLevel: [
                {
                    id: '0',
                    name: '简单',
                    iconCountList: [1],
                    jumpBase: 0.5,
                    jumpWeight: 2,
                    timeLimit: 20,
                },
                {
                    id: '1',
                    name: '中等',
                    iconCountList: [1, 2],
                    jumpBase: 4,
                    jumpWeight: 4,
                    timeLimit: 15,
                },
                {
                    id: '2',
                    name: '困难',
                    iconCountList: [1, 2, 3, 4, 5],
                    jumpBase: 9,
                    jumpWeight: 8,
                    timeLimit: 10,
                },
            ]
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
                answerCorrectAnimationSwitching: false,
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
                distance: 0,
                totalMiles: 0,
                totalDistance: 0,
                restTime: state.constants.gameCurrentSettings.timeLimit,
                countdownStartTime: state.constants.gameCurrentSettings.timeLimit,
                userSelect: '',
                isCorrect: false,
                isUserSelected: false,
                correctCityList: [],
                wrongCityList: [],
                newlyUnlockedCityList: [],
                unlockedCitiesParam: '',
                isUnlockedNew: false,
                gameEndInfo: {
                  from: '',
                  to: '',
                  toAbs: '',
                  correct: '',
                  selected: '',
                },
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
        },
        async getUnlockedCities(state) {
            let previousUnlockedCities = {}
            if (state.userProfile.unlockedCities) {
                previousUnlockedCities = JSON.parse(state.userProfile.unlockedCities);
            }
            let currentUnlockedCities = state.judgeCtrl.correctCityList;
            let newlyUnlockedCityList = [];
            let newlyUnlockedCityIdDict = {};
            currentUnlockedCities.forEach(city => {
                if (!(city.id in previousUnlockedCities)) {
                    const today = new Date();
                    newlyUnlockedCityList.push(city);
                    newlyUnlockedCityIdDict[city.id] = {
                        name: city.name_chn,
                        userViewed: false,
                        unlockDate: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
                    };
                }
            });
            console.log('newlyUnlockedCityIdDict', newlyUnlockedCityIdDict)
            console.log('previousUnlockedCities', previousUnlockedCities)
            store.commit('setJudgeCtrl', { 
                newlyUnlockedCityList,
                unlockedCitiesParam: {
                    ...newlyUnlockedCityIdDict,
                    ...previousUnlockedCities,
                },
                isUnlockedNew: newlyUnlockedCityList.length > 0,
            });
        },
        setCurrentLevel(state, level) {
            state.constants.gameCurrentSettings = Object.assign(
                state.constants.gameCurrentSettings,
                state.constants.gameHardLevel[level],
            );
            store.commit('initJudgeCtrl');
        }
    }
});
export default store;