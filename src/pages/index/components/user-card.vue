<template>
  <cover-view class="card_wrapper_outer"
    @click="getUserProfilePermission"
  >
    <cover-view class="card_wrapper">
      <cover-view class="card_left">
        <cover-view class="left_ranking_info">
          <cover-view class="card_avatar">
            <cover-image class="avatar_img"
              v-if="userProfile.avatarUrl"
              :src="userProfile.avatarUrl">
            </cover-image>
            <cover-view
              class="avatar_img_placeholder"
              v-else>
              ?
            </cover-view>
          </cover-view>
          <cover-view class="card_name_wrapper">
            <cover-view class="card_name">
              <cover-view class="card_name_body">
                {{ userProfile.nickName }}
              </cover-view>
              <cover-view 
                v-if="displayLogIn"
                class="card_name_login"
              >
                登录
              </cover-view>
            </cover-view>
            <cover-view class="card_name_comefrom">{{userProfile.city || ' '}}</cover-view>
          </cover-view>
        </cover-view>
      </cover-view>
      <cover-view class="card_right">
        <cover-view class="right_score">
          {{ userProfile.score }}
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