<template>
	<cover-view class="ticket_wrapper" >
    <cover-view>{{cityInfo.city_ascii}}</cover-view>
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
      cityInfo: {
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

.ticket_wrapper {
  display: flex;
  background: $general-bright-button-background;
  border-radius: 1rem;
  justify-content: space-between;
  padding: 1rem;
}

</style>