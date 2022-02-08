<template>
  <view class="earth_wrapper">
    <canvas
      type="webgl" id="webgl"
      :style="canvasStyle"
    >
    </canvas>
    <end-page
      :anmtCtrl="anmtCtrl"
      :judgeCtrl="judgeCtrl"
      v-if="anmtCtrl.gameEndPageVisible"
      class="canvas_cover_end_panel"
    />
    <guide-page
      v-if="currentRoute === 'play-minute' && anmtCtrl.gameGuidePageVisible"
      class="canvas_cover_guide_panel"
    />
    <compass
      v-if="currentRoute === 'play-minute' && !anmtCtrl.gameStartPageVisible && !anmtCtrl.gameEndPageVisible"
      class="canvas_cover_compass"
    />
    <event-agent
      v-if="currentRoute === 'play-minute' && !anmtCtrl.gameStartPageVisible && !anmtCtrl.gameEndPageVisible && !anmtCtrl.gameGuidePageVisible"
    />
  </view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import Vue from 'vue';
import store from '@/store/index.js';
// import { contry_json, ocean } from '@/utils/data';
import { get_flight_orbit_height, draw_line } from '@/utils/common';
import {
  PICTURES_URL,
  LIGHTBALL_COLORS,
} from '@/utils/constants';
import { drawThreeGeo } from '@/utils/threeGeoJSON';
import { createScopedThreejs } from 'threejs-miniprogram';
import StartPage from '@/components/start-page.vue';
import GuidePage from '@/components/guide-page.vue';
import EndPage from '@/components/end-page.vue';
import Compass from '@/components/compass.vue';
import EventAgent from '@/components/event-agent.vue';
import { EventBus } from '@/utils/eventBus';

