<template>
  <view class="earth_wrapper">
    <canvas
      type="webgl" id="webgl"
      :style="canvasStyle"
    >
     <start-page
        v-if="anmtCtrl.gameStartPageVisible"
        class="canvas_cover_start_panel"
      />
      <end-page
        :anmtCtrl="anmtCtrl"
        :judgeCtrl="judgeCtrl"
        v-if="anmtCtrl.gameEndPageVisible"
        class="canvas_cover_end_panel"
      />
    </canvas>
    <!-- <cover-view
      class="canvas_cover_operation"
      v-show="showingCtrlCompass"
    >
      <fly-control-cross-t
        :anmtCtrl="anmtCtrl"
        v-show="showingCtrlCompass && anmtCtrl.crossTVisible"
        @clickedOneDirection="e => clickedOneDirection(e)"
      />
      <fly-control-cross-x
        :anmtCtrl="anmtCtrl"
        v-show="showingCtrlCompass && anmtCtrl.crossXVisible"
        @clickedOneDirection="e => clickedOneDirection(e)"
      />
    </cover-view> -->
  </view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import Vue from 'vue';
import store from '@/store/index.js'    
// import { contry_json, ocean } from '@/utils/data';
import { get_flight_orbit_height, draw_line } from '@/utils/common';
import {
  PICTURES_URL,
} from '@/utils/constants';
import { drawThreeGeo } from '@/utils/threeGeoJSON';
import { createScopedThreejs } from 'threejs-miniprogram';
import FlyControlCrossT from '@/components/fly-control-cross-t.vue';
import FlyControlCrossX from '@/components/fly-control-cross-x.vue';
import StartPage from '@/components/start-page.vue';
import EndPage from '@/components/end-page.vue';

