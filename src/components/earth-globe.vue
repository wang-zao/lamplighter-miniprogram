<template>
  <view class="earth_wrapper">
    <!-- on two fingers span, show the guide page -->
    <canvas
      type="webgl" id="webgl"
      :style="canvasStyle"
      @touchstart="handleTouchStart"
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
  PLAYING_MAX_SCORE_PER_QUESTION,
} from '@/utils/constants';
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
      // earthRoateDelta: 0.0003, // prod value
      earthRoateDelta: 0.0007, // testing
      cameraHeight: 2000,
      cameraInitialHeight: 2000,
      globalTHREE: null,
      globalScene: null,
      earthSurfaceOffset: 20,
      earthCameraHeadOffset: -30,
      earthColorLighter: '#c3d0eb',
      earthColorDarker: '#6683bd',
      earthColorBackground: '#041536',
      earthGlobalLightIntencityMin: 0.3,
      earthGlobalLightIntencityMax: 1,
      flyTimeSpan: 2000,
      flyAnimationFreq: 50,
      flyZoomInCameraYOffset: 0.7,
      allowingDrawOrbit: true,
      lightBallDeminishDelta: 0.1,
      lightBallConfig: (score) => {
        const increment = Math.max(0, score - 4);
        const idx = Math.floor((score - 0.01) / PLAYING_MAX_SCORE_PER_QUESTION * 10)
        let color = LIGHTBALL_COLORS[0];
        if (idx >= 0 && idx < LIGHTBALL_COLORS.length) {
          color = LIGHTBALL_COLORS[idx];
        }
        return {
          ballRadius: 2 + increment / 4,
          ballHeight: 25 + increment / 4,
          ballColor: color,
          lightColor: color,
          lightIntencity:  0.5 + increment / 20,
          lightDistance:  10 + 10 * increment,
        }
      },
      failedLightBallConfig: {
        ballRadius: 5,
        ballHeight: 25,
        ballColor: '#f26363',
        lightColor: '#ff6e6e',
        lightIntencity:  2,
        lightDistance:  10,
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
        directionalLight: null,
        atmosphereMaterial: null,
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
      return store.state.systemInfo.pixelRatio * 2;
    },
    isIOS() {
      return store.state.systemInfo?.system?.slice(0,3) === 'iOS';
    },
    canvasHeight() {
      return store.state.systemInfo.windowHeight * 2 || 896 * 2 ;
    },
    canvasWidth() {
      return store.state.systemInfo.windowWidth * 2 || 414 * 2;
    },
    canvasStyle() {
      return `width: ${this.canvasWidth}px; height: ${this.canvasHeight}px; transform: scale(${1 / 2});`;
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
          this.canvas = canvas;
          const ctx = canvas.getContext('webgl');
          const THREE = createScopedThreejs(canvas);
          this.globalTHREE = THREE;
          this.renderEarth(THREE, canvas);

          console.log('this is canvas', canvas);
          console.log('this is ctx', ctx);
          if (this.isIOS) {
            this.threeConfig.maxLightBallCount = 100;
          } else {
            this.threeConfig.maxLightBallCount = 50;
          }
          const dpr = wx.getSystemInfoSync().pixelRatio * 2;
          console.log('dpr', dpr);
          ctx.canvas.width = this.canvasWidth * dpr;
          ctx.canvas.height = this.canvasHeight * dpr;
          canvas.width = this.canvasWidth * dpr;
          canvas.height = this.canvasHeight * dpr;
          canvas.clientWidth = this.canvasWidth * dpr;
          canvas.clientHeight = this.canvasHeight * dpr;
          console.log('new canvas', canvas);
          ctx.viewport(0, 0, this.canvasWidth * dpr, this.canvasHeight * dpr);
        });
    },
    async renderEarth(THREE, canvas) {
      const scene = new THREE.Scene();
      this.globalScene = scene;
      const camera = new THREE.PerspectiveCamera(50, this.canvasWidth  / this.canvasHeight, 0.5, 20000);
      this.camera = camera;
      this.reInitCamera();

      //New Renderer
      const renderer = new THREE.WebGLRenderer({
        powerPreference: 'high-performance',
      });
      renderer.setSize(this.canvasWidth, this.canvasHeight);
      // AmbientLight
      // const light = new THREE.HemisphereLight(this.earthColorLighter, this.earthColorDarker, this.earthGlobalLightIntencity);
      // const light = new THREE.AmbientLight(this.earthColorLighter,this.earthGlobalLightIntencity);
      const directionalLight = new THREE.DirectionalLight( 0xd4e9ff, this.earthGlobalLightIntencityMax );
      this.directionalLight = directionalLight;

      // set it to the right side of the earth and casting from the right to the left
      directionalLight.position.set( 1, 0.5, 0 );
      scene.add(directionalLight);

      // Create a sphere to make visualization easier.
      const geometry = new THREE.SphereGeometry(this.earthRadius, 32, 32 );
      const material = new THREE.MeshPhongMaterial({
          transparent: true,
          opacity: 1,
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      await this.drawEarthSurface(THREE, scene);
      await this.drawEarthClouds(THREE, scene);
      await this.drawRenderSky(THREE, scene);
      await this.drawEarthAtmosphere(THREE, scene);

      //Render the image
      renderer.setPixelRatio(2)
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
        }, this.flyTimeSpan + 10);
      }
    },
    async drawEarthClouds(THREE, scene) {
      const geometry = new THREE.SphereGeometry(this.earthRadius + this.earthSurfaceOffset + 3, 32, 32 );
      const texture = new THREE.TextureLoader().load(PICTURES_URL.CLOUDS);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      });
      const cloudsMesh = new THREE.Mesh(geometry, material);
      // no castShadow for clouds
      // cloudsMesh.receiveShadow = true;
      cloudsMesh.castShadow = false;
      scene.add(cloudsMesh);
    },
    async drawRenderSky(THREE, scene) {
      // render a sky star map.
      const skyGeometry = new THREE.SphereGeometry(3000, 32, 32);
      const skyMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(PICTURES_URL.STAR_MAP),
        side: THREE.BackSide,
        lights: false, // Disable lighting for the sky
      });
      const sky = new THREE.Mesh(skyGeometry, skyMaterial);
      scene.add(sky);
    },
    async drawEarthAtmosphere(THREE, scene) {
      const vertexShader = `
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal); // Transform normals to world space
          vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        uniform vec3 uLightDirection; // Uniform for dynamic light direction
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          vec3 normalizedLightDirection = normalize(uLightDirection);
          float lightDot = dot(vNormal, normalizedLightDirection);
          if (lightDot > 0.0) {
            float viewDot = dot(vNormal, normalize(vPositionNormal));
            float fresnelCoefficient = pow(1.1 - viewDot, 3.5);
            vec3 atmosphereColor = vec4(0.68, 0.85, 0.98, 1.0).rgb * fresnelCoefficient * lightDot;
            gl_FragColor = vec4(atmosphereColor, 1.0);
          } else {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Make it fully transparent if not facing the light
          }
        }
      `;


      const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uLightDirection: { value: this.directionalLight.position ? this.directionalLight.position : new THREE.Vector3(1, 0.5, 0) },
        },
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        depthTest: false
      });
      this.threeObjects.atmosphereMaterial = atmosphereMaterial;

      const atmosphereGeometry = new THREE.SphereGeometry(this.earthRadius * 1.05, 50, 50);
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);

      return atmosphereMaterial; // Return the material for external updates
    },
    async drawEarthSurface(THREE, scene ) {
      const geometry = new THREE.SphereGeometry(this.earthRadius + this.earthSurfaceOffset, 32, 32 );
      let texture = new THREE.TextureLoader().load(
        PICTURES_URL.EARTH, () => wx.hideLoading(),
      );
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
    convertXyzToLatLng(x, y, z, radius) {
      const lat = Math.asin(y / radius) * 180 / Math.PI;
      const lng = Math.atan2(z, x) * 180 / Math.PI;
      return { lat, lng };
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
    flyFromOneToAnother(lat1, lng1, lat2, lng2, isDrawOrbit, score, cameraHeight = this.cameraInitialHeight) {
      if (!this.canvas || this.canvas === undefined || this.canvas === null) {
        console.error('canvas is not ready');
        return;
      }
      const t = this.flyTimeSpan;
      const f = this.flyAnimationFreq;
      const steps = t / f;
      const delta_lat = (lat2 - lat1) / steps;
      const delta_lng = (lng2 - lng1) / steps;
      const delta_camera_height = (cameraHeight - this.cameraHeight) / steps;
      let currentGroundLat = lat1;
      let currentGroundLng = lng1;
      let currentHeight = 10;
      let currentCameraHeight = this.cameraHeight;
      let prevGroundLat = currentGroundLat;
      let prevGroundLng = currentGroundLng;
      let prevHeight = currentHeight;
      let count = 0;

      const update = () => {
          if (count >= steps) {
              this.anmtCtrl.isPlanePausing = true;
              this.anmtCtrl.isPlaneShaking = false;
              this.cameraHeight = cameraHeight;
              return;
          }

          // Your update logic here (same as in setInterval)
          let currentCameraLatLng = this.getOffsetLatLonByGroundPoint(currentGroundLat, currentGroundLng, this.earthCameraHeadOffset);
          let currentLookAtLatLng = this.getOffsetLatLonByGroundPoint(currentGroundLat, currentGroundLng, 0);
          let currentCameraXYZ = this.convertLatLngToXyz(
            currentCameraLatLng.lat,
            currentCameraLatLng.lng,
            this.earthRadius + currentCameraHeight,
            this.globalTHREE,
          );
          let currentLookAtXYZ = this.convertLatLngToXyz(
            currentLookAtLatLng.lat,
            currentLookAtLatLng.lng,
            this.earthRadius * 0.3 ,
            this.globalTHREE,
          )
          // make centerposition's y up 60 deg
          currentLookAtXYZ.y += this.flyZoomInCameraYOffset * this.earthRadius;
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
          currentCameraHeight += delta_camera_height;
          count += 1;

          this.canvas.requestAnimationFrame(update); // Loop the animation
      };

      this.anmtCtrl.isPlanePausing = false;
      this.anmtCtrl.isPlaneShaking = true;
      this.canvas.requestAnimationFrame(update); // Start the animation
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
      // remove the oldest light ball and decrease its intensity by 0.1
      this.threeObjects.lightBalls.forEach((item) => {
        item.light.intensity -= this.lightBallDeminishDelta;
        // if light is too dim, remove it from the scene
        if (item.light.intensity <= 0) {
          this.globalScene.remove(item.light);
        }
      });

      // 计算初始和最终位置
      let initialPosition = this.convertLatLngToXyz(lat, lng, this.earthRadius, this.globalTHREE);
      let finalPosition = this.convertLatLngToXyz(lat, lng, this.earthRadius + cfg.ballHeight, this.globalTHREE);
      let initialSize = 0;
      let finalSize = cfg.ballRadius;

      // 创建小球和光源
      const ball = new this.globalTHREE.Mesh(
        new this.globalTHREE.SphereGeometry(initialSize, 8, 8),
        new this.globalTHREE.MeshBasicMaterial({ color: cfg.ballColor })
      );
      const light = new this.globalTHREE.PointLight(cfg.lightColor, cfg.lightIntensity, cfg.lightDistance);

      // 设置初始位置
      ball.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
      light.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
      this.globalScene.add(ball);
      this.globalScene.add(light);
      this.threeObjects.lightBalls.push({
        ball, light,
      });

      // 创建动画
      let startTime = Date.now();
      let duration = 500; // Animation duration in milliseconds

      const quickInEaseOut = (t) => t ** 3 * (t * (t * 6 - 15) + 10);

      const animate = () => {
        let elapsedTime = Date.now() - startTime;
        let t = elapsedTime / duration;
        if (t < 1) {
          let easeT = quickInEaseOut(t);
          ball.position.x = initialPosition.x + (finalPosition.x - initialPosition.x) * easeT;
          ball.position.y = initialPosition.y + (finalPosition.y - initialPosition.y) * easeT;
          ball.position.z = initialPosition.z + (finalPosition.z - initialPosition.z) * easeT;
          light.position.set(ball.position.x, ball.position.y, ball.position.z);
          ball.scale.setScalar(initialSize + (finalSize - initialSize) * easeT);
          this.canvas.requestAnimationFrame(animate);
        } else {
          ball.position.set(finalPosition.x, finalPosition.y, finalPosition.z);
          light.position.set(finalPosition.x, finalPosition.y, finalPosition.z);
        }
        // this.globalRenderer.render(this.globalScene, this.globalCamera);
      }

      animate();

      // remove the oldest light ball
      if (this.threeObjects.lightBalls.length > this.threeConfig.maxLightBallCount) {
        const { ball, light } = this.threeObjects.lightBalls.shift();
        ball.geometry.dispose();
        ball.material.dispose();
        this.globalScene.remove(ball);
        this.globalScene.remove(light);
      }
    },
    handleTouchStart(e) {
      console.log('touchstart', e);
    },
    watchFlyingEvent() {
      EventBus.$on('flyFromOneToAnother', (flyConfig) => {
        const { fromLat, fromLon, toLat, toLon, isDrawOrbit, score, cameraHeight } = flyConfig;
        this.flyFromOneToAnother(fromLat, fromLon, toLat, toLon, isDrawOrbit, score, cameraHeight);
      });
    },
    setCameraHeight(height, animated = false) {
      if (animated) {
        const t = 1000;
        const f = 50;
        const steps = t / f;
        const delta = (height - this.cameraHeight) / steps;
        let count = 0;
        let currentCameraHeight = this.cameraHeight;
        const update = () => {
          if (count >= steps) {
            this.cameraHeight = height;
            return;
          }
          currentCameraHeight += delta;
          const currentCameraLatLng = this.convertXyzToLatLng(
            this.camera.position.x,
            this.camera.position.y,
            this.camera.position.z,
            this.earthRadius + currentCameraHeight,
          );
          const currentCameraXYZ = this.convertLatLngToXyz(
            currentCameraLatLng.lat,
            currentCameraLatLng.lng,
            this.earthRadius + currentCameraHeight,
            this.globalTHREE,
          );
          this.camera.position = { ...currentCameraXYZ };
          count += 1;
          this.canvas.requestAnimationFrame(update);
        };
        update();
      } else {
        const currentCameraLatLng = this.convertXyzToLatLng(
          this.camera.position.x,
          this.camera.position.y,
          this.camera.position.z,
          this.earthRadius * 0.3 + this.cameraHeight,
        );
        const currentCameraXYZ = this.convertLatLngToXyz(
          currentCameraLatLng.lat,
          currentCameraLatLng.lng,
          this.earthRadius + height,
          this.globalTHREE,
        );
        this.camera.position = { ...currentCameraXYZ };
        this.cameraHeight = height;
      }
    },
    reInitCamera() {
      this.cameraHeight = this.cameraInitialHeight;
      let currentCameraLatLng = this.getOffsetLatLonByGroundPoint(40, 116, this.earthCameraHeadOffset);
      let currentCameraXYZ = this.convertLatLngToXyz(
        currentCameraLatLng.lat,
        currentCameraLatLng.lng,
        this.earthRadius + this.cameraHeight,
        this.globalTHREE,
      );

      this.camera.up.set( 0, 1, 0 );
      this.camera.position = { ...currentCameraXYZ };
      this.camera.lookAt( new this.globalTHREE.Vector3(0, 0, 0) );

      // this.setCameraHeight(this.cameraInitialHeight, false);
    },
    watchEarthRotation() {
      EventBus.$on('enableEarthRotation', () => {
        // reset camera before rotate
        this.reInitCamera();
        if (!this.globalScene) return;
        // set directionalLight intensity to max
        this.directionalLight.intensity = this.earthGlobalLightIntencityMax;
        this.rotationClockId = 'running';
        const animate = () => {
          if (this.rotationClockId === -1) return;
          if (this.globalScene) {
            this.globalScene.rotation.y += this.earthRoateDelta;
          }
          // rotate directional light towards the opposite direction and same speed.
          this.directionalLight.position.set(
            Math.cos(this.globalScene.rotation.y * 3) * 1,
            0.5,
            Math.sin(this.globalScene.rotation.y * 3) * 1,
          );
          // directionalLit actually only rotated 2 times of the earth because of the rotation of the earth.
          const lightRelativePosition = new this.globalTHREE.Vector3(
            Math.cos(this.globalScene.rotation.y * 2) * 1,
            0.5,
            Math.sin(this.globalScene.rotation.y * 2) * 1,
          );
          // set threeObjects.atmosphereMaterial's uLightDirection to the opposite direction of the rotation.
          this.threeObjects.atmosphereMaterial.uniforms.uLightDirection.value = lightRelativePosition;
          // set needUpdate to true to update the uniform value.
          this.threeObjects.atmosphereMaterial.needsUpdate = true;
          // rerender the scene
          this.canvas.requestAnimationFrame(animate);
        };
        animate();
        // set camera height to initial height
        // this.setCameraHeight(this.cameraInitialHeight, false);
      });
      EventBus.$on('disableEarthRotation', () => {
        // clearInterval(this.rotationClockId);
        // set directionalLight intensity to min. animate by adding 0.05 each frame.
        const animate = () => {
          if (this.directionalLight && this.directionalLight.intensity > this.earthGlobalLightIntencityMin) {
            this.directionalLight.intensity -= 0.01;
            this.canvas.requestAnimationFrame(animate);
          }
        };
        animate();
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
      EventBus.$on('startPlayEarthAnimation', (cfg) => {
        // 1. 清除地球上现存的所有光点
        while (this.threeObjects.lightBalls.length > 0) {
          const { ball, light } = this.threeObjects.lightBalls.shift();
          ball.geometry.dispose();
          ball.material.dispose();
          this.globalScene.remove(ball);
          this.globalScene.remove(light);
        }
        // // 1.5 DirectionalLight light的intensity设为最小值
        // this.globalScene.children.forEach((item) => {
        //   if (item.type === 'DirectionalLight') {
        //     item.intensity = this.earthGlobalLightIntencity;
        //   }
        // });
        // 2. 飞向开始的点
        if (this.globalScene) {
          const { lat, lon } = cfg;
          this.flyFromOneToAnother(40, 116, lat, lon, false, 0, 600);
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