export default Vue.extend({
// export default {
  name: 'EarthGlobe',
  props: {
    anmtCtrl: {
      type: Object,
      default: {},
    },
    judgeCtrl: {
      type: Object,
      default: {},
    },
    currentRoute: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      canvas: null,
      camera: null,
      earthRadius: 400,
      cameraHeight: 4500,
      globalTHREE: null,
      globalScene: null,
      earthSurfaceOffset: 10,
      earthCameraHeadOffset: -45,
      earthColorLighter: '#6683bd',
      earthColorDarker: '#6683bd',
      earthColorBackground: '#041536',
      earthGlobalLightIntencity: 0.5,
      flyTimeSpan: 1000,
      flyAnimationFreq: 50,
      allowingDrawOrbit: true,
      lightBallConfig: (score) => {
        const increment = Math.max(0, (score-4)*2);
        let color = LIGHTBALL_COLORS[0];
        if (score >= 0 && score < LIGHTBALL_COLORS.length) {
          color = LIGHTBALL_COLORS[score];
        }
        return {
          ballRadius: 2 + increment / 4,
          ballHeight: 15 + increment / 4,
          ballColor: color,
          lightColor: color,
          lightIntencity:  0.5 + increment / 20,
          lightDistance:  500 + 100 * increment,
        }
      },
      failedLightBallConfig: {
        ballRadius: 5,
        ballHeight: 15,
        ballColor: '#f26363',
        lightColor: '#ff6e6e',
        lightIntencity:  2,
        lightDistance:  500,
      },
      orbitArcConfig: {
        color: '#ffffff',
        linewidth: 1,
      },
      rotationClockId: -1,
      threeConfig: {
        maxLightBallCount: 10,
      },
      threeObjects: {
        lightBalls: [],
      }
    }
  },
  components: {
    StartPage,
    EndPage,
    Compass,
    GuidePage,
    EventAgent,
  },
  async mounted() {
    this.watchEarthRotation();
    this.watchFlyingEvent();
    this.watchShowFailedCityEvent();
    this.watchInitEarthAnimation();
    setTimeout(async () => {
      await this.drawEarth();
    }, 500);
  },
  computed: {
    dpr() {
      return store.state.systemInfo.pixelRatio;
    },
    isIOS() {
      return store.state.systemInfo.system.slice(0,3) === 'iOS';
    },
    canvasHeight() {
      return store.state.systemInfo.windowHeight || 896 ;
    },
    canvasWidth() {
      return store.state.systemInfo.windowWidth || 414;
    },
    canvasStyle() {
      return `width: ${this.canvasWidth}px; height: ${this.canvasHeight}px;`;
    },
  },
  methods: {
    drawEarth() {
      console.log('drawEarth');
      uni.createSelectorQuery()
        .in(this)
        .select('#webgl')
        .node()
        .exec((res) => {

          const canvas = res[0].node;
          const ctx = canvas.getContext('webgl');
          const THREE = createScopedThreejs(canvas);
          this.globalTHREE = THREE;
          this.renderEarth(THREE, canvas);

          console.log('this is canvas', canvas);
          console.log('this is ctx', ctx);
          if (this.isIOS) {
            this.threeConfig.maxLightBallCount = 10;
            // canvas.width = this.canvasWidth * 2;
            // canvas.height = this.canvasHeight * 2;
          } else {
            this.threeConfig.maxLightBallCount = 3;
            // const dpr = wx.getSystemInfoSync().pixelRatio;
            // ctx.canvas.width = this.canvasWidth * dpr;
            // ctx.canvas.height = this.canvasHeight * dpr;
            // ctx.viewport(0, 0, this.canvasWidth * dpr, this.canvasHeight * dpr);
          }
          const dpr = wx.getSystemInfoSync().pixelRatio;
          ctx.canvas.width = this.canvasWidth * dpr;
          ctx.canvas.height = this.canvasHeight * dpr;
          ctx.viewport(0, 0, this.canvasWidth * dpr, this.canvasHeight * dpr);
        });
    },
    async renderEarth(THREE, canvas) {
      const scene = new THREE.Scene();
      this.globalScene = scene;
      const camera = new THREE.PerspectiveCamera(10, this.canvasWidth  / this.canvasHeight, 0.5, 10000);
      this.camera = camera;

      let currentCameraLatLng = this.getOffsetLatLonByGroundPoint(0, 0, 0);
      let currentCameraXYZ = this.convertLatLngToXyz(
        currentCameraLatLng.lat,
        currentCameraLatLng.lng,
        this.earthRadius + this.cameraHeight,
        THREE,
      );

      // //Set the camera position
      // this.camera.up.set( 0, 1, 0 );
      this.camera.position = { ...currentCameraXYZ };
      this.camera.lookAt( new THREE.Vector3(0, 0, 0) );

      //New Renderer
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(this.canvasWidth, this.canvasHeight);
      const light = new THREE.HemisphereLight(this.earthColorLighter, this.earthColorDarker, this.earthGlobalLightIntencity);
      scene.add(light);

      // Create a sphere to make visualization easier.
      const geometry = new THREE.SphereGeometry(this.earthRadius, 16, 16 );
      const material = new THREE.MeshPhongMaterial({
          transparent: true,
          opacity: 1,
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      await this.drawEarthSurface(THREE, scene);

      //Render the image
      const render = () => {
        canvas.requestAnimationFrame(render);
        renderer.setClearColor(this.earthColorBackground, 1);
        renderer.render(scene, this.camera);
      }
      render();

      // enable auto rotate
      if (this.currentRoute === 'home') {
        this.flyFromOneToAnother(
          40, 179, 40, 116, false, 0
        );
        setTimeout(() => {
          EventBus.$emit('enableEarthRotation');
          wx.hideLoading();
        }, this.flyTimeSpan + 10);
      }
    },
    async drawEarthSurface(THREE, scene ) {
      const geometry = new THREE.SphereGeometry(this.earthRadius + this.earthSurfaceOffset, 32, 32 );
      let texture = new THREE.TextureLoader().load(PICTURES_URL.EARTH);
      let bumpTexture = new THREE.TextureLoader().load(PICTURES_URL.EARTH_TOPOLOGY);

      texture.minFilter = THREE.LinearFilter;
      bumpTexture.minFilter = THREE.LinearFilter;
      // const material  = new THREE.MeshBasicMaterial({
      const material  = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: bumpTexture,
        bumpScale: 2,
        color: '#ffffff',
        shininess: 50,
      });
      const earthMesh = new THREE.Mesh(geometry, material);
      scene.add(earthMesh);

    },
    convertLatLngToXyz(lat, lng, radius, THREE) {
      const phi = (90 - lat) * Math.PI / 180,
        theta = (180 - lng) * Math.PI / 180,
        position = new THREE.Vector3();

      position.x = radius * Math.sin(phi) * Math.cos(theta);
      position.y = radius * Math.cos(phi);
      position.z = radius * Math.sin(phi) * Math.sin(theta);

      return position;
    },
    getOffsetLatLonByGroundPoint(latGround, lngGround, offsetLat) {
      const getOppositeLng = (lng) => {
        return lng >= 0 ? lng - 180 : lng + 180;
      };

      let latTarget = latGround + offsetLat;
      let lngTarget = lngGround;
      switch (true) {
        case latTarget > 90:
          latTarget = 180 - latTarget;
          lngTarget = getOppositeLng(lngTarget);
        case latTarget < -90:
          latTarget = -180 - latTarget;
          lngTarget = getOppositeLng(lngTarget);
        default:
          break;
      }

      return { lng: lngTarget, lat: latTarget };
    },
    flyFromOneToAnother(lat1, lng1, lat2, lng2, isDrawOrbit, score) {
      const t = this.flyTimeSpan;
      const f = this.flyAnimationFreq;
      const delta_lat = (lat2 - lat1) / (t / f);
      const delta_lng = (lng2 - lng1) / (t / f);
      let currentGroundLat = lat1;
      let currentGroundLng = lng1;
      let currentHeight = 0;
      let prevGroundLat = currentGroundLat;
      let prevGroundLng = currentGroundLng;
      let prevHeight = currentHeight;
      let count = 0;

      this.anmtCtrl.isPlanePausing = false;
      this.anmtCtrl.isPlaneShaking = true;
      const clock = setInterval(() => {
        if (count >= t / f) {
          this.anmtCtrl.isPlanePausing = true;
          this.anmtCtrl.isPlaneShaking = false;
          clearInterval(clock);
        }

        let currentCameraLatLng = this.getOffsetLatLonByGroundPoint(currentGroundLat, currentGroundLng, this.earthCameraHeadOffset);
        let currentLookAtLatLng = this.getOffsetLatLonByGroundPoint(currentGroundLat, currentGroundLng, 0);
        let currentCameraXYZ = this.convertLatLngToXyz(
          currentCameraLatLng.lat,
          currentCameraLatLng.lng,
          this.earthRadius + this.cameraHeight,
          this.globalTHREE,
        );
        let currentLookAtXYZ = this.convertLatLngToXyz(
          currentLookAtLatLng.lat,
          currentLookAtLatLng.lng,
          this.earthRadius * 0.3 ,
          this.globalTHREE,
        );
        
        this.camera.up.set( 0, 1, 0 );
        this.camera.position = { ...currentCameraXYZ };
        this.camera.lookAt(currentLookAtXYZ);

        if (isDrawOrbit) {
          this.drawFlyRouteLine(
            prevGroundLat, prevGroundLng, prevHeight,
            currentGroundLat, currentGroundLng, currentHeight
          );
          prevHeight = currentHeight;
          currentHeight = get_flight_orbit_height(
            lat1, lng1, lat2, lng2, 
            currentGroundLat, currentGroundLng,
        );
        }

        prevGroundLat = currentGroundLat;
        prevGroundLng = currentGroundLng;

        currentGroundLat += delta_lat;
        currentGroundLng += delta_lng;

        count += 1;
      }, f);
      this.removeFlyRouteLines();
      this.drawLightBall(lat2, lng2, this.lightBallConfig(score));
    },
    allowDrawOrbit() {
      this.allowingDrawOrbit = true;
    },
    removeFlyRouteLines() {
      let obj;
      while (obj = this.globalScene.getObjectByProperty('type', 'Line')) {
        this.globalScene.remove(obj);
        obj.geometry.dispose();
        obj.material.dispose();
      }
    },
    drawFlyRouteLine(lat1, lon1, height1, lat2, lon2, height2) {
      if (this.allowingDrawOrbit) {
        const p1 = this.convertLatLngToXyz(
          lat1, lon1, this.earthRadius + height1 + this.earthSurfaceOffset,
          this.globalTHREE,
        );
        const p2 = this.convertLatLngToXyz(
          lat2, lon2, this.earthRadius + height2 + this.earthSurfaceOffset,
          this.globalTHREE,
        );
        draw_line(
          [p1.x, p2.x], [p1.y, p2.y], [p1.z, p2.z],
          this.orbitArcConfig,
          this.globalTHREE, this.globalScene,
        );
      }
    },
    drawLightBall(lat, lng, cfg) {
      const ball = new this.globalTHREE.Mesh(
        new this.globalTHREE.SphereGeometry(cfg.ballRadius, 8, 8), 
        new this.globalTHREE.MeshBasicMaterial({ color: cfg.ballColor }),
      );
      const light = new this.globalTHREE.PointLight(cfg.lightColor, cfg.lightIntencity, cfg.lightDistance );
      let xyz = this.convertLatLngToXyz(
        lat, lng,
        this.earthRadius + cfg.ballHeight,
        this.globalTHREE,
      );

      ball.position.set(xyz.x, xyz.y, xyz.z);
      light.position.set(xyz.x, xyz.y, xyz.z);
      this.globalScene.add(ball);
      this.globalScene.add(light);
      this.threeObjects.lightBalls.push({
        ball, light,
      });
      if (this.threeObjects.lightBalls.length > this.threeConfig.maxLightBallCount) {
        const { ball, light } = this.threeObjects.lightBalls.shift();
        ball.geometry.dispose();
        ball.material.dispose();
        this.globalScene.remove(ball);
        this.globalScene.remove(light);
      }
    },
    watchFlyingEvent() {
      EventBus.$on('flyFromOneToAnother', (flyConfig) => {
        const { fromLat, fromLon, toLat, toLon, isDrawOrbit, score } = flyConfig;
        this.flyFromOneToAnother(fromLat, fromLon, toLat, toLon, isDrawOrbit, score);
      });
    },
    watchEarthRotation() {
      EventBus.$on('enableEarthRotation', () => {
        if (this.rotationClockId === -1) {
          this.rotationClockId = setInterval(() => {
            this.globalScene.rotation.y += 0.001;
          }, 10);
        }
      });
      EventBus.$on('disableEarthRotation', () => {
        clearInterval(this.rotationClockId);
        this.rotationClockId = -1;
        this.globalScene.rotation.y = 0;
      });
    },
    watchShowFailedCityEvent() {
      EventBus.$on('showFailedCityPoint', (cityConfig) => {
        const { toLat, toLon } = cityConfig;
        this.drawLightBall(toLat, toLon,
          this.failedLightBallConfig);
      });
    },
    watchInitEarthAnimation() {
      EventBus.$on('initEarthAnimation', (cfg) => {
        // 1. 清除地球上现存的所有光点
        while (this.threeObjects.lightBalls.length > 0) {
          const { ball, light } = this.threeObjects.lightBalls.shift();
          ball.geometry.dispose();
          ball.material.dispose();
          this.globalScene.remove(ball);
          this.globalScene.remove(light);
        }
        // 2. 飞向开始的点
        if (this.globalScene) {
          const { lat, lon } = cfg;
          this.flyFromOneToAnother(40, 116, lat, lon, false, 0);
        }
      });
    },
  },
});
</script>

<style scoped lang="scss">
@import '../utils/customAnimate.wxss';

.canvas_cover_abstract {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 75vh;
  width: 50vw;
  color: #000;
  display: flex;
  justify-content: space-between;
}
.canvas_cover_operation {
  position: fixed;
  left: 50%;
  bottom: 10vh;
  transform: translateX(-50%);
  color: #000;
  width: 70vw;
  height: 20vh;
}
.canvas_cover_start_panel {
  position: fixed;
  left: 0;
  top: 0;
}
.canvas_cover_end_panel {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 101;
}
.canvas_cover_compass {
  position: fixed;
  left: 0;
  top: 70%;
  z-index: 10;
}
.canvas_cover_guide_panel {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 110;
}
</style>