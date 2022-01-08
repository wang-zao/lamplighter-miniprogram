<template>
  <cover-view
    v-show="visibility"
    class="abstract_wrapper"
    @click="changeAbstractVisibility"
  >
    <cover-view
      v-show="visibility"
      class="abstract_content"
      @click="changeAbstractVisibility"
    >{{abstract}}</cover-view>
  </cover-view>
</template>

<script>
  /**
   * @description 
   * @event {Function} click 
   */
  export default {
    name: 'AbstractModal',
    props: {
      abstract: {
        type: String,
        default: '',
      },
      visibility: {
        type: Boolean,
        default: false,
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

.abstract_wrapper {
  width: 90vw;
  height: 20vh;
  // background: red;
  border-radius: 2rem;
  background: $dark-mode-mask;
  padding: 5vw;
  overflow-y: scroll;

  .abstract_content {
    width: 80vw;
    // width: 100%;
    height: 100%;
    word-break: break-all;
    word-wrap:break-word;
    white-space:pre-line;
    overflow-y: scroll;
  }
}
  

</style>