import React, { useState, useMemo } from 'react';
import { 
  Users, 
  FileText, 
  Fish, 
  Droplets, 
  Coins, 
  FileSpreadsheet, 
  ChevronDown, 
  ArrowLeft, 
  Search, 
  Download, 
  Filter, 
  TrendingUp, 
  ShieldCheck, 
  BarChart3, 
  PieChart, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Activity,
  SlidersHorizontal,
  Compass,
  GitBranch,
  Building,
  Anchor,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';
import { 
  COASTAL_DEMOGRAPHICS, 
  POPULATION_TRENDS, 
  POLICY_EVALUATIONS, 
  POLICY_TRENDS, 
  BIO_CARBON_SINKS, 
  BIO_CARBON_TRENDS, 
  WATER_VULNERABILITY, 
  WATER_QUALITY_TRENDS, 
  CCER_MARKET_PROJECTS, 
  CCER_TRADING_TRENDS,
  CoastalDemographicItem,
  PolicyEvaluationItem,
  FisheryBioCarbonItem,
  LandSeaWaterVulnerabilityItem,
  CCERMarketItem
} from '../data/multiDimensionalAnalysisData';
import { StationData, STATIONS } from '../data/blueCarbonData';
import { DemographicsAdvancedCharts } from './charts/DemographicsAdvancedCharts';
import { PolicyRadarChart } from './charts/PolicyRadarChart';
import { BioCarbonVerticalProfile } from './charts/BioCarbonVerticalProfile';
import { WaterEnvironmentMatrix } from './charts/WaterEnvironmentMatrix';
import { BlueCarbonSankeyFlow } from './charts/BlueCarbonSankeyFlow';
import { ScenarioPredictionSimulator } from './charts/ScenarioPredictionSimulator';
import { downloadCSV } from '../utils/exportUtils';

export type AnalysisDimension = 
  | 'demographics' 
  | 'policy' 
  | 'bio_carbon' 
  | 'water_environment' 
  | 'ccer_market' 
  | 'hydrology_ledger'
  | 'sankey_flux'
  | 'scenario_sim';

interface MultiDimensionalAnalysisViewProps {
  currentDimension?: AnalysisDimension;
  onDimensionChange?: (dim: AnalysisDimension) => void;
  onBackToGis?: () => void;
  year?: number;
}

export const MultiDimensionalAnalysisView: React.FC<MultiDimensionalAnalysisViewProps> = ({
  currentDimension = 'demographics',
  onDimensionChange,
  onBackToGis,
  year = 2026,
}) => {
  const [activeDimension, setActiveDimension] = useState<AnalysisDimension>(currentDimension);
  const [selectedYear, setSelectedYear] = useState<number>(year);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string>('');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<'both' | 'charts_only' | 'table_only'>('both');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Sync internal state if prop changes
  React.useEffect(() => {
    if (currentDimension) {
      setActiveDimension(currentDimension);
    }
  }, [currentDimension]);

  const handleSelectDimension = (dim: AnalysisDimension) => {
    setActiveDimension(dim);
    setIsDropdownOpen(false);
    if (onDimensionChange) {
      onDimensionChange(dim);
    }
  };

  const dimensionConfigs = [
    {
      id: 'demographics' as AnalysisDimension,
      label: '沿海人口与社会经济驱动分析',
      shortLabel: '人口与社会经济',
      icon: Users,
      color: 'text-cyan-400',
      tagline: '常住人口总量、渔业劳动力男女比例与沿岸密度热力梯队',
      accentBg: 'bg-cyan-500/10 border-cyan-500/30',
    },
    {
      id: 'policy' as AnalysisDimension,
      label: '山东海洋强省与蓝碳政策评价',
      shortLabel: '宏观政策成效',
      icon: FileText,
      color: 'text-emerald-400',
      tagline: '《海洋强省建设》《碳达峰实施方案》考核达标率与生态补偿转移支付',
      accentBg: 'bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'bio_carbon' as AnalysisDimension,
      label: '海洋生物固碳与贝藻渔业产业协同',
      shortLabel: '生物碳汇与渔业',
      icon: Fish,
      color: 'text-amber-400',
      tagline: '大型海藻与双壳贝类固碳速率、微型生物碳泵(MCP)与万亩经济产值',
      accentBg: 'bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 'water_environment' as AnalysisDimension,
      label: '陆海统筹水质生态与脆弱性评估',
      shortLabel: '水质生态脆弱性',
      icon: Droplets,
      color: 'text-sky-400',
      tagline: '入海径流无机氮/COD通量消减、近海pH酸化监测与赤潮韧性预警',
      accentBg: 'bg-sky-500/10 border-sky-500/30',
    },
    {
      id: 'ccer_market' as AnalysisDimension,
      label: 'CCER国家碳市场与蓝碳普惠核算',
      shortLabel: 'CCER资产流转',
      icon: Coins,
      color: 'text-purple-400',
      tagline: '国家注册簿项目备案核证量、全国交易均价走势与绿色金融授信',
      accentBg: 'bg-purple-500/10 border-purple-500/30',
    },
    {
      id: 'hydrology_ledger' as AnalysisDimension,
      label: '全省蓝碳水文台账与月度对账矩阵',
      shortLabel: '水文月度台账',
      icon: FileSpreadsheet,
      color: 'text-teal-400',
      tagline: '1-12月海气碳吸收通量、沉积速率、DO/盐度实测台账',
      accentBg: 'bg-teal-500/10 border-teal-500/30',
    },
    {
      id: 'sankey_flux' as AnalysisDimension,
      label: '全省蓝碳碳汇流向与资产核算桑基图',
      shortLabel: '通量流向桑基图',
      icon: GitBranch,
      color: 'text-emerald-400',
      tagline: '从海-气/陆源输入至海草床/盐沼捕获，再至深海封存与CCER资产流转',
      accentBg: 'bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'scenario_sim' as AnalysisDimension,
      label: '“双碳”目标 2020-2035 宏观情景预测与推演沙盘',
      shortLabel: '双碳宏观推演沙盘',
      icon: TrendingUp,
      color: 'text-purple-400',
      tagline: '科技跃升/规划既定/惯性基准三情景仿真、置信区间与调参沙盘',
      accentBg: 'bg-purple-500/10 border-purple-500/30',
    },
  ];

  const currentConfig = dimensionConfigs.find((c) => c.id === activeDimension) || dimensionConfigs[0];

  const handleExportCSV = (title: string) => {
    try {
      if (activeDimension === 'demographics') {
        const headers = ['行政地市', '常住总人口(万人)', '涉海劳动力(万人)', '男性劳动力(万人)', '女性劳动力(万人)', '男性占比(%)', '女性占比(%)', '近海人口密度(人/km²)', '热力梯队', '碳普惠参与(万人)', '人均涉海产值(万元)', '主导产业'];
        const rows = filteredDemographics.map(r => [
          r.city, r.totalPopulation, r.marineLabor, r.maleLabor, r.femaleLabor, r.maleRatio, r.femaleRatio, r.densityPerSqKm, r.heatTier, r.carbonInclusionUsers, r.perCapitaSeaGdp, r.fisheryType
        ]);
        downloadCSV(`山东省沿海人口与社会经济台账_${selectedYear}`, headers, rows);
      } else if (activeDimension === 'policy') {
        const headers = ['政策文件与行动纲领', '牵头主管机构', '考核核心指标', '规划目标值', '当前达成值', '单位', '完成进度(%)', '评价等级', '财政转移支付(亿元)', '综合评分', '督查与文献出处'];
        const rows = filteredPolicies.map(r => [
          r.title, r.leadDept, r.targetMetric, r.targetValue, r.currentValue, r.unit, `${r.fulfillmentRate.toFixed(1)}%`, r.status, r.fiscalSubsidy, r.assessmentScore, r.literatureCitation
        ]);
        downloadCSV(`山东省海洋强省与蓝碳政策考核台账_${selectedYear}`, headers, rows);
      } else if (activeDimension === 'bio_carbon') {
        const headers = ['生物门类', '主要代表物种', '养殖面积(万亩)', '年收获产量(万吨)', '固碳速率(tCO₂e/ha·a)', '年固碳量(万吨CO₂e)', '占比(%)', '渔业产值(亿元)', '净水量(亿吨)', '同比增长(%)'];
        const rows = filteredBioCarbon.map(r => [
          r.category, r.species, r.cultureArea, r.annualYield, r.carbonSinkRate, r.annualCarbonSink, `${r.sharePercentage}%`, r.economicValue, r.purificationPower, `+${r.trendYoY}%`
        ]);
        downloadCSV(`山东省碳汇渔业生物固碳台账_${selectedYear}`, headers, rows);
      } else if (activeDimension === 'water_environment') {
        const headers = ['海湾海域单元', '所属海区', '无机氮消减率(%)', '磷酸盐达标率(%)', 'COD负荷消减(万吨)', '海表pH', '酸化风险', '水温距平(°C)', '富营养指数E', '综合韧性等级'];
        const rows = filteredWaterVulnerability.map(r => [
          r.bayName, r.region, `${r.dinReductionRate}%`, `${r.dipComplianceRate}%`, r.codFluxCut, r.seawaterPh, r.phAcidificationRisk, `+${r.sstAnomaly}°C`, r.eutrophicationIndex, r.resilienceRating
        ]);
        downloadCSV(`山东省陆海统筹水质生态与脆弱性台账_${selectedYear}`, headers, rows);
      } else if (activeDimension === 'ccer_market') {
        const headers = ['项目编号', '工程项目全称', '实施区县', '适用方法学', '第三方核查机构', '核证量(tCO₂e)', '成交价(元/吨)', '总金额(万元)', '履约率(%)', '注册状态'];
        const rows = filteredCCERProjects.map(r => [
          r.projectNo, r.projectName, r.region, r.methodology, r.verifier, r.carbonCreditTons, r.unitPrice, r.totalAmountWan, `${r.fulfillmentRate}%`, r.registryStatus
        ]);
        downloadCSV(`山东省CCER蓝碳自愿减排量项目台账_${selectedYear}`, headers, rows);
      } else {
        const headers = ['水文与碳核算监测项目', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        const rows = [
          ['海表最高吸收通量 (mmol/m²·d)', 1.2, 1.8, 3.4, 4.9, 7.8, 9.4, 9.8, 9.5, 8.2, 5.1, 2.8, 1.4],
          ['海表最低吸收通量 (mmol/m²·d)', 0.4, 0.6, 1.1, 1.8, 2.5, 3.2, 3.6, 3.1, 2.4, 1.6, 0.9, 0.5],
          ['月度平均固碳通量 (mmol/m²·d)', 0.8, 1.2, 2.2, 3.3, 5.1, 6.3, 6.7, 6.3, 5.3, 3.3, 1.8, 0.9],
          ['沉积碳历史封存 (g/m²·a)', 210, 215, 230, 245, 280, 310, 325, 315, 290, 260, 235, 215],
          ['蓝碳核算月度产值 (万元)', 180, 210, 350, 480, 890, 1240, 1370, 1310, 980, 620, 390, 220],
        ];
        downloadCSV(`山东省蓝碳水文通量月度台账_${selectedYear}`, headers, rows);
      }
      setExportToast(`已成功导出并下载 ${title} CSV 台账文件到您的电脑！`);
    } catch (e) {
      console.error('Failed to export CSV:', e);
      setExportToast(`导出 ${title} 失败，请重试`);
    }
    setTimeout(() => {
      setExportToast(null);
    }, 4000);
  };

  // Filtered & Sorted Demographics
  const filteredDemographics = useMemo(() => {
    let list = [...COASTAL_DEMOGRAPHICS];
    if (selectedCity !== 'all') {
      list = list.filter((item) => item.city === selectedCity);
    }
    if (searchQuery.trim()) {
      list = list.filter((item) => 
        item.city.includes(searchQuery.trim()) || 
        item.fisheryType.includes(searchQuery.trim())
      );
    }
    if (sortField) {
      list.sort((a, b) => {
        const valA = (a as any)[sortField];
        const valB = (b as any)[sortField];
        if (typeof valA === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
      });
    }
    return list;
  }, [selectedCity, searchQuery, sortField, sortAsc]);

  // Filtered Policy List
  const filteredPolicies = useMemo(() => {
    let list = [...POLICY_EVALUATIONS];
    if (searchQuery.trim()) {
      list = list.filter((item) => 
        item.title.includes(searchQuery.trim()) || 
        item.leadDept.includes(searchQuery.trim()) ||
        item.coreTarget.includes(searchQuery.trim())
      );
    }
    if (sortField) {
      list.sort((a, b) => {
        const valA = (a as any)[sortField];
        const valB = (b as any)[sortField];
        if (typeof valA === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
      });
    }
    return list;
  }, [searchQuery, sortField, sortAsc]);

  // Filtered Bio-carbon
  const filteredBioCarbon = useMemo(() => {
    let list = [...BIO_CARBON_SINKS];
    if (searchQuery.trim()) {
      list = list.filter((item) => 
        item.category.includes(searchQuery.trim()) || 
        item.species.includes(searchQuery.trim())
      );
    }
    if (sortField) {
      list.sort((a, b) => {
        const valA = (a as any)[sortField];
        const valB = (b as any)[sortField];
        return sortAsc ? valA - valB : valB - valA;
      });
    }
    return list;
  }, [searchQuery, sortField, sortAsc]);

  // Filtered Water Vulnerability
  const filteredWaterVulnerability = useMemo(() => {
    let list = [...WATER_VULNERABILITY];
    if (searchQuery.trim()) {
      list = list.filter((item) => 
        item.region.includes(searchQuery.trim()) || 
        item.bayName.includes(searchQuery.trim())
      );
    }
    return list;
  }, [searchQuery]);

  // Filtered CCER projects
  const filteredCCERProjects = useMemo(() => {
    let list = [...CCER_MARKET_PROJECTS];
    if (searchQuery.trim()) {
      list = list.filter((item) => 
        item.projectName.includes(searchQuery.trim()) || 
        item.region.includes(searchQuery.trim()) ||
        item.verifier.includes(searchQuery.trim())
      );
    }
    return list;
  }, [searchQuery]);

  // Render SVG interactive line chart with doubled high-contrast typography (~2x scale for clear readability)
  const renderTrendLineChart = (
    data: any[],
    xKey: string,
    lines: { key: string; color: string; label: string; unit: string }[],
    title: string
  ) => {
    if (!data || data.length === 0) return null;
    const width = 800;
    const height = 360;
    const padding = { top: 45, right: 45, bottom: 65, left: 95 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Find min and max for all lines
    let allValues: number[] = [];
    lines.forEach((line) => {
      data.forEach((d) => {
        if (typeof d[line.key] === 'number') allValues.push(d[line.key]);
      });
    });
    const minVal = Math.min(...allValues) * 0.95;
    const maxVal = Math.max(...allValues) * 1.05;
    const valRange = maxVal - minVal || 1;

    const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartW;
    const getY = (val: number) => padding.top + chartH - ((val - minVal) / valRange) * chartH;

    return (
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/95 border border-cyan-500/30 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <h4 className="text-lg sm:text-2xl font-black text-white tracking-wide">{title}</h4>
          </div>
          {/* Legend - doubled size */}
          <div className="flex items-center gap-5 text-sm sm:text-base font-bold">
            {lines.map((l) => (
              <div key={l.key} className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: l.color }} />
                <span className="text-white font-bold">{l.label}</span>
                <span className="text-cyan-300 font-mono font-num">({l.unit})</span>
              </div>
            ))}
          </div>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-72 sm:h-84 overflow-visible">
          {/* Horizontal grid lines and enlarged Y-axis tick values (2x size: fontSize 22) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + chartH * (1 - ratio);
            const val = minVal + valRange * ratio;
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(255,255,255,0.16)"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 16}
                  y={y + 7}
                  textAnchor="end"
                  fill="#ffffff"
                  fontSize="22"
                  fontWeight="900"
                  fontFamily="Chakra Petch, JetBrains Mono, monospace"
                  className="tabular-nums"
                >
                  {val.toFixed(val > 100 ? 0 : 1)}
                </text>
              </g>
            );
          })}

          {/* Render lines */}
          {lines.map((line) => {
            const points = data.map((d, i) => `${getX(i)},${getY(d[line.key])}`).join(' ');
            return (
              <g key={line.key}>
                {/* Glow filter under line */}
                <polyline
                  points={points}
                  fill="none"
                  stroke={line.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                />
                {/* Dots with values */}
                {data.map((d, i) => {
                  const cx = getX(i);
                  const cy = getY(d[line.key]);
                  return (
                    <g key={i} className="group cursor-pointer">
                      <circle
                        cx={cx}
                        cy={cy}
                        r="6"
                        fill="#0b1329"
                        stroke={line.color}
                        strokeWidth="3"
                        className="transition-all hover:r-8"
                      />
                      {/* Direct value callout above each point */}
                      <text
                        x={cx}
                        y={cy - 12}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="15"
                        fontWeight="900"
                        fontFamily="Chakra Petch, JetBrains Mono, monospace"
                        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] select-none"
                      >
                        {d[line.key]}
                      </text>
                      <title>{`${d[xKey]}年 ${line.label}: ${d[line.key]} ${line.unit}`}</title>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* X axis labels - doubled font size (fontSize 22) */}
          {data.map((d, i) => {
            const x = getX(i);
            return (
              <text
                key={i}
                x={x}
                y={height - padding.bottom + 42}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="22"
                fontWeight="900"
                fontFamily="Chakra Petch, JetBrains Mono, monospace"
              >
                {d[xKey]}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-[#030914] text-slate-100 overflow-hidden font-sans">
      {/* Toast Notification */}
      {exportToast && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.4)] backdrop-blur-md animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{exportToast}</span>
        </div>
      )}

      {/* Top Cockpit Command Bar with Dedicated Dimension Dropdown Switcher */}
      <section className="shrink-0 w-full px-5 py-3.5 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-md z-30">
        <div className="flex items-center gap-3">
          {onBackToGis && (
            <button
              onClick={onBackToGis}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-950/40 text-xs font-bold transition-all shadow-sm group cursor-pointer"
              title="返回全省数字孪生GIS主控驾驶舱"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>返回GIS态势大屏</span>
            </button>
          )}

          {/* DEDICATED DROPDOWN SWITCHER (As specifically requested by user: "像底图一样，点开可以下拉选择哪个分析") */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-950/90 via-slate-900 to-cyan-950/90 border border-cyan-400/60 text-white text-xs font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:border-cyan-300 hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <currentConfig.icon className={`w-4 h-4 ${currentConfig.color} group-hover:scale-110 transition-transform`} />
              <div className="text-left">
                <div className="text-[10px] text-cyan-400 font-mono tracking-wider">选择多维分析研判模块</div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{currentConfig.label}</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-84 rounded-2xl bg-slate-950/95 border border-cyan-500/50 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-xl p-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-1.5 text-[10px] font-mono text-cyan-400/80 border-b border-slate-800/80 mb-1 flex items-center justify-between">
                  <span>山东省蓝碳综合研判维度</span>
                  <span>6大维度</span>
                </div>
                <div className="space-y-1">
                  {dimensionConfigs.map((cfg) => {
                    const isSelected = cfg.id === activeDimension;
                    return (
                      <button
                        key={cfg.id}
                        onClick={() => handleSelectDimension(cfg.id)}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 border border-cyan-400/60 text-white shadow-sm'
                            : 'hover:bg-slate-900 border border-transparent text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-cyan-500/30' : 'bg-slate-900'}`}>
                          <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wide truncate">{cfg.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-snug line-clamp-1 mt-0.5">
                            {cfg.tagline}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="hidden xl:block h-6 w-[1px] bg-slate-800" />
          <p className="hidden xl:block text-xs text-slate-400">
            {currentConfig.tagline}
          </p>
        </div>

        {/* Right Toolbar: Year, City Filter, Display Mode, CSV Export */}
        <div className="flex items-center gap-2.5">
          {/* Year Picker */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">年份:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-cyan-300 font-mono font-bold focus:outline-none cursor-pointer"
            >
              {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                <option key={y} value={y} className="bg-slate-950 text-white">
                  {y}年度
                </option>
              ))}
            </select>
          </div>

          {/* City Filter (if applicable) */}
          {activeDimension === 'demographics' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px]">地市:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-950 text-white">沿海7市全域</option>
                {COASTAL_DEMOGRAPHICS.map((c) => (
                  <option key={c.city} value={c.city} className="bg-slate-950 text-white">
                    {c.city}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Display Mode Switcher (仅图片 / 仅表格 / 图表+表格) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setDisplayMode('charts_only')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-bold transition-all cursor-pointer ${
                displayMode === 'charts_only'
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="仅显示可视化图片与图表"
            >
              仅图片
            </button>
            <button
              onClick={() => setDisplayMode('table_only')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-bold transition-all cursor-pointer ${
                displayMode === 'table_only'
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="仅显示数据台账表格"
            >
              仅表格
            </button>
            <button
              onClick={() => setDisplayMode('both')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-bold transition-all cursor-pointer ${
                displayMode === 'both'
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="同屏同时显示可视化图片图表与明细数据表"
            >
              图表+表格
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={() => handleExportCSV(currentConfig.label)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
            title="导出当前分析台账数据为Excel/CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">导出台账</span>
          </button>
        </div>
      </section>

      {/* Main Analysis Viewport Content */}
      <div className="flex-1 w-full overflow-y-auto p-5 space-y-5">
        {/* ========================================================
            DIMENSION 1: COASTAL DEMOGRAPHICS & SOCIO-ECONOMIC
        ======================================================== */}
        {activeDimension === 'demographics' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">山东沿海7市常住总人口</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-cyan-300 font-num">3,916.3</span>
                  <span className="text-xs text-slate-400">万人</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>占全省人口总盘 38.6% · 稳健集聚</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">涉海渔业养殖与现代海洋劳动力</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-amber-300 font-num">385.2</span>
                  <span className="text-xs text-slate-400">万人</span>
                </div>
                <div className="text-[10px] text-amber-400 mt-1 flex items-center gap-1 font-mono">
                  <span>男劳力 57.9% · 女劳力 42.1%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/25 shadow-md">
                <div className="text-xs text-slate-300 font-semibold">蓝碳普惠机制注册与认购市民</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-emerald-300 font-num">184.8</span>
                  <span className="text-xs text-slate-300 font-bold">万人次</span>
                </div>
                <div className="text-xs font-semibold text-emerald-400 mt-1">
                  <span>人均减碳量 12.8 kg CO₂/年</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">人均涉海经济综合产值</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-purple-300 font-num">6.24</span>
                  <span className="text-xs text-slate-400">万元/人</span>
                </div>
                <div className="text-[10px] text-purple-300 mt-1">
                  <span>威海与青岛领先 (突破7.2万元)</span>
                </div>
              </div>
            </div>

            {/* Visual Charts Row (Shown if mode != 'table_only') */}
            {displayMode !== 'table_only' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Chart 1: Line Chart - Multi-Year Demographics & Labor Trend */}
                {renderTrendLineChart(
                  POPULATION_TRENDS,
                  'year',
                  [
                    { key: 'totalPop', color: '#06b6d4', label: '沿海常住人口', unit: '万人' },
                    { key: 'marineLabor', color: '#f59e0b', label: '涉海劳动力', unit: '万人' },
                  ],
                  '2018-2026年山东省沿海常住人口与涉海就业规模演变折线图'
                )}

                {/* Chart 2: Stacked/Grouped Bar Chart - Gender Structure Across Coastal Cities */}
                <div className="p-5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl flex flex-col justify-between">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-5 h-5 text-amber-400" />
                      <h4 className="text-base sm:text-lg font-black text-white tracking-wide">
                        沿海各市涉海劳动力规模与男女劳动者结构对比 (万人)
                      </h4>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-sm" />
                        <span className="text-white">男性劳动力</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-rose-400 shadow-sm" />
                        <span className="text-white">女性劳动力 (种苗/加工/微藻)</span>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart for Cities */}
                  <div className="space-y-3.5">
                    {COASTAL_DEMOGRAPHICS.map((city) => {
                      const maxTotal = 90;
                      const maleWidth = (city.maleLabor / maxTotal) * 100;
                      const femaleWidth = (city.femaleLabor / maxTotal) * 100;
                      return (
                        <div key={city.city} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-extrabold text-white text-base">{city.city}</span>
                            <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm font-bold">
                              <span className="text-cyan-400 font-num">{city.maleLabor}万 ({city.maleRatio}%)</span>
                              <span className="text-slate-500">/</span>
                              <span className="text-rose-400 font-num">{city.femaleLabor}万 ({city.femaleRatio}%)</span>
                              <span className="text-slate-200 text-xs font-semibold bg-slate-800/80 px-2 py-0.5 rounded">总 {city.marineLabor}万</span>
                            </div>
                          </div>
                          <div className="w-full h-4 rounded-full bg-slate-950 overflow-hidden flex p-0.5 border border-slate-800 shadow-inner">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-l-full transition-all duration-500"
                              style={{ width: `${maleWidth}%` }}
                              title={`男性劳动力: ${city.maleLabor}万人`}
                            />
                            <div
                              className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-r-full transition-all duration-500"
                              style={{ width: `${femaleWidth}%` }}
                              title={`女性劳动力: ${city.femaleLabor}万人`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>*女性劳动力主要广泛分布于海带苗种培育、藻类提取精制及碳汇研学旅游</span>
                    <span className="font-mono text-cyan-400">平均性别比 1.38:1</span>
                  </div>
                </div>

                {/* Chart 3: Demographic Heatmap Density Tiers */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg lg:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-rose-400" />
                      <h4 className="text-xs font-bold text-slate-200 tracking-wide">
                        近海沿岸人口密度梯度与生态承载热力分析
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-rose-500" /> 极高密度 (&gt;900人/km²)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-amber-500" /> 高密度 (500-900人)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-cyan-500" /> 中高密度 (400-500人)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> 生态均衡 (&lt;400人)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                    {COASTAL_DEMOGRAPHICS.map((city) => (
                      <div
                        key={city.city}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{city.shortName}</span>
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                            style={{
                              backgroundColor: `${city.heatColor}20`,
                              color: city.heatColor,
                              border: `1px solid ${city.heatColor}40`,
                            }}
                          >
                            {city.heatTier}
                          </span>
                        </div>
                        <div className="my-2">
                          <div className="text-[10px] text-slate-400">近海人口密度</div>
                          <div className="text-base font-extrabold text-white font-num font-mono">
                            {city.densityPerSqKm} <span className="text-[10px] font-normal text-slate-400">人/km²</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 flex justify-between">
                          <span>碳普惠活跃:</span>
                          <span className="font-mono text-cyan-400 font-bold">{city.carbonContributionIndex}分</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advanced Demographic Charts: Spatial Heatmap, Bilateral Pyramid, Quad Scatter */}
                <div className="lg:col-span-2">
                  <DemographicsAdvancedCharts />
                </div>
              </div>
            )}

            {/* Detailed Data Table (Shown if mode != 'charts_only') */}
            {displayMode !== 'charts_only' && (
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
                <div className="p-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-bold text-slate-100">
                      沿海7市人口结构、涉海劳动分工与碳普惠综合核算台账
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      (共 {filteredDemographics.length} 条记录)
                    </span>
                  </div>

                  {/* Search filter in table */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="搜索地市或主导产业..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 text-sm rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm sm:text-base border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-300 text-sm font-semibold">
                        <th className="p-3.5 font-bold">行政地市</th>
                        <th className="p-3.5 font-bold text-right">常住总人口 (万人)</th>
                        <th className="p-3.5 font-bold text-right">涉海劳动力 (万人)</th>
                        <th className="p-3.5 font-bold text-right">男性劳动力 (占比)</th>
                        <th className="p-3.5 font-bold text-right">女性劳动力 (占比)</th>
                        <th className="p-3.5 font-bold text-right">人口密度 (人/km²)</th>
                        <th className="p-3.5 font-bold text-center">热力梯队</th>
                        <th className="p-3.5 font-bold text-right">碳普惠参与 (万人)</th>
                        <th className="p-3.5 font-bold text-right">人均涉海产值 (万元)</th>
                        <th className="p-3.5 font-bold">主导产业及碳汇协同方向</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200 text-sm sm:text-base">
                      {filteredDemographics.map((row) => (
                        <tr key={row.city} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 font-sans font-bold text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                            {row.city}
                          </td>
                          <td className="p-3.5 text-right font-num font-semibold">{row.totalPopulation.toFixed(1)}</td>
                          <td className="p-3.5 text-right font-num font-bold text-amber-300">{row.marineLabor.toFixed(1)}</td>
                          <td className="p-3.5 text-right font-num text-cyan-300">{row.maleLabor.toFixed(1)} ({row.maleRatio}%)</td>
                          <td className="p-3.5 text-right font-num text-rose-300">{row.femaleLabor.toFixed(1)} ({row.femaleRatio}%)</td>
                          <td className="p-3.5 text-right font-num">{row.densityPerSqKm}</td>
                          <td className="p-3.5 text-center">
                            <span
                              className="px-2.5 py-1 rounded text-xs font-bold inline-block"
                              style={{
                                backgroundColor: `${row.heatColor}20`,
                                color: row.heatColor,
                                border: `1px solid ${row.heatColor}40`,
                              }}
                            >
                              {row.heatTier}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-num font-semibold text-emerald-400">{row.carbonInclusionUsers.toFixed(1)}</td>
                          <td className="p-3.5 text-right font-num font-bold text-purple-300">¥{row.perCapitaSeaGdp.toFixed(2)}</td>
                          <td className="p-3.5 font-sans text-slate-300 text-xs sm:text-sm max-w-xs truncate" title={row.fisheryType}>
                            {row.fisheryType}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-slate-700 bg-slate-950/80 font-bold text-slate-100 text-sm sm:text-base">
                        <td className="p-3.5">沿海全域合计 / 均值</td>
                        <td className="p-3.5 text-right font-mono font-num text-cyan-300">3,916.3 万人</td>
                        <td className="p-3.5 text-right font-mono font-num text-amber-300">385.2 万人</td>
                        <td className="p-3.5 text-right font-mono font-num">223.0 万 (57.9%)</td>
                        <td className="p-3.5 text-right font-mono font-num">162.2 万 (42.1%)</td>
                        <td className="p-3.5 text-right font-mono font-num">539 人/km²</td>
                        <td className="p-3.5 text-center font-sans text-cyan-400 text-xs sm:text-sm">黄渤海高承载带</td>
                        <td className="p-3.5 text-right font-mono font-num text-emerald-300">184.8 万人</td>
                        <td className="p-3.5 text-right font-mono font-num text-purple-300">¥6.24 万元</td>
                        <td className="p-3.5 font-sans text-xs sm:text-sm text-slate-300">陆海统筹现代海洋经济高地</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            DIMENSION 2: SHANDONG MARINE STRATEGY & POLICY MATRIX
        ======================================================== */}
        {activeDimension === 'policy' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">全省蓝碳重点政策综合履约率</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-emerald-300 font-num">103.8</span>
                  <span className="text-xs text-slate-400">%</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>超额完成“十四五”规划中期预期</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">海洋生态保护红线管控率</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-cyan-300 font-num">100.0</span>
                  <span className="text-xs text-slate-400">%</span>
                </div>
                <div className="text-[10px] text-cyan-400 mt-1">
                  <span>全域严守生态红线 · 零违法占用</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">海洋生态补偿转移支付累计</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-amber-300 font-num">117.1</span>
                  <span className="text-xs text-slate-400">亿元</span>
                </div>
                <div className="text-[10px] text-amber-400 mt-1">
                  <span>水质考核达标激励 · 奖优罚劣</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">CCER蓝碳国家方法学储备</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-indigo-300 font-num">3</span>
                  <span className="text-xs text-slate-400">项主导编制</span>
                </div>
                <div className="text-[10px] text-indigo-300 mt-1">
                  <span>微型生物碳泵与大型藻类核算</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            {displayMode !== 'table_only' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Policy Evolution Trend */}
                {renderTrendLineChart(
                  POLICY_TRENDS,
                  'year',
                  [
                    { key: 'score', color: '#10b981', label: '政策综合评分', unit: '分' },
                    { key: 'fiscalSubsidy', color: '#f59e0b', label: '生态补偿转移支付', unit: '亿元' },
                  ],
                  '2020-2026年山东省海洋强省政策成效评分与财政生态补偿投入折线图'
                )}

                {/* Policy Execution Radar / Progress Breakdown */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-slate-200 tracking-wide">
                        重点政策与规划关键量化指标达成进度 (%)
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                      均达标率 103.8%
                    </span>
                  </div>

                  <div className="space-y-3">
                    {POLICY_EVALUATIONS.map((pol) => {
                      const pct = Math.min(pol.fulfillmentRate, 120);
                      return (
                        <div key={pol.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-200 truncate max-w-[280px]" title={pol.title}>
                              {pol.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-mono text-[10px]">
                                目标: {pol.targetValue}{pol.unit} / 达成: {pol.currentValue}{pol.unit}
                              </span>
                              <span className="font-mono font-bold text-emerald-400 font-num">
                                {pol.fulfillmentRate.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${(pct / 120) * 100}%`,
                                backgroundColor: pol.statusColor,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>依据自然资源部《海洋碳汇核算指南》及山东省发改委考核</span>
                    <span className="text-cyan-400">政策落实等级: A+ 卓越</span>
                  </div>
                </div>

                {/* Hexagonal Multi-Axis Radar Chart */}
                <div className="lg:col-span-2">
                  <PolicyRadarChart />
                </div>
              </div>
            )}

            {/* Policy Detailed Table */}
            {displayMode !== 'charts_only' && (
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
                <div className="p-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-slate-100">
                      山东省海洋强省建设与蓝碳战略政策考核量化台账
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      (共 {filteredPolicies.length} 项国家与省重点政策)
                    </span>
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="搜索政策文件或牵头机构..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-sm rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm sm:text-base border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-300 text-sm font-semibold">
                        <th className="p-3.5 font-bold">政策文件与行动纲领</th>
                        <th className="p-3.5 font-bold">牵头主管机构</th>
                        <th className="p-3.5 font-bold">考核核心指标</th>
                        <th className="p-3.5 font-bold text-right">规划目标值</th>
                        <th className="p-3.5 font-bold text-right">当前达成值</th>
                        <th className="p-3.5 font-bold text-right">完成进度 (%)</th>
                        <th className="p-3.5 font-bold text-center">评价等级</th>
                        <th className="p-3.5 font-bold text-right">财政转移支付 (亿元)</th>
                        <th className="p-3.5 font-bold text-right">综合评分</th>
                        <th className="p-3.5 font-bold">文献与督查依据</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200 text-sm sm:text-base">
                      {filteredPolicies.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 font-sans font-bold text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.statusColor }} />
                            {row.title}
                          </td>
                          <td className="p-3.5 font-sans text-slate-300 text-xs sm:text-sm">{row.leadDept}</td>
                          <td className="p-3.5 font-sans text-slate-300 text-xs sm:text-sm">{row.targetMetric}</td>
                          <td className="p-3.5 text-right font-num">{row.targetValue} {row.unit}</td>
                          <td className="p-3.5 text-right font-num font-bold text-cyan-300">{row.currentValue} {row.unit}</td>
                          <td className="p-3.5 text-right font-num font-bold text-emerald-400">
                            {row.fulfillmentRate.toFixed(1)}%
                          </td>
                          <td className="p-3.5 text-center">
                            <span
                              className="px-2.5 py-1 rounded text-xs font-bold inline-block"
                              style={{
                                backgroundColor: `${row.statusColor}20`,
                                color: row.statusColor,
                                border: `1px solid ${row.statusColor}40`,
                              }}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-num text-amber-300">¥{row.fiscalSubsidy.toFixed(1)}</td>
                          <td className="p-3.5 text-right font-num font-bold text-indigo-300">{row.assessmentScore}分</td>
                          <td className="p-3.5 font-sans text-slate-300 text-xs sm:text-sm max-w-xs truncate" title={row.literatureCitation}>
                            {row.literatureCitation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            DIMENSION 3: MARINE BIO-CARBON SINKS & FISHERY SYNERGY
        ======================================================== */}
        {activeDimension === 'bio_carbon' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/25 shadow-md">
                <div className="text-xs text-slate-300 font-semibold">全省海洋贝藻生物固碳总量</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-amber-300 font-num">235.1</span>
                  <span className="text-xs text-slate-300 font-bold">万吨CO₂e/年</span>
                </div>
                <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>居全国首位 · 占全国近海养殖固碳 34%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/25 shadow-md">
                <div className="text-xs text-slate-300 font-semibold">碳汇渔业综合经济产值</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-cyan-300 font-num">605.3</span>
                  <span className="text-xs text-slate-300 font-bold">亿元</span>
                </div>
                <div className="text-xs font-semibold text-cyan-400 mt-1">
                  <span>“以渔抑藻、以贝净水”双向转化</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/25 shadow-md">
                <div className="text-xs text-slate-300 font-semibold">双壳贝类生物钙化固碳量</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-emerald-300 font-num">100.6</span>
                  <span className="text-xs text-slate-300 font-bold">万吨碳酸钙</span>
                </div>
                <div className="text-xs font-semibold text-emerald-400 mt-1">
                  <span>百年尺度长期碳汇封存</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/25 shadow-md">
                <div className="text-xs text-slate-300 font-semibold">年净水与富营养化消减能力</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-purple-300 font-num">93.5</span>
                  <span className="text-xs text-slate-300 font-bold">亿吨海水</span>
                </div>
                <div className="text-xs font-semibold text-purple-300 mt-1">
                  <span>相当于重滤近岸海湾水体 2.4 遍</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            {displayMode !== 'table_only' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Trend line chart */}
                {renderTrendLineChart(
                  BIO_CARBON_TRENDS,
                  'year',
                  [
                    { key: 'carbonSink', color: '#f59e0b', label: '生物固碳量', unit: '万吨CO₂e' },
                    { key: 'economicValue', color: '#06b6d4', label: '渔业产值', unit: '亿元' },
                  ],
                  '2020-2026年山东省贝藻碳汇固碳量与渔业经济总产值协同增长折线图'
                )}

                {/* Bio Carbon Species Breakdown Chart */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Fish className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs font-bold text-slate-200 tracking-wide">
                        典型碳汇生物固碳量贡献与占比构成 (万吨CO₂e)
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">焦念志院士/唐启升院士模型</span>
                  </div>

                  <div className="space-y-3">
                    {BIO_CARBON_SINKS.map((item) => (
                      <div key={item.category} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-slate-200">{item.category}</span>
                            <span className="text-slate-400 text-[10px] ml-1.5 font-sans">({item.species})</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span className="text-amber-400 font-num font-bold">{item.annualCarbonSink} 万吨</span>
                            <span className="text-cyan-400 font-num">({item.sharePercentage}%)</span>
                            <span className="text-slate-400 text-[10px]">产值 {item.economicValue}亿</span>
                          </div>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${(item.annualCarbonSink / 90) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>海带裙带菜光合速率极高 · 贝壳钙化沉降长效固碳</span>
                    <span className="text-emerald-400 font-mono">年总汇量: 235.1 万吨</span>
                  </div>
                </div>

                {/* Vertical Multi-Trophic Carbon Pump Column Diagram */}
                <div className="lg:col-span-2">
                  <BioCarbonVerticalProfile />
                </div>
              </div>
            )}

            {/* Detailed Data Table */}
            {displayMode !== 'charts_only' && (
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
                <div className="p-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm sm:text-base font-bold text-slate-100">
                      山东省碳汇渔业重点生物群落、固碳速率与生态价值详表
                    </h4>
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="搜索生物分类或物种..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-sm rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm sm:text-base border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-300 text-sm font-semibold">
                        <th className="p-3.5 font-bold">生物门类</th>
                        <th className="p-3.5 font-bold">主要代表物种</th>
                        <th className="p-3.5 font-bold text-right">养殖面积 (万亩)</th>
                        <th className="p-3.5 font-bold text-right">年收获产量 (万吨)</th>
                        <th className="p-3.5 font-bold text-right">固碳速率 (tCO₂e/ha·a)</th>
                        <th className="p-3.5 font-bold text-right">年固碳量 (万吨CO₂e)</th>
                        <th className="p-3.5 font-bold text-right">占比 (%)</th>
                        <th className="p-3.5 font-bold text-right">渔业经济产值 (亿元)</th>
                        <th className="p-3.5 font-bold text-right">水体净化量 (亿吨)</th>
                        <th className="p-3.5 font-bold text-right">同比增长</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200 text-sm sm:text-base">
                      {filteredBioCarbon.map((row) => (
                        <tr key={row.category} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 font-sans font-bold text-white">{row.category}</td>
                          <td className="p-3.5 font-sans text-slate-300 text-xs sm:text-sm">{row.species}</td>
                          <td className="p-3.5 text-right font-num">{row.cultureArea.toFixed(1)}</td>
                          <td className="p-3.5 text-right font-num">{row.annualYield > 0 ? row.annualYield.toFixed(1) : '-'}</td>
                          <td className="p-3.5 text-right font-num text-cyan-300 font-semibold">{row.carbonSinkRate.toFixed(2)}</td>
                          <td className="p-3.5 text-right font-num font-bold text-amber-300">{row.annualCarbonSink.toFixed(1)}</td>
                          <td className="p-3.5 text-right font-num text-emerald-400 font-semibold">{row.sharePercentage.toFixed(1)}%</td>
                          <td className="p-3.5 text-right font-num font-bold text-purple-300">¥{row.economicValue.toFixed(1)}</td>
                          <td className="p-3.5 text-right font-num text-sky-300">{row.purificationPower.toFixed(1)}</td>
                          <td className="p-3.5 text-right font-num text-emerald-400 font-semibold">+{row.trendYoY.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            DIMENSION 4: LAND-SEA WATER QUALITY & VULNERABILITY
        ======================================================== */}
        {activeDimension === 'water_environment' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">陆源入海无机氮 (DIN) 消减率</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-sky-300 font-num">42.8</span>
                  <span className="text-xs text-slate-400">%</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">
                  <span>黄河口与小清河流域统筹减排</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">近海海表水体平均 pH 酸度监测</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-cyan-300 font-num">8.24</span>
                  <span className="text-xs text-slate-400">pH安全区间</span>
                </div>
                <div className="text-[10px] text-cyan-400 mt-1">
                  <span>海草床光合强碱化效应缓冲酸化</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">沿海优良水质海湾比例 (一二类)</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-emerald-300 font-num">88.6</span>
                  <span className="text-xs text-slate-400">%</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">
                  <span>连续5年提升 · 优于考核红线</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">赤潮/绿潮灾害综合韧性指数</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-emerald-400 font-num">94.2</span>
                  <span className="text-xs text-slate-400">高韧性等级</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">
                  <span>全域无暴发级有害赤潮</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            {displayMode !== 'table_only' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {renderTrendLineChart(
                  WATER_QUALITY_TRENDS,
                  'year',
                  [
                    { key: 'dinCut', color: '#38bdf8', label: '无机氮消减率', unit: '%' },
                    { key: 'goodWaterRate', color: '#10b981', label: '优良水质比例', unit: '%' },
                  ],
                  '2020-2026年入海陆源污染物消减与近岸优良水质比例趋势折线图'
                )}

                {/* Ocean Acidification & SST Anomaly Gauge Matrix */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-sky-400" />
                      <h4 className="text-xs font-bold text-slate-200 tracking-wide">
                        沿海各重点海域海水酸化(pH)与水质富营养化指数(E)
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">E&lt;1为贫营养清净</span>
                  </div>

                  <div className="space-y-2.5">
                    {WATER_VULNERABILITY.map((bay) => (
                      <div key={bay.bayName} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{bay.bayName}</span>
                            <span className="text-[10px] text-slate-400 font-sans">({bay.region})</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 font-mono">
                            <span>pH: <strong className="text-cyan-300">{bay.seawaterPh}</strong></span>
                            <span>氮消减: <strong className="text-sky-300">{bay.dinReductionRate}%</strong></span>
                            <span>COD消减: <strong className="text-amber-300">{bay.codFluxCut}万吨</strong></span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              bay.resilienceRating === '极强'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            }`}
                          >
                            韧性{bay.resilienceRating}
                          </span>
                          <div className="text-[9px] text-slate-500 mt-1 font-mono">
                            富营养化 E={bay.eutrophicationIndex}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bay Water Quality & Acidification Matrix Heatmap */}
                <div className="lg:col-span-2">
                  <WaterEnvironmentMatrix />
                </div>
              </div>
            )}

            {/* Detailed Table */}
            {displayMode !== 'charts_only' && (
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-sky-400" />
                    <h4 className="text-sm sm:text-base font-bold text-slate-100">
                      山东省重点海区陆海统筹水环境质量、海水酸化与生态韧性台账
                    </h4>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm sm:text-base border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-300 text-sm font-semibold">
                        <th className="p-3.5 font-bold">海湾海域单元</th>
                        <th className="p-3.5 font-bold">所属海区</th>
                        <th className="p-3.5 font-bold text-right">无机氮消减率 (%)</th>
                        <th className="p-3.5 font-bold text-right">磷酸盐达标率 (%)</th>
                        <th className="p-3.5 font-bold text-right">COD负荷消减 (万吨)</th>
                        <th className="p-3.5 font-bold text-right">海表水体 pH</th>
                        <th className="p-3.5 font-bold text-center">酸化风险研判</th>
                        <th className="p-3.5 font-bold text-right">水温距平 (°C)</th>
                        <th className="p-3.5 font-bold text-right">富营养指数 E</th>
                        <th className="p-3.5 font-bold text-center">综合韧性等级</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200 text-sm sm:text-base">
                      {filteredWaterVulnerability.map((row) => (
                        <tr key={row.bayName} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 font-sans font-bold text-white">{row.bayName}</td>
                          <td className="p-3.5 font-sans text-slate-300 text-xs sm:text-sm">{row.region}</td>
                          <td className="p-3.5 text-right font-num text-sky-300 font-semibold">{row.dinReductionRate}%</td>
                          <td className="p-3.5 text-right font-num text-emerald-400 font-semibold">{row.dipComplianceRate}%</td>
                          <td className="p-3.5 text-right font-num text-amber-300">{row.codFluxCut}</td>
                          <td className="p-3.5 text-right font-num font-bold text-cyan-300">{row.seawaterPh}</td>
                          <td className="p-3.5 text-center">
                            <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {row.phAcidificationRisk}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-num text-slate-300">+{row.sstAnomaly}°C</td>
                          <td className="p-3.5 text-right font-num">{row.eutrophicationIndex}</td>
                          <td className="p-3.5 text-center">
                            <span className="px-2.5 py-1 rounded text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                              {row.resilienceRating}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            DIMENSION 5: CCER MARKET & ASSET INCLUSION
        ======================================================== */}
        {activeDimension === 'ccer_market' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/25 shadow-md">
                <div className="text-xs text-slate-300 font-semibold">国家注册簿蓝碳累计备案量</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-purple-300 font-num">47.9</span>
                  <span className="text-xs text-slate-300 font-bold">万吨CO₂e</span>
                </div>
                <div className="text-xs font-semibold text-emerald-400 mt-1">
                  <span>涉及海草床、盐沼及大型藻场</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/25 shadow-md">
                <div className="text-xs text-slate-300 font-semibold">蓝碳现货平均成交单价</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-amber-300 font-num">81.60</span>
                  <span className="text-xs text-slate-300 font-bold">元/吨</span>
                </div>
                <div className="text-xs font-semibold text-emerald-400 mt-1">
                  <span>较全国碳市场均价溢价 +3.9%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/25 shadow-md">
                <div className="text-xs text-slate-300 font-semibold">累计挂牌与撮合成交金额</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-cyan-300 font-num">3,958.3</span>
                  <span className="text-xs text-slate-300 font-bold">万元</span>
                </div>
                <div className="text-xs font-semibold text-cyan-400 mt-1">
                  <span>企业履约与社会中和认购率 97.4%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/25 shadow-md">
                <div className="text-xs text-slate-300 font-semibold">关联绿色金融与碳质押授信</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-emerald-300 font-num">22.4</span>
                  <span className="text-xs text-slate-300 font-bold">亿元</span>
                </div>
                <div className="text-xs font-semibold text-emerald-400 mt-1">
                  <span>海洋碳汇预期收益权质押贷款</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            {displayMode !== 'table_only' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {renderTrendLineChart(
                  CCER_TRADING_TRENDS,
                  'year',
                  [
                    { key: 'shandongBluePrice', color: '#a855f7', label: '山东蓝碳成交均价', unit: '元/吨' },
                    { key: 'nationalPrice', color: '#64748b', label: '全国碳市场基准价', unit: '元/吨' },
                  ],
                  '2020-2026年山东省蓝碳自愿减排量(CCER)交易均价走势与全国基准溢价折线图'
                )}

                {/* Projects Volume & Credit Progress */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-purple-400" />
                      <h4 className="text-xs font-bold text-slate-200 tracking-wide">
                        各沿海试点项目核证量 (tCO₂e) 与流转完成率
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {CCER_MARKET_PROJECTS.map((proj) => (
                      <div key={proj.projectNo} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200 truncate max-w-[260px]" title={proj.projectName}>
                            {proj.projectName}
                          </span>
                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span className="text-purple-300 font-bold font-num">{proj.carbonCreditTons.toLocaleString()} t</span>
                            <span className="text-amber-400">¥{proj.unitPrice}/吨</span>
                            <span className="text-emerald-400">{proj.fulfillmentRate}%履约</span>
                          </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${proj.fulfillmentRate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-xs text-slate-300 font-semibold flex items-center justify-between">
                    <span>*依托中环联合(CEC)、中国船级社(CCSC)第三方核证</span>
                    <span className="text-purple-400 font-mono">区块链存证已上链</span>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Table */}
            {displayMode !== 'charts_only' && (
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm sm:text-base font-bold text-slate-100">
                      山东省蓝碳自愿减排量(CCER)备案上市项目台账与资产流转明细
                    </h4>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm sm:text-base border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-300 text-sm font-semibold">
                        <th className="p-3.5 font-bold">项目编号</th>
                        <th className="p-3.5 font-bold">工程项目全称</th>
                        <th className="p-3.5 font-bold">实施区县</th>
                        <th className="p-3.5 font-bold">适用方法学</th>
                        <th className="p-3.5 font-bold">第三方核验机构</th>
                        <th className="p-3.5 font-bold text-right">核证量 (tCO₂e)</th>
                        <th className="p-3.5 font-bold text-right">成交价 (元/吨)</th>
                        <th className="p-3.5 font-bold text-right">总金额 (万元)</th>
                        <th className="p-3.5 font-bold text-right">履约率</th>
                        <th className="p-3.5 font-bold text-center">注册簿状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200 text-sm sm:text-base">
                      {filteredCCERProjects.map((row) => (
                        <tr key={row.projectNo} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 text-cyan-400 text-xs sm:text-sm font-bold font-mono">{row.projectNo}</td>
                          <td className="p-3.5 font-sans font-bold text-white">{row.projectName}</td>
                          <td className="p-3.5 font-sans text-slate-300 text-xs sm:text-sm">{row.region}</td>
                          <td className="p-3.5 font-sans text-slate-300 text-xs sm:text-sm">{row.methodology}</td>
                          <td className="p-3.5 font-sans text-slate-300 text-xs sm:text-sm">{row.verifier}</td>
                          <td className="p-3.5 text-right font-num font-bold text-purple-300">{row.carbonCreditTons.toLocaleString()}</td>
                          <td className="p-3.5 text-right font-num text-amber-300">¥{row.unitPrice.toFixed(2)}</td>
                          <td className="p-3.5 text-right font-num text-cyan-300">¥{row.totalAmountWan.toFixed(2)}</td>
                          <td className="p-3.5 text-right font-num text-emerald-400 font-bold">{row.fulfillmentRate}%</td>
                          <td className="p-3.5 text-center">
                            <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {row.registryStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            DIMENSION 6: HYDROLOGY & MONTHLY MONITORING LEDGER
        ======================================================== */}
        {activeDimension === 'hydrology_ledger' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-teal-500/25 shadow-md">
                <div className="text-xs text-slate-300 font-semibold">全省全年海-气净碳吸收通量</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-teal-300 font-num">384.62</span>
                  <span className="text-xs text-slate-300 font-bold">万吨CO₂e</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">
                  <span>夏秋季藻类快速生长呈高吸收波峰</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">沉积物长期碳封存速率均值</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-cyan-300 font-num">268.4</span>
                  <span className="text-xs text-slate-400">g C/(m²·a)</span>
                </div>
                <div className="text-[10px] text-cyan-400 mt-1">
                  <span>黄河三角洲与海草床深层千年埋藏</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">年度蓝碳综合核算产值</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-amber-300 font-num">8,940</span>
                  <span className="text-xs text-slate-400">万元</span>
                </div>
                <div className="text-[10px] text-amber-400 mt-1">
                  <span>结合现货挂牌估值与减排量认证</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/25 shadow-md">
                <div className="text-[11px] text-slate-400 font-medium">浮标传感器原位巡检有效率</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-indigo-300 font-num">99.85</span>
                  <span className="text-xs text-slate-400">%</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">
                  <span>24小时全天候高频水文遥测</span>
                </div>
              </div>
            </div>

            {/* 12-Month Line Chart */}
            {displayMode !== 'table_only' && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-teal-400" />
                    <h4 className="text-xs font-bold text-slate-200 tracking-wide">
                      1-12月海表吸收通量极值与月度平均固碳通量走势 (mmol/m²·d)
                    </h4>
                  </div>
                </div>

                {renderTrendLineChart(
                  [
                    { month: '1月', maxFlux: 1.2, minFlux: 0.4, avgFlux: 0.8 },
                    { month: '2月', maxFlux: 1.8, minFlux: 0.6, avgFlux: 1.2 },
                    { month: '3月', maxFlux: 3.4, minFlux: 1.1, avgFlux: 2.2 },
                    { month: '4月', maxFlux: 4.9, minFlux: 1.8, avgFlux: 3.3 },
                    { month: '5月', maxFlux: 7.8, minFlux: 2.5, avgFlux: 5.1 },
                    { month: '6月', maxFlux: 9.4, minFlux: 3.2, avgFlux: 6.3 },
                    { month: '7月', maxFlux: 9.8, minFlux: 3.6, avgFlux: 6.7 },
                    { month: '8月', maxFlux: 9.5, minFlux: 3.1, avgFlux: 6.3 },
                    { month: '9月', maxFlux: 8.2, minFlux: 2.4, avgFlux: 5.3 },
                    { month: '10月', maxFlux: 5.1, minFlux: 1.6, avgFlux: 3.3 },
                    { month: '11月', maxFlux: 2.8, minFlux: 0.9, avgFlux: 1.8 },
                    { month: '12月', maxFlux: 1.4, minFlux: 0.5, avgFlux: 0.9 },
                  ],
                  'month',
                  [
                    { key: 'maxFlux', color: '#14b8a6', label: '最高吸收通量', unit: 'mmol/m²·d' },
                    { key: 'avgFlux', color: '#06b6d4', label: '月均吸收通量', unit: 'mmol/m²·d' },
                    { key: 'minFlux', color: '#64748b', label: '最低吸收通量', unit: 'mmol/m²·d' },
                  ],
                  '12个月周期水文通量季相节律折线图'
                )}
              </div>
            )}

            {/* 12-Month Table */}
            {displayMode !== 'charts_only' && (
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-teal-400" />
                    <h4 className="text-sm sm:text-base font-bold text-slate-100">
                      全省蓝碳水文通量统计与历史对账分析月度台账
                    </h4>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm sm:text-base border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-300 text-sm font-semibold">
                        <th className="p-3.5 font-bold font-sans">水文与碳核算监测项目</th>
                        {['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'].map((m) => (
                          <th key={m} className="p-3.5 font-bold text-right">{m}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200 text-sm sm:text-base">
                      <tr className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-sans font-bold text-cyan-300">海表最高吸收通量 (mmol/m²·d)</td>
                        {[1.2, 1.8, 3.4, 4.9, 7.8, 9.4, 9.8, 9.5, 8.2, 5.1, 2.8, 1.4].map((v, i) => (
                          <td key={i} className="p-3.5 text-right font-num text-cyan-400 font-bold">{v}</td>
                        ))}
                      </tr>
                      <tr className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-sans font-bold text-slate-300">海表最低吸收通量 (mmol/m²·d)</td>
                        {[0.4, 0.6, 1.1, 1.8, 2.5, 3.2, 3.6, 3.1, 2.4, 1.6, 0.9, 0.5].map((v, i) => (
                          <td key={i} className="p-3.5 text-right font-num text-slate-400">{v}</td>
                        ))}
                      </tr>
                      <tr className="hover:bg-slate-800/40 bg-teal-950/20">
                        <td className="p-3.5 font-sans font-bold text-teal-300">月度平均固碳通量 (mmol/m²·d)</td>
                        {[0.8, 1.2, 2.2, 3.3, 5.1, 6.3, 6.7, 6.3, 5.3, 3.3, 1.8, 0.9].map((v, i) => (
                          <td key={i} className="p-3.5 text-right font-num text-teal-300 font-bold">{v}</td>
                        ))}
                      </tr>
                      <tr className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-sans font-bold text-slate-300">沉积碳历史封存 (g/m²·a)</td>
                        {[210, 215, 230, 245, 280, 310, 325, 315, 290, 260, 235, 215].map((v, i) => (
                          <td key={i} className="p-3.5 text-right font-num">{v}</td>
                        ))}
                      </tr>
                      <tr className="hover:bg-slate-800/40 bg-amber-950/20">
                        <td className="p-3.5 font-sans font-bold text-amber-300">蓝碳核算月度产值 (万元)</td>
                        {[180, 210, 350, 480, 890, 1240, 1370, 1310, 980, 620, 390, 220].map((v, i) => (
                          <td key={i} className="p-3.5 text-right font-num text-amber-300 font-bold">{v}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            DIMENSION 7: SANKEY FLOW OF BLUE CARBON & ASSET FLUX
        ======================================================== */}
        {activeDimension === 'sankey_flux' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <BlueCarbonSankeyFlow />
          </div>
        )}

        {/* ========================================================
            DIMENSION 8: DUAL CARBON 2020-2035 SCENARIO SIMULATION
        ======================================================== */}
        {activeDimension === 'scenario_sim' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <ScenarioPredictionSimulator />
          </div>
        )}
      </div>
    </div>
  );
};
