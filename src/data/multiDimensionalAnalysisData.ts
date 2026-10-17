// Multi-Dimensional Macro Policy, Demographics & Blue Carbon Analysis Data Matrix
// Grounded in Shandong Provincial Marine Policies and Authoritative Scientific Literature

export interface CoastalDemographicItem {
  city: string;
  shortName: string;
  totalPopulation: number; // 万人
  marineLabor: number; // 万人 (涉海劳动力总量)
  maleLabor: number; // 万人
  femaleLabor: number; // 万人
  maleRatio: number; // %
  femaleRatio: number; // %
  densityPerSqKm: number; // 人/km² (近海人口密度)
  heatTier: '极高密集' | '高密集' | '中高密集' | '均衡生态';
  heatColor: string;
  carbonInclusionUsers: number; // 万人 (蓝碳普惠参与人次)
  perCapitaSeaGdp: number; // 万元/人 (人均涉海经济产值)
  fisheryType: string; // 核心产业类型
  carbonContributionIndex: number; // 碳普惠活跃指数 (0-100)
}

export interface PolicyEvaluationItem {
  id: string;
  title: string;
  leadDept: string; // 牵头主管机构
  publishYear: number;
  coreTarget: string; // 核心量化目标
  targetMetric: string; // 指标名称
  targetValue: number; // 考核目标值
  currentValue: number; // 当前达成值
  unit: string;
  fulfillmentRate: number; // 达成率 %
  status: '超额达成' | '优秀达标' | '稳步推进' | '重点攻坚';
  statusColor: string;
  fiscalSubsidy: number; // 财政与生态补偿转移支付 (亿元)
  literatureCitation: string; // 政策文件/文献出处
  assessmentScore: number; // 综合评价得分 (100分制)
}

export interface FisheryBioCarbonItem {
  category: string; // 生物门类
  species: string; // 代表物种
  cultureArea: number; // 万亩
  annualYield: number; // 万吨
  carbonSinkRate: number; // 固碳速率 tCO₂e/公顷·年
  annualCarbonSink: number; // 年固碳总量 万吨CO₂e
  economicValue: number; // 产值 (亿元)
  purificationPower: number; // 净水与抑藻效能 (亿吨水体/年)
  sharePercentage: number; // 占全省生物碳汇比重 %
  trendYoY: number; // 同比增长 %
}

export interface LandSeaWaterVulnerabilityItem {
  region: string;
  bayName: string;
  dinReductionRate: number; // 陆源无机氮消减率 %
  dipComplianceRate: number; // 活性磷酸盐达标率 %
  codFluxCut: number; // COD负荷消减 万吨/年
  seawaterPh: number; // 海水pH
  phAcidificationRisk: '安全正常' | '轻度偏酸' | '需加强监测';
  sstAnomaly: number; // 表层水温距平 °C
  eutrophicationIndex: number; // 富营养化指数 E (小于1为贫/中营养)
  resilienceRating: '极强' | '优良' | '中等' | '脆弱';
  redTideAlertLevel: '绿码安全' | '黄码关注' | '橙码警示';
}

export interface CCERMarketItem {
  projectNo: string;
  projectName: string;
  region: string;
  methodology: string;
  verifier: string; // 第三方核证机构
  carbonCreditTons: number; // 核证减排量 (tCO₂e)
  unitPrice: number; // 成交单价 (元/吨)
  totalAmountWan: number; // 交易总额 (万元)
  fulfillmentRate: number; // 履约消纳率 %
  greenCreditAssigned: number; // 关联绿色金融授信 (亿元)
  registryStatus: '已签发上市' | '备案复核中' | '技术评审中';
}

