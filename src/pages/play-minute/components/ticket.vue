<template>
  <view
    class="ticket_wrapper" 
    :class="{ ticket_wrapper_abstracted: showAbstract }"
    :style="{
      background: CITY_COLOR_HASHMAP[ cityInfo.id % 10],
    }"
    @click="changeAbstractVisibility"
  >
    <view class="ticket_reminder" @click="changeAbstractVisibility">{{reminder}}</view>
    <view class="ticket_placename" @click="changeAbstractVisibility">
      {{ cityInfo.name_chn || '-' }}
    </view>
    <!-- <view v-if="showAbstract" class="ticket_abstract">
      {{ cityInfo.abs_chn || '-' }}
    </view> -->
  </view>
</template>

<script>
  /**
   * @description 
   * @event {Function} click 
   */
import { CITY_COLOR_HASHMAP } from '@/utils/constants';
import Vue from 'vue';

export default Vue.extend({
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
      showAbstract: {
        type: Boolean,
        default: false,
      },
      anmtCtrl: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        CITY_COLOR_HASHMAP: CITY_COLOR_HASHMAP,
      }
    },
    computed: {
    },
    created() {
    },
    methods: {
      changeAbstractVisibility() {
        this.$emit('changeAbstractVisibility', this.cityInfo)
      },
    }
})
</script>

<style scoped lang="scss">

$ticket-max-height: 15vh;

.ticket_wrapper_abstracted {
  // height: 20vh;
  // width: 50vw;
  height: max-content;
  width: max-content;
  overflow: hidden;
  text-overflow:ellipsis;
  transition: max-height ease-out 0.2s; 
}
.ticket_wrapper {
  background: $general-bright-button-blue;
  transition: max-height ease-out 0.2s; 
  border-radius: 1rem;
  padding: 1rem;
  max-height: $ticket-max-height;
  max-width: 40vw;
  transition: ease .2s;
  color: transparent;
  .ticket_reminder {
    font-size: 1rem;
    color: #fff;
    margin-bottom: 10rpx;
  }
  .ticket_placename {
    font-size: 1.4rem;
    color: #fff;
    margin-bottom: 10rpx;
  }
  .ticket_abstract {
    // transition: max-height ease-out 0.2s; 
    max-height: 3rem;
    font-size: .7rem;
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-line;
    color: #fff;
    line-height: 1.6;
    overflow: scroll;
    white-space: wrap;
  }
}

</style>