export interface StationData {
  id: string;
  name: string;
  shortName: string;
  city: string;
  bay: string;
  coreSpecies: string;
  coordinates: { lon: number; lat: number };
  svgCoords: { x: number; y: number };
  tagline: string;
  description: string;
  carbonTotal: number; // 万吨 CO2e
  carbonShare: {
    saltmarsh: number; // 盐沼湿地 %
    seagrass: number;  // 海草床 %
    shellfishAlgae: number; // 贝藻养殖 %
  };
  carbonGrowthRate: number; // 同比增长 %
  uniqueMetrics: {
    label: string;
    value: string;
    unit: string;
    sublabel?: string;
  }[];
  buoySensors: {
    do: number; // 溶解氧 mg/L
    ph: number;
    salinity: number; // 盐度 PSU
    temperature: number; // 水温 °C
    burialRate: number; // 沉积物碳埋藏速率 g C/(m²·a)
  };
  radarScores: {
    biodiversity: number; // 生物多样性
    waterQuality: number; // 水质优良率
    sinkStability: number; // 碳汇稳定性
    ndviIndex: number;    // 遥感植被指数
    economicRatio: number;// 经济转化率
  };
  remoteSensing: {
    ndvi: number;
    ndwi: number;
    sst: number;
    chla: number; // 叶绿素a mg/m³
  };
  carbonFlow: {
    atmosphereCO2: number; // 100%
    photosynthesis: number; // %
    phytoplanktonAlgae: number; // %
    biomassStorage: number; // %
    deepSedimentBurial: number; // %
    fisheryExport: number; // %
  };
  hourlyFluxData: {
    hour: string;
    flux: number; // mmol/(m²·h)
    chla: number; // 叶绿素a
    tideHeight: number; // 潮位 (m)
  }[];
}

export interface EcologicalAlert {
  id: string;
  stationId: string;
  level: 'warning' | 'critical' | 'info';
  title: string;
  time: string;
  location: string;
  summary: string;
  prescription: {
    problemAnalysis: string;
    suggestedMethod: string;
    targetGain: string;
    executionStages: string[];
    ecologicalBenefit: string;
  };
}

export const PROVINCE_OVERVIEW: StationData = {
  id: 'all',
  name: '山东省蓝碳总览库',
  shortName: '全省总览',
  city: '山东全省沿海',
  bay: '黄渤海海岸带',
  coreSpecies: '翅碱蓬 / 大叶藻 / 芦苇 / 海带 / 栉孔扇贝',
  coordinates: { lon: 120.38, lat: 36.65 },
  svgCoords: { x: 490, y: 310 },
  tagline: '黄渤海陆海统筹现代海洋生态碳汇大省',
  description: '覆盖全省 3345 公里大陆海岸线，统筹黄河口盐沼湿地、胶东半岛海草床及深远海贝藻养殖三大典型碳库。',
  carbonTotal: 384.62,
  carbonShare: {
    saltmarsh: 38.2,
    seagrass: 29.4,
    shellfishAlgae: 32.4,
  },
  carbonGrowthRate: 8.6,
  uniqueMetrics: [
    { label: '全省蓝碳生态空间面积', value: '184.2', unit: '万公顷', sublabel: '居沿海省份前列' },
    { label: '年均蓝碳汇增量潜力', value: '412.5', unit: '万吨CO₂e', sublabel: '含微型生物碳泵' },
    { label: '入海径流输送有机碳', value: '128.9', unit: '万吨/年', sublabel: '陆海交互关键汇' },
    { label: '蓝碳生态系统总估值', value: '30,192', unit: '万元', sublabel: 'CCER基准测算' },
  ],
  buoySensors: {
    do: 8.8,
    ph: 8.16,
    salinity: 30.6,
    temperature: 16.8,
    burialRate: 245,
  },
  radarScores: {
    biodiversity: 92,
    waterQuality: 91,
    sinkStability: 95,
    ndviIndex: 90,
    economicRatio: 94,
  },
  remoteSensing: {
    ndvi: 0.742,
    ndwi: -0.315,
    sst: 16.8,
    chla: 4.85,
  },
  carbonFlow: {
    atmosphereCO2: 100,
    photosynthesis: 64,
    phytoplanktonAlgae: 36,
    biomassStorage: 38,
    deepSedimentBurial: 42,
    fisheryExport: 20,
  },
  hourlyFluxData: [
    { hour: '00:00', flux: -1.2, chla: 3.8, tideHeight: 1.2 },
    { hour: '02:00', flux: -0.8, chla: 3.5, tideHeight: 1.8 },
    { hour: '04:00', flux: -0.5, chla: 3.4, tideHeight: 2.5 },
    { hour: '06:00', flux: -1.9, chla: 4.1, tideHeight: 3.2 },
    { hour: '08:00', flux: -3.8, chla: 5.2, tideHeight: 2.7 },
    { hour: '10:00', flux: -5.6, chla: 6.4, tideHeight: 1.9 },
    { hour: '12:00', flux: -6.8, chla: 7.1, tideHeight: 1.1 },
    { hour: '14:00', flux: -6.2, chla: 6.8, tideHeight: 1.5 },
    { hour: '16:00', flux: -4.5, chla: 5.9, tideHeight: 2.3 },
    { hour: '18:00', flux: -3.1, chla: 4.8, tideHeight: 3.1 },
    { hour: '20:00', flux: -1.8, chla: 4.2, tideHeight: 2.6 },
    { hour: '22:00', flux: -1.4, chla: 3.9, tideHeight: 1.6 },
  ],
};

