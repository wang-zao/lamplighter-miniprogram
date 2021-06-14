import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        screenWidth: 414,
        screenHeight: 896,
        globalCloudEnv: '',
        selectedGameId: '',
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
    }
})
export default store