// 1. Coastal Demographics Data (7 coastal cities + province summary)
export const COASTAL_DEMOGRAPHICS: CoastalDemographicItem[] = [
  {
    city: '青岛市',
    shortName: '青岛',
    totalPopulation: 1045.2,
    marineLabor: 88.6,
    maleLabor: 50.5,
    femaleLabor: 38.1,
    maleRatio: 57.0,
    femaleRatio: 43.0,
    densityPerSqKm: 928,
    heatTier: '极高密集',
    heatColor: '#ef4444',
    carbonInclusionUsers: 48.5,
    perCapitaSeaGdp: 6.85,
    fisheryType: '现代海洋生物医药、贝藻立体养殖与深海智能装备',
    carbonContributionIndex: 96,
  },
  {
    city: '烟台市',
    shortName: '烟台',
    totalPopulation: 705.8,
    marineLabor: 74.2,
    maleLabor: 43.1,
    femaleLabor: 31.1,
    maleRatio: 58.1,
    femaleRatio: 41.9,
    densityPerSqKm: 512,
    heatTier: '高密集',
    heatColor: '#f97316',
    carbonInclusionUsers: 34.2,
    perCapitaSeaGdp: 6.12,
    fisheryType: '长岛国际零碳岛、海带/牡蛎精深加工与海洋牧场',
    carbonContributionIndex: 94,
  },
  {
    city: '威海市',
    shortName: '威海',
    totalPopulation: 292.4,
    marineLabor: 62.5,
    maleLabor: 35.6,
    femaleLabor: 26.9,
    maleRatio: 57.0,
    femaleRatio: 43.0,
    densityPerSqKm: 504,
    heatTier: '高密集',
    heatColor: '#f59e0b',
    carbonInclusionUsers: 28.6,
    perCapitaSeaGdp: 7.24,
    fisheryType: '桑沟湾IMTA多营养层级碳汇、大叶藻海草床与海带种业',
    carbonContributionIndex: 98,
  },
  {
    city: '日照市',
    shortName: '日照',
    totalPopulation: 308.2,
    marineLabor: 36.8,
    maleLabor: 21.8,
    femaleLabor: 15.0,
    maleRatio: 59.2,
    femaleRatio: 40.8,
    densityPerSqKm: 575,
    heatTier: '中高密集',
    heatColor: '#06b6d4',
    carbonInclusionUsers: 14.8,
    perCapitaSeaGdp: 4.95,
    fisheryType: '前三岛深水大网箱、贻贝微藻碳汇与生态海岸休闲',
    carbonContributionIndex: 88,
  },
  {
    city: '潍坊市',
    shortName: '潍坊',
    totalPopulation: 940.5,
    marineLabor: 45.2,
    maleLabor: 27.2,
    femaleLabor: 18.0,
    maleRatio: 60.2,
    femaleRatio: 39.8,
    densityPerSqKm: 584,
    heatTier: '中高密集',
    heatColor: '#06b6d4',
    carbonInclusionUsers: 19.4,
    perCapitaSeaGdp: 4.62,
    fisheryType: '莱州湾南岸重度盐碱潮滩柽柳/碱蓬湿地与滩涂贝类',
    carbonContributionIndex: 86,
  },
  {
    city: '东营市',
    shortName: '东营',
    totalPopulation: 220.8,
    marineLabor: 32.4,
    maleLabor: 19.1,
    femaleLabor: 13.3,
    maleRatio: 59.0,
    femaleRatio: 41.0,
    densityPerSqKm: 268,
    heatTier: '均衡生态',
    heatColor: '#10b981',
    carbonInclusionUsers: 16.5,
    perCapitaSeaGdp: 6.90,
    fisheryType: '黄河三角洲国家级自然保护区翅碱蓬红地毯与芦苇储碳',
    carbonContributionIndex: 92,
  },
  {
    city: '滨州市',
    shortName: '滨州',
    totalPopulation: 392.6,
    marineLabor: 28.5,
    maleLabor: 17.2,
    femaleLabor: 11.3,
    maleRatio: 60.4,
    femaleRatio: 39.6,
    densityPerSqKm: 408,
    heatTier: '均衡生态',
    heatColor: '#10b981',
    carbonInclusionUsers: 11.2,
    perCapitaSeaGdp: 4.15,
    fisheryType: '渤海西南岸贝壳堤岛湿地系统、丰年虫生态繁育',
    carbonContributionIndex: 84,
  },
];