export default Vue.extend({
// export default {
  name: 'EarthGlobe',
  props: {
    currentCity: {
      type: Object,
      default: {},
    },
    nextCity: {
      type: Object,
      default: {},
    },
    anmtCtrl: {
      type: Object,
      default: {},
    },
    judgeCtrl: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      canvas: null,
      showCoverViews: false,
      camera: null,
      earthRadius: 300,
      cameraHeight: 4500,
      globalTHREE: null,
      globalScene: null,
      earthSurfaceOffset: 10,
      earthColorLighter: '#51adcf',
      earthColorDarker: '#0278ae',
      earthColorBackground: '#0b2353',
      height_array: [],
      flyTimeSpan: 1000,
      flyAnimationFreq: 25,
      allowingDrawOrbit: false,
    }
  },
  components: {
    StartPage,
    EndPage,
    FlyControlCrossT,
    FlyControlCrossX,
  },
  mounted() {
    this.drawEarth();
  },
  computed: {
    canvasHeight() {
      return store.state.systemInfo.windowHeight * 0.5 || 896 * 0.5 ;
    },
    canvasWidth() {
      return store.state.systemInfo.windowWidth || 414;
    },
    canvasStyle() {
      return `width: ${this.canvasWidth}px; height: ${this.canvasHeight}px;`;
    },
    showingAbstractModalComputed() {
      return this.anmtCtrl.showingAbstractModal && !this.anmtCtrl.gameStartPageVisible;
    },
    showingCtrlCompass() {
      // return false;
      // return !anmtCtrl.gameStartPageVisible && !anmtCtrl.gameEndPageVisible;
    }
  },
  methods: {
    drawEarth() {
      uni.createSelectorQuery()
        .in(this)
        .select('#webgl')
        .node()
        .exec((res) => {
          const canvas = res[0].node
          const THREE = createScopedThreejs(canvas)
          this.globalTHREE = THREE;
          this.renderEarth(THREE, canvas)
          canvas.width = this.canvasWidth * 2;
          canvas.height = this.canvasHeight * 2;
        })
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

      // this.testFlyFunction(THREE);

      //New Renderer
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(this.canvasWidth, this.canvasHeight);
      const light = new THREE.HemisphereLight(this.earthColorLighter, this.earthColorDarker, 1);
      scene.add(light);

      // Create a sphere to make visualization easier.
      const geometry = new THREE.SphereGeometry(this.earthRadius, 100, 100);
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
    },
    
    async drawEarthSurface(THREE, scene ) {
      const geometry = new THREE.SphereGeometry(this.earthRadius + this.earthSurfaceOffset, 32, 32);
      let texture = new THREE.TextureLoader().load(PICTURES_URL.EARTH);
      // let texture = new THREE.TextureLoader().load('../static/earth_colorful.jpeg');

      texture.minFilter = THREE.LinearFilter;
      const material  = new THREE.MeshBasicMaterial({
        map: texture,
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

    calcFlightOrbitArray(lat1, lng1, lat2, lng2) {
      this.height_array = [];
      const t = this.flyTimeSpan;
      const f = this.flyAnimationFreq;
      const delta_lat = (lat2 - lat1) / (t / f);
      const delta_lng = (lng2 - lng1) / (t / f);
      let currentGroundLat = lat1;
      let currentGroundLng = lng1;
      let count = 0;
      
      while (count <= (t/f)) {
        this.height_array.push(
          get_flight_orbit_height(
            lat1, lng1, lat2, lng2, 
            currentGroundLat, currentGroundLng,
          ),
        );
        currentGroundLat += delta_lat;
        currentGroundLng += delta_lng;
        count += 1;
      }
    },
    flyFromOneToAnother(lat1, lng1, lat2, lng2) {
      this.calcFlightOrbitArray(lat1, lng1, lat2, lng2);
      const t = this.flyTimeSpan;
      const f = this.flyAnimationFreq;
      const delta_lat = (lat2 - lat1) / (t / f);
      const delta_lng = (lng2 - lng1) / (t / f);
      let currentGroundLat = lat1;
      let currentGroundLng = lng1;
      let count = 0;

      this.anmtCtrl.isPlanePausing = false;
      this.anmtCtrl.isPlaneShaking = true;
      const clock = setInterval(() => {
        if (count >= t / f) {
          this.anmtCtrl.isPlanePausing = true;
          this.anmtCtrl.isPlaneShaking = false;
          clearInterval(clock);
        }

        let currentCameraLatLng = this.getOffsetLatLonByGroundPoint(currentGroundLat, currentGroundLng, -50);
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
        this.drawFlyRouteLine(
          currentGroundLat,
          currentGroundLng,
          this.height_array[count] | this.height_array[-1],
          currentGroundLat + delta_lat,
          currentGroundLng + delta_lng,
          this.height_array[count + 1] | this.height_array[-1],
        );
        currentGroundLat += delta_lat;
        currentGroundLng += delta_lng;
        count += 1;
      }, f);
    },
    allowDrawOrbit() {
      this.allowingDrawOrbit = true;
    },
    drawFlyRouteLine(lat1, lon1, height1, lat2, lon2, height2) {
      if (this.allowingDrawOrbit) {
        const p1 = this.convertLatLngToXyz(
          lat1, lon1, this.earthRadius,
          this.globalTHREE,
        );
        const p2 = this.convertLatLngToXyz(
          lat2, lon2, this.earthRadius,
          this.globalTHREE, this.globalScene,
        );
        draw_line(
          [p1.x, p2.x], [p1.y, p2.y],
          [p1.z + height1 + this.earthSurfaceOffset, p2.z + height2 + this.earthSurfaceOffset],
          { color: '#4b5aa3' },
          this.globalTHREE, this.globalScene,
        );
      }
    },
    testFlyFunction(THREE) {
      let ccount = 0;
      let east = true
      setTimeout(() => {
        const clockk = setInterval(() => {
          ccount += 1
          if (ccount >= 30) {
            clearInterval(clockk);
          }
          if (east) {
            this.flyFromOneToAnother(20, 90, 40, 116)
          } else {
            this.flyFromOneToAnother(40, 116, 20, 90)
          }
          east = !east
        }, 5000)
      }, 10);
    },

    clickedOneDirection(direction) {
      this.$emit('clickedOneDirection', direction);
    },

  }
});
// }
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
}
</style>