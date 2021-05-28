<template>
	<cover-view class="ticket_wrapper" >
    <cover-view class="ticket">
      <cover-view>{{currentCity.city_ascii}}</cover-view>
      <cover-view>=></cover-view>
      <cover-view
      >{{nextCity.city_ascii}}</cover-view>
	  </cover-view>
	</cover-view>
</template>

<script>
	/**
	 * @description 
	 * @event {Function} click 
	 */
	export default {
		name: 'Ticket',
		props: {
      currentCity: {
        type: Object,
        default: {},
      },
      nextCity: {
        type: Object,
        default: {},
      },
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


</style>