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
    // adjustable fomula below
    score: Math.ceil((bias - minDistance) * (bias - minDistance) / (bias * bias) * (base)),
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

export const csvToJsonParser = (csvString) => {
  const lines = csvString.split('\n');
  const result = [];
  const headers = lines[0].split(',');
  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(',');
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return result;
}


export const firstNameToPinyinMapping = (name) => {
  const map_dict = {'上': 'shang', '百': 'bai', '广': 'guang', '河': 'he', '东': 'dong', '横': 'heng', '玉': 'yu', '柳': 'liu', '北': 'bei', '桂': 'gui', '梧': 'wu', '平': 'ping', '崇': 'chong', '贵': 'gui', '合': 'he', '岑': 'cen', '来': 'lai', '钦': 'qin', '贺': 'he', '靖': 'jing', '凭': 'ping', '五': 'wu', '新': 'xin', '铁': 'tie', '可': 'ke', '吐': 'tu', '昆': 'kun', '白': 'bai', '图': 'tu', '伊': 'yi', '防': 'fang', '双': 'shuang', '奎': 'kui', '巴': 'ba', '沙': 'sha', '阜': 'fu', '哈': 'ha', '塔': 'ta', '绥': 'sui', '黑': 'hei', '库': 'ku', '荔': 'li', '梅': 'mei', '深': 'shen', '汕': 'shan', '揭': 'jie', '阳': 'yang', '惠': 'hui', '潮': 'chao', '化': 'hua', '信': 'xin', '韶': 'shao', '乐': 'le', '湛': 'zhan', '廉': 'lian', '云': 'yun', '江': 'jiang', '肇': 'zhao', '开': 'kai', '清': 'qing', '陆': 'lu', '恩': 'en', '高': 'gao', '南': 'nan', '连': 'lian', '佛': 'fo', '吴': 'wu', '四': 'si', '普': 'pu', '珠': 'zhu', '鹤': 'he', '罗': 'luo', '台': 'tai', '中': 'zhong', '茂': 'mao', '雷': 'lei', '英': 'ying', '兴': 'xing', '阿': 'a', '胡': 'hu', '宜': 'yi', '九': 'jiu', '庐': 'lu', '吉': 'ji', '镇': 'zhen', '泰': 'tai', '盐': 'yan', '海': 'hai', '淮': 'huai', '太': 'tai', '无': 'wu', '宿': 'su', '赣': 'gan', '鹰': 'ying', '黄': 'huang', '任': 'ren', '邯': 'han', '瑞': 'rui', '井': 'jing', '扬': 'yang', '抚': 'fu', '共': 'gong', '樟': 'zhang', '萍': 'ping', '德': 'de', '丰': 'feng', '龙': 'long', '景': 'jing', '苏': 'su', '博': 'bo', '霍': 'huo', '和': 'he', '克': 'ke', '昌': 'chang', '乌': 'wu', '喀': 'ka', '石': 'shi', '仪': 'yi', '启': 'qi', '丹': 'dan', '常': 'chang', '张': 'zhang', '句': 'ju', '如': 'ru', '徐': 'xu', '邳': 'pi', '溧': 'li', '怀': 'huai', '山': 'shan', '临': 'lin', '资': 'zi', '泸': 'lu', '华': 'hua', '什': 'shen', '攀': 'pan', '邛': 'qiong', '峨': 'e', '康': 'kang', '西': 'xi', '彭': 'peng', '甘': 'gan', '会': 'hui', '马': 'ma', '内': 'nei', '都': 'du', '绵': 'mian', '固': 'gu', '宁': 'ning', '灵': 'ling', '银': 'yin', '天': 'tian', '达': 'da', '遂': 'sui', '雅': 'ya', '阆': 'lang', '凉': 'liang', '万': 'wan', '简': 'jian', '射': 'she', '隆': 'long', '通': 'tong', '延': 'yan', '松': 'song', '珲': 'hui', '辽': 'liao', '长': 'chang', '扶': 'fu', '基': 'ji', '嘉': 'jia', '磐': 'pan', '青': 'qing', '大': 'da', '成': 'cheng', '自': 'zi', '眉': 'mei', '公': 'gong', '集': 'ji', '洮': 'tao', '舒': 'shu', '桦': 'hua', '敦': 'dun', '榆': 'yu', '蛟': 'jiao', '潜': 'qian', '安': 'an', '邹': 'zou', '淄': 'zi', '莱': 'lai', '滨': 'bin', '潍': 'wei', '曲': 'qu', '滕': 'teng', '枣': 'zao', '聊': 'liao', '菏': 'he', '济': 'ji', '胶': 'jiao', '侯': 'hou', '运': 'yun', '吕': 'lv', '孝': 'xiao', '朔': 'shuo', '诸': 'zhu', '忻': 'xin', '晋': 'jin', '永': 'yong', '原': 'yuan', '介': 'jie', '古': 'gu', '汾': 'fen', '寿': 'shou', '池': 'chi', '宣': 'xuan', '铜': 'tong', '巢': 'chao', '亳': 'bo', '明': 'ming', '六': 'liu', '界': 'jie', '桐': 'tong', '蚌': 'beng', '芜': 'wu', '滁': 'chu', '禹': 'yu', '威': 'wei', '日': 'ri', '乳': 'ru', '肥': 'fei', '烟': 'yan', '栖': 'qi', '招': 'zhao', '荣': 'rong', '沧': 'cang', '盘': 'pan', '仁': 'ren', '那': 'na', '拉': 'la', '林': 'lin', '福': 'fu', '三': 'san', '泉': 'quan', '漳': 'zhang', '遵': 'zun', '赤': 'chi', '本': 'ben', '盖': 'gai', '凌': 'ling', '瓦': 'wa', '调': 'diao', '凯': 'kai', '武': 'wu', '黔': 'qian', '毕': 'bi', '建': 'jian', '庆': 'qing', '酒': 'jiu', '澳': 'ao', '邵': 'shao', '湖': 'hu', '岳': 'yue', '涟': 'lian', '祁': 'qi', '洪': 'hong', '冷': 'leng', '娄': 'lou', '湘': 'xiang', '陇': 'long', '厦': 'xia', '莆': 'pu', '定': 'ding', '金': 'jin', '兰': 'lan', '穆': 'mu', '讷': 'ne', '牡': 'mu', '密': 'mi', '虎': 'hu', '香': 'xiang', '茫': 'mang', '同': 'tong', '佳': 'jia', '富': 'fu', '齐': 'qi', '七': 'qi', '果': 'guo', '尚': 'shang', '鸡': 'ji', '嫩': 'nen', '格': 'ge', '葫': 'hu', '凤': 'feng', '庄': 'zhuang', '锦': 'jin', '营': 'ying', '沈': 'shen', '灯': 'deng', '鞍': 'an', '朝': 'chao', '彬': 'bin', '陕': 'shan', '神': 'shen', '渭': 'wei', '咸': 'xian', '重': 'chong', '汉': 'han', '宝': 'bao', '子': 'zi', '商': 'shang', '韩': 'han', '旬': 'xun', '桃': 'tao', '濮': 'pu', '辉': 'hui', '巩': 'gong', '荥': 'xing', '郑': 'zheng', '沁': 'qin', '登': 'deng', '漯': 'luo', '许': 'xu', '洛': 'luo', '浙': 'zhe', '慈': 'ci', '义': 'yi', '丽': 'li', '舟': 'zhou', '邓': 'deng', '余': 'yu', '杭': 'hang', '衢': 'qu', '项': 'xiang', '滦': 'luan', '迁': 'qian', '霸': 'ba', '廊': 'lang', '保': 'bao', '秦': 'qin', '承': 'cheng', '辛': 'xin', '唐': 'tang', '衡': 'heng', '邢': 'xing', '周': 'zhou', '卫': 'wei', '驻': 'zhu', '泊': 'bo', '舞': 'wu', '焦': 'jiao', '汝': 'ru', '涿': 'zhuo', '孟': 'meng', '绍': 'shao', '钟': 'zhong', '利': 'li', '当': 'dang', '荆': 'jing', '随': 'sui', '麻': 'ma', '应': 'ying', '鄂': 'e', '沅': 'yuan', '汨': 'mi', '津': 'jin', '耒': 'lei', '株': 'zhu', '浏': 'liu', '醴': 'li', '郴': 'chen', '益': 'yi', '监': 'jian', '京': 'jing', '琼': 'qiong', '文': 'wen', '屯': 'tun', '陵': 'ling', '澄': 'cheng', '嵊': 'sheng', '温': 'wen', '十': 'shi', '老': 'lao', '仙': 'xian', '襄': 'xiang', '枝': 'zhi', '儋': 'dan', '漠': 'mo', '个': 'ge', '楚': 'chu', '昭': 'zhao', '腾': 'teng', '芒': 'mang', '蒙': 'meng', '怒': 'nu', '红': 'hong', '禄': 'lu', '水': 'shui', '迪': 'di', '弥': 'mi', '二': 'er', '锡': 'xi', '额': 'e', '呼': 'hu', '根': 'gen', '包': 'bao', '满': 'man', '牙': 'ya', '扎': 'zha', '敏': 'min', '缅': 'mian', '腊': 'la', '纳': 'na', '仰': 'yang', '帕': 'pa', '立': 'li', '希': 'xi', '曼': 'man', '考': 'kao', '特': 'te', '索': 'suo', '摩': 'mo', '约': 'yue', '鲁': 'lu', '亚': 'ya', '卑': 'bei', '美': 'mei', '奥': 'ao', '勒': 'le', '布': 'bu', '切': 'qie', '蒂': 'di', '萨': 'sa', '弗': 'fu', '韦': 'wei', '维': 'wei', '秘': 'mi', '突': 'tu', '叶': 'ye', '斯': 'si', '直': 'zhi', '莫': 'mo', '沃': 'wo', '捷': 'jie', '波': 'bo', '戈': 'ge', '查': 'cha', '恰': 'qia', '久': 'jiu', '佩': 'pei', '以': 'yi', '贾': 'jia', '加': 'jia', '卡': 'ka', '奇': 'qi', '伯': 'bo', '科': 'ke', '艾': 'ai', '卢': 'lu', '瓜': 'gua', '贝': 'bei', '好': 'hao', '圣': 'sheng', '皮': 'pi', '杰': 'jie', '里': 'li', '路': 'lu', '堪': 'kan', '纽': 'niu', '休': 'xiu', '泽': 'ze', '独': 'du', '詹': 'zhan', '得': 'de', '爱': 'ai', '方': 'fang', '诺': 'nuo', '核': 'he', '塞': 'sai', '尤': 'you', '匹': 'pi', '庞': 'pang', '夏': 'xia', '米': 'mi', '印': 'yin', '费': 'fei', '旧': 'jiu', '剑': 'jian', '坎': 'kan', '陶': 'tao', '埃': 'ai', '哥': 'ge', '芝': 'zhi', '史': 'shi', '伍': 'wu', '皇': 'huang', '俄': 'e', '多': 'duo', '杜': 'du', '顿': 'dun', '丘': 'qiu', '素': 'su', '托': 'tuo', '彼': 'bi', '下': 'xia', '奔': 'ben', '设': 'she', '别': 'bie', '法': 'fa', '比': 'bi', '绿': 'lu', '土': 'tu', '夜': 'ye', '宋': 'song', '孔': 'kong', '热': 're', '赫': 'he', '琴': 'qin', '旺': 'wang', '卧': 'wo', '悉': 'xi', '珀': 'po', '厄': 'e', '橡': 'xiang', '耶': 'ye', '于': 'yu', '玻': 'bo', '宾': 'bin', '瑙': 'nao', '代': 'dai', '汤': 'tang', '玛': 'ma', '墨': 'mo', '谢': 'xie', '采': 'cai', '提': 'ti', '耐': 'nai', '拿': 'na', '撒': 'sa', '岘': 'xian', '越': 'yue', '芽': 'ya', '顺': 'shun', '赞': 'zan', '奠': 'dian', '芹': 'qin', '边': 'bian', '地': 'di', '凡': 'fan', '乔': 'qiao', '聂': 'nie', '杨': 'yang', '占': 'zhan', '潘': 'pan', '菲': 'fei', '葡': 'pu', '桑': 'sang', '发': 'fa', '荷': 'he', '也': 'ye', '乍': 'zha', '避': 'bi', '蒲': 'pu', '木': 'mu', '怡': 'yi', '梳': 'shu', '廷': 'ting', '黎': 'li', '莎': 'sha', '关': 'guan', '道': 'dao', '八': 'ba', '依': 'yi', '士': 'shi', '的': 'de', '欧': 'ou', '班': 'ban', '帝': 'di', '不': 'bu', '佐': 'zuo', '赛': 'sai', '朱': 'zhu', '刻': 'ke', '若': 'ruo', '蔚': 'wei', '敖': 'ao', '门': 'men', '尼': 'ni', '釜': 'fu', '全': 'quan', '首': 'shou', '浦': 'pu', '春': 'chun', '城': 'cheng', '忠': 'zhong', '光': 'guang', '舍': 'she', '钱': 'qian', '半': 'ban', '亨': 'heng', '劳': 'lao', '朗': 'lang', '何': 'he', '朴': 'pu', '迈': 'mai', '底': 'di', '俾': 'bi', '小': 'xiao', '火': 'huo', '麦': 'mai', '伦': 'lun', '奈': 'nai', '鹿': 'lu', '楠': 'nan', '牛': 'niu', '琅': 'lang', '肯': 'ken', '刘': 'liu', '因': 'yin', '沉': 'chen', '坦': 'tan', '芬': 'fen', '夸': 'kua', '委': 'wei', '圭': 'gui', '斋': 'zhai', '飞': 'fei', '姆': 'mu', '兹': 'zi', '滑': 'hua', '苦': 'ku', '贡': 'gong', '婆': 'po', '匈': 'xiong', '列': 'lie', '赖': 'lai', '默': 'mo', '居': 'ju', '坤': 'kun', '望': 'wang', '勿': 'wu', '棉': 'mian', '危': 'wei', '梭': 'suo', '泗': 'si', '巨': 'ju', '翁': 'weng', '瑟': 'se', '叙': 'xu', '菩': 'pu', '乞': 'qi', '豪': 'hao', '屈': 'qu', '宗': 'zong', '拜': 'bai', '栋': 'dong', '毗': 'pi', '农': 'nong', '努': 'nu', '季': 'ji', '第': 'di', '柬': 'jian', '茶': 'cha', '暹': 'xian', '智': 'zhi', '欣': 'xin', '毛': 'mao', '冰': 'bing', '冈': 'gang', '钏': 'chuan', '埼': 'qi', '堺': 'sakai', '札': 'zha', '川': 'chuan', '千': 'qian', '名': 'ming', '相': 'xiang', '静': 'jing', '宇': 'yu', '姬': 'ji', '熊': 'xiong', '甲': 'jia', '伏': 'fu', '车': 'che', '契': 'qi', '梁': 'liang', '涅': 'nie', '戛': 'jia', '昂': 'ang', '孚': 'fu', '亭': 'ting', '秋': 'qiu', '宰': 'zai', '矿': 'kuang', '符': 'fu', '刚': 'gang', '渥': 'wo', '魁': 'kui', '章': 'zhang', '累': 'lei', '茹': 'ru', '意': 'yi', '挪': 'nuo', '斐': 'fei', '非': 'fei', '几': 'ji', '般': 'ban', '魏': 'wei', '施': 'shi', '柏': 'bai', '慕': 'mu' }
  if (!(name[0] in map_dict)) {
    console.log('name not in map_dict', name)
  }
  return map_dict[name[0]] || '';
};
