<template>
  <view class="router_wrapper">
    <home-buttons
      @routeChange="handleRouteChange"
      v-show="currentRoute === 'home'"
    />
    <!-- 注意，cover-view在v-if切换之后，再次显示它的数据会冻死。可能是它的双向绑定有bug，因此下面这个组件需要用v-show -->
    <play-minute
      :currentRoute="currentRoute"
      v-show="currentRoute === 'play-minute'"
    />
    <ranking
      @routeChange="handleRouteChange"
      v-if="currentRoute === 'ranking'"
    />
    <collections
      @routeChange="handleRouteChange"
      v-if="currentRoute === 'collection'"
    />
  </view>
</template>

<script>
  /**
   * @description 
   * @event {Function} click 
   */
import PlayMinute from '@/pages/play-minute/play-minute.vue';
import HomeButtons from './homeButtons.vue';
import Ranking from '@/pages/ranking/index.vue';
import Collections from '@/pages/collections/index.vue';
import { EventBus } from '@/utils/eventBus';

export default {
  name: 'globalRouter',
  components: {
    HomeButtons,
    PlayMinute,
    Ranking,
    Collections,
  },
  props: {
    currentRoute: {
      type: String,
      default: 'home',
    },
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    init() {
    },
    handleRouteChange(route) {
      this.$emit('handleRouteChange', route);
      EventBus.$emit('playAudio', 'buttonPress');
    },
  }
}
</script>

<style scoped lang="scss">

.router_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
</style>