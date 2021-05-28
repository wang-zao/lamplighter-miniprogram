<template>
	<cover-view class="plane_wrapper" >
    <cover-image
      class="ufo_item_body"
      src="../static/ufo_blue.png"
      mode="widthFix"
    />
    <cover-image
      class="ufo_item_light"
      src="../static/ufo_light.png"
      mode="heightFix"
      :class="{
        headEastTail: anmtCtrl.headEastTail,
        headWestTail: anmtCtrl.headWestTail,
        headSouthTail: anmtCtrl.headSouthTail,
        headNorthTail: anmtCtrl.headNorthTail,
      }"
    />
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
  width: 100%;
  height: 20vh;
  .ufo_item_light {
    height: 4rem;
    width: 3rem;
    animation-duration: 1.2s;
    z-index: 10;
  }
  .ufo_item_body {
    height: 2rem;
    width: 3rem;
    z-index: 15;
  }
}
</style>