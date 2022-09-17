<template>
  <view
    class="detail_wrapper"
  >
    <view class="detail_mask"
      @click="closeCityDetail"
    ></view>
    <view class="detail_body">
      <view class="detail_body_inner">
        <view class="detail_image_wrapper">
          <image
            class="detail_image"
            :id="`city_image_${city.id}`"
            @load="e => onImgLoad(e)"
            :style="imgStyle"
            :class="{ 'fade_in_pic': fadeInPic }"
            :src="`cloud://northenv-4gh0748xf50343cf.6e6f-northenv-4gh0748xf50343cf-1304769767/city_images/recast_300/pic_${city.id}_resize_300.jpg`"
          />
          <view class="detail_image_cover"></view>
          <view class="detail_image_nothing"></view>
        </view>
        <view class="detail_text_wrapper">
          <view class="detail_text_wrapper_scroll">
            <view class="detail_title">
              <view class="detail_title_text">
                {{ city.name_chn }}
              </view>
              <view class="detail_title_english">
                {{ city.name }}
              </view>
            </view>
            <view class="detail_description">
              <view class="detail_description_text">
                {{ city.abs_chn }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import Vue from 'vue';
export default Vue.extend({
  name: 'cityDetail',
  props: {
    city: {
      type: Object,
      default: '',
    },
  },
  data() {
    return {
      heightToWidthRatio: -1,
      fadeInPic: false,
    }
  },
  created() {
  },
  computed: {
    imgStyle() {
      if (!this.heightToWidthRatio) {
        return '';
      }
      return `width: 80vw; height: ${80 * this.heightToWidthRatio}vw;`;
    }
  },
  methods: {
    init() {
    },
    closeCityDetail() {
      console.log('closing')
      this.$emit('closeCityDetail');
    },
    onImgLoad(e) {
      console.log('img loaded!', e)
      try {
        const { detail: { width, height } } = e;
        this.heightToWidthRatio = height / width;
        this.fadeInPic = true;
      } catch(e) {
        console.log('initialize pics ratio error!', e)
      }
    },
  }
})
</script>

<style scoped lang="scss">

$visible-image-height: 30vh;
$word-top-height: 20vh;
$pop-up-background: #041536;

@keyframes FadeInPic {
  from { opacity: 0; }
  to { opacity: 0.6; }
}

.detail_mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  background: #00000080;
}
.detail_body {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 60vh;
  z-index: 11;
  background: $pop-up-background;
  border: 2px solid #ffffff;
  border-radius: 2rem;
  overflow-x: hidden;
  overflow-y: hidden;
  box-sizing: border-box;
  .detail_body_inner {
    position: relative;
    width: 100%;
    height: 100%;
    .detail_image_wrapper {
      overflow: hidden;
      width: 100%;
      height: 100%;
      .detail_image {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        min-height: $visible-image-height;
        object-fit: cover;
        opacity: 0;
      }
      .fade_in_pic {
        animation: FadeInPic .6s forwards ease-in-out;
      }
      .detail_image_cover {
        position: absolute;
        left: 0;
        top: $visible-image-height / 2;
        width: 100%;
        height: $visible-image-height / 2;
        background: linear-gradient(0deg, #041536 10%, #04153600 70%)
      }
      .detail_image_nothing {
        position: absolute;
        left: 0;
        top: $visible-image-height;
        width: 100%;
        height: 60vh;
        background: #041536;
      }
    }
    .detail_text_wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      .detail_text_wrapper_scroll {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: $word-top-height;
      }
    }
    .detail_title {
      text-align: left;
      width: 100%;
      .detail_title_text {
        padding: 10px 1rem 0;
        font-size: 2rem;
        font-weight: bold;
      }
      .detail_title_english {
        padding: 10px 1rem 0;
        font-size: 1.1rem;
        font-weight: bold;
      }
    }
    .detail_description {
      padding: 10px 1rem;
      font-size: .7rem;
      text-align: justify;
    }
  }
}

</style>