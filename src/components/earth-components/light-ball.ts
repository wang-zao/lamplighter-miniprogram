export class LightGlowingBall {
  private geometry: any;
  private material: any;
  public mesh: any;

  constructor(globalTHREE: any, radius: number, widthSegments: number, heightSegments: number, instanceCount: number) {
    // Define the geometry
    this.geometry = new globalTHREE.SphereGeometry(radius, widthSegments, heightSegments);

    // make the material simply white
    this.material = new globalTHREE.MeshBasicMaterial({ color: 0xffffff });

    // Create the instanced mesh
    this.mesh = new globalTHREE.InstancedMesh(this.geometry, this.material, instanceCount);
  }

  // Optionally, you can add methods to update ball properties
  public setLightIntensity(intensity: number): void {
    this.material.uniforms.lightIntensity.value = intensity;
  }

  public dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export class LightGlowingBallOuterGlow {
  private geometry: any;
  private material: any;
  public mesh: any;

  constructor(globalTHREE: any, radius: number, widthSegments: number, heightSegments: number) {
    // Define the geometry
    this.geometry = new globalTHREE.SphereGeometry(radius, widthSegments, heightSegments);

    // make a glowing shader material
    this.material = new globalTHREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal); // Transform normals to world space
          vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          float viewDot = dot(vNormal, normalize(vPositionNormal));
          float fresnelCoefficient = pow(1.0 * viewDot, 5.0); // Gradient effect
          vec3 atmosphereColor = vec4(0.68, 0.68, 0.68, fresnelCoefficient).rgb; // Adjust color to include alpha
          
          // Remove the condition on lightDot and use fresnelCoefficient directly for the alpha
          gl_FragColor = vec4(atmosphereColor, fresnelCoefficient);
        }
      `,
      side: globalTHREE.BackSide,
      blending: globalTHREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      depthTest: true, // this will make the outer atmosphere not visible when the camera is inside the earth.
      uniforms: {
        lightIntensity: { value: 1.0 },
      },
    });

    // Create the instanced mesh
    this.mesh = new globalTHREE.Mesh(this.geometry, this.material);
  }

  // Optionally, you can add methods to update ball properties
  public setLightIntensity(intensity: number): void {
    this.material.uniforms.lightIntensity.value = intensity;
  }

  public dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}


export class LightGlowingBallManager {
  private globalTHREE: any;
  private globalScene: any;
  private currentMesh: any = null;
  private earthGlobeRadius: number = 1;
  private instancedLightBallsPositions: {lat: number, lon: number}[] = [];
  private lightBallElevationFromEarthSurface: number = 25;
  private managedMeshesArray: LightGlowingBallOuterGlow[] = [];

  constructor(
    globalTHREE: any,
    globalScene: any,
    earthGlobeRadius: number,
  ) {
    this.globalTHREE = globalTHREE;
    this.globalScene = globalScene;
    this.earthGlobeRadius = earthGlobeRadius;
  }

  private convertLatLngToXyz(lat: number, lon: number, radius: number, THREE: any) {
    const phi = (90 - lat) * Math.PI / 180,
      theta = (180 - lon) * Math.PI / 180,
      position = new THREE.Vector3();

    position.x = radius * Math.sin(phi) * Math.cos(theta);
    position.y = radius * Math.cos(phi);
    position.z = radius * Math.sin(phi) * Math.sin(theta);

    return position;
  }

  private recreateInstancedMeshBasedOnData(
    instancedLightBallsPositions: {lat: number, lon: number}[],
  ): void {
    // Dispose the old mesh
    if (this.currentMesh) {
      this.currentMesh.dispose();
      this.globalScene.remove(this.currentMesh);
    }

    // Create the new light glowing balls
    const lightGlowingBall = new LightGlowingBall(this.globalTHREE, 2, 32, 32, instancedLightBallsPositions.length);

    // Update the position of each instance
    const matrix = new this.globalTHREE.Matrix4();
    for (let i = 0; i < instancedLightBallsPositions.length; i++) {
      const { lat, lon } = instancedLightBallsPositions[i];
      const position = this.convertLatLngToXyz(lat, lon, this.earthGlobeRadius + this.lightBallElevationFromEarthSurface, this.globalTHREE);
      matrix.makeTranslation(position.x, position.y, position.z);
      lightGlowingBall.mesh.setMatrixAt(i, matrix);
    }

    // Update the instanced mesh
    lightGlowingBall.mesh.instanceMatrix.needsUpdate = true;

    // Add the mesh to the scene
    this.globalScene.add(lightGlowingBall.mesh);

    this.currentMesh = lightGlowingBall.mesh;
  }

  public clearAllInstancedLightBalls(): void {
    this.instancedLightBallsPositions = [];
    // dispose the old mesh
    if (this.currentMesh) {
      this.currentMesh.dispose();
      this.globalScene.remove(this.currentMesh);
    }
    // clear the managed meshes array
    this.managedMeshesArray.forEach((mesh) => {
      mesh.dispose();
      this.globalScene.remove(mesh.mesh);
    });
  }

  public addNewInstancedLightBall(lat: number, lon: number): void {
    // update the data
    this.instancedLightBallsPositions.push({ lat, lon });

    // Recreate the instanced mesh
    this.recreateInstancedMeshBasedOnData(this.instancedLightBallsPositions);

    // add glowing post processing effect
    const lightGlowingBallOuterGlow = new LightGlowingBallOuterGlow(this.globalTHREE, 5, 32, 32);
    const position = this.convertLatLngToXyz(lat, lon, this.earthGlobeRadius + this.lightBallElevationFromEarthSurface, this.globalTHREE);
    lightGlowingBallOuterGlow.mesh.position.set(position.x, position.y, position.z);
    // lightGlowingBallOuterGlow.mesh.instanceMatrix.needsUpdate = true;
    this.globalScene.add(lightGlowingBallOuterGlow.mesh);

    // push it into a managed array
    this.managedMeshesArray.push(lightGlowingBallOuterGlow);
    
  }
}