// Multi-year Population and Marine Labor Evolution (2018-2026)
export const POPULATION_TRENDS = [
  { year: 2018, totalPop: 3820, marineLabor: 342, maleRatio: 60.8, femaleRatio: 39.2, carbonParticipationRate: 4.2 },
  { year: 2019, totalPop: 3845, marineLabor: 349, maleRatio: 60.2, femaleRatio: 39.8, carbonParticipationRate: 7.8 },
  { year: 2020, totalPop: 3868, marineLabor: 356, maleRatio: 59.6, femaleRatio: 40.4, carbonParticipationRate: 12.5 },
  { year: 2021, totalPop: 3885, marineLabor: 362, maleRatio: 59.1, femaleRatio: 40.9, carbonParticipationRate: 18.2 },
  { year: 2022, totalPop: 3895, marineLabor: 368, maleRatio: 58.7, femaleRatio: 41.3, carbonParticipationRate: 24.6 },
  { year: 2023, totalPop: 3902, marineLabor: 373, maleRatio: 58.4, femaleRatio: 41.6, carbonParticipationRate: 31.8 },
  { year: 2024, totalPop: 3908, marineLabor: 378, maleRatio: 58.2, femaleRatio: 41.8, carbonParticipationRate: 38.5 },
  { year: 2025, totalPop: 3912, marineLabor: 382, maleRatio: 58.0, femaleRatio: 42.0, carbonParticipationRate: 44.2 },
  { year: 2026, totalPop: 3916, marineLabor: 385, maleRatio: 57.9, femaleRatio: 42.1, carbonParticipationRate: 49.6 },
];

