<template>
  <cover-view class="event_wrapper"
    @touchstart="startRotatingCompass"
    @touchend="endRotatingCompass"
  >
  </cover-view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import { EventBus } from '@/utils/eventBus';

export default {
  name: 'EventAgent',
  props: {
    // anyprops: {
    //   type: String,
    //   default: '',
    // },
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
    startRotatingCompass() {
      EventBus.$emit('startRotatingCompass');
    },
    endRotatingCompass() {
      EventBus.$emit('endRotatingCompass');
    },
  }
}
</script>

<style scoped lang="scss">

$event-agent-height: 50vh;

.event_wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: $event-agent-height;
  background: transparent;
  color: #ffffff;
  font-size: 5rem;
}
</style>