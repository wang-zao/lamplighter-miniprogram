import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
      screenWidth: 414,
      screenHeight: 896,
    },
    mutations: {
        add(state) {
            // 变更状态
            state.count += 2
        }
    }
})
export default store