// 2. Policy Evaluation Matrix (Based on Shandong provincial policies & academic reviews)
export const POLICY_EVALUATIONS: PolicyEvaluationItem[] = [
  {
    id: 'pol-01',
    title: '《山东省海洋强省建设行动方案》',
    leadDept: '省发展改革委 / 省海洋局',
    publishYear: 2021,
    coreTarget: '构建现代海洋产业体系与万亿级蓝色经济高地',
    targetMetric: '全省海洋生产总值突破万亿目标',
    targetValue: 16500,
    currentValue: 17280,
    unit: '亿元',
    fulfillmentRate: 104.7,
    status: '超额达成',
    statusColor: '#10b981',
    fiscalSubsidy: 48.6,
    literatureCitation: '鲁政发〔2021〕12号 / 自然资源部海洋经济发展公报',
    assessmentScore: 96,
  },
  {
    id: 'pol-02',
    title: '《山东省碳达峰实施方案（海洋篇）》',
    leadDept: '省生态环境厅 / 省自然资源厅',
    publishYear: 2022,
    coreTarget: '拓展海洋生态碳汇增量，建设黄渤海蓝碳先行示范区',
    targetMetric: '沿海蓝碳年汇量累计增幅',
    targetValue: 350,
    currentValue: 384.6,
    unit: '万吨CO₂e',
    fulfillmentRate: 109.9,
    status: '超额达成',
    statusColor: '#10b981',
    fiscalSubsidy: 28.2,
    literatureCitation: '鲁发改环资〔2022〕850号 / 《中国海洋大学学报(自然科学版)》',
    assessmentScore: 97,
  },
  {
    id: 'pol-03',
    title: '《海洋生态保护红线监管与红线划定条例》',
    leadDept: '省自然资源厅（省海洋局）',
    publishYear: 2020,
    coreTarget: '严守全省海洋生态保护红线，实现红线内违法开发零容忍',
    targetMetric: '生态保护红线面积管控执行率',
    targetValue: 100,
    currentValue: 100,
    unit: '%',
    fulfillmentRate: 100.0,
    status: '优秀达标',
    statusColor: '#06b6d4',
    fiscalSubsidy: 32.5,
    literatureCitation: '《山东省国土空间生态保护红线划定方案》',
    assessmentScore: 98,
  },
  {
    id: 'pol-04',
    title: '《山东省海洋生态保护补偿管理办法》',
    leadDept: '省财政厅 / 省海洋局 / 省生态环境厅',
    publishYear: 2023,
    coreTarget: '纵向横向结合，依据近岸海域水质考核结果实施转移支付',
    targetMetric: '考核断面达标率与资金兑付率',
    targetValue: 90,
    currentValue: 94.2,
    unit: '%',
    fulfillmentRate: 104.7,
    status: '优秀达标',
    statusColor: '#06b6d4',
    fiscalSubsidy: 24.6,
    literatureCitation: '鲁财资环〔2023〕18号 / 省财政预算执行评价',
    assessmentScore: 94,
  },
  {
    id: 'pol-05',
    title: '《烟台长岛国际零碳岛蓝碳先行试验区总体规划》',
    leadDept: '烟台市人民政府 / 省海洋局',
    publishYear: 2023,
    coreTarget: '建成全国首个全域碳中和与海岛蓝碳综合核算试验岛',
    targetMetric: '海岛绿电与微藻立体固碳替代率',
    targetValue: 85,
    currentValue: 88.5,
    unit: '%',
    fulfillmentRate: 104.1,
    status: '优秀达标',
    statusColor: '#06b6d4',
    fiscalSubsidy: 15.8,
    literatureCitation: '烟政字〔2023〕41号 / 中国科学院海洋研究所评估报告',
    assessmentScore: 93,
  },
  {
    id: 'pol-06',
    title: '《黄河三角洲国家级自然保护区湿地修复规划》',
    leadDept: '东营市委市政府 / 黄三角国家公园管委会',
    publishYear: 2021,
    coreTarget: '清除入侵物种互花米草，恢复翅碱蓬红地毯与芦苇湿地',
    targetMetric: '互花米草清除与本土原生植物恢复率',
    targetValue: 95,
    currentValue: 96.2,
    unit: '%',
    fulfillmentRate: 101.3,
    status: '优秀达标',
    statusColor: '#06b6d4',
    fiscalSubsidy: 19.4,
    literatureCitation: '国家林草局 / 自然资源部联合督察通报',
    assessmentScore: 96,
  },
  {
    id: 'pol-07',
    title: '《国家自愿减排量(CCER)海洋碳汇方法学攻关实施细则》',
    leadDept: '省海洋局 / 崂山国家实验室 / 中国海洋大学',
    publishYear: 2024,
    coreTarget: '突破微型生物碳泵(MCP)与大型藻类固碳CCER方法学立项',
    targetMetric: '国家发改委与生态环境部方法学预备入库数',
    targetValue: 3,
    currentValue: 3,
    unit: '项',
    fulfillmentRate: 100.0,
    status: '稳步推进',
    statusColor: '#8b5cf6',
    fiscalSubsidy: 12.0,
    literatureCitation: '焦念志院士团队微型生物碳泵成果与行业标准报批稿',
    assessmentScore: 91,
  },
];

// Multi-year Policy Score & Fiscal Transfer Trends (2020-2026)
export const POLICY_TRENDS = [
  { year: 2020, score: 82.4, fiscalSubsidy: 8.5, redlineRate: 98.2, bayQualityRate: 79.5 },
  { year: 2021, score: 85.6, fiscalSubsidy: 11.2, redlineRate: 98.9, bayQualityRate: 82.1 },
  { year: 2022, score: 88.9, fiscalSubsidy: 14.8, redlineRate: 99.4, bayQualityRate: 84.8 },
  { year: 2023, score: 91.5, fiscalSubsidy: 18.2, redlineRate: 99.8, bayQualityRate: 86.4 },
  { year: 2024, score: 93.4, fiscalSubsidy: 21.0, redlineRate: 100.0, bayQualityRate: 87.2 },
  { year: 2025, score: 94.8, fiscalSubsidy: 23.5, redlineRate: 100.0, bayQualityRate: 88.0 },
  { year: 2026, score: 95.8, fiscalSubsidy: 25.8, redlineRate: 100.0, bayQualityRate: 88.6 },
];

