<template>
<view class="ufo_wrapper" @click="hadleBackgroundClicked">
	<view class="ufo_wrapper_place_holder" >place holder</view>
	<view class="dialog_shake_outer_wrap dialog_shake_outer_wrap_right shake" @click.stop="{}">
		<view class="dialog_wrap dialog_right shake" :class="{
			dialog_shaking: anmtCtrl.isDialogShaking,
			dialog_pausing: anmtCtrl.isDialogPausing,
			dialog_expanding: anmtCtrl.rightAbstract,
			dialog_expanding_right: anmtCtrl.rightAbstract,
		}" @click="handleRightClicked">
			<view v-show="!this.anmtCtrl.rightAbstract" class="dialog_subtitle">飞往</view>
			<view v-show="!this.anmtCtrl.rightAbstract" class="dialog_title">
				<view class="dialog_title_current dialog_title_right" :class="{
					fadeOutDownSmall: anmtCtrl.isDialogTitleSwitchingRight
				}">{{dataCtrl.dialoggedCity}}</view>
				<view class="dialog_title_next dialog_title_right" :class="{
					fadeInUpSmall: anmtCtrl.isDialogTitleSwitchingRight
				}">{{dataCtrl.dialoggedCityNext}}</view>
			</view>
			<view v-show="this.anmtCtrl.rightAbstract" class="dialog_abstract">{{currentCity.abstract}}</view>
		</view>

	</view>
	<view class="dialog_shake_outer_wrap dialog_shake_outer_wrap_left shake" @click.stop="{}">
		<view class="dialog_wrap dialog_left  shake" :class="{
			dialog_shaking: anmtCtrl.isDialogShaking,
			dialog_pausing: anmtCtrl.isDialogPausing,
			dialog_expanding: anmtCtrl.leftAbstract,
			dialog_expanding_left: anmtCtrl.leftAbstract,
		}" @click="handleLeftClicked">
			<view  v-show="!this.anmtCtrl.leftAbstract" class="dialog_subtitle">到达了</view>
			<view  v-show="!this.anmtCtrl.leftAbstract" class="dialog_title">
				<view class="dialog_title_current dialog_title_left" :class="{
					fadeOutDownSmall: anmtCtrl.isDialogTitleSwitching
				}">{{dataCtrl.dialoggedCityCurrent}}</view>
				<view class="dialog_title_next dialog_title_left" :class="{
					fadeInUpSmall: anmtCtrl.isDialogTitleSwitching
				}">{{dataCtrl.dialoggedCityCurrentNew}}</view>
			</view>
			<view v-show="this.anmtCtrl.leftAbstract" class="dialog_abstract">{{sampleCityList[0].abstract}}</view>
		</view>
	</view>
	

  <view class="ufo_item">
    <view class="ufo_item_icon shake" :class="{
			dialog_shaking: anmtCtrl.isDialogShaking,
			dialog_pausing: anmtCtrl.isDialogPausing,
		}">
			<image
				class="ufo_item_light"
				src="../static/ufo_light_circle.png"
				mode="heightFix"
				:class="{
					headEastTail: anmtCtrl.headEastTail,
					headWestTail: anmtCtrl.headWestTail,
					headSouthTail: anmtCtrl.headSouthTail,
					headNorthTail: anmtCtrl.headNorthTail,
				}"
			/>
			<image
				class="ufo_item_body"
				src="../static/ufo_blue.png"
				mode="widthFix"
			/>
		</view>
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
	import { falseCityData } from '@/utils/data';
	export default {
		name: 'FlyUfoResponsive',
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
					headEastTail: false,
					headWestTail: false,
					headNorthTail: false,
					headSouthTail: false,
					leftAbstract: false,
					rightAbstract: false,
				},
				currentCity: {
					name: '北京',
					next: 'south',
					abstract: 'Kabul (Pashto: کابل‎， romanized: Kābəl; Dari: کابل‎， romanized: Kābol) is the capital and largest city of Afghanistan， located in the eastern section of the country. It is also a municipality， forming part of the greater Kabul Province， and divided into 22 districts. According to estimates in 2020， the population of Kabul is 4.222 million， which includes all the major ethnic groups of Afghanistan. Afghanistans only city with a population of over 1 million， Kabul serves as its political， cultural and economical center. Rapid urbanization has made Kabul the worlds 75th largest city.Kabul is located high up in a narrow valley between the Hindu Kush mountains， with an elevation of 1，790 metres (5，873 ft)',
				},
				leaveCss: '',
				enterCss: '',
				timeCtrl: {
					fly: 600,
					period: 3000,
				},
				dataCtrl: {
					dialoggedCity: '北京',
					dialoggedCityCurrent: '北京',
					dialoggedCityCurrentNew: '北京',
					dialoggedDirection: '南',
					dialoggedCityNext: '马尼拉',
					dialoggedDirectionNext: '南',
				},
				sampleCityList: [
					{
						name: '马尼拉',
						next: 'west',
						abstract: 'Kabul (Pashto: کابل‎， romanized: Kābəl; Dari: کابل‎， romanized: Kābol) is the capital and largest city of Afghanistan',
					},
					{
						name: '阿尔及尔',
						next: 'north',
						abstract: 'Kabul (Pashto: کابل‎， romanized: Kābəl; Dari: کابل‎， romanized: Kābol) is the capital and largest city of Afghanistan',
					},
					{
						name: '雅典',
						next: 'east',
						abstract: 'Kabul (Pashto: کابل‎， romanized: Kābəl; Dari: کابل‎， romanized: Kābol) is the capital and largest city of Afghanistan',
					},
				]
			}
		},
		created() {
      this.getNewCities();
			// this.startCityFlyLoop();
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
			executeAnimation(cssString, time) {
				const animation = cssString;
				this.anmtCtrl[animation] = true;
				setTimeout(() => {
					this.anmtCtrl[animation] = false;
				}, time)
			},
      getNewCities() {

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
				const currentCity = this.currentCity.name;
				const nextCity = this.sampleCityList[0].name;
				this.dataCtrl.dialoggedCityNext = nextCity;
				this.dataCtrl.dialoggedCityCurrentNew = currentCity;
				this.anmtCtrl.isDialogTitleSwitching = true;
				setTimeout(() => {
					this.anmtCtrl.isDialogTitleSwitching = false;
					this.dataCtrl.dialoggedCityCurrent = currentCity;
				}, 300)
				setTimeout(() => {
					this.dataCtrl.dialoggedDirectionNext = nextDrct;
					this.anmtCtrl.isDialogTitleSwitchingRight = true;
				}, 300)
				setTimeout(() => {
					this.anmtCtrl.isDialogTitleSwitchingRight = false;
					this.dataCtrl.dialoggedDirection = nextDrct;
					this.dataCtrl.dialoggedCity = nextCity;
				}, 600)
			},
			changeDialogShakingStatus() {
				this.anmtCtrl.isDialogPausing = !this.anmtCtrl.isDialogPausing;
				this.anmtCtrl.isDialogShaking = !this.anmtCtrl.isDialogShaking;
			},
			flyToNext(direction) {
				this.changeDialogShakingStatus();
				this.executeAnimation(directionMapNWSE[direction].leaveCss, this.timeCtrl.fly);
				this.executeAnimation(directionMapNWSE[direction].ufoLightCss, this.timeCtrl.fly * 2);
				// 离开当前城市1000ms后再交换数据
				setTimeout(() => {
					this.swapCity();
				}, this.timeCtrl.fly);
				// 离开当前城市1000ms后就马上飞入新的城市
				setTimeout(() => {
					this.executeAnimation(directionMapNWSE[direction].enterCss, this.timeCtrl.fly);
				}, this.timeCtrl.fly);
				// 离开当前城市2000ms后到达，更新城市信息
				setTimeout(() => {
					this.changeDialogShakingStatus();
					this.updateDialogContext();
				}, this.timeCtrl.fly * 2);
			},
			handleLeftClicked() {
				this.changeAbstractVisibility('left', !this.anmtCtrl.leftAbstract);
				if (this.anmtCtrl.leftAbstract) {
					this.changeAbstractVisibility('right', false);
				}
			},
			handleRightClicked() {
				this.changeAbstractVisibility('right', !this.anmtCtrl.rightAbstract);
				if (this.anmtCtrl.rightAbstract) {
					this.changeAbstractVisibility('left', false);
				}
			},
			hadleBackgroundClicked() {
				this.changeAbstractVisibility('left', false);
				this.changeAbstractVisibility('right', false);

			},
			changeAbstractVisibility(side, target) {
				switch (side) {
					case 'left':
						this.anmtCtrl.leftAbstract = target;
						break;
					case 'right':
						this.anmtCtrl.rightAbstract = target;
						break;
					default:
						break;
				}
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

<style scoped lang="scss">
@import '../utils/customAnimate.wxss';

.ufo_wrapper {
	position: relative;
	.ufo_wrapper_place_holder {
		color: transparent;
		user-select: none;
	}
}
.dialog_shake_outer_wrap {
	position: absolute;
	animation-play-state: running;
	animation-iteration-count: infinite;
	.dialog_wrap {
		background: #b8b8b8;
		padding: 0.8rem;
		width: 4rem;
		height: 2.2rem;
		transition: .3s ease;
		animation-iteration-count: infinite;
	}
	.dialog_left {
		transform: skewY(15deg) scaleX(0.9);
		border-radius: 2rem 2rem 0 2rem;
		text-align: right;
		animation-duration: .20s;
	}
	.dialog_right {
		transform: skewY(-15deg) scaleX(0.9);
		border-radius: 2rem 2rem 2rem 0;
		animation-duration: .15s;
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
		/* animation-duration: .55s; */
	}
	.dialog_pausing {
		animation-play-state: paused;
		/* animation-duration: 2s; */
	}
	.dialog_expanding {
		width: 7rem;
		height: 6rem;
		overflow: scroll;
	}
	.dialog_expanding_left {
		transform: skewY(15deg) scaleX(0.9) translateY(-5rem);
	}
	.dialog_expanding_right {
		transform: skewY(-15deg) scaleX(0.9) translateY(-5rem);
	}
	.dialog_abstract {
		font-size: 0.5rem;
	}
}
.dialog_shake_outer_wrap_right {
  animation-duration: 1.85s;
	top: 20vh;
	left: 60%;
}
.dialog_shake_outer_wrap_left {
  animation-duration: 2s;
	top: 15vh;
	right: 60%;
}
.ufo_item {
	position: absolute;
	top: 30vh;
	left: 50%;
	right: 50%;
	font-size: 2rem;
	margin-left: -1.5rem;
}
.ufo_item_light {
	position: absolute;
	height: 16rem;
	top: -6rem;
	left: -1.5rem;
	right: 0;
	margin: auto;
  animation-duration: 1.2s;
}
.ufo_item_body {
	width: 3rem;
}
.ufo_item_icon {
	position: relative;
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