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
import {
  PICTURES_URL,
  LIGHTBALL_COLORS,
  PLAYING_MAX_SCORE_PER_QUESTION,
} from '@/utils/constants';
import { createScopedThreejs } from '@/utils/createScopedThreejs.js';
// import { createScopedThreejs } from 'threejs-miniprogram';
import StartPage from '@/components/start-page.vue';
import GuidePage from '@/components/guide-page.vue';
import EndPage from '@/components/end-page.vue';
import Compass from '@/components/compass.vue';
import EventAgent from '@/components/event-agent.vue';
import { EventBus } from '@/utils/eventBus';
import { LightGlowingBallManager } from './earth-components/light-ball';
import { InstancedOrbitArcsManager } from './earth-components/orbit-arc';

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
      earthRoateDelta: 0.15, // testing
      cameraHeight: 2000,
      cameraInitialHeight: 2000,
      playingModeCameraHeight: 800,
      directionalLightInitialPosition: [0, 0, 1],
      globalTHREE: null,
      globalScene: null,
      earthSurfaceOffset: 20,
      earthCameraHeadOffset: -30,
      earthColorLighter: '#c3d0eb',
      earthColorDarker: '#6683bd',
      earthColorBackground: '#041536',
      earthGlobalLightIntencityMin: 0.3,
      earthGlobalLightIntencityMax: 0.5,
      earthAmbientLightIntencity: 0.3,
      orbitArcHeight: 100,
      LightGlowingBallManager: null,
      InstancedOrbitArcsManager: null,
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
        instancedLightBallsPositions: [],
        directionalLight: null,
        innerAtmosphereMaterial: null,
        outerAtmosphereMaterial: null,
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
          console.log('this is THREE', THREE);
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
      const directionalLight = new THREE.DirectionalLight( 0xd4e9ff, this.earthGlobalLightIntencityMax );
      this.directionalLight = directionalLight;

      // set it to the right side of the earth and casting from the right to the left
      console.log('directionalLightInitialPosition', this.directionalLightInitialPosition);
      directionalLight.position.set( this.directionalLightInitialPosition[0], this.directionalLightInitialPosition[1], this.directionalLightInitialPosition[2] );
      console.log('directionalLightdirectionalLight', directionalLight.position);
      scene.add(directionalLight);

      // add ambient light
      const ambientLight = new THREE.AmbientLight(this.earthColorLighter,this.earthAmbientLightIntencity);
      scene.add(ambientLight);


      // Create a sphere to make visualization easier.
      const geometry = new THREE.SphereGeometry(this.earthRadius, 64, 64 );
      const material = new THREE.MeshPhongMaterial({
          transparent: true,
          opacity: 1,
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      await this.drawEarthSurface(THREE, scene);
      await this.drawEarthClouds(THREE, scene);
      await this.drawRenderSky(THREE, scene);
      // await this.drawEarthInnerFresnelAtmosphere(THREE, scene);
      await this.drawEarthOuterAtmosphere(THREE, scene);
      this.LightGlowingBallManager = new LightGlowingBallManager(THREE, scene, this.earthRadius);
      this.InstancedOrbitArcsManager = new InstancedOrbitArcsManager(THREE, scene, this.earthRadius);

      //Render the image
      renderer.setPixelRatio(2)
      const render = () => {
        canvas.requestAnimationFrame(render);
        renderer.setClearColor(this.earthColorBackground, 1);
        renderer.render(scene, this.camera);
      }
      render();

      // // enable auto rotate
      // if (this.currentRoute === 'home') {
      //   this.flyFromOneToAnother(
      //     40, 179, 40, 116, false, 0
      //   );
      //   setTimeout(() => {
      EventBus.$emit('enableEarthRotation');
      //   }, this.flyTimeSpan + 10);
      // }
    },
    async drawEarthClouds(THREE, scene) {
      const geometry = new THREE.SphereGeometry(this.earthRadius + this.earthSurfaceOffset + 1, 64, 64 );
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
      // make it rotate slowly
      const animate = () => {
        cloudsMesh.rotation.y += 0.00005;
        this.canvas.requestAnimationFrame(animate);
      };
      animate();
    },
    async drawRenderSky(THREE, scene) {
      // render a sky star map.
      const skyGeometry = new THREE.SphereGeometry(3000, 64, 64);
      const skyMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(PICTURES_URL.STAR_MAP),
        side: THREE.BackSide,
        lights: false, // Disable lighting for the sky
      });
      const sky = new THREE.Mesh(skyGeometry, skyMaterial);
      scene.add(sky);
    },
    async drawEarthInnerFresnelAtmosphere(THREE, scene) {
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
            float fresnelCoefficient = pow(1.0 - viewDot, 1.1);
            vec3 atmosphereColor = vec4(0.68, 0.85, 0.98, 1.0).rgb * fresnelCoefficient * lightDot;
            gl_FragColor = vec4(atmosphereColor, 1.0);
          } else {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Make it fully transparent if not facing the light
          }
        }
      `;


      const innerAtmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uLightDirection: { value: this.directionalLight.position ? this.directionalLight.position : new THREE.Vector3(this.directionalLightInitialPosition[0], this.directionalLightInitialPosition[1], this.directionalLightInitialPosition[2]) }
        },
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        depthTest: false
      });
      this.threeObjects.innerAtmosphereMaterial = innerAtmosphereMaterial;

      const atmosphereGeometry = new THREE.SphereGeometry(this.earthRadius * 1.05, 64, 64);
      const atmosphere = new THREE.Mesh(atmosphereGeometry, innerAtmosphereMaterial);
      scene.add(atmosphere);
    },
    async drawEarthOuterAtmosphere(THREE, scene) {
      const atmosphereRadius = this.earthRadius + 50;
      const atmosphereGeometry = new THREE.SphereGeometry(atmosphereRadius, 64, 64);

      const vertexShader = `
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal); // Transform normals to world space
          vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      // const fragmentShaderConsiderLight = `
      //   uniform vec3 uLightDirection; // Uniform for dynamic light direction
      //   varying vec3 vNormal;
      //   varying vec3 vPositionNormal;
      //   void main() {
      //     vec3 normalizedLightDirection = normalize(uLightDirection);
      //     float lightDot = dot(vNormal, normalizedLightDirection);
      //     float viewDot = dot(vNormal, normalize(vPositionNormal));
      //     float fresnelCoefficient = pow(3.0 * viewDot, 5.0); // Gradient effect
      //     vec3 atmosphereColor = vec4(0.68, 0.85, 0.98, fresnelCoefficient).rgb; // Adjust color to include alpha
      //     if (lightDot > 0.0) {
      //       gl_FragColor = vec4(atmosphereColor * lightDot, fresnelCoefficient);
      //     } else {
      //       gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Make it fully transparent if not facing the light
      //     }
      //   }
      // `;

      const fragmentShader = `
        uniform vec3 uLightDirection; // Uniform for dynamic light direction
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          // vec3 normalizedLightDirection = normalize(uLightDirection); // Not needed
          // float lightDot = dot(vNormal, normalizedLightDirection); // Not needed
          float viewDot = dot(vNormal, normalize(vPositionNormal));
          float fresnelCoefficient = pow(2.0 * viewDot, 3.0); // Gradient effect
          vec3 atmosphereColor = vec4(0.68, 0.85, 0.98, fresnelCoefficient).rgb; // Adjust color to include alpha
          
          // Remove the condition on lightDot and use fresnelCoefficient directly for the alpha
          gl_FragColor = vec4(atmosphereColor, fresnelCoefficient);
        }
      `;


      const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uLightDirection: { value: this.directionalLight.position.clone().normalize() }
        },
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        depthTest: true, // this will make the outer atmosphere not visible when the camera is inside the earth.
      });

      this.threeObjects.outerAtmosphereMaterial = atmosphereMaterial;

      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);
    },

    async drawEarthSurface(THREE, scene ) {
      const geometry = new THREE.SphereGeometry(this.earthRadius + this.earthSurfaceOffset, 64, 64 );
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
      if (cameraHeight === 600) {
        // hard code here, this means the camera is in the playing mode
        cameraHeight = this.playingModeCameraHeight;
      }
      const t = this.flyTimeSpan;
      const f = this.flyAnimationFreq;
      const steps = t / f;
      const delta_lat = lat2 - lat1;
      const delta_lng = lng2 - lng1;
      const delta_camera_height = cameraHeight - this.cameraHeight;
      let currentGroundLat = lat1;
      let currentGroundLng = lng1;
      let currentHeight = 10;
      let currentCameraHeight = this.cameraHeight;
      let prevGroundLat = currentGroundLat;
      let prevGroundLng = currentGroundLng;
      let prevHeight = currentHeight;
      let count = 0;

      const easeInOutCubic = (t) => {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const update = () => {
          if (count >= steps) {
              this.anmtCtrl.isPlanePausing = true;
              this.anmtCtrl.isPlaneShaking = false;
              this.cameraHeight = cameraHeight;
              return;
          }

          // Calculate the eased progress
          const progress = easeInOutCubic(count / steps);

          // Interpolate current positions with easing
          currentGroundLat = lat1 + delta_lat * progress;
          currentGroundLng = lng1 + delta_lng * progress;
          currentCameraHeight = this.cameraHeight + delta_camera_height * progress;

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

          prevGroundLat = currentGroundLat;
          prevGroundLng = currentGroundLng;

          count += 1;

          this.canvas.requestAnimationFrame(update); // Loop the animation
      };

      this.anmtCtrl.isPlanePausing = false;
      this.anmtCtrl.isPlaneShaking = true;
      this.canvas.requestAnimationFrame(update); // Start the animation

      // draw orbit arc if needed
      if (isDrawOrbit) {
        this.InstancedOrbitArcsManager?.addOrbitArc({ lat: lat1, lon: lng1 }, { lat: lat2, lon: lng2 });
      }
      
      // this.removeFlyRouteLines();
      // this.drawLightBall(lat2, lng2, this.lightBallConfig(score));
      this.drawLightBallInstanced(lat2, lng2);
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
    drawLightBallInstanced(lat, lng) {
      this.LightGlowingBallManager?.addNewInstancedLightBall(lat, lng);
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
    reInitSceneRotation() {
      if (!this.globalScene) return;
      this.globalScene.rotation.y = 0;
      this.globalScene.rotation.x = 0;
      this.globalScene.rotation.z = 0;
    },
    watchEarthRotation() {
      EventBus.$on('EarthDraggedRotation', (baseX, baseY) => {
        if (!this.globalScene) return;
        const rotationY = baseX / 100;
        // const rotationX = baseY / 100;
        this.globalScene.rotation.y = rotationY;
        // this.globalScene.rotation.x = rotationX;

        // SUB TASK 1:  Align the directional light with the rotation of the earth
        // Calculate the inverse rotation matrix
        const inverseRotation = new this.globalTHREE.Matrix4().makeRotationY(-this.globalScene.rotation.y);
        const inverseRotation2 = new this.globalTHREE.Matrix4().makeRotationX(-this.globalScene.rotation.x);
        // Calculate the new light direction
        const lightDirection = new this.globalTHREE.Vector3(this.directionalLightInitialPosition[0], this.directionalLightInitialPosition[1], this.directionalLightInitialPosition[2]).applyMatrix4(inverseRotation).applyMatrix4(inverseRotation2);
        // Update the light direction
        this.directionalLight.position.set(lightDirection.x, lightDirection.y, lightDirection.z);


        // SUB TASK 2:  Align the atmosphere with the rotation of the earth
        // requestAnimationFrame
        // this.canvas.requestAnimationFrame(() => {
        //   // Calculate the inverse rotation matrix
        //   // Update the atmosphere material
        //   if (this.threeObjects.innerAtmosphereMaterial && this.threeObjects.outerAtmosphereMaterial) {
        //     this.threeObjects.innerAtmosphereMaterial.uniforms.uLightDirection.value.copy(lightDirection);
        //     this.threeObjects.outerAtmosphereMaterial.uniforms.uLightDirection.value.copy(lightDirection);
        //     this.threeObjects.innerAtmosphereMaterial.needsUpdate = true;
        //     this.threeObjects.outerAtmosphereMaterial.needsUpdate = true;


        //     console.log('Updating atmosphere materials', lightDirection)
        //     console.log('\tinner:', this.threeObjects.innerAtmosphereMaterial.uniforms.uLightDirection.value.x, this.threeObjects.innerAtmosphereMaterial);
        //     console.log('\touter:', this.threeObjects.outerAtmosphereMaterial.uniforms.uLightDirection.value.x, this.threeObjects.outerAtmosphereMaterial);
        //   }
        // });
      });
      EventBus.$on('enableEarthRotation', () => {
        // // reset camera before rotate
        this.reInitCamera();
        this.reInitSceneRotation();

        // console.log('enabled==========')

        // if (!this.globalScene) return;
        // // set directionalLight intensity to max
        // this.directionalLight.intensity = this.earthGlobalLightIntencityMax;
        // this.rotationClockId = 'running';
        // let currentRotation = 0;
        // const animate = () => {
        //   if (this.rotationClockId === -1) return;
        //   currentRotation += this.earthRoateDelta;
        //   const clockwiseReversedLightRelativePosition = new this.globalTHREE.Vector3(
        //     Math.cos(-currentRotation-120),
        //     0.5,
        //     Math.sin(-currentRotation-120),
        //   );
        //   if (this.threeObjects.innerAtmosphereMaterial) {
        //     this.threeObjects.innerAtmosphereMaterial.uniforms.uLightDirection.value = clockwiseReversedLightRelativePosition;
        //     this.threeObjects.innerAtmosphereMaterial.needsUpdate = true;
        //     console.log('updated inner at')
        //   }

        //   if (this.threeObjects.outerAtmosphereMaterial) {
        //     this.threeObjects.outerAtmosphereMaterial.uniforms.uLightDirection.value = clockwiseReversedLightRelativePosition;
        //     this.threeObjects.outerAtmosphereMaterial.needsUpdate = true;
        //   }
          
        //   this.canvas.requestAnimationFrame(animate);
        // };
        // animate();
      });
      EventBus.$on('playAgain', () => {
        // dispose all the light balls and arcs
        this.LightGlowingBallManager?.clearAllInstancedLightBalls();
        this.InstancedOrbitArcsManager?.clearAllOrbitArcs();
      });
      EventBus.$on('disableEarthRotation', () => {
        this.reInitSceneRotation();
        // dispose all the light balls and arcs
        this.LightGlowingBallManager?.clearAllInstancedLightBalls();
        this.InstancedOrbitArcsManager?.clearAllOrbitArcs();
        // clearInterval(this.rotationClockId);
        // set directionalLight intensity to min. animate by adding 0.05 each frame.
        // const animate = () => {
        //   if (this.directionalLight && this.directionalLight.intensity > this.earthGlobalLightIntencityMin) {
        //     this.directionalLight.intensity -= 0.01;
        //     this.canvas.requestAnimationFrame(animate);
        //   }
        // };
        // animate();
        // this.rotationClockId = -1;
        // this.globalScene.rotation.y = 0;
      });
    },
    watchShowFailedCityEvent() {
      EventBus.$on('showFailedCityPoint', (cityConfig) => {
        const { toLat, toLon } = cityConfig;
        // this.drawLightBall(toLat, toLon,
        //   this.failedLightBallConfig);
        this.drawLightBallInstanced(toLat, toLon);
      });
    },
    watchInitEarthAnimation() {
      EventBus.$on('startPlayEarthAnimation', (cfg) => {
        // 1. 清除地球上现存的所有光点
        this.LightGlowingBallManager?.clearAllInstancedLightBalls();

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
          this.flyFromOneToAnother(40, 116, lat, lon, false, 0, this.playingModeCameraHeight);
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