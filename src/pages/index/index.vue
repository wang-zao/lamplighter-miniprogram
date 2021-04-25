<template>
	<view class="content" >
		<view class="top_ufo">
			<view class="animate__animated animate__bounce">🛸</view>
		</view>
		<view class="mid_buttons">
			<view class="info_line_1 info_line">
				<view class="user">wangzao</view>
				<view class="string">的</view>
				<view class="game_name">东南西北</view>
			</view>
			<view class="info_line_2 info_line">
				<view class="type">限时模式</view>
				<view class="kilometer">1232km</view>
			</view>
			<view class="info_line_3 info_line">
				<view class="type">漫游模式</view>
				<view class="kilometer">12321km</view>
			</view>
			<view class="buttons_line_2 buttons_line">
				<view class="button_start button_general" @click="startGeneral">开始</view>
			</view>
			<view class="buttons_line_3 buttons_line">
				<view class="button_train button_general">漫游</view>
				<view class="button_rank button_general">排行</view>
			</view>
		</view>
		<view class="btm_infos">
			<view class="btm_report btm_itm">反馈</view>
			<view class="btm_support btm_itm">帮助</view>
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	export default Vue.extend({
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			startGeneral() {
				uni.navigateTo({
					url: '/pages/select-world/select-world'
				})
			},
			moveHandle() {}
		}
	});
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #464646;
	color: #6a6a6a;
	height: 100vh;
}

/* 
height: 
top_ufo: 50%;
5%
mid_buttons: 30%;
5%
btm_infos: 10%;
 */
.top_ufo {
	height: 50%;
	background: #333333;
}

.mid_buttons {
	height: 30%;
	margin: 5% 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}


.buttons_line {
	display: flex;
	justify-content: space-between;
	width: 60vw;
	line-height: 40px;
	margin: 10px 0;
}


.button_general {
	background: #111111;
	text-align: center;
}

.button_start {
	width: 100%;
}

.button_train {
	width: 60%;
}

.button_rank {
	width: 30%;
}

.btm_infos {
	height: 10%;
	position: fixed;
	right: 50px;
	bottom: 0;
	display: flex;
	justify-content: left;
	flex-direction: row-reverse;
	width: 70%;
	font-size: 14px;
}

.btm_itm {
	margin-left: 20px;
}

.info_line {
	display: flex;
	justify-content: space-between;
	width: 60vw;
	font-size: .8rem;
}
.info_line_1 {
	border-bottom: 2px solid #6a6a6a;
	line-height: 1.5rem;
}
</style>
