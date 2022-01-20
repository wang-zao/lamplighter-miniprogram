<template>
  <cover-view class="section_wraps">
    <cover-view class="top_info">
      <cover-view class="top_line top_line_1">星球</cover-view>
      <cover-view class="top_line top_line_2">点灯人</cover-view>
      
    </cover-view>
    <cover-view class="bottom_info">
      <cover-view class="mid_buttons">
        <!-- TODO: 用户信息部分等用户登录功能修好后放出 -->
        <cover-view class="info_line_1 info_line"  v-if="false">
          <cover-view class="user">wangzao</cover-view>
          <cover-view class="string">的</cover-view>
          <cover-view class="game_name">东南西北</cover-view>
        </cover-view>
        <cover-view class="info_line_2 info_line"  v-if="false">
          <cover-view class="type">里程数</cover-view>
          <cover-view class="kilometer">1232km</cover-view>
        </cover-view>
        <cover-view class="buttons_line_2 buttons_line">
          <cover-view class="button_start button_general" @click="startGeneral">开始</cover-view>
        </cover-view>
        <cover-view class="buttons_line_3 buttons_line">
          <cover-view class="button_train button_general">漫游</cover-view>
          <cover-view class="button_rank button_general"
            @click="goToRanking"
          >排行</cover-view>
        </cover-view>
      </cover-view>
      <cover-view class="btm_infos">
        <cover-view class="btm_report btm_itm">反馈</cover-view>
        <cover-view class="btm_support btm_itm">帮助</cover-view>
        <cover-view class="btm_support btm_itm" @click="getUserProfilePermission">登录</cover-view>
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

  export default {
    name: 'HomeButtons',
    data() {
      return {
        openid: '',
      }
    },
    created() {
      // this.getUserProfile();
      this.getSystemInfo();
      this.autoGetUserInfo();
    },
    methods: {
      init() {
      },
      getSystemInfo() {
        wx.getSystemInfo({
          success: (res) => {
            store.commit('updateSystemInfo', res);
          },
        });
      },
      startGeneral() {
        store.commit('updateSelectedGameId', 1);
        this.$emit('routeChange', 'play-minute');
      },
      goToRanking() {
        this.$emit('routeChange', 'ranking');
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
        const res = await uni.getUserProfile({
          desc: '使用微信名称和头像吗？'
        });
        const { userInfo } = res[1];
        await UserModel.updateInfo(userInfo);
        const profile = await UserModel.getExistingUserProfile(this.openid);
        store.commit('updateUserProfile', profile);
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
  flex-direction: column;
  align-items: top;
  justify-content: center;
  font-size: 2.5rem;
  margin-top: 5vh;
  padding-left: 0.2rem;
  .top_line {
    border-left: 3px solid #fff;
    padding-left: 0.8rem;
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
  justify-content: space-between;
  align-items: center;
  margin-top: 5vh;
  .btm_itm {
    font-size: .8rem;
    padding: 0.2rem 0.5rem;
    background: #ffffff44;
  }

}

</style>