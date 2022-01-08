
<template>
  <view
    class="operation_panel_wrapper"
  >
    <view class="canvas_cover_operation"
      v-if="!anmtCtrl.gameStartPageVisible && !anmtCtrl.gameEndPageVisible"
    >
      <compass
        @clickedOneDirection="e => clickedOneDirection(e)"
      />
      <!-- <fly-control-cross-t
        v-show="anmtCtrl.crossTVisible"
        @clickedOneDirection="e => clickedOneDirection(e)"
      />
      <fly-control-cross-x
        v-show="anmtCtrl.crossXVisible"
        @clickedOneDirection="e => clickedOneDirection(e)"
      /> -->
    </view>
  </view>
</template>

<script>
  /**
   * info panel 选择世界的世界单元
   * @description 用于展示选择世界的世界单元
   * @event {Function} click 点击触发事件
   */

  import FlyControlCrossT from '@/components/fly-control-cross-t.vue';
  import FlyControlCrossX from '@/components/fly-control-cross-x.vue';
  import Compass from '@/components/compass.vue';

  export default {
    name: 'OperationPanel',
    components: {
      FlyControlCrossT,
      FlyControlCrossX,
      Compass,
    },
    props: {
      anmtCtrl: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
      }
    },
    methods: {
      onClickEmit(e) {
        this.$emit('clicked')
      },
      clickedOneDirection(direction) {
        // console.log('emitted button again', direction)
        this.$emit('clickedOneDirection', direction);
      },
    }
  }
</script>


<style scoped lang="scss">
@import '@/utils/customAnimate.wxss';

.operation_panel_wrapper {
  width: 100%;
  .canvas_cover_operation {
    position: fixed;
    left: 50%;
    bottom: 10vh;
    transform: translateX(-50%);
    color: #000;
    width: 70vw;
    height: 20vh;
    // background: red;
  }
}

</style>