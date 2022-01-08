<template>
  <view class="earth_wrapper">
    <!-- <view>earth</view> -->
      <canvas
        type="webgl"
        id="webgl"
        class="globe"
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
        <!-- <cover-view class="canvas_cover_operation"
          v-if="!anmtCtrl.gameStartPageVisible && !anmtCtrl.gameEndPageVisible"
        >
          <fly-control-cross-t
            :anmtCtrl="anmtCtrl"
            v-show="anmtCtrl.crossTVisible"
            @clickedOneDirection="e => clickedOneDirection(e)"
          />
          <fly-control-cross-x
            :anmtCtrl="anmtCtrl"
            v-show="anmtCtrl.crossXVisible"
            @clickedOneDirection="e => clickedOneDirection(e)"
          />
        </cover-view> -->
        <!-- <cover-view class="canvas_cover_plane"
          v-if="!anmtCtrl.gameStartPageVisible"
        >
          <plane class="cover_plane shake" 
            :class="{
              plane_pausing: anmtCtrl.isPlanePausing,
              plane_shaking: anmtCtrl.isPlaneShaking,
            }"
          />
        </cover-view> -->
      </canvas>
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
import { drawThreeGeo } from '@/utils/threeGeoJSON';
// import * as THREE from 'three';
import { createScopedThreejs } from 'threejs-miniprogram';
import Plane from './plane.vue';
// import Ticket from './ticket.vue';
import FlyControlCrossT from '@/components/fly-control-cross-t.vue';
import FlyControlCrossX from '@/components/fly-control-cross-x.vue';
import StartPage from '@/components/start-page.vue';
import EndPage from '@/components/end-page.vue';
// import AbstractModal from '@/components/abstract-modal.vue';
// import * as THREE from '@/utils/three';

// const earth_surface = require('../static/earthmap_color.jpeg');

