<template>
<view class="ufo_wrapper">
	<view >place holder</view>
  <view class="ufo_item">
    <view class="animated bounce">u</view>
  </view>
	<view class="city_item">
		<view class="animated_city" :class="{
			fadeInRight: anmtCtrl.fadeInRight,
			fadeOutRight: anmtCtrl.fadeOutRight,
			fadeInLeft: anmtCtrl.fadeInLeft,
			fadeOutLeft: anmtCtrl.fadeOutLeft,
			fadeInDown: anmtCtrl.fadeInDown,
			fadeOutDown: anmtCtrl.fadeOutDown,
			fadeInUp: anmtCtrl.fadeInUp,
			fadeOutUp: anmtCtrl.fadeOutUp,
			hided: anmtCtrl.hideCity,
		}">
			<view class="animated_city_icon">c</view>
			<view class="animated_city_text">{{currentCity.name}}</view>
		</view>
	</view>
</view>
</template>

<script>
	/**
	 * FlyingUfoShowcase 首页展示ufo飞来飞去的动画画布组件
	 * @description 首页展示ufo飞来飞去的动画画布组件
	 */
	import { directionMapNWSE } from '@/utils/common';
	export default {
		name: 'FlyUfoShowcase',
		props: {},
		data() {
			return {
				cityEntering: false,
				cityLeaving: false,
				timeoutID: 0,
				anmtCtrl: {
					fadeInRight: false,
					fadeOutRight: false,
					fadeInLeft: false,
					fadeOutLeft: false,
					fadeInDown: false,
					fadeOutDown: false,
					fadeInUp: false,
					fadeOutUp: false,
					hideCity: false,
				},
				currentCity: {
					name: 'Beijing',
					from: 'west'
				},
				leaveCss: '',
				enterCss: '',
				sampleCityList: [
					{
						name: 'Manila',
						from: 'north'
					},
					{
						name: 'Dodoma',
						from: 'east'
					},
					{
						name: 'Athens',
						from: 'south'
					},
				]
			}
		},
		created() {
			console.log('asdasd')
			this.startCityFlyLoop();
		},
		beforeDestroy() {
			console.log('timeoutID cleaared', this.timeoutID)
			clearTimeout(this.timeoutID);
		},
		computed: {
			cityAnimationClassName() {
				return '';
			}
		},
		methods: {
			executeAnimation(cssString) {
				const animation = cssString;
				this.anmtCtrl[animation] = true;
				setTimeout(() => {
					this.anmtCtrl[animation] = false;
				}, 1000)
			},
			swapCity() {
				const temp = this.currentCity;
				this.currentCity = { ...this.sampleCityList.slice(0, 1)[0] };
				this.sampleCityList = [ ...this.sampleCityList.slice(1, 4), temp ]
				this.sampleCityList = [ ...this.sampleCityList ]
			},
			updateCssType(city) {
				this.leaveCss = directionMapNWSE[city.from].leaveCss;
				this.enterCss = directionMapNWSE[city.from].enterCss;
			},
			flyToNext(direction) {
				this.executeAnimation(directionMapNWSE[direction].leaveCss);
				// 离开当前城市1010ms后再交换数据，同时隐藏
				setTimeout(() => {
					this.anmtCtrl.hideCity = true;
					this.swapCity();
				}, 1010);
				// 离开当前城市1100ms后再飞入新的城市
				setTimeout(() => {
					this.anmtCtrl.hideCity = true;
					this.executeAnimation(directionMapNWSE[direction].enterCss);
					this.anmtCtrl.hideCity = false;
				}, 1100);
			},
			startCityFlyLoop() {
				let direction = this.currentCity.from;
				this.flyToNext(direction);
				// 飞行执行用时2500，停留1000，周期3500
				const id = setInterval(() => {
					direction = this.currentCity.from;
					this.flyToNext(direction);
				}, 3000);
				this.timeoutID = id;
			}
		}
	}
</script>

<style scoped>
@import '../utils/customAnimate.wxss';

.ufo_wrapper {
	position: relative;
}
.ufo_item {
	position: absolute;
	top: 30vh;
	left: 50%;
	right: 50%;
	font-size: 2rem;
	margin-left: -1rem;
}
.city_item {
	position: absolute;
	top: 45vh;
	left: 50%;
	right: 50%;
	font-size: 2rem;
	margin-left: -1rem;
}

.animated_city {
  animation-duration: 1s;
  animation-fill-mode: forwards;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.animated_city_text {
	font-size: .8rem;
}

.hided {
	opacity: 0;
}
</style>