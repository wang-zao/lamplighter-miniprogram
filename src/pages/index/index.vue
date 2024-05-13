<template>
  <view class="content" >
    <earth-globe
      class="earth_panel_index"
      ref="flyingEarth"
      :anmtCtrl="anmtCtrl"
      :judgeCtrl="judgeCtrl"
      :currentRoute="currentRoute"
    />
    <global-router
      :currentRoute="currentRoute"
      @handleRouteChange="handleRouteChange"
    />
    <global-audio />
  </view>
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index.js';
import EarthGlobe from '@/components/earth-globe.vue';
import GlobalAudio from '@/components/global-audio.vue';
import GlobalRouter from '@/pages/index/components/globalRouter.vue';
import { EventBus } from '@/utils/eventBus';

export default Vue.extend({
  components: {
    EarthGlobe,
    GlobalRouter,
    GlobalAudio,
  },
  data() {
    return {
      currentRoute: 'home',
    }
  },
  computed: {
    anmtCtrl() {
      return store.state.anmtCtrl;
    },
    judgeCtrl() {
      return store.state.judgeCtrl;
    },
  },
  onLoad() {
    this.showLoading();
    this.watchRouteChangeFromEventBus();

  },
  onShareAppMessage(res){
    return {
      title:'来和我一起点亮星球吗？'
    }
  },
  methods: {
    showLoading() {
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
    },
    handleRouteChange(route: string) {
      this.currentRoute = route;
      if (route === 'home') {
        EventBus.$emit('enableEarthRotation');
      } else if (route === 'play-minute') {
        EventBus.$emit('disableEarthRotation');
        EventBus.$emit('playAgain');
      }
    },
    watchRouteChangeFromEventBus() {
      EventBus.$on('handleRouteChange', (route: string) => {
        this.handleRouteChange(route);
        store.commit('initAnmtCtrl');
        store.commit('initJudgeCtrl');
      });
    },
  },
});
</script>

<style scoped lang="scss">

$earth-top-margin: 50vh;

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $dark-mode-bg;
  color: #fff;
  height: 100vh;
  font-size: 1rem;
}

// .earth_panel_index {
//  margin-top: $earth-top-margin;
// }

</style>
