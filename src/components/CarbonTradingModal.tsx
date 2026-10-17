import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Briefcase, 
  Calculator, 
  ArrowUpRight, 
  ArrowDownRight,
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Activity, 
  Layers, 
  Sparkles, 
  BarChart2, 
  RefreshCw, 
  Sliders,
  CheckCircle2,
  FileText,
  Percent,
  Coins
} from 'lucide-react';
import { StationData } from '../data/blueCarbonData';

interface CarbonTradingModalProps {
  isOpen?: boolean;
  onClose: () => void;
  station: StationData;
  year: number;
  isFullView?: boolean;
  onBackToGis?: () => void;
}

interface TickerItem {
  id: string;
  code: string;
  name: string;
  price: number;
  change: number;
  changeAmount: number;
  high: number;
  low: number;
  volume: number;
  type: string;
}

export const CarbonTradingModal: React.FC<CarbonTradingModalProps> = ({
  isOpen,
  onClose,
  station,
  year,
}) => {
  // Available Tradable Blue Carbon Assets
  const tickers: TickerItem[] = [
    {
      id: 'sd-bc-01',
      code: 'SD-BC-01',
      name: '日照前三岛·大型贝藻碳汇凭证',
      price: 78.50,
      change: +3.42,
      changeAmount: +2.60,
      high: 79.20,
      low: 75.80,
      volume: 48920,
      type: '贝藻微藻固碳',
    },
    {
      id: 'sd-yz-02',
      code: 'SD-YZ-02',
      name: '黄河口·盐沼湿地生态减排票',
      price: 84.20,
      change: +4.15,
      changeAmount: +3.35,
      high: 85.00,
      low: 80.60,
      volume: 62400,
      type: '盐沼沉积碳封存',
    },
    {
      id: 'sd-hc-03',
      code: 'SD-HC-03',
      name: '桑沟湾·海草床蓝碳自愿减排量',
      price: 89.60,
      change: -0.80,
      changeAmount: -0.72,
      high: 91.00,
      low: 88.50,
      volume: 31250,
      type: '海草床长效碳库',
    },
    {
      id: 'sd-cd-04',
      code: 'SD-CD-04',
      name: '长岛海洋牧场·贝壳碳酸盐期权',
      price: 72.80,
      change: +1.95,
      changeAmount: +1.40,
      high: 73.50,
      low: 71.00,
      volume: 24800,
      type: '贝类生物钙化',
    },
  ];

  const [selectedTickerId, setSelectedTickerId] = useState<string>('sd-bc-01');
  const activeTicker = tickers.find((t) => t.id === selectedTickerId) || tickers[0];

  // Stock-style state
  const [selectedKLineRange, setSelectedKLineRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [tradeVolumeTons, setTradeVolumeTons] = useState<number>(500); // 吨
  const [isOrderSubmitted, setIsOrderSubmitted] = useState<boolean>(false);

  // Enterprise Quota Simulator State
  const [companyEmissionTons, setCompanyEmissionTons] = useState<number>(100000); // 企业年排放量 10万吨

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Policy formula calculation:
  // 1. 基准CCER碳税对冲折算公式: Benefit = Q_carbon * P_carbon * (1 + Policy_Incentive_alpha)
  // 2. 财政政策专项补贴: 15% 绿色金融再贷款贴息与海洋蓝碳增汇补贴
  // 3. 企业ESG税收抵免: Tax_Credit = Q_carbon * 12.5 RMB/ton
  const currentMarketPrice = activeTicker.price;
  const policyIncentiveRate = 0.15; 
  const grossRevenue = tradeVolumeTons * currentMarketPrice;
  const policyBonus = grossRevenue * policyIncentiveRate;
  const corporateEsgTaxDeduction = tradeVolumeTons * 12.5;
  const netEconomicBenefit = grossRevenue + policyBonus + corporateEsgTaxDeduction;

  // Enterprise Simulator Math:
  // 国家碳排放权交易管理办法规定：重点排放单位每年可以使用国家核证自愿减排量(CCER)抵销碳排放配额的清缴，抵销比例不得超过应清缴碳排放配额的 5%
  const maxAllowedCcerOffsetTons = companyEmissionTons * 0.05; // 5% CCER抵销上限
  const ceaBenchmarkPrice = 93.5; // 全国碳市场配额 CEA 均价约 93.5元/吨
  const unitPriceDifference = ceaBenchmarkPrice - currentMarketPrice; // 差价
  const directCostSaved = maxAllowedCcerOffsetTons * unitPriceDifference;
  const greenFinanceSubsidy = maxAllowedCcerOffsetTons * currentMarketPrice * 0.15;
  const totalEnterpriseBenefit = directCostSaved + greenFinanceSubsidy;

  // Candlestick / K-line mock simulation points
  const kLineData = [
    { time: '09:30', open: 76.2, close: 77.0, high: 77.4, low: 75.8, vol: 1200 },
    { time: '10:30', open: 77.0, close: 76.8, high: 77.5, low: 76.4, vol: 1800 },
    { time: '11:30', open: 76.8, close: 77.8, high: 78.1, low: 76.7, vol: 2400 },
    { time: '13:30', open: 77.8, close: 78.4, high: 78.9, low: 77.5, vol: 3100 },
    { time: '14:30', open: 78.4, close: 78.2, high: 78.6, low: 77.9, vol: 2800 },
    { time: '15:00', open: 78.2, close: currentMarketPrice, high: 79.2, low: 78.0, vol: 4200 },
  ];

  // Order Book depth
  const bids = [
    { price: currentMarketPrice - 0.02, volume: 1250 },
    { price: currentMarketPrice - 0.05, volume: 2400 },
    { price: currentMarketPrice - 0.10, volume: 890 },
    { price: currentMarketPrice - 0.15, volume: 3100 },
    { price: currentMarketPrice - 0.20, volume: 1540 },
  ];

  const asks = [
    { price: currentMarketPrice + 0.02, volume: 920 },
    { price: currentMarketPrice + 0.05, volume: 1800 },
    { price: currentMarketPrice + 0.10, volume: 2600 },
    { price: currentMarketPrice + 0.15, volume: 1450 },
    { price: currentMarketPrice + 0.20, volume: 3800 },
  ];

  const handlePlaceOrder = () => {
    setIsOrderSubmitted(true);
    setTimeout(() => {
      setIsOrderSubmitted(false);
    }, 2800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl max-h-[94vh] flex flex-col rounded-2xl bg-slate-900 border border-amber-500/40 text-slate-100 shadow-[0_0_70px_rgba(245,158,11,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar with Prominent Close Button */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-amber-500/20 bg-slate-950/95 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/25 to-cyan-500/10 border border-amber-400/40 text-amber-300">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  山东蓝碳金融资产交易所 · CCER 大宗行情与清算大盘
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                  国家绿色金融试点
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                依据《国家温室气体自愿减排交易管理办法》(部令第31号) · 挂牌连续撮合机制
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 text-xs font-semibold border border-slate-700 hover:border-rose-500/50 transition-all cursor-pointer shadow-sm"
            title="关闭行情大盘 (ESC)"
          >
            <X className="w-4 h-4 text-slate-300" />
            <span>关闭大盘</span>
          </button>
        </div>

        {/* Scrollable Main Cockpit Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Ticker Selector Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {tickers.map((t) => {
              const isSelected = t.id === selectedTickerId;
              const isUp = t.change >= 0;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTickerId(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cyan-400">{t.code}</span>
                    <span className={`text-xs font-mono font-bold flex items-center gap-0.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {isUp ? `+${t.change}%` : `${t.change}%`}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate mt-1">{t.name}</div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-num text-lg font-bold text-white">¥{t.price.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{t.type}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Ticker Real-Time Stock Header Banner */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-baseline gap-4">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">当前即期成交价</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-num text-3xl font-extrabold text-amber-400">
                    ¥{activeTicker.price.toFixed(2)}
                  </span>
                  <span className={`text-xs font-mono font-bold flex items-center ${activeTicker.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {activeTicker.change >= 0 ? `+${activeTicker.change}% (+¥${activeTicker.changeAmount})` : `${activeTicker.change}% (-¥${Math.abs(activeTicker.changeAmount)})`}
                  </span>
                </div>
              </div>

              <div className="hidden sm:block text-xs font-mono text-slate-400 space-y-0.5 pl-4 border-l border-slate-800">
                <div>今日最高: <span className="text-emerald-400 font-num">{activeTicker.high.toFixed(2)}</span></div>
                <div>今日最低: <span className="text-rose-400 font-num">{activeTicker.low.toFixed(2)}</span></div>
              </div>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">全日撮合成交量</span>
                <span className="font-num text-cyan-300 font-bold">{activeTicker.volume.toLocaleString()} 吨 CO₂e</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">当日清算成交额</span>
                <span className="font-num text-emerald-300 font-bold">¥{(activeTicker.volume * activeTicker.price / 10000).toFixed(1)} 万元</span>
              </div>
            </div>
          </div>

          {/* Center Split: K-Line Chart + Order Book */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Col 1 & 2: K-Line Stock Style Chart */}
            <div className="lg:col-span-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              {/* Chart Toolbar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>分时连续撮合与成交量研判图 (SD-CCER Tick Stream)</span>
                </div>
                <div className="flex items-center gap-1 p-0.5 rounded bg-slate-900 border border-slate-700 text-xs">
                  <span className="px-2.5 py-0.5 rounded font-mono text-xs bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40">
                    1D 日内行情
                  </span>
                </div>
              </div>

              {/* Simulated Candlestick / K-Line Chart SVG */}
              <div className="relative w-full h-[200px] pt-1">
                <svg viewBox="0 0 520 180" className="w-full h-full overflow-visible">
                  {/* Horizontal Grid lines */}
                  <line x1="30" y1="20" x2="500" y2="20" stroke="rgba(148, 163, 184, 0.1)" strokeDasharray="3 3" />
                  <line x1="30" y1="60" x2="500" y2="60" stroke="rgba(148, 163, 184, 0.1)" strokeDasharray="3 3" />
                  <line x1="30" y1="100" x2="500" y2="100" stroke="rgba(148, 163, 184, 0.1)" strokeDasharray="3 3" />
                  <line x1="30" y1="140" x2="500" y2="140" stroke="rgba(148, 163, 184, 0.2)" />

                  {/* Simulated Candlestick bars */}
                  {kLineData.map((d, i) => {
                    const x = 50 + i * 80;
                    const isUp = d.close >= d.open;
                    const color = isUp ? '#10b981' : '#f43f5e';
                    const mapY = (p: number) => 140 - ((p - 75) / 5) * 120;

                    const yOpen = mapY(d.open);
                    const yClose = mapY(d.close);
                    const yHigh = mapY(d.high);
                    const yLow = mapY(d.low);

                    return (
                      <g key={i}>
                        <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.5" />
                        <rect
                          x={x - 12}
                          y={Math.min(yOpen, yClose)}
                          width="24"
                          height={Math.max(Math.abs(yClose - yOpen), 3)}
                          fill={color}
                          rx="1"
                        />
                        <rect
                          x={x - 10}
                          y={170 - (d.vol / 4200) * 25}
                          width="20"
                          height={(d.vol / 4200) * 25}
                          fill={color}
                          opacity="0.35"
                        />
                        <text x={x} y="180" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                          {d.time}
                        </text>
                      </g>
                    );
                  })}

                  {/* 5-day MA line */}
                  <path
                    d="M 50,110 C 130,105 210,80 290,65 C 370,55 450,45 490,40"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Sub-metrics */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
                <span>MA5均线: <strong className="text-sky-300 font-num">¥78.12</strong></span>
                <span>MA10均线: <strong className="text-amber-300 font-num">¥77.45</strong></span>
                <span>RSI相对强弱: <strong className="text-emerald-300 font-num">64.2</strong> (偏多买盘)</span>
                <span>日波动率: <strong className="text-cyan-300 font-num">1.4%</strong> (稳健)</span>
              </div>
            </div>

            {/* Col 3: Order Book Depth (盘口买卖五档) */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between text-xs">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 font-bold">
                  <span className="text-slate-200">挂单撮合深度 (五档盘口)</span>
                  <span className="text-cyan-400 font-mono text-[10px]">毫秒级同步</span>
                </div>

                {/* Asks (Sell) */}
                <div className="space-y-1 mb-2 font-mono text-[11px]">
                  {asks.slice().reverse().map((a, i) => (
                    <div key={i} className="flex justify-between items-center text-rose-400">
                      <span>卖{5 - i} ¥{a.price.toFixed(2)}</span>
                      <span className="text-slate-300">{a.volume} 吨</span>
                    </div>
                  ))}
                </div>

                <div className="h-[1px] bg-slate-800 my-2" />

                {/* Bids (Buy) */}
                <div className="space-y-1 font-mono text-[11px]">
                  {bids.map((b, i) => (
                    <div key={i} className="flex justify-between items-center text-emerald-400">
                      <span>买{i + 1} ¥{b.price.toFixed(2)}</span>
                      <span className="text-slate-300">{b.volume} 吨</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Volume Selector */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">交易量快速加注:</span>
                <div className="grid grid-cols-4 gap-1 text-[11px] font-mono">
                  {[200, 500, 1000, 5000].map((v) => (
                    <button
                      key={v}
                      onClick={() => setTradeVolumeTons(v)}
                      className={`py-1 rounded border text-center transition-colors cursor-pointer ${
                        tradeVolumeTons === v ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold' : 'border-slate-800 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      {v}T
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Mathematical Conversion Model & Policy Economic Engine    */}
          {/* ======================================================== */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>国家政策标准与企业经济效益数学转化核算模型</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                IPCC 2013 + 沿海湿地蓝碳计量标准 (CMS-001-V01)
              </span>
            </div>

            {/* Mathematical Formulas Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-xs">
              <div className="space-y-1">
                <div className="text-[11px] text-cyan-300 font-bold">公式1: 沿海蓝碳有效净减排量核算模型 (Net Sequestration)</div>
                <div className="text-slate-300 bg-slate-900/90 p-2 rounded text-[11px] border border-cyan-500/20">
                  Q_net = ∑ (A_i × SR_i × OC_i) - E_leakage - E_baseline
                </div>
                <div className="text-[10px] text-slate-400">
                  A_i为样区面积，SR_i为沉积埋藏速率({station.buoySensors.burialRate} g/m²·a)，OC_i为有机碳分数。
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] text-amber-300 font-bold">公式2: 企业蓝碳资产综合经济转化价值模型 (Net Economic Value)</div>
                <div className="text-slate-300 bg-slate-900/90 p-2 rounded text-[11px] border border-amber-500/20">
                  V_total = Q × P_market × (1 + α_subsidy) + Q × T_tax_deduct + β_green_credit
                </div>
                <div className="text-[10px] text-slate-400">
                  α为山东省海洋绿碳贴息(15%)，T为排污税抵扣额(¥12.5/吨)，β为绿色金融低息红利。
                </div>
              </div>
            </div>

            {/* Current Transaction Math Calculation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">① 基础现货交易市值</span>
                <div className="font-num text-lg font-bold text-cyan-300 mt-1">
                  ¥{grossRevenue.toLocaleString()}
                </div>
                <span className="text-[9px] text-slate-500 font-mono">Q × P_market</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">② 海洋蓝碳专项补贴 (+15%)</span>
                <div className="font-num text-lg font-bold text-amber-300 mt-1">
                  +¥{policyBonus.toLocaleString()}
                </div>
                <span className="text-[9px] text-slate-500 font-mono">省财政海洋经济奖补</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">③ 控排企业环保税减免</span>
                <div className="font-num text-lg font-bold text-emerald-300 mt-1">
                  +¥{corporateEsgTaxDeduction.toLocaleString()}
                </div>
                <span className="text-[9px] text-slate-500 font-mono">抵扣企业环保税额</span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                <span className="text-emerald-300 font-bold block text-[10px]">
                  综合净经济效益总值 (Net Benefit)
                </span>
                <div className="font-num text-xl font-extrabold text-emerald-200 mt-1">
                  ¥{netEconomicBenefit.toLocaleString()}
                </div>
                <span className="text-[9px] text-emerald-400 font-mono">经济乘数: 1.31x 增益</span>
              </div>
            </div>

            {/* Enterprise Quota Offset Calculator */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-500/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">企业控排履约抵扣效益试算器</span>
                  <span className="text-[10px] text-slate-400">（按国家5% CCER清缴抵销上限测算）</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">企业年碳排放量:</span>
                  <input
                    type="number"
                    value={companyEmissionTons}
                    onChange={(e) => setCompanyEmissionTons(Math.max(1000, Number(e.target.value)))}
                    className="w-24 px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/40 font-mono text-cyan-300 font-bold text-right"
                  />
                  <span className="text-slate-300 font-mono font-semibold">吨 CO₂e</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">政策允许CCER冲抵量</span>
                  <span className="font-num text-base font-bold text-cyan-300">
                    {maxAllowedCcerOffsetTons.toLocaleString()} 吨
                  </span>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">相对全国CEA配额直接差价节省</span>
                  <span className="font-num text-base font-bold text-amber-300">
                    ¥{Math.round(directCostSaved).toLocaleString()} 元
                  </span>
                </div>

                <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/30">
                  <span className="text-emerald-300 block text-[10px]">综合清缴履约减负总额</span>
                  <span className="font-num text-base font-bold text-emerald-300">
                    ¥{Math.round(totalEnterpriseBenefit).toLocaleString()} 元
                  </span>
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 gap-3">
              <div className="text-[11px] text-slate-400">
                支持山东碳排放权交易中心 API 毫秒级直连申报，核销成功后直出全国碳市场履约凭单。
              </div>

              <div className="flex items-center gap-3">
                {isOrderSubmitted && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                    <ShieldCheck className="w-4 h-4" />
                    撮合报单已提交至山东碳排放权交易中心撮合队列！
                  </span>
                )}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>提交企业买卖撮合委托</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-slate-800 bg-slate-950/95 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>行情撮合网关：活跃正常</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
          >
            返回主界面
          </button>
        </div>
      </div>
    </div>
  );
};
