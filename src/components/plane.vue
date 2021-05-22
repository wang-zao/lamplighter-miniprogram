<template>
	<cover-view class="plane_wrapper" >
		it is a big plane !!!!!
	</cover-view>
</template>

<script>
	/**
	 * @description 
	 * @event {Function} click 
	 */
	export default {
		name: 'Plane',
		props: {
		},
		data() {
			return {
			}
		},
		created() {
		},
		methods: {
			onClick(direction) {
				// this.$emit('clickedOneDirection', direction)
			}
		}
	}
</script>

<style scoped lang="scss">

.plane_wrapper {
  position: fixed;
  top: 50vh;
  left: 0;
  right: 0;
}
</style>