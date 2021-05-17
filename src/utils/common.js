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

// 地球半径
const R = 6371.393;

export const calc_shortest_dis = (x1, y1, x2, y2) => {
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

export const calc_next_direction = (x1, y1, x2, y2) => {
  // 用矢量(x, y)表示从(x1, y1) 到 (x2, y2)
  let y = y2 - y1
  let x_left = x2 - x1
  let x_right = 360

  if (x2 < 0 && x1 > 0) {
    x_right = 360 + x2 - x1
  } else if (x2 > 0 && x1 < 0) {
    x_right = x2 - (360 + x1)
  }

  let x = 0
  if (Math.abs(x_right) < Math.abs(x_left)) {
    x = x_right;
  } else {
    x = x_left;
  }

  const x_distance = calc_shortest_dis(0, 0, 0, x)
  const y_distance = calc_shortest_dis(0, 0, y, 0)


}