<template>
  <cover-view class="ranking_wrapper">
    <cover-view class="ranking_body">
      <cover-view class="ranking_title">
        <cover-view class="ranking_title_text">
          排行榜
        </cover-view>
      </cover-view>
      <cover-view class="ranking_box">

      </cover-view>
      <cover-view class="your_box">

      </cover-view>
    </cover-view>
    <cover-view class="ranking_bottom">
      <cover-view class="ranking_bottom_button"
        @click="emitRouteChange('home')"
      >
        返回
      </cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
  /**
   * @description 
   * @event {Function} click 
   */
  export default {
    name: 'Ranking',
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
      emitRouteChange(route) {
        this.$emit('routeChange', route);
      },
    }
  }
</script>

<style scoped lang="scss">

$ranking-body-height: 60vh;
$ranking-bottom-height: 20vh;


.ranking_wrapper {
  width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  .ranking_body {
    width: 100%;
    height: $ranking-body-height;
    margin-top: 10vh;
    .ranking_title_text {
      font-size: 2rem;
      padding: 0.5rem 0;
    }
    .ranking_box {
      height: 75%;
      background: #ffffff22;
    }
    .your_box {
      margin-top: 5%;
      height: 20%;
      background: #ffffff22;
    }
  }
  .ranking_bottom {
    width: 100%;
    height: $ranking-bottom-height;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}

</style>