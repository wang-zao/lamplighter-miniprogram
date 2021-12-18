<template>
	<view class="earth_wrapper" >
		<view>earth</view>
      <canvas
        type="webgl"
        id="webgl"
        class="globe"
        style="width: 1366px; height: 600px;"
      >
        <cover-view
          class="canvas_cover_view"
        >
          <cover-view class="">666</cover-view>
          <plane ></plane>
        </cover-view>
        <cover-view class="canvas_gradient">5555</cover-view>
      </canvas>
	</view>
</template>

<script>
/**
 * @description 
 * @event {Function} click 
 */
import { contry_json } from '@/utils/data';
import { drawThreeGeo } from '@/utils/threeGeoJSON';
// import * as THREE from 'three';
import { createScopedThreejs } from 'threejs-miniprogram';
import Plane from './plane.vue';
// import * as THREE from '@/utils/three';

export default {
  name: 'Earth',
  props: {
  },
  data() {
    return {
      canvas: null,
      canvasWidth: 1366,
      canvasHeight: 600,
      showCoverViews: false,
      camera: null,
      earthRadius: 1000,
      cameraHeight: 400,
    }
  },
  components: {
    Plane,
  },
  mounted() {
    console.log('into earth onload only----------!');
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
            this.renderEarth(threeObj);
        });
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
    flyFromOneToAnother(lat1, lng1, lat2, lng2, THREE) {
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
        let currentLookAtLatLng = this.getOffsetLatLonByGroundPoint(currentGroundLat, currentGroundLng, 70);
        let currentCameraXYZ = this.convertLatLngToXyz(
          currentCameraLatLng.lat,
          currentCameraLatLng.lng,
          this.earthRadius + this.cameraHeight,
          THREE,
        );
        let currentLookAtXYZ = this.convertLatLngToXyz(
          currentLookAtLatLng.lat,
          currentLookAtLatLng.lng,
          this.earthRadius * 0.3 ,
          THREE,
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
            this.flyFromOneToAnother(20, 90, 40, 116, THREE)
          } else {
            this.flyFromOneToAnother(40, 116, 20, 90, THREE)
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

      this.testFlyFunction(THREE);

      //New Renderer
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(this.canvasWidth, this.canvasHeight);

      const light = new THREE.HemisphereLight(0xbbe6ff, 0x072d43, 1);
      scene.add(light);

      //Create a sphere to make visualization easier.
      const geometry = new THREE.SphereGeometry(this.earthRadius, 32, 32);
      const material = new THREE.MeshPhongMaterial({
          transparent: false,
          opacity: 0.9,
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

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

          console.log('cube_marker', cube_marker);
          cube_marker.castShadow = true;

          const new_position = this.convertLatLngToXyz(coords[i][0], coords[i][1], this.earthRadius, THREE);
          // console.log('new_position', new_position)
          cube_marker.position.x = new_position.x;
          cube_marker.position.y = new_position.y;
          cube_marker.position.z = new_position.z;
          cube_marker.rotation.z = 45;
          cube_marker.lookAt(sphere.position);
          cube_marker.translateZ(-(coords[i][2] / 2) + 1);

          sphere.add(cube_marker);

      }

      // Draw the GeoJSON
      const test_json = contry_json;
      drawThreeGeo(
        test_json,
        this.earthRadius,
        'sphere',
        { color: '#4b5aa3' },
        scene,
        THREE,
      );

      //Render the image
      const render = () => {
          // controls.update();
          this.canvas.requestAnimationFrame(render);
          renderer.setClearColor(0x333333, 1);
          renderer.render(scene, this.camera);
      }
      render();
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
.canvas_cover_view {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
}
.canvas_gradient {
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 50vh;
  left: 50%;
  transform: translateX(-50%);
  background: #3b6279;
  // background: linear-gradient(0deg, #3b6279fa 0%, #3b6279fa 30%, #3b627900 100%);
}
</style>