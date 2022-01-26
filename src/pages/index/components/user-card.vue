<template>
  <view class="card_wrapper_outer"
    @click="getUserProfilePermission"
  >
    <view class="card_wrapper">
      <view class="card_left">
        <view class="left_ranking_info">
          <view class="card_avatar">
            <image class="avatar_img"
              v-if="userProfile.avatarUrl"
              :src="userProfile.avatarUrl">
            </image>
            <view
              class="avatar_img_placeholder"
              v-else>
              ?
            </view>
          </view>
          <view class="card_name_wrapper">
            <view class="card_name">
              <view class="card_name_body">
                {{ userProfile.nickName }}
              </view>
              <view 
                v-if="displayLogIn"
                class="card_name_login"
              >
                登录
              </view>
            </view>
            <view class="card_name_comefrom">{{userProfile.city || ' '}}</view>
          </view>
        </view>
      </view>
      <view class="card_right">
        <view class="right_score">
          {{ userProfile.score }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import { EventBus } from '@/utils/eventBus';

export default {
  name: 'UserCard',
  props: {
    userProfile: {
      type: Object,
      default: {},
    },
  },
  computed: {
    displayLogIn() {
      return this.userProfile.avatarUrl === '' && this.userProfile.nickName === '游客';
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
    getUserProfilePermission() {
      if (this.userProfile.avatarUrl === '' || this.userProfile.nickName === '游客') {
        EventBus.$emit('getUserProfilePermission');
      }
    },
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
  width: 95%;
}
.card_left {
  display: flex;
  align-items: center;
  width: 70%;
  .left_ranking_info {
    display: flex;
    align-items: center;
    .card_avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 0.5rem;
      border: 1px solid #ffffff;
      background: #ffffff66;
      .avatar_img {
        width: 100%;
        height: 100%;
      }
      .avatar_img_placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 2rem;
        opacity: .3;
      }
    }
    .card_name_wrapper {
      text-align: left;
      .card_name {
        display: flex;
        align-items: center;
        .card_name_login {
          margin-left: 0.5rem;
          font-size: 0.7rem;
          background: #ffffff22;
          border: 1px solid #ffffff;
          line-height: 1rem;
          padding: 0 0.5rem;
          border-radius: 0.5rem;
        }
      }
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
    margin-right: 0;
    font-weight: bold;
  }
}


</style>