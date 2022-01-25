import {
  PLAYING_ALLOWED_AZIMUSH_BIAS,
  PLAYING_MAX_SCORE_PER_QUESTION,
} from './constants';

export const directionMapNWSE = {
  east: {
    leaveCss: 'fadeOutLeft',
    enterCss: 'fadeInRight',
    ufoLightCss: 'headEastTail',
    chn: '东',
  },
  south: {
    leaveCss: 'fadeOutUp',
    enterCss: 'fadeInUp',
    ufoLightCss: 'headSouthTail',
    chn: '南',
  },
  west: {
    leaveCss: 'fadeOutRight',
    enterCss: 'fadeInLeft',
    ufoLightCss: 'headWestTail',
    chn: '西',
  },
  north: {
    leaveCss: 'fadeOutDown',
    enterCss: 'fadeInDown',
    ufoLightCss: 'headNorthTail',
    chn: '北',
  },
};


export const calc_shortest_dis = (x1, y1, x2, y2) => {
  // 地球半径
  const R = 6371.393;
  const latitude1 = (Math.PI / 180) * y1;
  const latitude2 = (Math.PI / 180) * y2;
  const longitude1 = (Math.PI / 180) * x1;
  const longitude2 = (Math.PI / 180) * x2;
  const d = Math.acos(
    Math.sin(latitude1) * Math.sin(latitude2) +
    Math.cos(latitude1) * Math.cos(latitude2) * Math.cos(longitude2 - longitude1)
  ) * R;
  return d;
};

export const calc_wrong_direction = (x1, y1, x2, y2) => {
  // 这个方法设计错了，不能把地球当平面，智障了，所以请不要使用这个方法
  // 用矢量(x, y)表示从(x1, y1) 到 (x2, y2)
  let y = y2 - y1;
  let x_left = x2 - x1;
  let x_right = 360;

  if (x2 < 0 && x1 > 0) {
    x_right = 360 + x2 - x1;
  } else if (x2 > 0 && x1 < 0) {
    x_right = x2 - (360 + x1);
  }

  let x = 0
  if (Math.abs(x_right) < Math.abs(x_left)) {
    x = x_right;
  } else {
    x = x_left;
  }

  const x_distance = calc_shortest_dis(0, 0, 0, x);
  const y_distance = calc_shortest_dis(0, 0, y, 0);
  const tan = y_distance / x_distance;

  let ans = '';
  let type = '';
  if (tan > 0.414 && tan < 2.414) {
    // use control cross x
    type = 'x';
    if (x >= 0) {
      ans = y >= 0 ? 'northeast' : 'southeast';
    } else {
      ans = y >= 0 ? 'northwest' : 'southwest';
    }
  } else {
    // use control cross t
    type = 't';
    if (x_distance >= y_distance) {
      ans = x >= 0 ? 'east' : 'west';
    } else {
      ans = y >= 0 ? 'north' : 'south';
    }
  }

  const res = {
    direction: ans,
  }
};

export const calc_azimuth = (x1, y1, x2, y2) => {
  const pi = Math.PI;
  const lat1_rad = y1 * pi / 180;
  const lon1_rad = x1 * pi / 180;
  const lat2_rad = y2 * pi / 180;
  const lon2_rad = x2 * pi / 180;

  const y = Math.sin(lon2_rad - lon1_rad) * Math.cos(lat2_rad)
  const x = Math.cos(lat1_rad) * Math.sin(lat2_rad) -
    Math.sin(lat1_rad) * Math.cos(lat2_rad) * Math.cos(lon2_rad - lon1_rad);

  const brng = Math.atan2(y, x) * 180 / pi;

  return parseFloat((brng + 360.0) % 360.0);
};

export const calc_next_direction = (x1, y1, x2, y2) => {
  const azimuth = calc_azimuth(x1, y1, x2, y2);
  switch (true) {
    case 0 <= azimuth && azimuth < 22.5:
      return 'north';
    case 22.5 <= azimuth && azimuth < 67.5:
      return 'northeast';
    case 67.5 <= azimuth && azimuth < 112.5:
      return 'east';
    case 112.5 <= azimuth && azimuth < 157.5:
      return 'southeast';
    case 157.5 <= azimuth && azimuth < 202.5:
      return 'south';
    case 202.5 <= azimuth && azimuth < 247.5:
      return 'southwest';
    case 247.5 <= azimuth && azimuth < 292.5:
      return 'west';
    case 292.5 <= azimuth && azimuth < 337.5:
      return 'northwest';
    case 337.5 <= azimuth && azimuth < 360:
      return 'north';
    default:
      return 'north';
  }
};

export const calc_next_direction_chn = (azimuth) => {
  switch (true) {
    case 0 <= azimuth && azimuth < 22.5:
      return '北';
    case 22.5 <= azimuth && azimuth < 67.5:
      return '东北';
    case 67.5 <= azimuth && azimuth < 112.5:
      return '东';
    case 112.5 <= azimuth && azimuth < 157.5:
      return '东南';
    case 157.5 <= azimuth && azimuth < 202.5:
      return '南';
    case 202.5 <= azimuth && azimuth < 247.5:
      return '西南';
    case 247.5 <= azimuth && azimuth < 292.5:
      return '西';
    case 292.5 <= azimuth && azimuth < 337.5:
      return '西北';
    case 337.5 <= azimuth && azimuth < 360:
      return '北';
    default:
      return '北';
  }
};

export const getPenaltyTimeWhenWrong = (userAnswerTime) => {
  if (userAnswerTime && !isNaN(userAnswerTime)) {
    switch (true) {
      case 0 <= userAnswerTime && userAnswerTime < 1:
        return 8;
      case 1 <= userAnswerTime && userAnswerTime < 2:
        return 4;
      case 2 <= userAnswerTime && userAnswerTime < 3:
        return 2;
      case 3 <= userAnswerTime && userAnswerTime < 4:
        return 1;
      case 4 <= userAnswerTime:
        return 0;
      default:
        return 0;
    }
  }
  return 0;
}

