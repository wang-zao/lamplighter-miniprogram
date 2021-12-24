<template>
  <view class="page_wrapper">
    <view class="select_info">
      <view class="select_title">选择世界</view>
      <view class="select_world">我的总里程：{{myTotalScore}}</view>
    </view>
    <scroll-view class="select_wrap" scroll-y="true" >
      <view
        v-for="theme, index in themes_list"
        :key="index"
        class="select_theme_group"
      >
        <view class="theme_title">
          <view class="theme_title_chn">
            {{ theme.theme_chn }}
          </view>
          <view class="theme_title_description">
            {{ theme.theme_description }}
          </view>
        </view>
        <view class="theme_child_games">
          <world-item
            v-for="game in theme.theme_games"
            :key="game._id"
            class="select_item"
            :text="game.game_chn"
            :selected="game.game_id === selectedGameId"
            :locked="myTotalScore < game.unlock_min_score"
            :unlockMinScore="game.unlock_min_score"
            kilometer="1244"
            @clicked="selectGame(game)"
          />
        </view>

      </view>
    </scroll-view>
    <view class="select_confirm">
      <view class="select_confirm_btn select_confirm_cancel" @click="backToHome">返回</view>
      <view class="select_confirm_btn select_confirm_confirm" @click="startPlayingGeneral">开始</view>
    </view>
  </view>
</template>

<script lang="ts">
  /// <reference path="../../api/index.d.ts" />
	import Vue from 'vue';
  import store from '@/store/index.js'    
	import API from '@/api/index.ts';
  import WorldItem from './components/world-item.vue';
    // @ts-ignore
  import { ThemeModal } from '../../api/index.js';
	export default Vue.extend({
		data() {
			return {
				gameMode: '',
				currentWorld: '世界城市',
				myTotalScore: 23,
        themes_list: [],
        selectedGameId: 'game_001',
			}
		},
		onLoad() {
      this.getAllThemes();
		},
		methods: {
      backToHome() {
				uni.navigateTo({
					url: '/pages/index/index'
				});
      },
			startPlayingGeneral() {
        
        store.commit('updateSelectedGameId', this.selectedGameId);
				uni.navigateTo({
					url: '/pages/play-minute/play-minute'
				})
			},
      async getAllThemes() {
        // const { data } = await ThemeModal.getAllThemes();
				const data = await API.getAllCategories();
        // const data = await ThemeModal.getAllThemes();
        console.log('data categories', data);
        this.alignGameWithTheme(data);
      },
      alignGameWithTheme(data: any) {
        data.forEach((i: GameCategory) => {
          // const {
          //   game_chn,
          //   game_icon_url: '',
          //   game_id: '',
          //   game_status,
          //   id,
          //   poi_count,
          //   theme_chn,
          //   theme_description,
          //   theme_id,
          //   unlock_min_score,
          //   _id,
          // } = i;
          const gameInfo = {
            game_chn: i.category_chn,
            game_icon_url: '',
            game_id: i.level_id,
            disabled: false,
            id: i.id,
            unlock_min_score: i.unlock_score,
            _id: i.id,
          };
          const themeInfo = {
            poi_count: 4,
            theme_chn: '选择关卡',
            theme_description: '',
            theme_id: 1,
            theme_games: [gameInfo],
          };
          const existThemeIdx = this.themes_list.findIndex((i: any) => {
            return i.theme_id === themeInfo.theme_id;
          });
          if (existThemeIdx >= 0) {
            (this.themes_list[existThemeIdx] as any).theme_games.push(gameInfo);
          } else if (!existThemeIdx || existThemeIdx < 0) {
            (this.themes_list as any).push(themeInfo);
          }
        });
      },
      selectGame(game: GameInfoAligned) {
        console.log('selected', game);
        this.selectedGameId = game.game_id;
      },
		},
		components:{
			WorldItem
		}
	});
</script>

<style scoped lang="scss">
.page_wrapper {
  height: 100vh;
	background: $dark-mode-bg;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.select_info {
  height: 10%;
  text-align: center;
  padding-top: 5rem;
  .select_title {
    font-size: 24px;
    line-height: 40px;
  }
}
.select_wrap {
  height: 70%;
  margin: 5% 0;
  width: 90vw;
  display: flex;
	flex-direction: row;
  justify-content: space-between;
	align-items: center;
  flex-wrap: wrap;
  overflow-y: scroll;
  .theme_title {
    padding: 1rem 1vw 0 1vw;
    text-align: left;
    .theme_title_chn {
      font-size: 1.2rem;
    }
  }
}
.select_confirm {
  height: 20%;
  display: flex;
  justify-content: space-between;
	align-items: center;
	width: 60vw;
}
.select_confirm_confirm {
  width: 70%;
}
.select_confirm_cancel {
  width: 20%;
}
.select_confirm_btn {
	background: $general-bright-button-background;
  text-align: center;
	line-height: 40px;
	line-height: 40px;
}
</style>