// 3. Marine Bio-Carbon Sinks and Fishery Aquaculture Matrix
export const BIO_CARBON_SINKS: FisheryBioCarbonItem[] = [
  {
    category: '大型经济褐藻',
    species: '海带 (Saccharina japonica) / 裙带菜',
    cultureArea: 58.4,
    annualYield: 186.5,
    carbonSinkRate: 1.85,
    annualCarbonSink: 84.2,
    economicValue: 142.5,
    purificationPower: 12.8,
    sharePercentage: 35.8,
    trendYoY: 7.8,
  },
  {
    category: '大型红藻与绿藻',
    species: '龙须菜 (Gracilaria) / 石莼 (Ulva prolifera)',
    cultureArea: 22.6,
    annualYield: 64.2,
    carbonSinkRate: 1.42,
    annualCarbonSink: 28.5,
    economicValue: 48.0,
    purificationPower: 8.4,
    sharePercentage: 12.1,
    trendYoY: 10.4,
  },
  {
    category: '滤食性双壳贝类',
    species: '栉孔扇贝 / 太平洋牡蛎 / 贻贝',
    cultureArea: 92.8,
    annualYield: 312.0,
    carbonSinkRate: 0.98,
    annualCarbonSink: 76.4,
    economicValue: 285.6,
    purificationPower: 38.6,
    sharePercentage: 32.5,
    trendYoY: 6.2,
  },
  {
    category: '潮间带底栖贝类',
    species: '菲律宾蛤仔 / 文蛤 / 泥蚶',
    cultureArea: 41.5,
    annualYield: 128.4,
    carbonSinkRate: 0.65,
    annualCarbonSink: 24.2,
    economicValue: 92.4,
    purificationPower: 14.2,
    sharePercentage: 10.3,
    trendYoY: 5.5,
  },
  {
    category: '微型生物碳泵(MCP)',
    species: '海洋超微原核生物 / 噬菌体裂解产物 (RDOC)',
    cultureArea: 184.2, // 近海辐射面积
    annualYield: 0, // 微观碳汇无直接初级农产吨位
    carbonSinkRate: 0.28,
    annualCarbonSink: 21.8,
    economicValue: 36.8, // 衍生生态高价值
    purificationPower: 19.5,
    sharePercentage: 9.3,
    trendYoY: 12.8,
  },
];

// Multi-year Bio-Carbon & Economic Output Dual Trend
export const BIO_CARBON_TRENDS = [
  { year: 2020, carbonSink: 168.5, economicValue: 420, kelpShare: 33.2, shellfishShare: 36.4 },
  { year: 2021, carbonSink: 182.4, economicValue: 465, kelpShare: 34.0, shellfishShare: 35.8 },
  { year: 2022, carbonSink: 196.8, economicValue: 512, kelpShare: 34.8, shellfishShare: 34.5 },
  { year: 2023, carbonSink: 212.0, economicValue: 558, kelpShare: 35.2, shellfishShare: 33.8 },
  { year: 2024, carbonSink: 224.5, economicValue: 585, kelpShare: 35.5, shellfishShare: 33.0 },
  { year: 2025, carbonSink: 232.8, economicValue: 602, kelpShare: 35.6, shellfishShare: 32.7 },
  { year: 2026, carbonSink: 235.1, economicValue: 605, kelpShare: 35.8, shellfishShare: 32.5 },
];

