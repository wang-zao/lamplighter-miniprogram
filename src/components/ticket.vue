;'
?'<template>
	<cover-view class="ticket_wrapper" @click="changeAbstractVisibility">
    <cover-view class="ticket_reminder" @click="changeAbstractVisibility">{{reminder}}</cover-view>
    <cover-view class="ticket_placename" @click="changeAbstractVisibility">{{cityInfo.point_name}}</cover-view>
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
      reminder: {
        type: String,
        default: '',
      },
		},
		data() {
			return {
			}
		},
		created() {
		},
		methods: {
			changeAbstractVisibility() {
				this.$emit('changeAbstractVisibility', this.cityInfo)
			}
		}
	}
</script>

<style scoped lang="scss">

.ticket_wrapper {
  background: $general-bright-button-background;
  background: $general-bright-button-blue;
  border-radius: 1rem;
  padding: 1rem;
  .ticket_reminder {
    font-size: 1rem;
  }
  .ticket_placename {
    font-size: 1.4rem;
  }
}

</style>