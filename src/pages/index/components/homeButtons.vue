<template>
  <view class="section_wraps">
    <view class="top_info">
      <view class="info_border"></view>
      <view class="info_content">
        <view class="top_line top_line_1">星球</view>
        <view class="top_line top_line_2">点灯人</view>
      </view>
    </view>
    <view class="bottom_info">
      <view class="mid_buttons">
        <!-- TODO: 用户信息部分等用户登录功能修好后放出 -->
        <user-card
          :userProfile="userProfile"
          @click="getUserProfilePermission"
        />
        <view class="buttons_line_2 buttons_line">
          <view class="button_start button_general" @click="startGeneral">开始</view>
        </view>
        <view class="buttons_line_3 buttons_line">
          <view class="button_train button_general" @click="stillDeveloping">(开发中...)</view>
          <view class="button_rank button_general"
            @click="goToRanking"
          >排行</view>
        </view>
      </view>
      <view class="btm_infos">
        <view class="btm_report btm_itm"
          @click="goToCommunity"
        >社区</view>
        <view class="btm_report btm_itm"
          @click="goToFeedback"
        >反馈</view>
        <!-- <view class="btm_support btm_itm"
          @click="goToReload"
        >刷新</view> -->
        <!-- 
        <view class="btm_support btm_itm" @click="getUserProfilePermission">登录</view> -->
      </view>
    </view>
  </view>
</template>

<script>
  /**
   * @description 
   * @event {Function} click 
   */
  import { FeedBackModal, UserModel } from '@/api/index.js';
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
      stillDeveloping() {
        wx.showToast({
          title: '程序员努力中...',
          icon: 'loading',
          duration: 2000,
        });
      },
      goToRanking() {
        this.$emit('routeChange', 'ranking');
      },
      goToReload() {
        uni.navigateTo({
          url: '/pages/index/index'
        });
      },
      goToCommunity() {
        wx.showModal({
          title: '用户社区',
          content: '感谢体验这款还在完善中的小程序！欢迎通过微信公众号”星球点灯人campsite”或微博”星球点灯人“关注我们哦！',
          cancelText: '返回',
          confirmText: '好嘞',
        });
      },
      goToFeedback() {
        wx.showModal({
          title: '用户反馈',
          cancelText: '返回',
          confirmText: '提交',
          editable: true,
          placeholderText: '如果有任何优化建议、玩法创意或者遇到了bug，请在这里描述问题并提交给我们。',
          async success (res) {
            if (res.confirm && res.content.length > 0) {
              wx.showLoading({
                title: '提交中...',
                mask: true,
              });
              try {
                const feedback = {
                  systemInfo: store.state.systemInfo || {},
                  userInfo: store.state.userProfile || {},
                  content: res.content,
                };
                await FeedBackModal.addNewFeedBack(feedback);
                wx.hideLoading();
                wx.showToast({
                  title: '提交成功！',
                  icon: 'success',
                  duration: 2000,
                })
              } catch (error) {
                wx.hideLoading();
                wx.showToast({
                  title: '提交失败',
                  icon: 'error',
                  duration: 2000,
                });
              }
                
            } else if (res.cancel) {
            }
          }
        });
      },
      async autoGetUserInfo() {
        // 1.先获取用户信息
        let profile = await UserModel.getExistingUserProfile();
        if (!profile) {
          await UserModel.registerAsTourist()
          profile = await UserModel.getExistingUserProfile();
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
          mask: true,
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
          const profile = await UserModel.getExistingUserProfile();
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