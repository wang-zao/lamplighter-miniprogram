<template>
  <view class="section_wraps">
    <view class="top_info">
      <view class="info_title">
        <span :key="key" v-for="(letter, key) in '星球点灯人'">{{ letter }}</span>
      </view>
      <view class="info_img">
        <!-- <image class="info_img_content" src="@/static/title-miniprogram-s.png" /> -->
      </view>
      <!-- <view class="info_border"></view> -->
      <!-- <view class="info_content">
        <view class="top_line_notes top_line_notes_line1">{{ note1 }}</view>
        <view class="top_line_notes">{{ note2 }}</view>
        <view class="top_line_notes">{{ note3 }}</view>
      </view> -->
    </view>
    <view class="mid_draggable_area">
      <draggable-area
        height="55vh"
      />
    </view>
    <view class="bottom_info">
      <view class="mid_buttons">
        <!-- TODO: 用户信息部分等用户登录功能修好后放出 -->
        <!-- <user-card
          :userProfile="userProfile"
          @click="getUserProfilePermission"
        /> -->
        <!-- <level-select /> -->
        <view class="buttons_new_wrapper">
          <view v-if="buttonTab === 'home'" class="buttons_new_wrapper_inner">
            <view class="button_new_item" @click="switchButtonTab('compass')">
              <view class="button_new_icon button_compass_new">
                <image class="button_new_icon_img" src="@/static/compass.svg"></image>
              </view>
              <view class="button_new_text">方向感训练器</view>
            </view>
            <view class="button_new_item" @click="goToRandomCity">
              <view class="button_new_icon button_travel_new">
                <image class="button_new_icon_img" src="@/static/dice.svg"></image>
              </view>
              <view class="button_new_text">目的地抽取器</view>
            </view>
            <view class="button_new_item" @click="goToLightUp">
              <view class="button_new_icon button_footprint_new">
                <image class="button_new_icon_img" src="@/static/footprint.svg"></image>
              </view>
              <view class="button_new_text">流浪史生成器</view> 
            </view>
          </view>
          <!-- 方向训练tab -->
          <view v-if="buttonTab === 'compass'" class="buttons_new_wrapper_inner">
            <view class="button_new_item" @click="switchButtonTab('home')">
              <view class="button_new_icon button_compass_new button_minor">
                <image class="button_new_icon_img" src="@/static/return.svg"></image>
              </view>
              <view class="button_new_text">返回</view>
            </view>
            <view class="button_new_item" @click="startGeneral">
              <view class="button_new_icon button_compass_new">
                <image class="button_new_icon_img" src="@/static/compass.svg"></image>
              </view>
              <view class="button_new_text">开始</view>
            </view>
            <view class="button_new_item" @click="goToCollection">
              <view class="button_new_icon button_compass_new button_minor">
                <image class="button_new_icon_img" src="@/static/book-city-fill.svg"></image>
              </view>
              <view class="button_new_text">图鉴</view>
            </view>
            <view class="button_new_item" @click="goToRanking">
              <view class="button_new_icon button_compass_new button_minor">
                <image class="button_new_icon_img" src="@/static/rank.svg"></image>
              </view>
              <view class="button_new_text">排行</view>
            </view>
          </view>
        </view>
        <!-- <view class="buttons_line_2 buttons_line">
          <view class="button_start button_general" @click="goToLightUp">
            足迹生成器
          </view>
        </view>
        <view class="buttons_line_2 buttons_line">
          <view class="button_start button_general" @click="startGeneral">
            方向感训练器
            <image class="button_general_icon" src="@/static/earth.svg"></image>
            <image class="button_general_icon" src="@/static/lightbulb.svg"></image>
            <image class="button_general_icon" src="@/static/plane.svg"></image>
          </view>
        </view>
        <view class="buttons_line_3 buttons_line">
          <view class="button_train button_general" @click="goToCollection">
            <image class="button_general_icon" src="@/static/city_fill.svg"></image>
            <image class="button_general_icon" src="@/static/book-city-fill.svg"></image>
          </view>
          <view class="button_rank button_general" @click="goToRanking">
            <image class="button_general_icon" src="@/static/paiming_rank.svg"></image>
            <image class="button_general_icon" src="@/static/rank.svg"></image>
          </view>
        </view> -->
      </view>
      <view class="btm_infos">
        <view class="btm_report btm_itm"
          @click="goToCommunity"
        >
          <icon-font iconName="guanyu" iconSize="0.8rem"/>
        </view>
        <view class="btm_report btm_itm"
          @click="goToFeedback"
        >
          <icon-font iconName="wentifankui" iconSize="0.8rem"/>
        </view>
        <view class="btm_support btm_itm"
          @click="goToReload"
        >
          <icon-font iconName="shuaxin" iconSize="0.8rem"/>
        </view>
        <!-- <view class="btm_support btm_itm"
          @click="goToReload"
        >设置</view> -->
      </view>
    </view>
  </view>
</template>