export const getScoreWhenCorrect = (userAnswerTime) => {
  if (userAnswerTime && !isNaN(userAnswerTime)) {
    switch (true) {
      case 0 <= userAnswerTime && userAnswerTime < 1:
        return 15;
      case 1 <= userAnswerTime && userAnswerTime < 2:
        return 14;
      case 2 <= userAnswerTime && userAnswerTime < 3:
        return 13;
      case 3 <= userAnswerTime && userAnswerTime < 4:
        return 12;
      case 4 <= userAnswerTime && userAnswerTime < 5:
        return 11;
      case 5 <= userAnswerTime:
        return 10;
      default:
        return 0;
    }
  }
  return 0;
}


export const calc_fly_rank = (inputScore) => {
  const score = parseInt(String(inputScore), 10);
  switch (true) {
    case 0 <= score && score < 50:
      return { text: '南辕北辙', rank: 35 };
    case 50 <= score && score < 100:
      return { text: '东挨西撞', rank: 55 };
    case 100 <= score && score < 150:
      return { text: '南来北往', rank: 65 };
    case 150 <= score && score < 200:
      return { text: '东奔西走', rank: 75 };
    case 200 <= score && score < 250:
      return { text: '走南闯北', rank: 80 };
    case 250 <= score && score < 300:
      return { text: '东荡西驰', rank: 85 };
    case 300 <= score && score < 350:
      return { text: '横飞无阻', rank: 90 };
    case 350 <= score && score < 400:
      return { text: '四窜如神', rank: 95 };
    case 400 <= score:
      return { text: '量子大仙', rank: 100 };
    default:
      return { text: '', rank: '' };
  }
};

export const get_flight_orbit_height = (
  from_lat, from_lon,
  to_lat, to_lon,
  cur_lat, cur_lon,
) => {
  const dis = calc_shortest_dis(from_lon, from_lat, to_lon, to_lat);
  const cur_dis = calc_shortest_dis(from_lon, from_lat, cur_lon, cur_lat);
  const dis_r = dis / 2;
  const height = dis_r / 30 - (cur_dis - dis_r) ** 2 / (dis_r * 30);
  return height;
};

export const get_flight_orbit_height_precise = (
  from_lat, from_lon,
  to_lat, to_lon,
  cur_lat, cur_lon,
) => {
  const dis = calc_shortest_dis(from_lon, from_lat, to_lon, to_lat);
  const cur_dis = calc_shortest_dis(from_lon, from_lat, cur_lon, cur_lat);
  const dis_r = dis / 2;
  const height = ((1 - ((cur_dis - dis_r) ** 2) / (dis_r * dis_r)) * (dis_r / 2)) ** (1 / 2);
  return height;
};

export const draw_line = (x_values, y_values, z_values, options, THREE, container) => {

  var line_geom = new THREE.Geometry();
  createVertexForEachPoint(line_geom, x_values, y_values, z_values, THREE);

  var line_material = new THREE.LineBasicMaterial(options);
  var line = new THREE.Line(line_geom, line_material);
  container.add(line);
}

const createVertexForEachPoint = (object_geometry, values_axis1, values_axis2, values_axis3, THREE) => {
  for (var i = 0; i < values_axis1.length; i++) {
      object_geometry.vertices.push(new THREE.Vector3(values_axis1[i],
          values_axis2[i], values_axis3[i]));
  }
}

export const getRotateDegFromMatrix = (matrixString) => {
  const items = matrixString.split(',')
  const [a,b,c,d,e,f] = items.map(i => parseFloat(i.replace(/[^\d.-]/gi, '')));
  var aa=Math.round(180*Math.asin(a)/ Math.PI);  
  var bb=Math.round(180*Math.acos(b)/ Math.PI);  
  var cc=Math.round(180*Math.asin(c)/ Math.PI);  
  var dd=Math.round(180*Math.acos(d)/ Math.PI);  
  var deg=0;  
  if(aa==bb||-aa==bb){  
    deg=dd;  
  }else if(-aa+bb==180){  
    deg=180+cc;  
  }else if(aa+bb==180){  
    deg=360-cc||360-dd;  
  }  
  return deg>=360 ? 0 : deg;  
}

const getMinDistance = (selectedDeg, correctDeg) => {
  const { bias, base } = {
    bias: PLAYING_ALLOWED_AZIMUSH_BIAS,
    base: PLAYING_MAX_SCORE_PER_QUESTION,
  }
  const getDistance = (a, b) => (360 + a - b) % 360;
  const minDistance = Math.min(
    getDistance(selectedDeg, correctDeg),
    getDistance(correctDeg, selectedDeg), 
  );
  return {
    isDegreeWithinRange: minDistance <= bias,
    score: base - Math.round(minDistance / bias * (base - 1)),
  }
}


export const isDegreeWithinRange = (selectedDeg, correctDeg) => {
  return getMinDistance(selectedDeg, correctDeg).isDegreeWithinRange;
}

export const getScoreFromDegreeDistance = (selectedDeg, correctDeg) => {
  return getMinDistance(selectedDeg, correctDeg).score;
}

export const getAverageBiasFromAverageScore = (averageScore) => {
  const maxScore = PLAYING_MAX_SCORE_PER_QUESTION;
  const bias = PLAYING_ALLOWED_AZIMUSH_BIAS;
  const base = (maxScore - averageScore) % maxScore * (bias / maxScore);
  return (base + Math.random() * (bias / maxScore) / 2).toFixed(1);
}