<template>
  <view class="page_wrapper">
    <view class="select_info">
      <view class="select_title">选择世界</view>
      <view class="select_world">{{currentWorld}}</view>
    </view>
    <scroll-view class="select_wrap" scroll-y="true" >
      <world-item
        class="select_item"
        text="世界城市"
        kilometer="1244"
      />
      <world-item
        class="select_item"
        text="世界城市"
        kilometer="1244"
      />
      <world-item
        class="select_item"
        text="世界城市"
        kilometer="1244"
      />
      <world-item
        class="select_item"
        text="世界城市"
        kilometer="1244"
      />
      <world-item
        class="select_item"
        text="世界城市"
        kilometer="1244"
      />
      <world-item
        class="select_item"
        text="世界城市"
        kilometer="1244"
      />
    </scroll-view>
    <view class="select_confirm">
      <view class="select_confirm_btn select_confirm_cancel" @click="backToHome">返回</view>
      <view class="select_confirm_btn select_confirm_confirm">开始</view>
    </view>
  </view>
</template>

<script lang="ts">
	import Vue from 'vue';
  import WorldItem from './components/world-item.vue';
	export default Vue.extend({
		data() {
			return {
				gameMode: '',
				currentWorld: '世界城市',
			}
		},
		onLoad() {

		},
		methods: {
      backToHome() {
				uni.navigateTo({
					url: '/pages/index/index'
				});
      }
		},
		components:{
			WorldItem
		}
	});
</script>

<style>
.page_wrapper {
  height: 100vh;
	background: #464646;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.select_info {
  height: 20%;
  text-align: center;
}
.select_wrap {
  height: 50%;
  margin: 5% 0;
  width: 90vw;
  display: flex;
	flex-direction: row;
}
.select_confirm {
  height: 20%;
  display: flex;
  justify-content: space-between;
	align-items: center;
	width: 60vw;
}
.select_title {
  font-size: 24px;
  line-height: 80px;
}
.select_confirm_confirm {
  width: 70%;
}
.select_confirm_cancel {
  width: 20%;
}
.select_confirm_btn {
	background: #333333;
  text-align: center;
	line-height: 40px;
	line-height: 40px;
}
</style>