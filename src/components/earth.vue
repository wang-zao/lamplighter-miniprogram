<template>
	<view class="earth_wrapper" >
		<view>earth</view>
      <canvas
        type="webgl"
        id="webgl"
        class="globe"
        style="width: 414px; height: 500px;"
      >
        <cover-view
          v-if="showCoverViews"
          class="canvas_cover_view"
        >
          <cover-view>666</cover-view>
          <view>777</view>
          <view><view>888</view>00</view>
          <view><cover-view>999</cover-view>00</view>
        </cover-view>
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
// import * as THREE from '@/utils/three';

export default {
  name: 'Earth',
  props: {
  },
  data() {
    return {
      canvas: null,
      canvasWidth: 414,
      canvasHeight: 500,
      showCoverViews: false,
    }
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
            console.log('res');
            const canvas = res[0].node;
            this.canvas = canvas;
            const threeObj = createScopedThreejs(canvas)
            this.renderEarth(threeObj);
            //do something
        });
    },
    async renderEarth(THREE) {
      console.log('THREE', THREE)
      const res = await uni.getSystemInfo();
      console.log('getSystemInfo', res)
      const screenWidth = res[1].windowWidth;
      const screenHeight = res[1].windowHeight;
      console.log('screenWidth', screenWidth, screenHeight)
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(75, this.canvasWidth  / this.canvasHeight, 0.5, 10000);
      // var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 10000);
      var radius = 300;

      //Set the camera position
      camera.position.z = 500;

      //New Renderer
      var renderer = new THREE.WebGLRenderer();
      console.log('renderer', renderer);
      renderer.setSize(this.canvasWidth, this.canvasHeight);
      // renderer.setSize(screenWidth, screenHeight);
      // renderer.setSize(window.innerWidth, window.innerHeight);
      console.log('renderer', renderer);
      // document.body.appendChild(renderer.domElement);

      var light = new THREE.HemisphereLight(0xbbe6ff, 0x3b6279, 1);

      scene.add(light);

      //Create a sphere to make visualization easier.
      var geometry = new THREE.SphereGeometry(radius, 32, 32);
      //For ellipsoid testing: geometry.applyMatrix( new THREE.Matrix4().makeScale( 1.0, 1.0, 1.5 ) ); Try 6378137.0, 6356752.314140
      var material = new THREE.MeshPhongMaterial({
          transparent: false,
          opacity: 0.9,
      });
      var sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      var coords = [
          //[lat,lng,magitude],
          [40, 60, 10],
          [20, 20, 10],
          [30, 10, 30],
          [-100, 10, 80],
          [130, 10, 50],
          [-210, 10, 40],
          [-300, 90, 30],
          [330, 40, 90],
          [-230, 140, 34],
          [-380, 300, 50],
          [-110, -200, 20],
          [-230, 140, 110]
      ];

      for (var i = 0; i < coords.length; i++) {

          var cube_geometry = new THREE.CubeGeometry(10, 10, coords[i][2]);
          var cube_material = new THREE.MeshPhongMaterial({
            color: 0xCBE86B
          });
          var cube_marker = new THREE.Mesh(cube_geometry, cube_material);

          console.log('cube_marker', cube_marker);
          cube_marker.castShadow = true;

          const new_position = convert_lat_lng(coords[i][0], coords[i][1], radius);
          console.log('new_position', new_position)
          cube_marker.position.x = new_position.x;
          cube_marker.position.y = new_position.y;
          cube_marker.position.z = new_position.z;
          cube_marker.rotation.z = 45;
          cube_marker.lookAt(sphere.position);
          cube_marker.translateZ(-(coords[i][2] / 2) + 1);

          sphere.add(cube_marker);

      }

      // Draw the GeoJSON
      // var test_json = $.getJSON(
      //   "https://raw.githubusercontent.com/jdomingu/ThreeGeoJSON/master/test_geojson/countries_states.geojson",
      //   function(data) {
      //     drawThreeGeo(data, radius, 'sphere', {
      //       color: '#555',
      //     });
      //   },
      // );

      const test_json = contry_json;
      drawThreeGeo(
        test_json,
        radius,
        'sphere',
        { color: '#4b5aa3' },
        scene,
        THREE,
      );


      console.log('test_json----------', test_json)

      //Enable controls
      // var controls = new THREE.TrackballControls(camera);

      //Render the image
      const render = () => {
          // controls.update();
          this.canvas.requestAnimationFrame(render);
          renderer.setClearColor(0x333333, 1);
          renderer.render(scene, camera);
      }
      render();
      console.log('renderCompleted renderCompleted renderCompleted!!!')
      this.$emit('renderCompleted');
      setTimeout(() => {
        console.log('showing inner cover views !')
        this.showCoverViews = true;
      }, 1000);
      // UTILITY
      function convert_lat_lng(lat, lng, radius) {
          var phi = (90 - lat) * Math.PI / 180,
            theta = (180 - lng) * Math.PI / 180,
            position = new THREE.Vector3();

          position.x = radius * Math.sin(phi) * Math.cos(theta);
          position.y = radius * Math.cos(phi);
          position.z = radius * Math.sin(phi) * Math.sin(theta);

          return position;
      }
    },
  }
}
</script>

<style scoped lang="scss">

.earth_wrapper {
  position: fixed;
  left: 0;
  bottom: 0;
}
.canvas_cover_view {
  color: #fff;
}
</style>