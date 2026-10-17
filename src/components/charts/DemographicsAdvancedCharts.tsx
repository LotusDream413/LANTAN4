import React, { useState } from 'react';
import { Flame, Users, Sparkles, Compass, Info } from 'lucide-react';
import { COASTAL_DEMOGRAPHICS } from '../../data/multiDimensionalAnalysisData';

export const DemographicsAdvancedCharts: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<any | null>(null);

  // 1. Spatial Grid Heatmap Data for Shandong Coastline
  const gridCells = [
    { zone: '黄河口潮滩区', city: '东营', x: 1, y: 1, density: 268, labor: 32.4, carbonIdx: 92, temp: 0.28, color: '#10b981' },
    { zone: '莱州湾南岸重盐碱', city: '潍坊', x: 2, y: 1, density: 584, labor: 45.2, carbonIdx: 86, temp: 0.62, color: '#06b6d4' },
    { zone: '渤海西南岸贝壳堤', city: '滨州', x: 0, y: 1, density: 408, labor: 28.5, carbonIdx: 84, temp: 0.42, color: '#10b981' },
    { zone: '长岛国际零碳群岛', city: '烟台', x: 2, y: 0, density: 430, labor: 24.8, carbonIdx: 96, temp: 0.45, color: '#06b6d4' },
    { zone: '烟台北岸现代渔港', city: '烟台', x: 3, y: 0, density: 540, labor: 49.4, carbonIdx: 92, temp: 0.68, color: '#f59e0b' },
    { zone: '威海成山头海草床', city: '威海', x: 4, y: 0, density: 490, labor: 38.2, carbonIdx: 98, temp: 0.52, color: '#06b6d4' },
    { zone: '桑沟湾立体养殖区', city: '威海', x: 4, y: 1, density: 518, labor: 24.3, carbonIdx: 99, temp: 0.70, color: '#f59e0b' },
    { zone: '青岛胶州湾超密带', city: '青岛', x: 3, y: 2, density: 985, labor: 52.0, carbonIdx: 97, temp: 0.96, color: '#ef4444' },
    { zone: '青岛崂山湾生态带', city: '青岛', x: 4, y: 2, density: 720, labor: 36.6, carbonIdx: 95, temp: 0.78, color: '#f97316' },
    { zone: '日照前三岛深水区', city: '日照', x: 2, y: 3, density: 575, labor: 36.8, carbonIdx: 88, temp: 0.64, color: '#06b6d4' },
  ];

  // 2. Bilateral Demographic Gender Pyramid Across 6 Key Marine Divisions
  const divisions = [
    { title: '藻类微藻育种与种质库', male: 11.2, female: 18.5, malePct: 37.7, femalePct: 62.3 },
    { title: '贝藻立体筏架与海上采收', male: 68.4, female: 32.1, malePct: 68.1, femalePct: 31.9 },
    { title: '深水网箱与智能装备运维', male: 42.6, female: 9.3, malePct: 82.1, femalePct: 17.9 },
    { title: '蓝碳监测浮标与水化检测', male: 14.8, female: 17.4, malePct: 46.0, femalePct: 54.0 },
    { title: '多糖提取与藻类生物医药', male: 22.5, female: 31.1, malePct: 42.0, femalePct: 58.0 },
    { title: '生态巡护与碳普惠科普研学', male: 26.5, female: 27.6, malePct: 49.0, femalePct: 51.0 },
  ];

  return (
    <div className="space-y-5">
      {/* Grid: Heatmap + Bilateral Pyramid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* CHART 1: GEOSPATIAL POPULATION & WORKFORCE INTENSITY GRID HEATMAP */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs font-bold text-slate-100 tracking-wide">
                山东省沿海重点岸段人口空间密度与涉海强度热力矩阵
              </h4>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">空间网格单元</span>
          </div>

          <p className="text-[10px] text-slate-400 mb-3">
            悬停各空间网格单元可查看所在岸段的人口承载密度、涉海劳动强度及碳普惠指数。
          </p>

          {/* Interactive Heatmap Matrix Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-1">
            {gridCells.map((c, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredCell(c)}
                onMouseLeave={() => setHoveredCell(null)}
                className="relative p-2.5 rounded-xl border transition-all cursor-pointer hover:scale-105 group"
                style={{
                  backgroundColor: `${c.color}15`,
                  borderColor: `${c.color}50`,
                }}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-white">{c.city}</span>
                  <span className="font-mono font-bold" style={{ color: c.color }}>
                    {c.density} 人
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium truncate mt-1">
                  {c.zone}
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-950 mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${c.temp * 100}%`,
                      backgroundColor: c.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hover Telemetry Details Box */}
          <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-between text-[11px]">
            {hoveredCell ? (
              <div className="flex items-center justify-between w-full font-mono text-xs">
                <span className="text-white font-bold font-sans">
                  [{hoveredCell.city}] {hoveredCell.zone}
                </span>
                <span className="text-cyan-300 font-num">密度: {hoveredCell.density}人/km²</span>
                <span className="text-amber-300 font-num">涉海劳动: {hoveredCell.labor}万人</span>
                <span className="text-emerald-400 font-num">碳普惠: {hoveredCell.carbonIdx}分</span>
              </div>
            ) : (
              <span className="text-slate-500 text-[10px] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                鼠标移至热力网格单元上方查看实时微观遥测指标
              </span>
            )}
          </div>
        </div>

        {/* CHART 2: BILATERAL SYMMETRIC POPULATION/GENDER PYRAMID */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-slate-100 tracking-wide">
                涉海重点门类劳动力性别双向对称金字塔对比 (万人)
              </h4>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> 男性 (左翼)
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> 女性 (右翼)
              </span>
            </div>
          </div>

          <div className="space-y-2.5 my-auto">
            {divisions.map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-300 font-medium">
                  <span className="text-cyan-400 font-mono font-num">{d.male}万 ({d.malePct}%)</span>
                  <span className="text-slate-200 text-center font-semibold px-2">{d.title}</span>
                  <span className="text-rose-400 font-mono font-num">{d.female}万 ({d.femalePct}%)</span>
                </div>
                <div className="grid grid-cols-2 gap-1 h-2.5">
                  {/* Left: Male Bar */}
                  <div className="w-full flex justify-end bg-slate-950 rounded-l-full overflow-hidden p-0.5 border border-slate-850">
                    <div
                      className="h-full bg-gradient-to-l from-cyan-400 to-cyan-600 rounded-l-full transition-all duration-500"
                      style={{ width: `${(d.male / 70) * 100}%` }}
                    />
                  </div>
                  {/* Right: Female Bar */}
                  <div className="w-full flex justify-start bg-slate-950 rounded-r-full overflow-hidden p-0.5 border border-slate-850">
                    <div
                      className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-r-full transition-all duration-500"
                      style={{ width: `${(d.female / 70) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>*女性劳动力在微藻种苗与高附加值多糖深加工中占比超过60%</span>
            <span className="text-cyan-400 font-mono font-bold">全省涉海劳动结构协同稳健</span>
          </div>
        </div>
      </div>

      {/* CHART 3: FOUR-QUADRANT SCATTER BUBBLE PLOT */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-100 tracking-wide">
              山东沿海地市人均涉海产值 vs 近海人口承载四象限散点矩阵
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            气泡大小表示涉海劳动力总量 · 颜色表示碳普惠活力
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {COASTAL_DEMOGRAPHICS.map((city) => (
            <div
              key={city.city}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{city.city}</span>
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                  style={{ backgroundColor: `${city.heatColor}20`, color: city.heatColor }}
                >
                  {city.densityPerSqKm > 600 ? '高承载' : '生态型'}
                </span>
              </div>
              <div className="my-2 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>人均产值:</span>
                  <span className="text-amber-300 font-bold font-num">¥{city.perCapitaSeaGdp}万</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>人口密度:</span>
                  <span className="text-cyan-300 font-num">{city.densityPerSqKm}人/km²</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>涉海劳动力:</span>
                  <span className="text-emerald-400 font-num">{city.marineLabor}万人</span>
                </div>
              </div>
              <div className="w-full bg-slate-900 rounded-lg p-1 text-center text-[10px] text-slate-300 font-sans border border-slate-800">
                碳普惠综合指数: <strong className="text-cyan-400 font-mono">{city.carbonContributionIndex}分</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
