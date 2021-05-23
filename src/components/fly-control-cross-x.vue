<template>
	<cover-view class="fly-control-cross-x">
		<cover-view class="operation_row row_1">
      <cover-view
        class="btn_item btn_northwest"
        @click="onClick('northwest')"
      >西北</cover-view>
      <cover-view
        class="btn_item btn_northeast" 
        @click="onClick('northeast')"
      >东北</cover-view>
		</cover-view>
		<cover-view class="operation_row row_1">
      <cover-view
        class="btn_item btn_southwest"
        @click="onClick('southwest')"
      >西南</cover-view>
      <cover-view
        class="btn_item btn_southeast" 
        @click="onClick('southeast')"
      >东南</cover-view>
		</cover-view>
	</cover-view>
</template>

<script>
	/**
	 * fly-control-cross-t
	 * @description 用于操纵飞机飞行方向的控制面板
	 * @event {Function} click 点击触发事件
	 */
	export default {
		name: 'FlyControlCrossX',
		props: {
		},
		data() {
			return {
				
			}
		},
		methods: {
			onClick(direction) {
        console.log('emitted button', direction)
				this.$emit('clickedOneDirection', direction)
			}
		}
	}
</script>

<style scoped lang="scss">

.fly-control-cross-x {
	width: 70vw;
	height: 20vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.operation_row {
		display: flex;
		width: 100%;
	}
	.row_1 {
		justify-content: space-between;
	}
	.row_2 {
		justify-content: space-between;
	}
	.btn_item {
		width: 5rem;
		height: 2rem;
		border-radius: 1rem;
		background: $dark-mode-btn;
		// margin: auto;
		text-align: center;
		line-height: 2rem;
	}
}
</style>