<template>
	<cover-view class="fly-control-cross-t">
		<cover-view
			class="btn_item btn_north"
			@click="onClick('north')"
		>北</cover-view>
		<cover-view
			class="btn_item btn_west" 
			@click="onClick('west')"
		>西</cover-view>
		<cover-view
			class="btn_item btn_east"
			@click="onClick('east')"
		>东</cover-view>
		<cover-view
			class="btn_item btn_south" 
			@click="onClick('south')"
		>南</cover-view>
	</cover-view>
</template>

<script>
	/**
	 * fly-control-cross-t
	 * @description 用于操纵飞机飞行方向的控制面板
	 * @event {Function} click 点击触发事件
	 */
	export default {
		name: 'FlyControlCrossT',
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
	.btn_north {
		top: -3rem;
		left: 0;
		right: 0;
	}
	.btn_west {
		left: 1rem;
	}
	.btn_east {
		right: 1rem;
	}
	.btn_south {
		top: 3rem;
		left: 0;
		right: 0;
	}
}
</style>