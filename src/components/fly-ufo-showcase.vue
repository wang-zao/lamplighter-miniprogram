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
			fadeInBottom: anmtCtrl.fadeInBottom,
			fadeOutBottom: anmtCtrl.fadeOutBottom,
			fadeInTop: anmtCtrl.fadeInTop,
			fadeOutTop: anmtCtrl.fadeOutTop,
		}">
			<view class="animated_city_icon">c</view>
			<view class="animated_city_text">shanghai</view>
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
					fadeInBottom: false,
					fadeOutBottom: false,
					fadeInTop: false,
					fadeOutTop: false,
				},
				currentCity: {
					name: 'Beijing',
					next: 'south'
				},
				leaveCss: '',
				enterCss: '',
				sampleCityList: [
					{
						name: 'Manila',
						next: 'west'
					},
					{
						name: 'Dodoma',
						next: 'north'
					},
					{
						name: 'Athens',
						next: 'east'
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
				console.log('--------------swappiing')
				console.log('--------------swappiing')
				console.log('--------------swappiing')
				console.log('--------------swappiing')
				this.currentCity = { ...this.sampleCityList.slice(0, 1) };
				this.sampleCityList = [ ...this.sampleCityList.slice(1, 4), temp ]
				this.sampleCityList = [ ...this.sampleCityList ]
				console.log(this.currentCity)
				console.log(this.sampleCityList)
				// this.sampleCityList.push(temp)
			},
			updateCssType(city) {
				console.log('directionMapNWSE', directionMapNWSE)
				console.log('---------------ccity', city.name)
				console.log('city.next', city.next)
				console.log('directionMapNWSE[city.next]', directionMapNWSE[city.next])
				this.leaveCss = directionMapNWSE[city.next].leaveCss;
				this.enterCss = directionMapNWSE[city.next].enterCss;
			},
			startCityFlyLoop() {
				// console.log('directionMapNWSE',directionMapNWSE)
				console.log('undefiend1')
				this.updateCssType(this.currentCity);
				this.executeAnimation(this.leaveCss);
				setTimeout(() => {
					this.swapCity();
				}, 1000);
				const id = setInterval(() => {
					this.executeAnimation(this.enterCss);
					console.log('undefiend2')
					this.updateCssType(this.currentCity);
					setTimeout(() => {
						this.executeAnimation(this.leaveCss);
						setTimeout(() => {
							this.swapCity();
						}, 1000);
					}, 2000);
				}, 3000);
				console.log('iddddddd', id)
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

</style>