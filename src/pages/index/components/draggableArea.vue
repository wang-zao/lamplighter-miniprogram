<template>
  <view class="draggable-wrap"
    :style="{height: height}"
    @touchstart="dragStart"
    @touchmove="dragMove"
    @touchend="dragEnd"
  >
    draggable
    <p >{{ currentGlobeBasedX }}</p>
    <p >{{ currentGlobeBasedY }}</p>
  </view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import Vue from 'vue';
import { EventBus } from '@/utils/eventBus';
import _ from 'lodash';
export default Vue.extend({
  name: 'draggableArea',
  props: {
    height: {
      type: String,
      default: '30vh',
    },
    // anyprops: {
    //   type: String,
    //   default: '',
    // },
  },
  data() {
    return {
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      initialGlobeBasedX: 0,
      initialGlobeBasedY: 0,
      currentGlobeBasedX: 0,
      currentGlobeBasedY: 0,
    }
  },
  created() {
  },
  methods: {
    init() {
    },
    dragStart(e) {
      // console.log('dragStart', e);
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    },

    dragMove(e) {
      // console.log('dragMove', e);
      this.deltaX = e.touches[0].clientX - this.startX;
      this.deltaY = e.touches[0].clientY - this.startY;
      // rotate the globe based on the delta
      this.currentGlobeBasedX = this.initialGlobeBasedX + this.deltaX;
      this.currentGlobeBasedY = this.initialGlobeBasedY + this.deltaY;
      // execute the rotation
      this.executeRotationWithThrottle();
    },

    executeRotationWithThrottle: _.throttle(function() {
      EventBus.$emit('EarthDraggedRotation', this.currentGlobeBasedX, this.currentGlobeBasedY);
    }, 20),

    dragEnd(e) {
      // console.log('dragEnd', e);
      // update the initial globe based x and y
      this.initialGlobeBasedX = this.currentGlobeBasedX;
      this.initialGlobeBasedY = this.currentGlobeBasedY;
    },
  }
})
</script>

<style scoped lang="scss">

.draggable-wrap {
  width: 100vw;
  // background: #ff000044;
}

</style>