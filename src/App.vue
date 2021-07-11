<script lang="ts">
    import Vue from 'vue';
    import store from '@/store/index.js'    
    export default Vue.extend({
        mpType: 'app',
        onLaunch() {
            this.initEnv()
            console.log('App Launch')
        },
        onShow() {
            console.log('App Show')
        },
        onHide() {
            console.log('App Hide')
        },
        methods: {
            initEnv() {
                const env = 'northenv-4gh0748xf50343cf'
                wx.cloud.init({
                    env,
                    traceUser: true
                });
                store.commit('updateEnv', env);
            },
        }
    });
</script>

<style>
    /*每个页面公共css */
</style>
