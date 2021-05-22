<template>
	<cover-view class="fly-control-cross-t">
		<cover-view
			class="btn_item btn_northwest"
			@click="onClick('northwest')"
		>西北</cover-view>
		<cover-view
			class="btn_item btn_northeast" 
			@click="onClick('northeast')"
		>东北</cover-view>
		<cover-view
			class="btn_item btn_southwest"
			@click="onClick('southwest')"
		>西南</cover-view>
		<cover-view
			class="btn_item btn_southeast" 
			@click="onClick('southeast')"
		>东南</cover-view>
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
				this.$emit('clickedOneDirection', direction)
			}
		}
	}
</script>

<style scoped lang="scss">

.fly-control-cross-t {
	margin-bottom: 10rem;
	position: fixed;
	width: 100%;
	.btn_item {
		position: fixed;
		width: 5rem;
		height: 2rem;
		border-radius: 1rem;
		background: $dark-mode-btn;
		margin: auto;
		text-align: center;
		line-height: 2rem;
	}
	.btn_northwest {
		top: -3rem;
		left: 3rem;
	}
	.btn_northeast {
		top: -3rem;
		right: 3rem;
	}
	.btn_southwest {
    top: 3rem;
		left: 3rem;
	}
	.btn_southeast {
    top: 3rem;
		right: 3rem;
	}
}
</style>