<template>
	<view class="earth_wrapper" >
		<view>earth</view>
		<view>
      <canvas
        type="2d"
        id="canvas"
        class="globe"
        style="width: 320px; height: 320px;"
        :touchstart="handleTouchStart"
        :touchend="handleTouchEnd"
        :touchmove="handleTouchMove"
      ></canvas>
    </view>
	</view>
</template>

<script>
	/**
	 * @description 
	 * @event {Function} click 
	 */
  import { continents } from '@/utils/data';
	export default {
		name: 'Earth',
		props: {
		},
		data() {
			return {
        score: 0,
        lastFrameTime: 0,
        consolecount: 0,
        intervalPerRender: 16.666,
        earth: {
          canvas: null,
          ctx: null,
          yCenter: 300,
          xCenter: 300,
          canvasWidth: 600,
          canvasHeight: 600,
          globe: {
            radius: 250,
            continentThick: 10,
            behindContinentLimit: -20,
            needleTopRadius: 290,
            pinTopRadius: 300,
            markerFont: "60px 'Pirata One', cursive",
            pinLineWidth: 5,
          },
          scroll: {
            lat: 0,
            long: 20
          },
          markers: [],
          timing: {
            speed: 4,
            delta: 0,
            last: 0
          },
          drag: {
            start: { x: 0, y: 0 },
            force: 0,
            prevX: 0,
            isDragging: false
          },
          colors: {
            background: '#0278ae',
            pushPinBase: '#969799',
            pushPin: '#ed5c50',
            land: '#a5ecd7', //'#ffc975',
            landShade: '#318daf',
            ocean: '#51adcf'
          },
          complexShapes: {
            // put complex shapes here
          }
        },
			}
		},
		mounted() {
		  this.drawEarth();
		},
		methods: {
			onClick(direction) {
				// this.$emit('clickedOneDirection', direction)
			},
      drawEarth() {
        const that = this;
        console.log('drawing eatyth///...')
        const markers = [{
          name: '🏝',
          lat: 40,
          long: 116
        },
        {
          name: '🐚',
          lat: -25,
          long: 131
        },
        {
          name: '🌲',
          lat: -13,
          long: -70
        },
        {
          name: '🌸',
          lat: 25,
          long: 32
        },
        {
          name: '🌈',
          lat: 51,
          long: -2
        }];
        
        const lerp = (norm, min, max) => {
          return (max - min) * norm + min;
        }
        
        const norm = (value, min, max) => {
          return (value - min) / (max - min);
        }
        
        const map = (value, sourceMin, sourceMax, destMin, destMax) => {
          return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
        }
        
        const getRadius = (latitude) => {
          let yPart = Math.PI*2,
              radius = 50,
              frame = map(latitude, 90, -90, 0, 1.65);
          
          return Math.max(Math.sin(yPart + frame) * radius, 0);
        }
        
        const latLongSphere  = (lat, lon, radius) => {
            let x = that.data.earth.xCenter,
                y = that.data.earth.yCenter,
                z = 0;
        
            lon = -lon;
            let phi = (90-lat) * (Math.PI/180),
            teta = (lon + 180) * (Math.PI/180);
        
            x -= -(radius * Math.sin(phi) * Math.cos(teta));
            y -= radius * Math.cos(phi);
            z = radius * Math.sin(phi) * Math.sin(teta);
        
            return {
              x, y, z
            };
        }
        
        const drawGlobe = (ctx, color) => {
          ctx.beginPath();
          ctx.arc(that.data.earth.xCenter, that.data.earth.yCenter, that.data.earth.globe.radius, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        }
        
        const getLandMassPaths = (name, radius, thickness) => {
          let landmassBasic = continents[name],
              landmass = null,
              first = true,
              rotated = false,
              paths = {
                ground: new Path2D(),
                top: new Path2D(),
                sections: [],
                isVisible: false
              },
              section = {
                ground: [],
                top: []
              };
        
            // Complexify
            if(that.data.earth.complexShapes[name]) {
              landmass = that.data.earth.complexShapes[name];
            } else {
              landmass = complexify(landmassBasic, 1);
              that.data.earth.complexShapes[name] = landmass;
            }
            
            for (let i = 0; i < landmass.length; i++) {
              let point = landmass[0],
                  p = latLongSphere(point.lat + that.data.earth.scroll.lat, point.long + that.data.earth.scroll.long, radius);
              
                if(p.z < 0) {
                  landmass.splice(0, 0, landmass.pop());
                  rotated = true;
                } else {
                  break;
                }
            }
        
            let drawCurve = false,
                curveStart = null,
                sectionIsVisible = false;
        
            landmass.forEach((point) => {
              let p = latLongSphere(point.lat + that.data.earth.scroll.lat, point.long + that.data.earth.scroll.long, radius),
                  p2 = latLongSphere(point.lat + that.data.earth.scroll.lat, point.long + that.data.earth.scroll.long, radius + thickness);
              
              if(!sectionIsVisible && p.z > -200) {
                sectionIsVisible = true;
              }
              
              section.ground.push({
                x: p.x,
                y: p.y,
                z: p.z
              });
              section.top.push({
                x: p2.x,
                y: p2.y,
                z: p2.z
              });
        
              if(point.edge && !first) {
                if(sectionIsVisible) {
                  paths.sections.push(Object.assign({}, section));
                }
                
                section = {
                  ground: [{x: p.x, y: p.y, z: p.z }],
                  top: [{x: p2.x, y: p2.y, z: p2.z }]
                };
                
                sectionIsVisible = false;
              }
              
              first = false;
        
              if(p.z > 0) {
                if(drawCurve) {
                    drawCurve = false;
                    closeCurve(paths.ground, curveStart, p, radius);
                    closeCurve(paths.top, curveStart, p2, radius + thickness);
                  } else {
                    paths.ground.lineTo(p.x, p.y);
                    paths.top.lineTo(p2.x, p2.y);
                    paths.isVisible = true;
                  }
              } else {
                // draw curve
                if(!drawCurve) {   
                  drawCurve = true;
                  curveStart = {
                    x: p.x,
                    y: p.y,
                    z: p.z
                  };
                }
              }
            });
        
            // if the last point is in a curve
            if(drawCurve) {
              drawCurve = false;
              let point = landmass.slice(-1)[0],
                  p = latLongSphere(point.lat + that.data.earth.scroll.lat, point.long + that.data.earth.scroll.long, radius),
                  p2 = latLongSphere(point.lat + that.data.earth.scroll.lat, point.long + that.data.earth.scroll.long, radius + thickness);
              
              closeCurve(paths.ground, curveStart, p, radius);
              closeCurve(paths.top, curveStart, p2, radius + thickness);
            }
            
            let p = latLongSphere(landmass[0].lat + that.data.earth.scroll.lat, landmass[0].long + that.data.earth.scroll.long, radius),
                p2 = latLongSphere(landmass[0].lat + that.data.earth.scroll.lat, landmass[0].long + that.data.earth.scroll.long, radius + thickness);  
            
            section.ground.push({
                x: p.x,
                y: p.y,
                z: p.z
              });
              section.top.push({
                x: p2.x,
                y: p2.y,
                z: p2.z
              });
          
            if(section) {
              paths.sections.push(Object.assign({}, section));
            }
            
            return paths;
        }
        
        const closeCurve = (path, curveStart, p, radius) => {
            // draw curve from curveStart på p
            let a1 = getAngle({ x: that.data.earth.xCenter, y: that.data.earth.yCenter}, curveStart),
                a2 = getAngle({ x: that.data.earth.xCenter, y: that.data.earth.yCenter}, p),
                compare = a1 - a2,
                startAngle = a1 * (Math.PI/180),
                endAngle = a2 * (Math.PI/180);
          
            path.arc(that.data.earth.xCenter, that.data.earth.yCenter, radius, startAngle, endAngle, compare > 0 && compare < 180);
          }
        
        
        const getAngle = (p1, p2) => {
          let dy = p2.y - p1.y,
              dx = p2.x - p1.x,
              theta = Math.atan2(dy, dx);
          theta *= 180 / Math.PI;
          return theta;
        }
        
        const complexify = (landmass, level) => {
          let complex = [];
          
          for (let i = 0; i < (landmass.length - 1); i++) {
            let p1 = landmass[i],
                p2 = landmass[i + 1],
                steps = Math.floor(distanceBetween(p1, p2) / level);
        
            p1.edge = true;
            complex.push(p1);
        
            if(steps > 0) {
              let s = Math.floor(100 / steps);
              
              for (let i = 1; i <= steps; i++) {
                let percentage = i * s;
                
                if(percentage <= 100) {
                  let p = {
                    lat: map(percentage, 0, 100, p1.lat, p2.lat),
                    long: map(percentage, 0, 100, p1.long, p2.long)
                  }
                  
                  complex.push(p);
                }
              }
            }
          }
          
          let last = landmass.pop();
          last.edge = true;
          complex.push(last);
        
          return complex;
        }
        
        const distanceBetween = (p1, p2) => {
          let a = p1.long - p2.long,
              b = p1.lat - p2.lat;
        
          return Math.hypot(a, b);
        }
        
        const updateState = (delta) => {
          that.data.earth.drag.force *= 0.8;
          
          if(that.data.earth.timing.speed) {
            that.data.earth.scroll.long += Math.round((that.data.earth.timing.speed / 100) * delta);
            
            if(that.data.earth.scroll.long > 360) {
              that.data.earth.scroll.long = that.data.earth.scroll.long % 360;
            } else if (that.data.earth.scroll.long < 0) {
              that.data.earth.scroll.long += 360;   
            }
          }
        }
        
        const animateLoop = (time) => {
          that.data.earth.timing.delta = Math.abs(that.data.earth.timing.last - time);
          that.data.earth.timing.last = time;
          
          updateState(that.data.earth.timing.delta);
          
          // clear
          that.data.earth.ctx.fillStyle = that.data.earth.colors.background;
          that.data.earth.ctx.fillRect(0, 0, that.data.earth.canvasWidth, that.data.earth.canvasHeight);
          
          drawMarkers(that.data.earth.ctx, that.data.earth.markers, false);
          
          let continentNames = ['southamerica', 'northamerica', 'greenland', 'japan', 'africa', 'australia', 'asia', 'indonesia', 'europe', 'britain', 'madagaskar', 'papua', 'nz']; 
          let landPaths = [],
              se = [];
          
          continentNames.forEach((name) => {
            let paths = getLandMassPaths(name, that.data.earth.globe.radius, that.data.earth.globe.continentThick);
            
            if(paths) {
              that.data.earth.ctx.fillStyle = that.data.earth.colors.landShade;
        
              // if (this.data.consolecount < 100) {
              // 	console.log(this.data.consolecount, 'paths', paths);
              // 	this.data.consolecount += 1;
              // }

              paths.sections.forEach((section) => {
                se.push(section);
                drawSection(that.data.earth.ctx, section, true);
              });
        
              if(paths.isVisible) {
                landPaths.push(paths.top);
              }
            }
          });
          
          drawGlobe(that.data.earth.ctx, that.data.earth.colors.ocean);
          
          that.data.earth.ctx.fillStyle = that.data.earth.colors.landShade;
          se.forEach((section) => {  
            drawSection(that.data.earth.ctx, section, false);
          });
          
          landPaths.forEach((path) => {
              that.data.earth.ctx.fillStyle = that.data.earth.colors.land;
              that.data.earth.ctx.fill(path);
          });
          
          drawMarkers(that.data.earth.ctx, that.data.earth.markers, true);
          
          that.data.earth.canvas.requestAnimationFrame(animateLoop);
        }
        
        const drawSection = (ctx, section, drawBackside) => {
            let hasStarted = false,
                limit = that.data.earth.globe.behindContinentLimit;
            
            section.ground.forEach(p => {
              if(drawBackside && p.z < 0 || !drawBackside && p.z >= limit) {
                if(!hasStarted) {
                  ctx.beginPath();
                  hasStarted = true;
                }
                
                ctx.lineTo(p.x, p.y);
              }
            });
          
            section.top = drawBackside ? section.top.reverse() : section.top;
          
            section.top.forEach(p => {
              if(drawBackside && p.z < 0 || !drawBackside && p.z >= limit) {
                ctx.lineTo(p.x, p.y);
              }
            });
          
            if(hasStarted) {
              ctx.closePath();
              ctx.fill();
            }
        }
        
        const drawMarkers = (ctx, markers, drawFront) => {
          for (const marker of markers) {
            let ground = latLongSphere(marker.lat + that.data.earth.scroll.lat, marker.long + that.data.earth.scroll.long, that.data.earth.globe.radius + that.data.earth.globe.continentThick),
                needleTop = latLongSphere(marker.lat + that.data.earth.scroll.lat, marker.long + that.data.earth.scroll.long, that.data.earth.globe.needleTopRadius),
                pinTop = latLongSphere(marker.lat + that.data.earth.scroll.lat, marker.long + that.data.earth.scroll.long, that.data.earth.globe.pinTopRadius);
            
            if(ground.z >= 0 && drawFront) {
              drawMapPushPinBase(ctx, ground, needleTop, that.data.earth.colors.pushPinBase);
              drawMapPushPin(ctx, pinTop, that.data.earth.colors.pushPin);
              drawMarkerText(ctx, marker.name, pinTop);
            } else if(!drawFront) {
              drawMapPushPin(ctx, pinTop, that.data.earth.colors.pushPin);
              drawMapPushPinBase(ctx, ground, needleTop, that.data.earth.colors.pushPinBase);
              drawMarkerText(ctx, marker.name, pinTop);
            }
          }
        }
        
        const drawMarkerText = (ctx, text, pos) => {
            ctx.font = that.data.earth.globe.markerFont;
            ctx.fillStyle = 'black';
          
            let metrics = ctx.measureText(text); 
          
            ctx.fillText(text, pos.x - (metrics.width / 2), pos.y - 5);
        }
        
        const drawMapPushPinBase = (ctx, basePos, topPos, color) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = that.data.earth.globe.pinLineWidth;
          ctx.beginPath();
          ctx.moveTo(basePos.x, basePos.y);
          ctx.lineTo(topPos.x, topPos.y);
          ctx.stroke();
        }
        
        const drawMapPushPin = (ctx, pos, color) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
          ctx.fill();
        }
        
        const init = (res, markers) => {
          console.log('inited', init);
          const canvas = res[0].node;
          canvas.height = that.data.earth.canvasWidth;
          canvas.width = that.data.earth.canvasHeight;

          that.data.earth.markers = markers;
          that.data.earth.canvas = canvas;
          console.log('canvas now', canvas)
          console.log('res now', res)
          that.data.earth.ctx = canvas.getContext('2d');

          canvas.requestAnimationFrame(animateLoop);

        }

        
        // uni.createSelectorQuery()
        //   .select('#canvas')
        //   .fields({
        //     node: true,
        //   })
        //   .exec((res) => {
        //     init(res, markers);
        //   });
        const query = uni.createSelectorQuery().in(this);
        console.log('trying..')
        const node = query.selectAll('#canvas').node((res) => {
            console.log('selected emlement node:', res)
            // init(res, markers);
          });
        console.log('selected node:', node)
        console.log('tried..')
        // console.log('selected emlement node:', node);
          // .exec((res) => {
          //   console.log('selected emlement node:', res)
          //   // init(res, markers);
          // });
        
      },
      dragMove(e) {
        const lerp = (norm, min, max) => {
          return (max - min) * norm + min;
        }
        const norm = (value, min, max) => {
          return (value - min) / (max - min);
        }
        const map = (value, sourceMin, sourceMax, destMin, destMax) => {
          return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
        }
        const that = this;
        console.log('dragMove called==============');
        console.log('dragMove called==============');
        console.log('dragMove called==============');
        console.log('that.data.earth.drag.isDragging', that.data.earth.drag.isDragging);
        if(that.data.earth.drag.isDragging) {
          let long = that.data.earth.drag.start.long,
              clientX = e.touches ? e.touches[0].clientX : e.clientX,
              change = clientX - that.data.earth.drag.start.x,
              prevChange = clientX - that.data.earth.drag.prevX,
              canvasWidth = that.data.earth.canvas.width;
              // canvasWidth = that.data.earth.canvas.getBoundingClientRect().width;
          console.log('e', e)
          console.log('that.data.earth.drag.start', that.data.earth.drag.start)
          console.log('long', long);
          console.log('clientX', clientX);
          console.log('change', change);
          console.log('prevChange', prevChange);
          console.log('canvasWidth', canvasWidth);
          long += map(change, 0, canvasWidth, 0, 200);
          
          while(long < 0) {
            long += 360;
          } 
          
          if(prevChange > 0 && that.data.earth.drag.force < 0) {
            that.data.earth.drag.force = 0;
          } else if(prevChange < 0 && that.data.earth.drag.force > 0) {
            that.data.earth.drag.force = 0;
          }
          
          that.data.earth.drag.force += prevChange * (600 / canvasWidth);
          that.data.earth.drag.prevX = clientX;
          that.data.earth.scroll.long = Math.abs(long) % 360;
        }
      },
      dragStart(e) {
        const that = this;
        console.log('dragStart called==============');
        console.log('dragStart called==============');
        console.log('dragStart  called==============');
        console.log('e.touches', e.touches);
        if (e.touches) {
          // e.preventDefault();
          that.data.earth.drag.start = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            long: that.data.earth.scroll.long
          };
        } else {
          that.data.earth.drag.start = {
            x: e.clientX,
            y: e.clientY,
            long: that.data.earth.scroll.long
          };
        }
        that.data.earth.timing.speed = 0;
        that.data.earth.drag.isDragging = true;
        console.log('that.data.earth.canvas', that.data.earth.canvas)
        console.log('that.data.earth.canvas.classList', that.data.earth.canvas.classList)
        // that.data.earth.canvas.classList.add('globe--dragging');
      },
      dragEnd(e) {
        const that = this;
        const lerp = (norm, min, max) => {
          return (max - min) * norm + min;
        }
        const norm = (value, min, max) => {
          return (value - min) / (max - min);
        }
        const map = (value, sourceMin, sourceMax, destMin, destMax) => {
          return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
        }
        console.log('dragEnd called==============');
        console.log('dragEnd called==============');
        console.log('dragEnd called==============');
        console.log('that.data.earth.drag.isDragging', that.data.earth.drag.isDragging);
        if(that.data.earth.drag.isDragging) {
          that.data.earth.timing.speed = map(that.data.earth.drag.force, 0, 220, 0, 40);
          that.data.earth.drag.isDragging = false;
          // that.data.earth.canvas.classList.remove('globe--dragging');
        }
      },
      reqAnimationFrame(loopFunc) {
        // let lastFrameTime = 0;
        const intervalPerRender = this.data.intervalPerRender;
        // 模拟 requestAnimationFrame
        const doAnimationFrame = (callback) => {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, intervalPerRender - (currTime - this.data.lastFrameTime));
            const id = setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
            this.data.lastFrameTime = currTime + timeToCall;
            return id;
        };
        doAnimationFrame(loopFunc);
        // 模拟 cancelAnimationFrame5
        // const abortAnimationFrame = (id) => {
        // 		clearTimeout(id)
        // }
      },
      handleTouchStart(e) {
        const that = this;
        that.dragStart(e);
      },
      handleTouchEnd(e) {
        const that = this;
        that.dragEnd(e);
      },
      handleTouchMove(e) {
        const that = this;
        that.dragMove(e);
      },
		}
	}
</script>

<style scoped lang="scss">

.earth {
  position: absolute;
  top: 20px;
}
</style>