<script>
  /**
   * @description 
   * @event {Function} click 
   */
  import IconFont from '@/components/iconFont.vue';
  import { FeedBackModal, UserModel, SettingsModal } from '@/api/index.js';
  import API from '@/api/index.ts';
  import store from '@/store/index.js'
  import UserCard from './user-card.vue';
  import LevelSelect from './level-select.vue';
  import DraggableArea from './draggableArea.vue';
  import { EventBus } from '@/utils/eventBus';
  import { FONT_URL } from '@/utils/constants';

  export default {
    name: 'HomeButtons',
    components: {
      UserCard,
      IconFont,
      LevelSelect,
      DraggableArea,
    },
    data() {
      return {
        isGettingUserProfile: false,
        note1: '',
        note2: '',
        note3: '',
        buttonTab: 'home' // compass, footprint, travel
      }
    },
    computed: {
      userProfile() {
        return store.state.userProfile;
      },
    },
    created() {
      // this.getUserProfile();
      this.getSettings();
      this.getSystemInfo();
      this.autoGetUserInfo();
      this.watchGetUserProfilePermission();
    },
    methods: {
      init() {
      },
      async getSettings() {
        const { data: [ settings ] } = await SettingsModal.getAllSettings();
        this.note1 = settings.indexText.note1;
        this.note2 = settings.indexText.note2;
        this.note3 = settings.indexText.note3;
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
      goToLightUp() {
        this.$emit('routeChange', 'light-up');
      },
      goToRanking() {
        this.$emit('routeChange', 'ranking');
      },
      goToCollection() {
        this.$emit('routeChange', 'collection');
      },
      goToRandomCity() {
        this.$emit('routeChange', 'random-city');
      },
      switchButtonTab(tab) {
        this.buttonTab = tab;
      },
      goToReload() {
        wx.showModal({
          title: '如何刷新',
          content: '如遇异常，点击右上角的•••按钮，选择“重新进入小程序”，即可重新加载页面',
          cancelText: '返回',
          confirmText: '知道了',
        });
      },
      goToCommunity() {
        wx.showModal({
          title: '用户社区',
          content: '感谢体验这款还在完善中的小程序！欢迎通过微信公众号”王凿”或关注或留言哦！',
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
          placeholderText: '如果有任何优化建议、知识指正或者遇到了bug，请在这里描述问题并提交给我们。',
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

$globe-radius: 11rem;

.section_wraps {
  height: 90vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

}

.top_info {
  height: 1rem;
  width: 80vw;
  font-size: 2.5rem;
  margin-top: 5vh;
  padding-left: 0.2rem;
  position: relative;
  .info_title {
    font-size: 1rem;
    color: #ffffff;
    background: #ffffff11;
    backdrop-filter: blur(3px);
    padding: 0.5rem 0;
    text-align: center;
    border-radius: 1rem;
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    span {
      background: #ffffff11;
      padding: 2px;
      display: inline-block;
      width: 1.5rem;
      height: 1.5rem;
      text-align: center;
      border-radius: 50%;
      background: #52a8ff44;
    }
    // width: fit-content
  }
  .info_img {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    .info_img_content {
      width: 80vw;
      // width * 0.74
      height: 59vw;
    }

  }
  .info_border {
    position: absolute;
    top: 0;
    left: 0;
    width: $globe-radius / 2;
    height: $globe-radius;
    border-radius: 0 $globe-radius/2 $globe-radius/2 0;
    background: 
      linear-gradient(120deg, #ffffffff 0%, #ffff99ff 10%, #ffff9900 40%),
      linear-gradient(217deg, #99ffdd99, #99ccff00 60.71%),
      linear-gradient(336deg, #007aff66, #007aff00 30.71%);
  }
  .info_content {
    position: absolute;
    top: 65vw;
    width: 70vw;
    left: 50%;
    transform: translateX(-50%);
    .top_line {
      margin-top: 0.8rem;

    }
    .top_line_notes_line1 {
      margin-top: 0.5rem;
    }
    .top_line_notes {
      margin-top: 0.3rem;
      font-size: 0.5rem;
      letter-spacing: 0.1rem;
      // padding: 0 0.8rem;
      line-height: 0.7rem;
      color: #ffffff99;
    }
  }
}

.mid_buttons {
  background: #ffffff11;
  backdrop-filter: blur(3px);
  padding: 20px;
  border-radius: 1rem;

  .buttons_line {
    display: flex;
    justify-content: space-between;
    width: 70vw;
    margin: 10px 0;
  }

  .buttons_new_wrapper {
    width: 70vw;
    .buttons_new_wrapper_inner {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    .buttons_new_wrapper_inner_sub {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      width: 100%;
    }
    .button_new_item {
      display: flex;
      flex-direction: column;
      align-items: center;
      .button_new_icon {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #52a8ff44;
        .button_new_icon_img {
          width: 55%;
          height: 55%;
          opacity: .8;
        }
      }
      // .button_compass_new {
      //   background: #52a8ff44;
      // }
      // .button_footprint_new {
      //   background: #52ff4444;
      // }
      // .button_travel_new {
      //   background: #ffa85244;
      // }
      .button_new_text {
        font-size: 0.8rem;
        color: #ffffff;
        max-width: 16vw;
        text-align: center;
        white-space: nowrap;
        display: none; // remove if ui is decided
      }
      .button_minor {
        transform: scale(0.8);
      }
    }
  }

  .button_general {
    text-align: center;
    border-radius: 2rem;
    color: #fff;
    padding: 0.5rem 0;
    font-size: 1rem;
    font-weight: bold;
    box-shadow: 0 0 25px #ffffff33 inset;
    display: flex;
    justify-content: center;
    align-items: center;
    .button_general_icon {
      width: 1rem;
      height: 1rem;
      margin: 0 5px;
    }
  }

  .button_start {
    width: 100%;
    padding: 0.8rem 0;
    // background: #52a8ff44;
  }

  .button_train {
    width: 60%;
    // background: #52ffff44;
  }

  .button_rank {
    width: 30%;
    // background: #52ffa844;
  }
}



.btm_infos {
  height: 2rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 2vh;
  .btm_itm {
    font-size: .8rem;
    padding: 0.2rem 1rem;
    opacity: .7;
    // background: #ffffff44;
  }

}

</style>