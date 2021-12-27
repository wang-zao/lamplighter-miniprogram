<template>
  <cover-view class="fly-control-cross-t">
    
    <cover-view class="operation_row row_1">
      <cover-view
        class="btn_item btn_north"
        @click="onClick('north')"
      >北</cover-view>
    </cover-view>
    <cover-view class="operation_row row_2">
      <cover-view
        class="btn_item btn_west" 
        @click="onClick('west')"
      >西</cover-view>
      <cover-view
        class="btn_item btn_east"
        @click="onClick('east')"
      >东</cover-view>
    </cover-view>
    <cover-view class="operation_row row_3">
      <cover-view
        class="btn_item btn_south" 
        @click="onClick('south')"
      >南</cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
  /**
   * fly-control-cross-t
   * @description 用于操纵飞机飞行方向的控制面板
   * @event {Function} click 点击触发事件
   */
  import Vue from 'vue';

  export default Vue.extend({
    name: 'FlyControlCrossT',
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
      onClick(direction) {
        console.log('emitted button', direction)
        if (this.anmtCtrl.operationPanelDisabled) {
          return;
        }
        this.$emit('clickedOneDirection', direction);
      }
    }
  });
</script>

<style scoped lang="scss">

.fly-control-cross-t {
  width: 70vw;
  height: 20vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .operation_row {
    display: flex;
    width: 100%;
  }
  .row_1 {
    justify-content: center;
  }
  .row_2 {
    justify-content: space-between;
  }
  .row_3 {
    justify-content: center;
  }
  .btn_item {
    width: 5rem;
    height: 2rem;
    border-radius: 1rem;
    background: $general-bright-button-background;
    text-align: center;
    line-height: 2rem;
    background: linear-gradient(90deg, #eeeedd 10%, #fff 40%)
  }
}
</style>