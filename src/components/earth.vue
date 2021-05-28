<template>
	<view class="earth_wrapper" >
		<view>earth</view>
      <canvas
        type="webgl"
        id="webgl"
        class="globe"
        style="width: 1366px; height: 600px;"
      >
        <cover-image
          class="earth_shadow"
          src="../static/earth_shadow.png"
        />
        <!-- <cover-view class="canvas_cover_abstract">
            <cover-view>{{currentCity.country}}</cover-view>
            <cover-view></cover-view>
            <cover-view
            >{{nextCity.country}}</cover-view>
        </cover-view> -->
        <cover-view class="canvas_cover_cityname">
          <ticket
            class="cover_ticke_left"
            :cityInfo="currentCity"
            @changeAbstractVisibility="e => changeAbstractVisibility()"
          />
          <ticket
            class="cover_ticke_right"
            :cityInfo="nextCity"
            @changeAbstractVisibility="e => changeAbstractVisibility()"
          />
          <!-- <cover-view>{{currentCity.city_ascii}}</cover-view>
          <cover-view>=></cover-view>
          <cover-view
            @click="e => changeAbstractVisibility()"
          >{{nextCity.city_ascii}}</cover-view> -->
        </cover-view>
        <cover-view class="canvas_cover_plane">
          <plane class="cover_plane"></plane>
        </cover-view>
        <cover-view class="canvas_cover_operation">
          <fly-control-cross-t
            v-show="crossTVisible"
            @clickedOneDirection="e => clickedOneDirection(e)"
          />
          <fly-control-cross-x
            v-show="crossXVisible"
            @clickedOneDirection="e => clickedOneDirection(e)"
          />
        </cover-view>
      </canvas>
	</view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import { contry_json, ocean } from '@/utils/data';
import { drawThreeGeo } from '@/utils/threeGeoJSON';
// import * as THREE from 'three';
import { createScopedThreejs } from 'threejs-miniprogram';
import Plane from './plane.vue';
import Ticket from './ticket.vue';
import FlyControlCrossT from '@/components/fly-control-cross-t.vue';
import FlyControlCrossX from '@/components/fly-control-cross-x.vue';
// import * as THREE from '@/utils/three';

// const earth_surface = require('../static/earthmap_color.jpeg');

export default {
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
    crossTVisible: {
      type: Boolean,
      default: true,
    },
    crossXVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      canvas: null,
      canvasWidth: 1366,
      canvasHeight: 600,
      showCoverViews: false,
      camera: null,
      earthRadius: 400,
      cameraHeight: 400,
      globalTHREE: null,
      showingNextAbstract: true,
      earthColorLighter: '#51adcf',
      earthColorDarker: '#0278ae',
      earthColorBackground: '#dbf6e9',
    }
  },
  components: {
    Plane,
    Ticket,
    FlyControlCrossT,
    FlyControlCrossX,
  },
  mounted() {
    this.drawEarth();
  },
  computed: {
    canvasStyle() {
      console.log('canvasStyle', `width: ${this.canvasWidth}px; height: ${this.canvasHeight}px;`)
      return `width: ${this.canvasWidth}px; height: ${this.canvasHeight}px;`;
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
            const dpr = uni.getSystemInfoSync().pixelRatio;
            this.canvas.width = this.canvasWidth * dpr;
            this.canvas.height = this.canvasHeight * dpr;
            // ctx.scale(dpr, dpr);
            const threeObj = createScopedThreejs(canvas);
            this.globalTHREE = threeObj;
            this.renderEarth(threeObj);
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
    flyFromOneToAnother(lat1, lng1, lat2, lng2) {
      const t = 1000;
      const f = 10;
      const delta_lat = (lat2 - lat1) / (t / f);
      const delta_lng = (lng2 - lng1) / (t / f);

      console.log('from lat = ', lat1, 'lon = ', lng1);
      let currentGroundLat = lat1;
      let currentGroundLng = lng1;
      let count = 0;

      const clock = setInterval(() => {
        if (count === 100) {
          clearInterval(clock);
        }

        let currentCameraLatLng = this.getOffsetLatLonByGroundPoint(currentGroundLat, currentGroundLng, -20);
        let currentLookAtLatLng = this.getOffsetLatLonByGroundPoint(currentGroundLat, currentGroundLng, -60);
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

        currentGroundLat += delta_lat;
        currentGroundLng += delta_lng;
        count += 1;
      }, 10);
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
      const camera = new THREE.PerspectiveCamera(75, this.canvasWidth  / this.canvasHeight, 0.5, 10000);
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
          opacity: 0.9,
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // await this.drawEarthSurface(THREE, scene);
      // this.drawSpecificPoints(THREE, sphere);
      

      // Draw the GeoJSON
      const test_json = ocean;
      drawThreeGeo(
        test_json,
        this.earthRadius,
        'sphere',
        { color: '#4b5aa3', fill: '#4b5aa3' },
        scene,
        THREE,
      );

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
      const geometry = new THREE.SphereGeometry(this.earthRadius, 32, 32);
      // let texture = await new THREE.TextureLoader().load('../static/earth_colorful.jpeg');
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
    changeAbstractVisibility() {
      this.showingNextAbstract = !this.showingNextAbstract;
    },
  }
}
</script>

<style scoped lang="scss">

.globe {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}
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
.canvas_cover_cityname {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 70vh;
  color: #000;
  width: 60vw;
  display: flex;
  justify-content: space-between;
}
.canvas_cover_plane {
  position: fixed;
  left: 50%;
  bottom: 45vh;
  transform: translateX(-50%);
  color: #000;
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
.earth_shadow {
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 50vh;
  left: 50%;
  transform: translateX(-50%);
  // background: #3b6279;
  // background: linear-gradient(0deg, #3b6279fa 0%, #3b6279fa 30%, #3b627900 100%);
}
</style>