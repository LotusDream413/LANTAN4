import React, { useState } from 'react';
import { Droplets, Info } from 'lucide-react';

export const WaterEnvironmentMatrix: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<any | null>(null);

  const bays = [
    '威海桑沟湾',
    '东营黄河口',
    '青岛胶州湾',
    '潍坊小清河口',
    '日照前三岛',
    '烟台长岛海峡',
  ];

  const seasons = ['春季水期', '夏季丰水', '秋季浮游旺季', '冬季枯水'];

  // Matrix cells: Bay × Season
  const matrixData = [
    // 桑沟湾
    { bay: '威海桑沟湾', season: '春季水期', ph: 8.26, eIndex: 0.58, dinCut: 36.2, status: '清净优良', color: '#10b981' },
    { bay: '威海桑沟湾', season: '夏季丰水', ph: 8.32, eIndex: 0.65, dinCut: 41.5, status: '清净优良', color: '#10b981' },
    { bay: '威海桑沟湾', season: '秋季浮游旺季', ph: 8.28, eIndex: 0.62, dinCut: 38.6, status: '清净优良', color: '#10b981' },
    { bay: '威海桑沟湾', season: '冬季枯水', ph: 8.24, eIndex: 0.52, dinCut: 34.0, status: '清净优良', color: '#10b981' },

    // 黄河口
    { bay: '东营黄河口', season: '春季水期', ph: 8.14, eIndex: 0.82, dinCut: 38.5, status: '良好稳定', color: '#06b6d4' },
    { bay: '东营黄河口', season: '夏季丰水', ph: 8.08, eIndex: 0.94, dinCut: 45.2, status: '轻度偏酸', color: '#f59e0b' },
    { bay: '东营黄河口', season: '秋季浮游旺季', ph: 8.12, eIndex: 0.88, dinCut: 42.1, status: '良好稳定', color: '#06b6d4' },
    { bay: '东营黄河口', season: '冬季枯水', ph: 8.18, eIndex: 0.74, dinCut: 36.8, status: '良好稳定', color: '#06b6d4' },

    // 胶州湾
    { bay: '青岛胶州湾', season: '春季水期', ph: 8.20, eIndex: 0.71, dinCut: 32.4, status: '良好稳定', color: '#06b6d4' },
    { bay: '青岛胶州湾', season: '夏季丰水', ph: 8.25, eIndex: 0.82, dinCut: 38.9, status: '良好稳定', color: '#06b6d4' },
    { bay: '青岛胶州湾', season: '秋季浮游旺季', ph: 8.21, eIndex: 0.74, dinCut: 35.4, status: '良好稳定', color: '#06b6d4' },
    { bay: '青岛胶州湾', season: '冬季枯水', ph: 8.19, eIndex: 0.66, dinCut: 31.0, status: '良好稳定', color: '#06b6d4' },

    // 小清河口
    { bay: '潍坊小清河口', season: '春季水期', ph: 8.08, eIndex: 1.05, dinCut: 26.5, status: '关注警示', color: '#f59e0b' },
    { bay: '潍坊小清河口', season: '夏季丰水', ph: 8.02, eIndex: 1.25, dinCut: 34.2, status: '偏酸超标', color: '#ef4444' },
    { bay: '潍坊小清河口', season: '秋季浮游旺季', ph: 8.05, eIndex: 1.12, dinCut: 29.8, status: '关注警示', color: '#f59e0b' },
    { bay: '潍坊小清河口', season: '冬季枯水', ph: 8.10, eIndex: 0.98, dinCut: 24.0, status: '良好稳定', color: '#06b6d4' },

    // 前三岛
    { bay: '日照前三岛', season: '春季水期', ph: 8.22, eIndex: 0.54, dinCut: 38.0, status: '清净优良', color: '#10b981' },
    { bay: '日照前三岛', season: '夏季丰水', ph: 8.28, eIndex: 0.64, dinCut: 44.5, status: '清净优良', color: '#10b981' },
    { bay: '日照前三岛', season: '秋季浮游旺季', ph: 8.24, eIndex: 0.58, dinCut: 41.2, status: '清净优良', color: '#10b981' },
    { bay: '日照前三岛', season: '冬季枯水', ph: 8.21, eIndex: 0.49, dinCut: 35.8, status: '清净优良', color: '#10b981' },

    // 长岛
    { bay: '烟台长岛海峡', season: '春季水期', ph: 8.27, eIndex: 0.40, dinCut: 41.0, status: '清净优良', color: '#10b981' },
    { bay: '烟台长岛海峡', season: '夏季丰水', ph: 8.31, eIndex: 0.48, dinCut: 48.0, status: '清净优良', color: '#10b981' },
    { bay: '烟台长岛海峡', season: '秋季浮游旺季', ph: 8.29, eIndex: 0.42, dinCut: 44.5, status: '清净优良', color: '#10b981' },
    { bay: '烟台长岛海峡', season: '冬季枯水', ph: 8.26, eIndex: 0.36, dinCut: 39.5, status: '清净优良', color: '#10b981' },
  ];

  return (
    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-400" />
          <h4 className="text-xs font-bold text-slate-100 tracking-wide">
            沿海重点海湾水质富营养化指数(E)与酸化pH四季动态矩阵热力图
          </h4>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> 贫营养优良 (E&lt;0.7)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-cyan-500" /> 中营养正常 (0.7-1.0)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-500" /> 轻度富营养/偏酸 (1.0-1.2)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-500" /> 重点预警 (&gt;1.2)
          </span>
        </div>
      </div>

      {/* Heatmap Grid: Bays on Y axis, Seasons on X axis */}
      <div className="overflow-x-auto">
        <table className="w-full text-center text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="p-2.5 text-left font-semibold">海湾海域单元</th>
              {seasons.map((s) => (
                <th key={s} className="p-2.5 font-semibold">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {bays.map((bay) => (
              <tr key={bay} className="hover:bg-slate-800/30">
                <td className="p-2.5 text-left font-sans font-bold text-white text-xs">{bay}</td>
                {seasons.map((season) => {
                  const cell = matrixData.find((m) => m.bay === bay && m.season === season)!;
                  return (
                    <td key={season} className="p-1.5">
                      <div
                        onMouseEnter={() => setHoveredCell(cell)}
                        onMouseLeave={() => setHoveredCell(null)}
                        className="p-2 rounded-lg border transition-all cursor-pointer hover:scale-105"
                        style={{
                          backgroundColor: `${cell.color}20`,
                          borderColor: `${cell.color}60`,
                        }}
                      >
                        <div className="font-bold text-xs" style={{ color: cell.color }}>
                          E={cell.eIndex}
                        </div>
                        <div className="text-[10px] text-slate-300 font-normal">
                          pH {cell.ph}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hover Status Bar */}
      <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-between text-[11px]">
        {hoveredCell ? (
          <div className="flex items-center justify-between w-full font-mono text-xs">
            <span className="text-white font-bold font-sans">
              [{hoveredCell.bay} · {hoveredCell.season}]
            </span>
            <span className="text-cyan-300 font-num">水质状态: {hoveredCell.status}</span>
            <span className="text-amber-300 font-num">海表pH: {hoveredCell.ph}</span>
            <span className="text-sky-300 font-num">无机氮消减: {hoveredCell.dinCut}%</span>
          </div>
        ) : (
          <span className="text-slate-500 text-[10px] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            鼠标悬停任一海湾季节单元格查看微观水质富营养化指数与酸化参数
          </span>
        )}
      </div>
    </div>
  );
};
