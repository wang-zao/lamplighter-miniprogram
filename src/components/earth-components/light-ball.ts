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

  constructor(globalTHREE: any, radius: number, widthSegments: number, heightSegments: number, instanceCount: number) {
    // Define the geometry
    this.geometry = new globalTHREE.SphereGeometry(radius, widthSegments, heightSegments);

    // make a glowing shader material
    this.material = new globalTHREE.ShaderMaterial( {
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.5 - dot(vNormal, vec3(0, 0, 1)), 2.0);
          gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0) * intensity;
        }
      `,
      uniforms: {
        lightIntensity: { value: 1.0 },
      },
    });

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


export class LightGlowingBallManager {
  private globalTHREE: any;
  private globalScene: any;
  private currentMesh: any = null;
  private earthGlobeRadius: number = 1;
  private instancedLightBallsPositions: {lat: number, lon: number}[] = [];

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
    // const lightGlowingBallOuterGlow = new LightGlowingBallOuterGlow(this.globalTHREE, 450, 32, 32, instancedLightBallsPositions.length);

    // Update the position of each instance
    const matrix = new this.globalTHREE.Matrix4();
    for (let i = 0; i < instancedLightBallsPositions.length; i++) {
      const { lat, lon } = instancedLightBallsPositions[i];
      const position = this.convertLatLngToXyz(lat, lon, this.earthGlobeRadius + 20, this.globalTHREE);
      matrix.makeTranslation(position.x, position.y, position.z);
      lightGlowingBall.mesh.setMatrixAt(i, matrix);
      // lightGlowingBallOuterGlow.mesh.setMatrixAt(i, matrix);
    }

    // Update the instanced mesh
    lightGlowingBall.mesh.instanceMatrix.needsUpdate = true;
    // lightGlowingBallOuterGlow.mesh.instanceMatrix.needsUpdate = true;

    // Add the mesh to the scene
    this.globalScene.add(lightGlowingBall.mesh);
    // this.globalScene.add(lightGlowingBallOuterGlow.mesh);

    this.currentMesh = lightGlowingBall.mesh;
  }

  public clearAllInstancedLightBalls(): void {
    this.instancedLightBallsPositions = [];
    // dispose the old mesh
    if (this.currentMesh) {
      this.currentMesh.dispose();
      this.globalScene.remove(this.currentMesh);
    }
  }

  public addNewInstancedLightBall(lat: number, lon: number): void {
    // update the data
    this.instancedLightBallsPositions.push({ lat, lon });

    // Recreate the instanced mesh
    this.recreateInstancedMeshBasedOnData(this.instancedLightBallsPositions);
  }
}