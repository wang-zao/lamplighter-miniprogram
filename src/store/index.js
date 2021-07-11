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
    }
})
export default store