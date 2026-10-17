// Geographic lookup helper for map click events

export interface GeoLocationInfo {
  name: string;
  country: string;
  region: string;
  type: 'blue-carbon' | 'city' | 'sea' | 'general';
  description: string;
  lat: number;
  lng: number;
  elevationOrDepth?: string;
  blueCarbonStationId?: string;
  isBlueCarbonZone?: boolean;
  annualCarbonTotal?: number;
  burialRate?: number;
}

// Known boundary boxes or points for accurate detection around Shandong and surrounding areas
export function lookupGeoLocation(lat: number, lng: number): GeoLocationInfo {
  // 1. Check proximity to the 5 Core Blue Carbon Stations
  // Dongying Yellow River Estuary: ~37.78, 119.16
  const dDongying = Math.hypot(lat - 37.78, lng - 119.16);
  if (dDongying < 0.35) {
    return {
      name: '东营·黄河口盐沼湿地蓝碳监测站',
      country: '中国',
      region: '山东省东营市 · 黄河口国家公园',
      type: 'blue-carbon',
      isBlueCarbonZone: true,
      annualCarbonTotal: 142.5,
      burialRate: 312,
      description: '国家级蓝碳先导试验区，发育全国面积最大的翅碱蓬红地毯潮滩与芦苇群落，年均泥沙有机碳沉积率达 312 g/(m²·a)。',
      lat,
      lng,
      elevationOrDepth: '潮间带 (+0.5m ~ -2.0m)',
      blueCarbonStationId: 'dongying',
    };
  }

  // Weihai Sanggou Bay: ~37.15, 122.56
  const dWeihai = Math.hypot(lat - 37.15, lng - 122.56);
  if (dWeihai < 0.4) {
    return {
      name: '威海·桑沟湾海草床与贝藻碳汇站',
      country: '中国',
      region: '山东省威海市 · 荣成海域',
      type: 'blue-carbon',
      isBlueCarbonZone: true,
      annualCarbonTotal: 168.0,
      burialRate: 245,
      description: '中国现代蓝碳策源地，国际著名的多营养层次贝藻立体养殖区（IMTA）与连片大叶藻海草床，海带年吸收转化海气CO₂超56万吨。',
      lat,
      lng,
      elevationOrDepth: '浅海养殖水域 (-3m ~ -15m)',
      blueCarbonStationId: 'weihai',
    };
  }

  // Qingdao Jiaozhou Bay: ~36.12, 120.25
  const dQingdao = Math.hypot(lat - 36.12, lng - 120.25);
  if (dQingdao < 0.35) {
    return {
      name: '青岛·胶州湾海岸带通量监测站',
      country: '中国',
      region: '山东省青岛市 · 胶州湾海域',
      type: 'blue-carbon',
      isBlueCarbonZone: true,
      annualCarbonTotal: 78.3,
      burialRate: 185,
      description: '我国北方代表性半封闭海湾，布设高精度涡度相关通量塔，重点监测潮汐涨落周期与海-气CO₂净吸收通量的耦合机制。',
      lat,
      lng,
      elevationOrDepth: '海湾近岸区 (-2m ~ -12m)',
      blueCarbonStationId: 'qingdao',
    };
  }

  // Yantai Changdao: ~37.92, 120.72
  const dYantai = Math.hypot(lat - 37.92, lng - 120.72);
  if (dYantai < 0.4) {
    return {
      name: '烟台·长岛海洋牧场固碳试验区',
      country: '中国',
      region: '山东省烟台市 · 庙岛群岛海峡',
      type: 'blue-carbon',
      isBlueCarbonZone: true,
      annualCarbonTotal: 84.0,
      burialRate: 198,
      description: '国家级深远海绿色养殖与藻场人工礁示范区，研究微型生物碳泵（MCP）将活性有机碳转化为长期惰性碳（RDOC）的生化封存路径。',
      lat,
      lng,
      elevationOrDepth: '外海海峡区 (-15m ~ -35m)',
      blueCarbonStationId: 'yantai',
    };
  }

  // Rizhao Qiansandao: ~35.18, 119.95
  const dRizhao = Math.hypot(lat - 35.18, lng - 119.95);
  if (dRizhao < 0.35) {
    return {
      name: '日照·前三岛大型藻类监测站',
      country: '中国',
      region: '山东省日照市 · 海州湾北部',
      type: 'blue-carbon',
      isBlueCarbonZone: true,
      annualCarbonTotal: 52.0,
      burialRate: 165,
      description: '黄海冷水团前沿岛礁基底，以裙带菜、石莼等大型经济与生态海藻为核心，具备极强的生物量累积与抗风暴潮韧性。',
      lat,
      lng,
      elevationOrDepth: '岛礁近海水域 (-5m ~ -25m)',
      blueCarbonStationId: 'rizhao',
    };
  }

  // 2. Check nearby regional coastal points
  // Weifang Laizhou Bay coastal area: 37.0~37.4, 119.0~119.6
  if (lat >= 36.9 && lat <= 37.4 && lng >= 119.0 && lng <= 119.8) {
    return {
      name: '潍坊 · 莱州湾南岸卤水与湿地生态区',
      country: '中国',
      region: '山东省潍坊市 · 莱州湾海岸带',
      type: 'blue-carbon',
      description: '莱州湾南岸潮滩，拥有丰富的潮间带耐盐碱芦苇湿地和贝类底播区，为黄渤海次级蓝碳储备空间。',
      lat,
      lng,
      elevationOrDepth: '潮滩高程 +1.2m',
    };
  }

  // Binzhou Shell Dike: 38.0~38.3, 117.8~118.4
  if (lat >= 37.8 && lat <= 38.4 && lng >= 117.7 && lng <= 118.5) {
    return {
      name: '滨州 · 贝壳堤岛与湿地自然保护区',
      country: '中国',
      region: '山东省滨州市 · 渤海湾南岸',
      type: 'blue-carbon',
      description: '世界三大古贝壳堤之一，富含碳酸钙贝壳沉积物与潮间带耐盐植被，是古海岸演变与生物钙化固碳的重要实证。',
      lat,
      lng,
      elevationOrDepth: '贝壳砂堤 +2.5m',
    };
  }

  // Inland Shandong Cities
  // Jinan: 36.65, 117.0
  if (Math.hypot(lat - 36.65, lng - 117.0) < 0.45) {
    return {
      name: '济南市 (泉城)',
      country: '中国',
      region: '山东省省会 · 鲁中内陆地区',
      type: 'city',
      description: '黄河流域中心城市，国家历史文化名城，拥有七十二名泉，属温带季风气候，为山东省绿碳与湿地水源涵养核心枢纽。',
      lat,
      lng,
      elevationOrDepth: '海拔 48m',
    };
  }

  // Taian / Mount Tai: 36.2, 117.1
  if (Math.hypot(lat - 36.25, lng - 117.1) < 0.35) {
    return {
      name: '泰安市 · 泰山风景名胜区',
      country: '中国',
      region: '山东省中部 · 世界文化与自然双遗产',
      type: 'city',
      description: '五岳之首泰山所在地，森林覆盖率达 82%，为温带典型森林陆地森林生态系统（陆地绿碳库）。',
      lat,
      lng,
      elevationOrDepth: '主峰海拔 1545m',
    };
  }

  // Zibo: 36.8, 118.05
  if (Math.hypot(lat - 36.8, lng - 118.05) < 0.35) {
    return {
      name: '淄博市',
      country: '中国',
      region: '山东省中部 · 齐国故都',
      type: 'city',
      description: '鲁中工业重镇与齐文化发祥地，积极推进工业碳捕集利用与封存（CCUS）与近海蓝碳交易中和试点。',
      lat,
      lng,
      elevationOrDepth: '海拔 62m',
    };
  }

  // Linyi: 35.05, 118.35
  if (Math.hypot(lat - 35.05, lng - 118.35) < 0.4) {
    return {
      name: '临沂市 (沂蒙山区)',
      country: '中国',
      region: '山东省东南部 · 商贸物流之都',
      type: 'city',
      description: '山东省面积最大、人口最多的地级市，沂蒙山区森林与库区生态屏障，沂河水系直接入海提供营养盐。',
      lat,
      lng,
      elevationOrDepth: '海拔 75m',
    };
  }

  // Major Nearby Cities outside Shandong
  // Beijing: 39.9, 116.4
  if (Math.hypot(lat - 39.9, lng - 116.4) < 0.6) {
    return {
      name: '北京市 (首都)',
      country: '中国',
      region: '京津冀协同发展核心区',
      type: 'city',
      description: '中华人民共和国首都，全国政治、文化中心与国家碳排放权交易体系（CCER）全国注册登记机构总部所在地。',
      lat,
      lng,
      elevationOrDepth: '海拔 43m',
    };
  }

  // Tianjin: 39.1, 117.2
  if (Math.hypot(lat - 39.1, lng - 117.2) < 0.5) {
    return {
      name: '天津市 (渤海海湾中心)',
      country: '中国',
      region: '直辖市 · 渤海沿海重镇',
      type: 'city',
      description: '海河流域下流与环渤海经济中心，拥有北大港湿地与北方第一大港，积极协同环渤海三省一市海洋生态保护治理。',
      lat,
      lng,
      elevationOrDepth: '海拔 3.5m',
    };
  }

  // Dalian: 38.9, 121.6
  if (Math.hypot(lat - 38.9, lng - 121.6) < 0.5) {
    return {
      name: '大连市 (辽东半岛)',
      country: '中国',
      region: '辽宁省副省级城市 · 黄渤海分界点',
      type: 'city',
      description: '北方著名沿海港口与避暑名胜，与胶东半岛隔海相望，海参、海带及贝类增养殖业发达，为环渤海重要海洋生物圈。',
      lat,
      lng,
      elevationOrDepth: '近海海拔 12m',
    };
  }

  // Lianyungang: 34.6, 119.2
  if (Math.hypot(lat - 34.6, lng - 119.2) < 0.4) {
    return {
      name: '连云港市 (江苏省海州湾)',
      country: '中国',
      region: '江苏省东北部沿海 · 新亚欧大陆桥东方桥头堡',
      type: 'city',
      description: '海州湾南部枢纽，与日照市毗邻，拥有连片条斑紫菜养殖区和云台山森林生态屏障。',
      lat,
      lng,
      elevationOrDepth: '沿海平原海拔 4m',
    };
  }

  // Shanghai: 31.2, 121.5
  if (Math.hypot(lat - 31.2, lng - 121.5) < 0.6) {
    return {
      name: '上海市 (长江口)',
      country: '中国',
      region: '直辖市 · 长江三角洲龙头',
      type: 'city',
      description: '国际经济、金融与航运中心，崇明东滩与九段沙盐沼湿地是我国东海著名滩涂生态与候鸟过境中继站。',
      lat,
      lng,
      elevationOrDepth: '海拔 4m',
    };
  }

  // 3. Marine Waters Detection (Bohai, Yellow Sea, etc.)
  // Bohai Sea: lat 37.5 ~ 41.0, lng 117.5 ~ 121.0
  if (lat >= 37.5 && lat <= 40.8 && lng >= 118.0 && lng <= 121.0) {
    return {
      name: '中国 · 渤海海域',
      country: '中国',
      region: '中国内海 · 环渤海海洋生态区',
      type: 'sea',
      description: '半封闭型陆架浅海，平均水深约 18 米，承接黄河、海河、辽河等河流输运，富含浮游生物与微藻，具有显著的海-气碳交换汇效应。',
      lat,
      lng,
      elevationOrDepth: '水深约 -18m ~ -28m',
    };
  }

  // Yellow Sea: lat 34.0 ~ 39.0, lng 121.0 ~ 125.0
  if (lat >= 34.0 && lat <= 39.5 && lng >= 121.0 && lng <= 125.5) {
    return {
      name: '中国 · 黄海大陆架水域',
      country: '中国',
      region: '西北太平洋边缘海 · 黄海冷水团生境',
      type: 'sea',
      description: '水质清澈，夏季底部发育独特的黄海冷水团，孕育深水大型海藻场与优质冷水性海珍品养殖，是微型生物碳泵作用活跃海域。',
      lat,
      lng,
      elevationOrDepth: '水深约 -35m ~ -70m',
    };
  }

  // General geographic coordinate inside China
  if (lat >= 18 && lat <= 54 && lng >= 73 && lng <= 135) {
    return {
      name: `中国陆海地理测绘点 (${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E)`,
      country: '中国',
      region: '陆海统筹生态空间',
      type: 'general',
      description: '东亚季风气候区，地貌多样。陆地以森林、草原、农田绿碳为主，滨海及外海以滨海湿地与水体浮游微藻光合碳汇为主。',
      lat,
      lng,
      elevationOrDepth: 'GPS实测定位点',
    };
  }

  // Worldwide coordinates
  return {
    name: `全球地理坐标点 (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
    country: '全球公海/陆域',
    region: '地球表面生态圈',
    type: 'general',
    description: '海洋覆盖了地球表面 71% 的面积，储存了全球 93% 的二氧化碳，是调节全球气候变化最核心的长期碳汇池。',
    lat,
    lng,
    elevationOrDepth: '世界大地坐标系 (WGS-84)',
  };
}