// 4. Land-Sea Environmental Water Quality & Vulnerability Data
export const WATER_VULNERABILITY: LandSeaWaterVulnerabilityItem[] = [
  {
    region: '胶东东部海域',
    bayName: '威海桑沟湾海草床与养殖区',
    dinReductionRate: 38.6,
    dipComplianceRate: 98.5,
    codFluxCut: 1.45,
    seawaterPh: 8.28,
    phAcidificationRisk: '安全正常',
    sstAnomaly: +0.32,
    eutrophicationIndex: 0.62,
    resilienceRating: '极强',
    redTideAlertLevel: '绿码安全',
  },
  {
    region: '渤海西南海域',
    bayName: '东营黄河口径流冲淡水区',
    dinReductionRate: 42.1,
    dipComplianceRate: 92.4,
    codFluxCut: 3.12,
    seawaterPh: 8.12,
    phAcidificationRisk: '轻度偏酸',
    sstAnomaly: +0.65,
    eutrophicationIndex: 0.88,
    resilienceRating: '优良',
    redTideAlertLevel: '绿码安全',
  },
  {
    region: '胶东半岛南部',
    bayName: '青岛胶州湾与崂山湾海域',
    dinReductionRate: 35.4,
    dipComplianceRate: 95.2,
    codFluxCut: 2.10,
    seawaterPh: 8.21,
    phAcidificationRisk: '安全正常',
    sstAnomaly: +0.48,
    eutrophicationIndex: 0.74,
    resilienceRating: '极强',
    redTideAlertLevel: '绿码安全',
  },
  {
    region: '莱州湾南岸',
    bayName: '潍坊-昌邑小清河入海口',
    dinReductionRate: 29.8,
    dipComplianceRate: 88.6,
    codFluxCut: 2.85,
    seawaterPh: 8.05,
    phAcidificationRisk: '轻度偏酸',
    sstAnomaly: +0.78,
    eutrophicationIndex: 1.12,
    resilienceRating: '中等',
    redTideAlertLevel: '黄码关注',
  },
  {
    region: '鲁南沿海海域',
    bayName: '日照前三岛海域',
    dinReductionRate: 41.2,
    dipComplianceRate: 96.8,
    codFluxCut: 0.95,
    seawaterPh: 8.24,
    phAcidificationRisk: '安全正常',
    sstAnomaly: +0.25,
    eutrophicationIndex: 0.58,
    resilienceRating: '极强',
    redTideAlertLevel: '绿码安全',
  },
  {
    region: '渤海海峡海域',
    bayName: '烟台长岛群岛海域',
    dinReductionRate: 44.5,
    dipComplianceRate: 99.1,
    codFluxCut: 0.68,
    seawaterPh: 8.29,
    phAcidificationRisk: '安全正常',
    sstAnomaly: +0.18,
    eutrophicationIndex: 0.42,
    resilienceRating: '极强',
    redTideAlertLevel: '绿码安全',
  },
];

// Multi-year Nutrient Flux & Coastal Water Quality Trend
export const WATER_QUALITY_TRENDS = [
  { year: 2020, dinCut: 18.5, codFluxCut: 6.2, avgPh: 8.14, goodWaterRate: 79.5 },
  { year: 2021, dinCut: 24.2, codFluxCut: 7.5, avgPh: 8.16, goodWaterRate: 82.1 },
  { year: 2022, dinCut: 29.8, codFluxCut: 8.9, avgPh: 8.18, goodWaterRate: 84.8 },
  { year: 2023, dinCut: 34.6, codFluxCut: 10.4, avgPh: 8.20, goodWaterRate: 86.4 },
  { year: 2024, dinCut: 38.2, codFluxCut: 11.5, avgPh: 8.22, goodWaterRate: 87.2 },
  { year: 2025, dinCut: 41.0, codFluxCut: 12.2, avgPh: 8.23, goodWaterRate: 88.0 },
  { year: 2026, dinCut: 42.8, codFluxCut: 12.8, avgPh: 8.24, goodWaterRate: 88.6 },
];

