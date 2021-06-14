<template>
	<view
		class="world_item_wrapper"
		@click="onClickEmit()"
		:class="{
			world_item_wrapper_selected: selected,
		}"
	>
		<view class="world_item_content">
			<view class="world_item_icon">⛰</view>
			<view class="world_item_title">{{text}}</view>
			<view class="world_item_length">{{locked ? '-' : `${kilometer}km`}}</view>
		</view>
		<view v-if="locked" class="world_item_lock">
			<!-- <view class="lock_icon">🔐</view> -->
			<view class="lock_score">{{unlockMinScore}}🔓</view>
		</view>
	</view>
</template>

<script>
	/**
	 * world item 选择世界的世界单元
	 * @description 用于展示选择世界的世界单元
	 * @property {String} text 世界名称
	 * @property {String} kilometer 该世界里程
	 * @event {Function} click 点击触发事件
	 */
	export default {
		name: 'WorldItem',
		props: {
			text: {
				type: String,
				default: ''
			},
			selected: {
				type: Boolean,
				default: false
			},
			locked: {
				type: Boolean,
				default: false
			},
			unlockMinScore: {
				type: Number,
				default: -1,
			},
			kilometer: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
			}
		},
		methods: {
			onClickEmit(e) {
				if (this.locked) {
					return;
				}
        console.log('emitted onClickEmit', e)
				this.$emit('clicked')
			}
		}
	}
</script>


<style scoped lang="scss">
$commonBorderRadius: 15px;

.world_item_wrapper {
  // flex: 23vw;
	// min-width: 6rem;
	width: 26vw;
  height: 26vw;
  margin: 2vw;
  background: $general-bright-button-blue;
  border-radius: $commonBorderRadius;
  display: inline-block;
  text-align: center;
  text-justify: center;
	box-sizing: border-box;
	position: relative;
}
.world_item_wrapper_selected {
  border: 0.3rem solid;
	border-color: $general-bright-button-background;
}
.world_item_content {
	position: absolute;
	left: 0;
	right: 0;
  width: 100%;
  height: 100%;
  display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.world_item_length {
		font-size: .8rem;
	}
	.world_item_icon {
		font-size: 2rem;
	}
	.world_item_title {
		font-size: 1rem;
	}
}
.world_item_lock {
	position: absolute;
	left: 0;
	right: 0;
  width: 100%;
  height: 100%;
	background: $uni-bg-color-mask;
	color: #fff;
  border-radius: $commonBorderRadius;
  display: flex;
	flex-direction: column-reverse;
	align-items: center;
	// justify-content: right;
	.lock_icon {
		margin-top: 2vw;
		font-size: 2rem;
	}
	.lock_score {
		margin-bottom: 2vw;
	}
}
</style>