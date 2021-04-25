<template>
<view class="world_item_wrapper">
  <view class="world_item_content">
    <view class="world_item_icon">⛰</view>
    <view class="world_item_title">{{text}}</view>
    <view class="world_item_length">{{kilometer}}km</view>
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
			kilometer: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
			}
		},
		methods: {
			_onClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style scoped>
.world_item_wrapper {
  width: 40vw;
  height: 40vw;
  margin: 2.5vw;
  background: #666666;
  border-radius: 15px;
  display: inline-block;
  text-align: center;
  text-justify: center;
}
.world_item_content {
  width: 100%;
  height: 100%;
  display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.world_item_length {
  font-size: .8rem;
}
.world_item_icon {
  font-size: 2rem;
}
.world_item_title {
  font-size: 1rem;

}
</style>