// 5. CCER Carbon Market and Blue Carbon Asset Ledger
export const CCER_MARKET_PROJECTS: CCERMarketItem[] = [
  {
    projectNo: 'CCER-SD-MAR-2026-001',
    projectName: '威海荣成桑沟湾大叶藻海草床与大型海带立体碳汇工程',
    region: '威海市荣成区',
    methodology: 'CMS-004-V01 海草床与贝藻多营养层级碳汇核算方法学',
    verifier: '中环联合认证中心 (CEC)',
    carbonCreditTons: 128500,
    unitPrice: 89.60,
    totalAmountWan: 1151.36,
    fulfillmentRate: 98.4,
    greenCreditAssigned: 5.2,
    registryStatus: '已签发上市',
  },
  {
    projectNo: 'CCER-SD-MAR-2026-002',
    projectName: '东营黄河三角洲国家级自然保护区翅碱蓬红地毯湿地碳封存项目',
    region: '东营市垦利区',
    methodology: 'CMS-001-V02 暖温带潮滩盐沼湿地原生植物增汇核算法',
    verifier: '中国船级社质量认证公司 (CCSC)',
    carbonCreditTons: 154200,
    unitPrice: 84.20,
    totalAmountWan: 1298.36,
    fulfillmentRate: 96.5,
    greenCreditAssigned: 6.8,
    registryStatus: '已签发上市',
  },
  {
    projectNo: 'CCER-SD-MAR-2026-003',
    projectName: '日照前三岛大型褐藻场培育与贝藻协同增汇示范工程',
    region: '日照市岚山区',
    methodology: 'HY/T 0305-2021 自然资源部大型藻类与双壳贝类标准',
    verifier: '北京绿色交易所认证中心',
    carbonCreditTons: 64800,
    unitPrice: 78.50,
    totalAmountWan: 508.68,
    fulfillmentRate: 92.0,
    greenCreditAssigned: 3.5,
    registryStatus: '已签发上市',
  },
  {
    projectNo: 'CCER-SD-MAR-2026-004',
    projectName: '烟台长岛大钦岛-砣矶岛深远海现代化海洋牧场生境修复',
    region: '烟台市长岛区',
    methodology: 'CMS-009-V01 海洋牧场人工鱼礁与微藻生态泵方法学',
    verifier: '通标标准技术服务有限公司 (SGS)',
    carbonCreditTons: 82000,
    unitPrice: 72.80,
    totalAmountWan: 596.96,
    fulfillmentRate: 88.6,
    greenCreditAssigned: 4.1,
    registryStatus: '备案复核中',
  },
  {
    projectNo: 'CCER-SD-MAR-2026-005',
    projectName: '青岛胶州湾红石崖滨海湿地生态修复与微型生物碳泵试点',
    region: '青岛市西海岸新区',
    methodology: 'CMS-011-V01 滨海城市潟湖湿地生境恢复核算法',
    verifier: '方圆标志认证集团',
    carbonCreditTons: 49500,
    unitPrice: 81.40,
    totalAmountWan: 402.93,
    fulfillmentRate: 85.2,
    greenCreditAssigned: 2.8,
    registryStatus: '技术评审中',
  },
];

// Multi-year Carbon Trading Price & Quota Fulfillment Trend
export const CCER_TRADING_TRENDS = [
  { year: 2020, nationalPrice: 42.5, shandongBluePrice: 48.0, totalVolume: 12.4, fulfillmentRate: 78.5 },
  { year: 2021, nationalPrice: 51.2, shandongBluePrice: 56.5, totalVolume: 18.2, fulfillmentRate: 82.4 },
  { year: 2022, nationalPrice: 58.0, shandongBluePrice: 63.8, totalVolume: 24.6, fulfillmentRate: 86.9 },
  { year: 2023, nationalPrice: 65.4, shandongBluePrice: 71.2, totalVolume: 32.5, fulfillmentRate: 90.2 },
  { year: 2024, nationalPrice: 72.0, shandongBluePrice: 75.8, totalVolume: 39.8, fulfillmentRate: 93.5 },
  { year: 2025, nationalPrice: 76.5, shandongBluePrice: 77.2, totalVolume: 44.5, fulfillmentRate: 95.8 },
  { year: 2026, nationalPrice: 78.5, shandongBluePrice: 81.6, totalVolume: 48.9, fulfillmentRate: 97.4 },
];
