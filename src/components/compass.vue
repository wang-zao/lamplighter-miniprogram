<template>
  <view class="compass_wrapper"
    @touchstart="startRotating"
    @touchend="endRotating"
  >
    <view class="compass_body_wrapper">
      <view class="compass_item compass_plate">
        <image
          class="compass_background"
          src="../static/compass.png"
          mode="heightFix" />
      </view>
      <view class="compass_item compass_aircraft"
      >
        <image
          id="airplane"
          class="airplane_background"
          :class="{
            airplane_paused: pausingRotation,
            airplane_rotating: !pausingRotation,
          }"
          src="../static/airplane.png"
          mode="heightFix"
        />
      </view>
      <view class="compass_item compass_text">
        <view class="text_degree">{{currentDegree}}°</view>
        <view class="text_degree">{{calc_next_direction_chn(currentDegree)}}</view>
      </view>
      <!-- <view class="compass_item compass_needle">
        <view class="needle_right"></view>
      </view> -->
    </view>
  </view>
</template>

<script>
  /**
   * @description 
   * @event {Function} click 
   */
  import {
    getRotateDegFromMatrix,
    calc_next_direction_chn
  } from '@/utils/common';

  export default {
    name: 'Compass',
    props: {
      // anyprops: {
      //   type: String,
      //   default: '',
      // },
    },
    data() {
      return {
        currentDegree: 0,
        pausingRotation: true,
        calc_next_direction_chn: calc_next_direction_chn,
      }
    },
    mounted() {
      this.init();
    },
    computed: {
      
    },
    methods: {
      init() {
      },
      startRotating() {
        this.pausingRotation = false;
      },
      endRotating() {
        this.pausingRotation = true;
        let theNode = uni
          .createSelectorQuery()
          .in(this)
          .select("#airplane")
        theNode.fields({
          computedStyle: ['transform']
        },(data)=>{
          this.currentDegree = getRotateDegFromMatrix(data.transform)
          // console.log('currentDegree set===', this.currentDegree)
          this.$emit('clickedOneDirection', this.currentDegree);
        }).exec()
      }
    }
  }
</script>

<style scoped lang="scss">

// maxheight of this part: 20vw;
$compass-radius: 20vw;
$aircraft-radius: 10vw;
$needle-radius: 4vw;

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform:rotate(360deg); }
}

.compass_wrapper {
  color: #fff;
  width: 70vw;
  height: 100px;
  display: flex;
  justify-content: center;
}

.compass_body_wrapper {
  position: relative;
  .compass_item {
    position: absolute;
    text-align: center;
  }
  .compass_plate {
    top: 0;
    left: -1 * $compass-radius;
    width: 2 * $compass-radius;
    height: 2 * $compass-radius;
    border: solid 2px #ffffffaa;
    border-radius: $compass-radius;
    opacity: .6;
    .compass_background {
      width: 2 * $compass-radius;
      height: 2 * $compass-radius;

    }
  }
  .compass_aircraft {
    top: $compass-radius - $aircraft-radius;
    left: -$aircraft-radius;
    width: 2 * $aircraft-radius;
    height: 2 * $aircraft-radius;
    border: solid 2px #ffffff;
    border-radius: $aircraft-radius;
    background: #ffffff44;
    .airplane_background {
      width: 2 * $aircraft-radius;
      height: 2 * $aircraft-radius;
      animation: rotate 2s infinite linear;
      animation-play-state: paused;
    }
    .airplane_paused {
      animation-play-state: paused;
    }
    .airplane_rotating {
      animation-play-state: running;
    }
  }
  .compass_text {
    color: #fff;
    top: $compass-radius - 5vw;
    left: -35vw;
    text-align: left;
    width: 30vw;
    height: 10vw;

  }
  .compass_needle {
    top: $compass-radius - $aircraft-radius - 2 * $needle-radius;
    left: -1 * $needle-radius;
    .needle_right {
      border-left: $needle-radius solid transparent;
      border-right: $needle-radius solid transparent;
      border-top: $needle-radius solid transparent;
      border-bottom: $needle-radius solid #fff;

    }
  }
}

</style>