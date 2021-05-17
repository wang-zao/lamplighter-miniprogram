<template>
<view class="play_minute_wrapper">
  <view class="play_minute_content">
    <view class="content_panel mile_panel">mile_pannel</view>
    <view class="content_panel info_panel">info_pannel</view>
    <view class="content_panel ufo_pnnel">
			<!-- <fly-ufo-showcase /> -->
			<fly-ufo-responsive />
    </view>
    <view class="content_panel operation_panel">
      <fly-control-cross-t />
    </view>
  </view>
</view>
</template>

<script>
	import Vue from 'vue';
  import FlyUfoResponsive from '@/components/fly-ufo-responsive.vue';
  import FlyControlCrossT from '@/components/fly-control-cross-t.vue';
	export default Vue.extend({
		data() {
			return {
			}
		},
		onLoad() {

		},
		methods: {
		},
		components: {
			FlyUfoResponsive,
			FlyControlCrossT,
		},
	});
</script>

<style scoped lang="scss">

$general-paddng: 1rem;

.play_minute_content {
  .content_panel {
    width: 100%;
    position: fixed;
    display: flex;
  }
  .mile_panel {
    top: 0;
    justify-content: left;
  }
  .info_panel {
    top: 0;
    justify-content: center;
  }
  .ufo_pnnel {
    top: 2rem;
    justify-content: center;
    align-items: center;
  }
  .operation_panel {
    bottom: 0;
    justify-content: center;
  }
}

</style>