export const STATIONS: Record<string, StationData> = {
  dongying: {
    id: 'dongying',
    name: '东营·黄河口盐沼湿地监测站',
    shortName: '东营黄河口',
    city: '东营市',
    bay: '渤海湾与莱州湾',
    coreSpecies: '翅碱蓬 / 芦苇',
    coordinates: { lon: 119.16, lat: 37.78 },
    svgCoords: { x: 380, y: 165 },
    tagline: '国家公园天然碳库 · 红色滩涂泥沙有机碳沉积重地',
    description: '坐落于黄河三角洲国家级自然保护区，是我国暖温带最完整的湿地生态系统，重点监测翅碱蓬潮滩与芦苇群落长期碳封存。',
    carbonTotal: 104.35,
    carbonShare: {
      saltmarsh: 78.4,
      seagrass: 4.6,
      shellfishAlgae: 17.0,
    },
    carbonGrowthRate: 11.4,
    uniqueMetrics: [
      { label: '翅碱蓬红地毯湿地面积', value: '6,420', unit: '公顷', sublabel: '原生潮滩植被' },
      { label: '芦苇群落高碳汇储量', value: '82.4', unit: '万吨CO₂e', sublabel: '耐盐碱高效吸碳' },
      { label: '互花米草攻坚清除率', value: '96.2%', unit: '治理率', sublabel: '生态位恢复达标' },
      { label: '黄河入海泥沙有机碳埋藏', value: '312.0', unit: 'g/(m²·a)', sublabel: '深层千年封存' },
    ],
    buoySensors: {
      do: 8.6,
      ph: 8.12,
      salinity: 22.4,
      temperature: 17.2,
      burialRate: 312,
    },
    radarScores: {
      biodiversity: 96,
      waterQuality: 86,
      sinkStability: 97,
      ndviIndex: 98,
      economicRatio: 82,
    },
    remoteSensing: {
      ndvi: 0.812,
      ndwi: -0.210,
      sst: 17.2,
      chla: 5.12,
    },
    carbonFlow: {
      atmosphereCO2: 100,
      photosynthesis: 78,
      phytoplanktonAlgae: 22,
      biomassStorage: 45,
      deepSedimentBurial: 48,
      fisheryExport: 7,
    },
    hourlyFluxData: [
      { hour: '00:00', flux: -0.9, chla: 3.1, tideHeight: 0.9 },
      { hour: '02:00', flux: -0.6, chla: 2.8, tideHeight: 1.4 },
      { hour: '04:00', flux: -0.4, chla: 2.9, tideHeight: 2.1 },
      { hour: '06:00', flux: -2.3, chla: 3.8, tideHeight: 2.8 },
      { hour: '08:00', flux: -4.9, chla: 5.5, tideHeight: 2.2 },
      { hour: '10:00', flux: -7.5, chla: 7.2, tideHeight: 1.4 },
      { hour: '12:00', flux: -9.2, chla: 8.4, tideHeight: 0.8 },
      { hour: '14:00', flux: -8.1, chla: 7.9, tideHeight: 1.1 },
      { hour: '16:00', flux: -5.4, chla: 6.2, tideHeight: 1.9 },
      { hour: '18:00', flux: -3.5, chla: 4.9, tideHeight: 2.6 },
      { hour: '20:00', flux: -1.7, chla: 4.0, tideHeight: 2.1 },
      { hour: '22:00', flux: -1.1, chla: 3.4, tideHeight: 1.3 },
    ],
  },
  weihai: {
    id: 'weihai',
    name: '威海·桑沟湾海草床与贝藻碳汇站',
    shortName: '威海桑沟湾',
    city: '威海市',
    bay: '桑沟湾与荣成天鹅湖',
    coreSpecies: '大叶藻 / 海带 / 栉孔扇贝',
    coordinates: { lon: 122.56, lat: 37.15 },
    svgCoords: { x: 740, y: 220 },
    tagline: '中国现代蓝碳策源地 · 多营养层次贝藻海草立体碳汇',
    description: '依托胶东半岛桑沟湾国际著名IMTA养殖模式与大叶藻海草床，构建海草床根系沉积碳与海带光合碳汇的高精度立体监测体系。',
    carbonTotal: 96.80,
    carbonShare: {
      saltmarsh: 12.1,
      seagrass: 48.6,
      shellfishAlgae: 39.3,
    },
    carbonGrowthRate: 9.8,
    uniqueMetrics: [
      { label: '大叶藻海草床覆盖度', value: '78.5%', unit: '茂密盖度', sublabel: '底栖微生境优良' },
      { label: '贝藻立体养殖年固碳量', value: '56.8', unit: '万吨CO₂e', sublabel: '海带贻贝协同' },
      { label: '溶解无机碳(DIC)转化率', value: '91.2%', unit: '生化效率', sublabel: '海气吸收加速' },
      { label: '贝类壳体钙化长期固碳', value: '24.6', unit: '万吨碳酸钙', sublabel: '百年稳定沉降' },
    ],
    buoySensors: {
      do: 9.4,
      ph: 8.28,
      salinity: 31.8,
      temperature: 15.6,
      burialRate: 278,
    },
    radarScores: {
      biodiversity: 93,
      waterQuality: 96,
      sinkStability: 94,
      ndviIndex: 88,
      economicRatio: 98,
    },
    remoteSensing: {
      ndvi: 0.725,
      ndwi: -0.420,
      sst: 15.6,
      chla: 6.45,
    },
    carbonFlow: {
      atmosphereCO2: 100,
      photosynthesis: 58,
      phytoplanktonAlgae: 42,
      biomassStorage: 32,
      deepSedimentBurial: 41,
      fisheryExport: 27,
    },
    hourlyFluxData: [
      { hour: '00:00', flux: -1.5, chla: 4.5, tideHeight: 1.5 },
      { hour: '02:00', flux: -1.1, chla: 4.1, tideHeight: 2.1 },
      { hour: '04:00', flux: -0.8, chla: 3.9, tideHeight: 2.7 },
      { hour: '06:00', flux: -2.8, chla: 5.2, tideHeight: 3.3 },
      { hour: '08:00', flux: -4.6, chla: 6.8, tideHeight: 2.9 },
      { hour: '10:00', flux: -6.7, chla: 8.4, tideHeight: 2.0 },
      { hour: '12:00', flux: -7.8, chla: 9.2, tideHeight: 1.2 },
      { hour: '14:00', flux: -6.9, chla: 8.6, tideHeight: 1.6 },
      { hour: '16:00', flux: -5.1, chla: 7.3, tideHeight: 2.4 },
      { hour: '18:00', flux: -3.4, chla: 5.9, tideHeight: 3.0 },
      { hour: '20:00', flux: -2.1, chla: 5.1, tideHeight: 2.5 },
      { hour: '22:00', flux: -1.8, chla: 4.8, tideHeight: 1.8 },
    ],
  },
  qingdao: {
    id: 'qingdao',
    name: '青岛·胶州湾海岸带通量监测站',
    shortName: '青岛胶州湾',
    city: '青岛市',
    bay: '胶州湾与黄岛海域',
    coreSpecies: '潮间带微藻 / 红藻 / 牡蛎礁',
    coordinates: { lon: 120.25, lat: 36.12 },
    svgCoords: { x: 550, y: 350 },
    tagline: '国际海洋科技核心区 · 城市海岸带海-气碳通量与港口中和试验',
    description: '布设于胶州湾口高频涡度相关通量塔与智能浮标阵列，重点探究海湾潮汐水位变动与大气CO₂净交换通量的耦合响应。',
    carbonTotal: 68.20,
    carbonShare: {
      saltmarsh: 22.5,
      seagrass: 31.2,
      shellfishAlgae: 46.3,
    },
    carbonGrowthRate: 7.5,
    uniqueMetrics: [
      { label: '海-气CO₂净吸收通量', value: '-5.24', unit: 'mmol/(m²·d)', sublabel: '持续强净汇' },
      { label: '潮汐水位吸收增益协同率', value: '+34.5%', unit: '涨落耦合', sublabel: '半日潮驱动' },
      { label: '港口低碳航道与蓝碳中和', value: '31.2%', unit: '中和配比', sublabel: '碳普惠试点' },
      { label: '海岸线生态红线受控率', value: '94.8%', unit: '保护比例', sublabel: '严控工程填海' },
    ],
    buoySensors: {
      do: 8.2,
      ph: 8.08,
      salinity: 30.5,
      temperature: 18.1,
      burialRate: 198,
    },
    radarScores: {
      biodiversity: 89,
      waterQuality: 90,
      sinkStability: 91,
      ndviIndex: 84,
      economicRatio: 96,
    },
    remoteSensing: {
      ndvi: 0.684,
      ndwi: -0.340,
      sst: 18.1,
      chla: 4.20,
    },
    carbonFlow: {
      atmosphereCO2: 100,
      photosynthesis: 61,
      phytoplanktonAlgae: 39,
      biomassStorage: 40,
      deepSedimentBurial: 38,
      fisheryExport: 22,
    },
    hourlyFluxData: [
      { hour: '00:00', flux: -1.0, chla: 3.4, tideHeight: 1.1 },
      { hour: '02:00', flux: -0.7, chla: 3.2, tideHeight: 1.7 },
      { hour: '04:00', flux: -0.4, chla: 3.1, tideHeight: 2.6 },
      { hour: '06:00', flux: -1.8, chla: 3.8, tideHeight: 3.4 },
      { hour: '08:00', flux: -3.5, chla: 4.7, tideHeight: 2.8 },
      { hour: '10:00', flux: -5.1, chla: 5.6, tideHeight: 2.0 },
      { hour: '12:00', flux: -6.4, chla: 6.3, tideHeight: 1.0 },
      { hour: '14:00', flux: -5.8, chla: 6.0, tideHeight: 1.4 },
      { hour: '16:00', flux: -4.2, chla: 5.2, tideHeight: 2.2 },
      { hour: '18:00', flux: -2.8, chla: 4.4, tideHeight: 3.2 },
      { hour: '20:00', flux: -1.6, chla: 3.9, tideHeight: 2.7 },
      { hour: '22:00', flux: -1.2, chla: 3.6, tideHeight: 1.5 },
    ],
  },
  yantai: {
    id: 'yantai',
    name: '烟台·长岛海洋牧场固碳试验区',
    shortName: '烟台长岛',
    city: '烟台市',
    bay: '渤海海峡与长岛列岛',
    coreSpecies: '鼠尾藻 / 皱纹盘鲍 / 海胆',
    coordinates: { lon: 120.72, lat: 37.92 },
    svgCoords: { x: 540, y: 140 },
    tagline: '生态海岛试验区 · 微型生物碳泵(MCP)与深远海藻场',
    description: '位于庙岛群岛渤海海峡咽喉，结合国家深远海绿色养殖与藻场人工礁，专注惰性溶解有机碳(RDOC)长期持留与微型生物碳汇过程。',
    carbonTotal: 65.40,
    carbonShare: {
      saltmarsh: 8.5,
      seagrass: 36.4,
      shellfishAlgae: 55.1,
    },
    carbonGrowthRate: 8.9,
    uniqueMetrics: [
      { label: '深远海多层级海洋牧场碳汇', value: '49.3', unit: '万吨CO₂e', sublabel: '国家级海洋牧场' },
      { label: '藻场人工礁体海藻附着量', value: '38.6', unit: '株/m²', sublabel: '底栖生物庇护' },
      { label: '微型生物碳泵(MCP)储碳活度', value: '88.7%', unit: '微生物催化', sublabel: '转化持久惰性碳' },
      { label: '惰性溶解有机碳(RDOC)存量', value: '26.5', unit: '万吨', sublabel: '千年级化学封存' },
    ],
    buoySensors: {
      do: 9.8,
      ph: 8.32,
      salinity: 32.1,
      temperature: 14.8,
      burialRate: 260,
    },
    radarScores: {
      biodiversity: 95,
      waterQuality: 97,
      sinkStability: 93,
      ndviIndex: 86,
      economicRatio: 93,
    },
    remoteSensing: {
      ndvi: 0.705,
      ndwi: -0.460,
      sst: 14.8,
      chla: 4.90,
    },
    carbonFlow: {
      atmosphereCO2: 100,
      photosynthesis: 55,
      phytoplanktonAlgae: 45,
      biomassStorage: 28,
      deepSedimentBurial: 44,
      fisheryExport: 28,
    },
    hourlyFluxData: [
      { hour: '00:00', flux: -1.4, chla: 3.9, tideHeight: 1.3 },
      { hour: '02:00', flux: -1.0, chla: 3.6, tideHeight: 1.9 },
      { hour: '04:00', flux: -0.7, chla: 3.5, tideHeight: 2.7 },
      { hour: '06:00', flux: -2.5, chla: 4.4, tideHeight: 3.3 },
      { hour: '08:00', flux: -4.2, chla: 5.7, tideHeight: 2.8 },
      { hour: '10:00', flux: -6.1, chla: 7.0, tideHeight: 1.8 },
      { hour: '12:00', flux: -7.2, chla: 7.9, tideHeight: 1.1 },
      { hour: '14:00', flux: -6.5, chla: 7.4, tideHeight: 1.5 },
      { hour: '16:00', flux: -4.8, chla: 6.3, tideHeight: 2.3 },
      { hour: '18:00', flux: -3.2, chla: 5.2, tideHeight: 3.1 },
      { hour: '20:00', flux: -1.9, chla: 4.6, tideHeight: 2.5 },
      { hour: '22:00', flux: -1.5, chla: 4.2, tideHeight: 1.7 },
    ],
  },
  rizhao: {
    id: 'rizhao',
    name: '日照·前三岛大型藻类监测站',
    shortName: '日照前三岛',
    city: '日照市',
    bay: '海州湾北部与前三岛群岛',
    coreSpecies: '裙带菜 / 石莼 / 真鲷礁',
    coordinates: { lon: 119.95, lat: 35.18 },
    svgCoords: { x: 485, y: 440 },
    tagline: '黄海冷水团前沿 · 大型经济海藻生态固碳与耐候性监测',
    description: '地处鲁苏交界海州湾北部，具有典型岛礁基底与清澈暖温海流，重点监测大型绿藻、褐藻光合固碳及其向下坡度颗粒碳输送机制。',
    carbonTotal: 49.87,
    carbonShare: {
      saltmarsh: 18.2,
      seagrass: 26.5,
      shellfishAlgae: 55.3,
    },
    carbonGrowthRate: 8.2,
    uniqueMetrics: [
      { label: '大型生态海藻鲜品总生物量', value: '14.2', unit: '万吨', sublabel: '裙带菜高产' },
      { label: '海岛岛礁区碳汇年增量', value: '18.7', unit: '万吨CO₂e', sublabel: '多物种协同' },
      { label: '阳光海岸带生态耐候指数', value: '0.892', unit: '稳定性', sublabel: '抗风暴潮韧性' },
      { label: '潮汐驱动水体营养盐通量', value: '45.2', unit: 'm³/s', sublabel: '上升流滋养' },
    ],
    buoySensors: {
      do: 8.9,
      ph: 8.18,
      salinity: 31.2,
      temperature: 17.6,
      burialRate: 220,
    },
    radarScores: {
      biodiversity: 91,
      waterQuality: 94,
      sinkStability: 90,
      ndviIndex: 86,
      economicRatio: 92,
    },
    remoteSensing: {
      ndvi: 0.695,
      ndwi: -0.380,
      sst: 17.6,
      chla: 4.60,
    },
    carbonFlow: {
      atmosphereCO2: 100,
      photosynthesis: 62,
      phytoplanktonAlgae: 38,
      biomassStorage: 35,
      deepSedimentBurial: 39,
      fisheryExport: 26,
    },
    hourlyFluxData: [
      { hour: '00:00', flux: -1.1, chla: 3.6, tideHeight: 1.2 },
      { hour: '02:00', flux: -0.8, chla: 3.3, tideHeight: 1.8 },
      { hour: '04:00', flux: -0.5, chla: 3.2, tideHeight: 2.5 },
      { hour: '06:00', flux: -2.0, chla: 4.0, tideHeight: 3.1 },
      { hour: '08:00', flux: -3.8, chla: 5.1, tideHeight: 2.6 },
      { hour: '10:00', flux: -5.5, chla: 6.2, tideHeight: 1.8 },
      { hour: '12:00', flux: -6.7, chla: 7.0, tideHeight: 1.0 },
      { hour: '14:00', flux: -6.0, chla: 6.6, tideHeight: 1.3 },
      { hour: '16:00', flux: -4.4, chla: 5.6, tideHeight: 2.1 },
      { hour: '18:00', flux: -2.9, chla: 4.6, tideHeight: 2.9 },
      { hour: '20:00', flux: -1.7, chla: 4.1, tideHeight: 2.4 },
      { hour: '22:00', flux: -1.3, chla: 3.8, tideHeight: 1.5 },
    ],
  },
};