export default Vue.extend({
// export default {
  name: 'Earth',
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
      // canvasWidth: 1366,
      // canvasHeight: 600,
      showCoverViews: false,
      camera: null,
      earthRadius: 300,
      cameraHeight: 2500,
      globalTHREE: null,
      globalScene: null,
      earthSurfaceOffset: 10,
      // showingAbstractModal: false,
      earthColorLighter: '#51adcf',
      earthColorDarker: '#0278ae',
      // earthColorBackground: '#dbf619',
      earthColorBackground: '#ecfaf3',
      height_array: [],
      flyTimeSpan: 1000,
      flyAnimationFreq: 25,
      allowingDrawOrbit: false,
    }
  },
  components: {
    Plane,
    // Ticket,
    StartPage,
    EndPage,
    // AbstractModal,
    FlyControlCrossT,
    FlyControlCrossX,
  },
  mounted() {
    console.log('into earth onload of old earth!----------');
    this.drawEarth();
  },
  computed: {
    canvasHeight() {
      // console.log('canvasHeightcanvasHeight', store.state.systemInfo.windowHeight / 3)
      return store.state.systemInfo.windowHeight * 0.6 || 896 * 0.6 ;
    },
    canvasWidth() {
      // console.log('---systemInfo-------', store.state.systemInfo)
      // console.log('canvasWidthcanvasWidth', store.state.systemInfo.windowWidth)
      return store.state.systemInfo.windowWidth || 414;
    },
    pixelRatio() {
      return store.state.systemInfo.pixelRatio;
    },
    canvasStyle() {
      // console.log('canvasStyle', `width: ${this.canvasWidth}px; height: ${this.canvasHeight}px;`)
      return `width: ${this.canvasWidth}px; height: ${this.canvasHeight}px;`;
    },
    showingAbstractModalComputed() {
      // return this.anmtCtrl.showingAbstractModal && !this.anmtCtrl.gameStartPageVisible;
      // console.log('this.anmtCtrl.showingAbstractModal', this.anmtCtrl.showingAbstractModal)
      // console.log('!this.anmtCtrl.gameStartPageVisible', !this.anmtCtrl.gameStartPageVisible)
      // console.log('this.anmtCtrl.showingAbstractModal && !this.anmtCtrl.gameStartPageVisible', this.anmtCtrl.showingAbstractModal && !this.anmtCtrl.gameStartPageVisible)
      return this.anmtCtrl.showingAbstractModal && !this.anmtCtrl.gameStartPageVisible;
      // return this.anmtCtrl.showingAbstractModal && !this.anmtCtrl.gameStartPageVisible;
    },
  },
  methods: {
    onClick(direction) {
      // this.$emit('clickedOneDirection', direction)
    },
    drawEarth() {
      uni.createSelectorQuery()
        .in(this)
        .select('#webgl')
        .node()
        .exec((res) => {
            const canvas = res[0].node;
            this.canvas = canvas;
            const width = res[0].width
            const height = res[0].height
            // const dpr = uni.getSystemInfoSync().pixelRatio;
            // console.log('-----------canvas')
            // console.log('-----------canvas')
            // console.log('-----------canvas', canvas)
            // this.canvas._ctx.canvas.width = this.canvasWidth * 2;
            // this.canvas._ctx.canvas.height = this.canvasHeight * 2;
            // this.canvas.width = this.canvasWidth * 2;
            // this.canvas.height = this.canvasHeight * 2;
            // this.canvas.style.width = `${this.canvasWidth * 2}px`;
            // this.canvas.style.height = `${this.canvasHeight * 2}px`;
            // this.canvas._ctx.scale(2,2);
            // ctx.scale(dpr, dpr);
            // console.log('-----------canvas2', canvas)
            const threeObj = createScopedThreejs(canvas);
            this.globalTHREE = threeObj;
            this.renderEarth(threeObj);
            // 下面这两行用来调整dpi，必须放在canvas requestAnimateFrame之后，摸索了半天，靠
            this.canvas.width = this.canvasWidth * 2;
            this.canvas.height = this.canvasHeight * 2;

        });
    },
    // convertLatLngToXyz(lat, lng, radius) {
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
      // const height_array = [];
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
      console.log('from lat = ', lat1, 'lon = ', lng1);
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
    async renderEarth(THREE) {

      // const res = await uni.getSystemInfo();
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

      //Set the camera position
      this.camera.up.set( 0, 1, 0 );
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
      // this.drawSpecificPoints(THREE, sphere);
      

      // // Draw the GeoJSON
      // const test_json = ocean;
      // drawThreeGeo(
      //   test_json,
      //   this.earthRadius,
      //   'sphere',
      //   { color: '#4b5aa3' },
      //   scene,
      //   THREE,
      // );

      //Render the image
      const render = () => {
          // controls.update();
          this.canvas.requestAnimationFrame(render);
          renderer.setClearColor(this.earthColorBackground, 1);
          renderer.render(scene, this.camera);
      }
      render();
    },
    drawSpecificPoints(THREE, sphere) {
      const coords = [
          //[lat,lng,magitude],
          [40, 116, 10],
      ];
      for (let i = 0; i < coords.length; i++) {
          const cube_geometry = new THREE.CubeGeometry(10, 10, coords[i][2]);
          const cube_material = new THREE.MeshPhongMaterial({
            color: 0xCBE86B
          });
          const cube_marker = new THREE.Mesh(cube_geometry, cube_material);
          cube_marker.castShadow = true;
          const new_position = this.convertLatLngToXyz(coords[i][0], coords[i][1], this.earthRadius, THREE);
          cube_marker.position.x = new_position.x;
          cube_marker.position.y = new_position.y;
          cube_marker.position.z = new_position.z;
          cube_marker.rotation.z = 45;
          cube_marker.lookAt(sphere.position);
          cube_marker.translateZ(-(coords[i][2] / 2) + 1);
          sphere.add(cube_marker);
      }
    },
    async drawEarthSurface(THREE, scene ) {
      const geometry = new THREE.SphereGeometry(this.earthRadius + this.earthSurfaceOffset, 32, 32);
      let texture = await new THREE.TextureLoader().load('https://i.loli.net/2021/11/21/54oQkYWaijxPAtz.jpg');
      // let texture = new THREE.TextureLoader().load('src/static/earthmap_color.jpeg');

      texture.minFilter = THREE.LinearFilter;
      const material  = new THREE.MeshBasicMaterial({
        map: texture,
      });
      const earthMesh = new THREE.Mesh(geometry, material);
      scene.add(earthMesh);

    },
    clickedOneDirection(direction) {
      console.log('emitted button again', direction)
      this.$emit('clickedOneDirection', direction);
    },
    // changeAbstractVisibility(city, target) {
    //   // this.abstractContent = city.abstract;
    //   this.$emit('changeAbstractVisibility', target, city.abstract)
    // },
  }
});
// }
</script>

<style scoped lang="scss">
@import '../utils/customAnimate.wxss';

// .globe {
//   width: 100%;
//   height: 100%;
//   max-width: 100%;
//   max-height: 100%;
// }
.canvas_cover_abstract {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 75vh;
  width: 60vw;
  color: #000;
  display: flex;
  justify-content: space-between;
}
// .canvas_cover_cityname {
//   position: fixed;
//   left: 50%;
//   transform: translateX(-50%);
//   bottom: 70vh;
//   color: #000;
//   width: 90vw;
//   padding: 0 10vw;
//   display: flex;
//   justify-content: space-between;
//   .cover_ticket {
//   animation-duration: .8s;

//   }
// }
// .canvas_cover_plane {
//   position: fixed;
//   left: 50%;
//   bottom: 45vh;
//   transform: translateX(-50%);
//   color: #000;
//   .cover_plane {
//     animation-iteration-count: infinite;
//     animation-duration: .5s;
//   }
//   .plane_shaking {
//     animation-play-state: running;
//   }
//   .plane_pausing {
//     animation-play-state: paused;
//   }
// }
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
// .canvas_cover_abstract_panel {
//   position: fixed;
//   left: 50%;
//   transform: translateX(-50%);
//   display: flex;
//   justify-content: center;
//   bottom: 60vh;
//   width: 90vw;
//   border-radius: 2rem;
//   background: $dark-mode-mask;
//   // background: yellow;
// }
// .earth_shadow {
//   position: fixed;
//   bottom: 0;
//   width: 100vw;
//   height: 50vh;
//   left: 50%;
//   transform: translateX(-50%);
  // background: #3b6279;
  // background: linear-gradient(0deg, #3b6279fa 0%, #3b6279fa 30%, #3b627900 100%);
// }
</style>