<template>
  <cover-view class="card_wrapper_outer">
    <cover-view class="card_wrapper">
      <cover-view class="card_left">
        <cover-view class="left_ranking_number">
          1
        </cover-view>
        <cover-view class="left_ranking_info">
          <cover-view class="card_avatar">
            <!-- <image class="avatar_img" src="{{avatar}}"></image> -->
            <cover-view class="card_avatar_wrapper">
              avt
            </cover-view>
          </cover-view>
          <cover-view class="card_name_wrapper">
            <cover-view class="card_name">{{ nickName }}</cover-view>
            <cover-view class="card_name_comefrom">London</cover-view>
          </cover-view>
        </cover-view>
      </cover-view>
      <cover-view class="card_right">
        <cover-view class="right_score">
          123
        </cover-view>
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
  name: 'RankingCard',
  props: {
    nickName: {
      type: String,
      default: '',
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
    }
  }
}
</script>

<style scoped lang="scss">

$card-height: 4rem;

.card_wrapper_outer {
  width: 100%;
  display: flex;
  justify-content: center;
}
.card_wrapper {
  height: $card-height;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #ffffff22;
  width: 95%;
}
.card_left {
  display: flex;
  align-items: center;
  width: 70%;
  .left_ranking_number {
    font-size: 1rem;
    min-width: 1rem;
    margin: 0 0.5rem;
  }
  .left_ranking_info {
    display: flex;
    align-items: center;
    .card_avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 0.5rem;
      .card_avatar_wrapper {
        width: 100%;
        height: 100%;
        background: #ffffff;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .card_name_wrapper {
      text-align: left;
      .card_name_comefrom {
        font-size: 0.7rem;
      }
    }
  }
}
.card_right {
  text-align: right;
  width: 30%;
  .right_score {
    font-size: 1.3rem;
    margin-right: 1rem;
    font-weight: bold;
  }
}


</style>