export const ALERTS_LIST: EcologicalAlert[] = [
  {
    id: 'alt-01',
    stationId: 'dongying',
    level: 'warning',
    title: '黄河口潮滩局部互花米草幼苗复萌预警',
    time: '10:24:18',
    location: '东营市垦利区孤东海堤外侧 (37°49′N, 119°12′E)',
    summary: '无人机多光谱监测检出 4.2 公顷斑块状互花米草复发萌芽，对原生翅碱蓬和芦苇生境构成挤压威胁。',
    prescription: {
      problemAnalysis: '夏秋交替期种子随潮汐扩散定居，若不及时干预，互花米草单优群落将降低潮滩底栖生物多样性 60% 以上，并导致原生沉积物碳埋藏通路变异。',
      suggestedMethod: '采用“机械旋耕淹水翻耕 + 芦苇/碱蓬优良原生株系快速补植”双轨生态置换治理法，避免化学药剂污染海洋水体。',
      targetGain: '预计可保护翅碱蓬红地毯面积 35 公顷，挽回潜在蓝碳损失约 1,840 吨 CO₂e。',
      executionStages: [
        '第一阶段（24小时内）：高光谱无人机对4.2公顷斑块划定厘米级电子围栏',
        '第二阶段（3日内）：低潮期特种水陆两栖旋耕机实施根系彻底切碎与翻埋（深翻>40cm）',
        '第三阶段（7日内）：人工飞播本土高发芽率翅碱蓬种衣剂，恢复红色湿地景观',
      ],
      ecologicalBenefit: '消除生物入侵隐患，保障国家公园底栖鸟类觅食生境，长期固碳速率恢复至 310 g C/(m²·a)。',
    },
  },
  {
    id: 'alt-02',
    stationId: 'weihai',
    level: 'info',
    title: '桑沟湾大叶藻种子成熟期水下监测通报',
    time: '09:15:42',
    location: '威海荣成桑沟湾海草床保护区 (37°08′N, 122°32′E)',
    summary: '水下多光谱摄像记录到大叶藻生殖枝结实率达 89.4%，进入年度最佳天然种子沉降与人工采收补植窗口。',
    prescription: {
      problemAnalysis: '海草床天然扩繁受水流剪切力与海底沉积底质影响，人工辅助播种可将成苗存活率由自然状态下的 12% 提升至 68% 以上。',
      suggestedMethod: '实施“水下网袋泥沙固定播种法”与“幼苗泥球沉降移植技术”，配合局部休渔禁拖网保护网格。',
      targetGain: '新增高密度健康海草床 120 公顷，年增固碳能力达 4,320 吨 CO₂e。',
      executionStages: [
        '潜水作业队于大叶藻成熟株系采收生殖穗',
        '室内低温微流水控温促进种子脱落与防霉预处理',
        '退潮静流期开展海底网格化人工精准抛撒与锚定',
      ],
      ecologicalBenefit: '提供水生幼鱼及扇贝栖息微环境，显著降低水体悬浮物浊度，水下透光率提升 22%。',
    },
  },
  {
    id: 'alt-03',
    stationId: 'qingdao',
    level: 'critical',
    title: '胶州湾东北部近岸海域局部营养盐比值异常',
    time: '08:42:05',
    location: '青岛市李村河入海口及大桥北侧 (36°11′N, 120°21′E)',
    summary: '浮标连续监测到溶解态无机氮(DIN)短时上升，N/P摩尔比偏离Redfield平衡，可能诱发微型甲藻异常增殖。',
    prescription: {
      problemAnalysis: '近期降水径流携带初期陆源雨水入海，水体微富营养化可能抑制底栖微藻净碳通量，甚至引发局部赤潮隐患。',
      suggestedMethod: '立即启动“大型红藻（江蓠/龙须菜）浮筏应急生物汲取吸氮”方案，协同上游湿地闸坝截污调控。',
      targetGain: '在48小时内使过量氮磷被巨藻吸收固化，维持海-气吸收负通量稳定在 -4.5 mmol/(m²·d) 以上。',
      executionStages: [
        '调派2艘海洋环境应急监测船采集立体水样做宏基因组赤潮生物排查',
        '投放近海生态应急吸附式龙须菜浮帘 5,000 米',
        '联动市政环保部门排查陆基排水口水质异常源头',
      ],
      ecologicalBenefit: '遏制赤潮爆发风险，保护胶州湾贝类养殖区安全，收获海藻可加工为海藻酸钠原料。',
    },
  },
  {
    id: 'alt-04',
    stationId: 'yantai',
    level: 'info',
    title: '长岛人工藻礁微型生物碳泵(MCP)储碳活度跃升',
    time: '07:30:11',
    location: '烟台市长岛南隍城岛深远海试验区 (38°21′N, 120°54′E)',
    summary: '原位微生物高通量测序分析表明，红螺菌与自养固碳古菌代谢通量提升 14.8%，惰性碳库转化加速。',
    prescription: {
      problemAnalysis: '深水低温上升流与马尾藻多糖分泌形成协同微环境，驱动异养细菌将易分解DOC转化为难以被氧化的RDOC。',
      suggestedMethod: '继续扩大生态多孔透水人工礁群投放规模，构建海底“藻-菌-贝-底栖”四元立体固碳闭环。',
      targetGain: '预计年增千年以上尺度长期深海封存碳 1,200 吨 CO₂e。',
      executionStages: [
        '持续跟踪水下溶解有机碳(DOC)组分质谱分析',
        '增设深水30米光量子与氧化还原电位探头',
        '形成国家级海岛型蓝碳微型生物转化标准工法草案',
      ],
      ecologicalBenefit: '形成不可逆的永久性海洋深层碳库，避免浅层生物碳重新分解返还大气。',
    },
  },
];
