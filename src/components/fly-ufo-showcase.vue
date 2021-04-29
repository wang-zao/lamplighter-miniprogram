<template>
<view class="ufo_wrapper">
	<view >place holder</view>
	<view class="dialog_wrap dialog_right shake" :class="{
		dialog_shaking: anmtCtrl.isDialogShaking,
		dialog_pausing: anmtCtrl.isDialogPausing,
	}">
		<view class="dialog_subtitle">现在</view>
		<view class="dialog_title">
			<view class="dialog_title_current dialog_title_right" :class="{
				fadeOutDownSmall: anmtCtrl.isDialogTitleSwitchingRight
			}">向{{dataCtrl.dialoggedDirection}}飞！</view>
			<view class="dialog_title_next dialog_title_right" :class="{
				fadeInUpSmall: anmtCtrl.isDialogTitleSwitchingRight
			}">向{{dataCtrl.dialoggedDirectionNext}}飞！</view>
		</view>
	</view>
	<view class="dialog_wrap dialog_left shake" :class="{
		dialog_shaking: anmtCtrl.isDialogShaking,
		dialog_pausing: anmtCtrl.isDialogPausing,
	}">
		<view class="dialog_subtitle">到达了</view>
		<view class="dialog_title">
			<view class="dialog_title_current dialog_title_left" :class="{
				fadeOutDownSmall: anmtCtrl.isDialogTitleSwitching
			}">{{dataCtrl.dialoggedCity}}</view>
			<view class="dialog_title_next dialog_title_left" :class="{
				fadeInUpSmall: anmtCtrl.isDialogTitleSwitching
			}">{{dataCtrl.dialoggedCityNext}}</view>
		</view>
	</view>

  <view class="ufo_item">
    <view class="ufo_item_icon shake" :class="{
			dialog_shaking: anmtCtrl.isDialogShaking,
			dialog_pausing: anmtCtrl.isDialogPausing,
		}">u</view>
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
					isDialogShaking: false,
					isDialogPausing: true,
					isDialogTitleSwitching: false,
					isDialogTitleSwitchingRight: false,
				},
				currentCity: {
					name: '北京',
					next: 'south'
				},
				leaveCss: '',
				enterCss: '',
				timeCtrl: {
					fly: 600,
					period: 3000,
				},
				dataCtrl: {
					dialoggedCity: '北京',
					dialoggedDirection: '南',
					dialoggedCityNext: '北京',
					dialoggedDirectionNext: '南',
				},
				sampleCityList: [
					{
						name: '马尼拉',
						next: 'west'
					},
					{
						name: '阿尔及利亚的阿尔及尔',
						next: 'north'
					},
					{
						name: '雅典',
						next: 'east'
					},
				]
			}
		},
		created() {
			this.startCityFlyLoop();
		},
		beforeDestroy() {
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
				}, this.timeCtrl.fly)
			},
			swapCity() {
				const temp = this.currentCity;
				this.currentCity = { ...this.sampleCityList.slice(0, 1)[0] };
				this.sampleCityList = [ ...this.sampleCityList.slice(1, 4), temp ]
				this.sampleCityList = [ ...this.sampleCityList ]
			},
			updateCssType(city) {
				this.leaveCss = directionMapNWSE[city.next].leaveCss;
				this.enterCss = directionMapNWSE[city.next].enterCss;
			},
			updateDialogContext() {
				const nextDrct = directionMapNWSE[this.currentCity.next].chn;
				const nextCity = this.currentCity.name;
				this.dataCtrl.dialoggedCityNext = nextCity;
				this.anmtCtrl.isDialogTitleSwitching = true;
				setTimeout(() => {
					this.anmtCtrl.isDialogTitleSwitching = false;
					this.dataCtrl.dialoggedCity = nextCity;
				}, 300)
				setTimeout(() => {
					this.dataCtrl.dialoggedDirectionNext = nextDrct;
					this.anmtCtrl.isDialogTitleSwitchingRight = true;
				}, 300)
				setTimeout(() => {
					this.anmtCtrl.isDialogTitleSwitchingRight = false;
					this.dataCtrl.dialoggedDirection = nextDrct;
				}, 600)
			},
			changeDialogShakingStatus() {
				this.anmtCtrl.isDialogPausing = !this.anmtCtrl.isDialogPausing;
				this.anmtCtrl.isDialogShaking = !this.anmtCtrl.isDialogShaking;
			},
			flyToNext(direction) {
				this.changeDialogShakingStatus();
				this.executeAnimation(directionMapNWSE[direction].leaveCss);
				// 离开当前城市1000ms后再交换数据
				setTimeout(() => {
					this.swapCity();
				}, this.timeCtrl.fly);
				// 离开当前城市1000ms后就马上飞入新的城市
				setTimeout(() => {
					this.executeAnimation(directionMapNWSE[direction].enterCss);
				}, this.timeCtrl.fly);
				// 离开当前城市2000ms后就马上飞入新的城市
				setTimeout(() => {
					this.changeDialogShakingStatus();
					this.updateDialogContext();
				}, this.timeCtrl.fly * 2);
			},
			startCityFlyLoop() {
				let direction = this.currentCity.next;
				this.flyToNext(direction);
				// 飞行执行用时2500，停留1000，周期3500
				const id = setInterval(() => {
					direction = this.currentCity.next;
					this.flyToNext(direction);
				}, this.timeCtrl.period);
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
.dialog_wrap {
	position: absolute;
	background: #222222;
	padding: 0.8rem;
	min-width: 4rem;
	max-width: 4rem;
	height: 2.2rem;
	transition: .3s ease;
	animation-iteration-count: infinite;
}
.dialog_left {
	right: 60%;
	top: 15vh;
	transform: skewY(15deg) scaleX(0.9);
	border-radius: 2rem 2rem 0 2rem;
	text-align: right;
  animation-duration: .45s;
}
.dialog_right {
	left: 60%;
	top: 20vh;
	transform: skewY(-15deg) scaleX(0.9);
	border-radius: 2rem 2rem 2rem 0;
  animation-duration: .55s;
}
.dialog_subtitle {
	font-size: .6rem;
}
.dialog_title {
	position: relative;
	white-space: wrap;
}
.dialog_title_next {
	position: absolute;
	top: -1rem;
	left: 0;
	opacity: 0;
  animation-duration: .3s;
}
.dialog_title_current {
	position: absolute;
	top: 0;
  animation-duration: .3s;
}
.dialog_title_right {
	left: 0;
}
.dialog_title_left {
	right: 0;
}
.dialog_shaking {
	animation-play-state: running;
}
.dialog_pausing {
	animation-play-state: paused;
}
.ufo_item {
	position: absolute;
	top: 30vh;
	left: 50%;
	right: 50%;
	font-size: 2rem;
	margin-left: -0.5rem;
}
.ufo_item_icon {
	animation-iteration-count: infinite;
  animation-duration: .5s;
}
.city_item {
	position: absolute;
	top: 45vh;
	left: 50%;
	right: 50%;
	font-size: 2rem;
	margin-left: -0.5rem;
}

.animated_city {
  animation-duration: 600ms;
  animation-fill-mode: forwards;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.animated_city_text {
	font-size: .8rem;
	white-space: nowrap;
}

.hided {
	opacity: 0;
}


</style>