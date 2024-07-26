
// the first fake half circle used to show the animation of the orbit arc creation
// it should have the black or blank side up first, then rotate from the from point to the to point
// then the second half circle should be created to complete the circle
// color: 1/2 black, 1/2 white, opacity: 0.5, width: 1
// The animation is just a rotation from the from point to the to point
// it will be disposed after the animation is done and replaced by the real orbit arc instance
export class OrbitArc {
  private mesh: any;
  private mixer: any;
  
  constructor(globalTHREE: any, start: {x: number, y: number, z: number}, end: {x: number, y: number, z: number}, lookAt: {x: number, y: number, z: number}, opacity: number) {
    // Create circle geometry
    const d = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2) + Math.pow(end.z - start.z, 2));
    const radius = d / 2;
    const geometry = new globalTHREE.RingGeometry(radius, radius, 64);
    const material = new globalTHREE.MeshBasicMaterial({
      color: 0xffffff,
      side: globalTHREE.DoubleSide,  // Ensure it's visible from both sides
      opacity: opacity,
      transparent: true
    });
    this.mesh = new globalTHREE.Line(geometry, material);

    // Position mesh at the midpoint between start and end points
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const midZ = (start.z + end.z) / 2;
    this.mesh.position.set(midX, midY, midZ);

    // Adjust orientation to align with the start-end line.
    this.mesh.lookAt(new globalTHREE.Vector3(lookAt.x, lookAt.y, lookAt.z));

    // Initialize the animation mixer
    this.mixer = new globalTHREE.AnimationMixer(this.mesh);
  }

  dispose(): void {
    this.mixer.uncacheRoot(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    // remove from the scene
    this.mesh.parent.remove(this.mesh);
    
  }

  getMesh(): any {
    return this.mesh;
  }
}

// class to manage the instanced orbit arcs
// functions:
// - addOrbitArc(from: {lat: number, lon: number}, to: {lat: number, lon: number}): void
//   this function will create a singleAnimatedOrbitArc first and animate it.
//   after the animation is done, it will be disposed and replaced by the real orbit arc instance.
//   it will do so by delete the current singleAnimatedOrbitArc, and delete the InstancedOrbitArcs as well, but create a new one with new arc added to the previous arcs
// - clearAllOrbitArcs(): void
//   this function will dispose all the instanced orbit arcs
export class InstancedOrbitArcsManager {
  // private arcs: InstancedOrbitArcs;
  private scene: any;
  private globalTHREE: any;
  private earthGlobeRadius: number;
  private lightBallElevationFromEarthSurface: number = 15;
  private orbitArcArray: {arc: OrbitArc, from: {lat: number, lon: number}, to: {lat: number, lon: number}}[] = [];

  constructor(globalTHREE: any, scene: any, earthGlobeRadius: number) {
    this.earthGlobeRadius = earthGlobeRadius;
    this.globalTHREE = globalTHREE;
    this.scene = scene;
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

  private getLookAtPointXYZ(pointA: {x: number, y: number, z: number}, pointB: {x: number, y: number, z: number}): {x: number, y: number, z: number} {
    // 将点A和点B转换为Vector3对象
    const A = new this.globalTHREE.Vector3(pointA.x, pointA.y, pointA.z);
    const B = new this.globalTHREE.Vector3(pointB.x, pointB.y, pointB.z);

    // 计算中点C
    const C = A.clone().add(B).multiplyScalar(0.5);

    // 计算向量C到地心的向量
    const center = new this.globalTHREE.Vector3(0, 0, 0);
    const CToCenter = center.sub(C);

    // 计算A到B的向量
    const AB = B.sub(A);

    // 计算垂直于AB和CToCenter的向量，这将是正方形的一个边向量
    const perpendicular = AB.clone().cross(CToCenter).normalize().multiplyScalar(AB.length() / Math.sqrt(2));

    // 计算正方形的一个顶点，我们取中点C，沿着垂直向量移动得到新的顶点
    const lookAtPoint = C.add(perpendicular); // 或者 C.sub(perpendicular) 来获取另一个顶点

    // 返回lookAt点的坐标
    return {x: lookAtPoint.x, y: lookAtPoint.y, z: lookAtPoint.z};
  }
  

  turnLastOrbitToLessVisible(): void {
    // pop last orbit arc from the array if it exists
    if (this.orbitArcArray.length > 0) {
      const lastOrbitArc = this.orbitArcArray.pop();
      if (lastOrbitArc === undefined) {
        return;
      }
      // dispose the last orbit arc
      lastOrbitArc.arc.dispose();
      // create a new instanced orbit arcs with the last orbit arc removed but less opacity
      const start = this.convertLatLngToXyz(lastOrbitArc.from.lat, lastOrbitArc.from.lon, this.earthGlobeRadius + this.lightBallElevationFromEarthSurface, this.globalTHREE);
      const end = this.convertLatLngToXyz(lastOrbitArc.to.lat, lastOrbitArc.to.lon, this.earthGlobeRadius + this.lightBallElevationFromEarthSurface, this.globalTHREE);
      const lookAt = this.getLookAtPointXYZ(start, end);
      const singleAnimatedOrbitArc = new OrbitArc(this.globalTHREE, start, end, lookAt, 0.05);
      this.scene.add(singleAnimatedOrbitArc.getMesh());
      // add this to managed data array
      this.orbitArcArray.push({arc: singleAnimatedOrbitArc, from: lastOrbitArc.from, to: lastOrbitArc.to});
    }
  }


  addOrbitArc(from: {lat: number, lon: number}, to: {lat: number, lon: number}): void {
    // turnLastOrbitToLessVisible first
    this.turnLastOrbitToLessVisible();

    setTimeout(() => {
      // add the animated orbit arc first
      const start = this.convertLatLngToXyz(from.lat, from.lon, this.earthGlobeRadius + this.lightBallElevationFromEarthSurface, this.globalTHREE);
      const end = this.convertLatLngToXyz(to.lat, to.lon, this.earthGlobeRadius + this.lightBallElevationFromEarthSurface, this.globalTHREE);
      const lookAt = this.getLookAtPointXYZ(start, end);
      const singleAnimatedOrbitArc = new OrbitArc(this.globalTHREE, start, end, lookAt, 1);
      this.scene.add(singleAnimatedOrbitArc.getMesh());
      // add this to managed data array
      this.orbitArcArray.push({arc: singleAnimatedOrbitArc, from: from, to: to});
    }, 500);
  }

  clearAllOrbitArcs(): void {
    // dispose all the orbit arcs
    for (let i = 0; i < this.orbitArcArray.length; i++) {
      this.orbitArcArray[i].arc.dispose();
    }
    this.orbitArcArray = [];
  }
}