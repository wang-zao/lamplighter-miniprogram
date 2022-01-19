<template>
  <cover-view class="ranking_wrapper">
    <cover-view class="ranking_body">
      <cover-view class="ranking_title">
        <cover-view class="ranking_title_text">
          世界排行 {{userProfile.nickName}}
        </cover-view>
      </cover-view>
      <cover-view class="ranking_box">
        <ranking-card
          class="ranking_card_list"
          nickName="harryPotter"
        />
        <ranking-card
          class="ranking_card_list"
          nickName="harryPotter"
        />
        <ranking-card
          class="ranking_card_list"
          nickName="harryPotter"
        />
        <ranking-card
          class="ranking_card_list"
          nickName="harryPotter"
        />
        <ranking-card
          class="ranking_card_list"
          nickName="harryPotter"
        />
      </cover-view>
      <cover-view class="your_box">
        <ranking-card
          class="ranking_card_yours"
          :nickName="userProfile.nickName"
        />
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
  import RankingCard from './components/ranking-card.vue';
  import store from '@/store/index.js';
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
    components: {
      RankingCard,
    },
    data() {
      return {
      }
    },
    computed: {
      userProfile() {
        return store.state.userProfile;
      },
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

$ranking-body-height: 80vh;
$ranking-bottom-height: 20vh;
$ranking-margin-top: 0.5rem;

$ranking-item-inner-height: 4rem;
$ranking-item-inner-padding: 0.5rem;
$ranking-item-height: $ranking-item-inner-height + $ranking-item-inner-padding * 2;

$ranking-box-inner-height: $ranking-item-inner-height * 5 + $ranking-item-inner-padding * 4;
$ranking-box-inner-padding: 0.5rem;
$ranking-box-height: $ranking-box-inner-height + $ranking-box-inner-padding * 2;


.ranking_wrapper {
  width: 90vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  .ranking_body {
    width: 100%;
    height: $ranking-body-height;
    margin-top: $ranking-margin-top;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .ranking_title_text {
      font-size: 1.5rem;
      padding: 1rem 0;
    }
    .ranking_box {
      height: $ranking-box-height;
      background: #ffffff11;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .ranking_card_list {
        width: 100%;
        margin-top: $ranking-item-inner-padding;
      }
    }
    .your_box {
      margin-top: 5%;
      height: $ranking-item-height;
      background: #ffffff11;
      display: flex;
      .ranking_card_yours {
        width: 100%;
        margin-top: $ranking-item-inner-padding;
      }
    }
  }
  .ranking_bottom {
    width: 100%;
    height: $ranking-bottom-height;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}

</style>