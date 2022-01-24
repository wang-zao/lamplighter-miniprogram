<template>
  <cover-view class="section_wraps">
    <cover-view class="top_info">
      <cover-view class="info_border"></cover-view>
      <cover-view class="info_content">
        <cover-view class="top_line top_line_1">星球</cover-view>
        <cover-view class="top_line top_line_2">点灯人</cover-view>
      </cover-view>
    </cover-view>
    <cover-view class="bottom_info">
      <cover-view class="mid_buttons">
        <!-- TODO: 用户信息部分等用户登录功能修好后放出 -->
        <user-card
          :userProfile="userProfile"
          @click="getUserProfilePermission"
        />
        <cover-view class="buttons_line_2 buttons_line">
          <cover-view class="button_start button_general" @click="startGeneral">开始</cover-view>
        </cover-view>
        <cover-view class="buttons_line_3 buttons_line">
          <cover-view class="button_train button_general">(开发中...)</cover-view>
          <cover-view class="button_rank button_general"
            @click="goToRanking"
          >排行</cover-view>
        </cover-view>
      </cover-view>
      <cover-view class="btm_infos">
        <!-- 这部分等到帮助和反馈功能做出来之后再说 -->
        <cover-view class="btm_report btm_itm"
          @click="goToFeedback"
        >反馈</cover-view>
        <!-- 
        <cover-view class="btm_support btm_itm">帮助</cover-view>
        <cover-view class="btm_support btm_itm" @click="getUserProfilePermission">登录</cover-view> -->
      </cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
  /**
   * @description 
   * @event {Function} click 
   */
  import { TestModal, UserModel } from '@/api/index.js';
  import API from '@/api/index.ts';
  import store from '@/store/index.js'
  import UserCard from './user-card.vue';
  import { EventBus } from '@/utils/eventBus';

  export default {
    name: 'HomeButtons',
    components: {
      UserCard,
    },
    data() {
      return {
        openid: '',
        isGettingUserProfile: false,
      }
    },
    computed: {
      userProfile() {
        return store.state.userProfile;
      },
    },
    created() {
      // this.getUserProfile();
      this.getSystemInfo();
      this.autoGetUserInfo();
      this.watchGetUserProfilePermission();
    },
    methods: {
      init() {
      },
      getSystemInfo() {
        const res = wx.getSystemInfoSync();
        store.commit('updateSystemInfo', res);
      },
      startGeneral() {
        store.commit('updateSelectedGameId', 1);
        this.$emit('routeChange', 'play-minute');
      },
      goToRanking() {
        this.$emit('routeChange', 'ranking');
      },
      goToFeedback() {
        wx.showModal({
          title: '用户反馈',
          content: '感谢体验这款还在完善中的小程序！如果有任何优化建议、玩法创意或者遇到了bug，欢迎微信搜索：”星球点灯人campsite”，关注公众号，在后台留言告诉我们哦',
          cancelText: '好的',
          confirmText: '好哒',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        });
      },
      async autoGetUserInfo() {
        // 1.先获取openid
        const { result: { openid }} = await UserModel.getUserOpenId();
        this.openid = openid;
        // 2.依据openid获取用户信息
        let profile = await UserModel.getExistingUserProfile(openid);
        if (!profile) {
          await UserModel.registerAsTourist(openid)
          profile = await UserModel.getExistingUserProfile(openid);
        }
        store.commit('updateUserProfile', profile);
      },
      async getUserProfilePermission() {
        if (this.isGettingUserProfile) {
          return;
        }
        this.isGettingUserProfile = true;
        wx.showLoading({
          title: '登录中',
        })
        setTimeout(() => {
          wx.hideLoading();
        }, 1000);
        try {
          const res = await uni.getUserProfile({
            desc: '使用微信名称和头像吗？'
          });
          const { userInfo } = res[1];
          await UserModel.updateInfo(userInfo);
          const profile = await UserModel.getExistingUserProfile(this.openid);
          store.commit('updateUserProfile', profile);
        } catch (error) {
          console.log(error);
        }
        this.isGettingUserProfile = false;
      },
      watchGetUserProfilePermission() {
        EventBus.$on('getUserProfilePermission', () => {
          this.getUserProfilePermission();
        });
      },
    }
  }
</script>

<style scoped lang="scss">

.section_wraps {
  height: 90vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

}

.top_info {
  height: 6rem;
  width: 80vw;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 2.5rem;
  margin-top: 5vh;
  padding-left: 0.2rem;
  .info_border {
    width: 3px;
    height: 100%;
    background: #ffffff;
  }
  .info_content {
    .top_line {
      padding-left: 0.8rem;
    }
  }
}

.mid_buttons {
  .buttons_line {
    display: flex;
    justify-content: space-between;
    width: 60vw;
    margin: 10px 0;
  }

  .button_general {
    background: #ffffff44;
    text-align: center;
    border-radius: 2rem;
    border: 2px #fff solid;
    color: #fff;
    padding: 0.5rem 0;
    font-size: 1rem;
  }

  .button_start {
    width: 100%;
    padding: 0.8rem 0;
  }

  .button_train {
    width: 60%;
  }

  .button_rank {
    width: 30%;
  }
}



.btm_infos {
  height: 2rem;
  width: 60vw;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 5vh;
  .btm_itm {
    font-size: .8rem;
    padding: 0.2rem 0.5rem;
    opacity: .7;
    // background: #ffffff44;
  }

}

</style>