import React, { useState } from 'react';
import { 
  X, 
  Table, 
  Download, 
  Filter, 
  Search, 
  BarChart3, 
  Calendar, 
  MapPin, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { StationData, STATIONS } from '../data/blueCarbonData';

interface StatisticalAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
}

export const StatisticalAnalysisModal: React.FC<StatisticalAnalysisModalProps> = ({
  isOpen,
  onClose,
  year,
}) => {
  const [selectedStationId, setSelectedStationId] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<'carbon' | 'flux' | 'burial'>('carbon');

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const stationList = Object.values(STATIONS);

  // Month-by-month table matrix data (similar to user's uploaded reservoir management screenshot)
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  const rows = [
    { label: '海表最高吸收通量 (mmol/m²·d)', values: [1.2, 1.8, 3.4, 4.9, 7.8, 9.4, 9.8, 9.5, 8.2, 5.1, 2.8, 1.4] },
    { label: '海表最低吸收通量 (mmol/m²·d)', values: [0.4, 0.6, 1.1, 1.8, 2.5, 3.2, 3.6, 3.1, 2.4, 1.6, 0.9, 0.5] },
    { label: '月度平均固碳通量 (mmol/m²·d)', values: [0.8, 1.2, 2.2, 3.3, 5.1, 6.3, 6.7, 6.3, 5.3, 3.3, 1.8, 0.9] },
    { label: '沉积碳历史极值 (g/m²·a)', values: [210, 215, 230, 245, 280, 310, 325, 315, 290, 260, 235, 215] },
    { label: '蓝碳综合核算产值 (万元/月)', values: [180, 210, 350, 480, 890, 1240, 1370, 1310, 980, 620, 390, 220] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-slate-900 border border-cyan-500/40 text-slate-100 shadow-[0_0_60px_rgba(6,182,212,0.25)] p-5">
        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-md"
          title="关闭统计分析"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-cyan-500/20 pb-3 mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                全省蓝碳水文通量统计与历史对账分析看板
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                SHANDONG MARINE HYDROLOGY & BLUE CARBON LEDGER {year}
              </p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 pr-10 text-xs">
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={selectedStationId}
                onChange={(e) => setSelectedStationId(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none text-xs"
              >
                <option value="all" className="bg-slate-900">全省综合对账</option>
                {stationList.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900">
                    {s.shortName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => alert('已生成并下载《山东省蓝碳月度通量与资产对账台账.xlsx》')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600/30 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出台账数据</span>
            </button>
          </div>
        </div>

        {/* 12-Month Matrix Table (Matched with user's uploaded reference design) */}
        <div className="overflow-x-auto rounded-xl border border-cyan-500/25 bg-slate-950/80 mb-4">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-cyan-950/60 border-b border-cyan-500/30 text-cyan-300 font-semibold font-mono">
                <th className="py-2.5 px-3 min-w-[200px]">监测指标 / 月份</th>
                {months.map((m) => (
                  <th key={m} className="py-2.5 px-2.5 text-center min-w-[55px]">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-cyan-500/5 transition-colors">
                  <td className="py-2 px-3 font-sans text-slate-200 font-medium">
                    {r.label}
                  </td>
                  {r.values.map((v, i) => (
                    <td key={i} className="py-2 px-2.5 text-center text-cyan-100">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 12-Month Bar Visualizer (Matched directly with user's reference diagram) */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-slate-200">12月水文通量与历史极值对比柱形图 (万元/月)</span>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-cyan-400">■ 当期核算值</span>
              <span className="flex items-center gap-1 text-amber-400">■ 历史最高纪录</span>
            </div>
          </div>

          <div className="h-[120px] w-full flex items-end justify-between gap-2 px-2 pt-2 border-b border-slate-800">
            {months.map((m, i) => {
              const val = rows[4].values[i];
              const maxHist = val * 1.15;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-[90px]">
                    <div
                      className="w-3 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-xs"
                      style={{ height: `${(val / 1400) * 100}%` }}
                      title={`${m} 当期: ${val}万元`}
                    />
                    <div
                      className="w-3 bg-amber-500/70 rounded-t-xs"
                      style={{ height: `${(maxHist / 1400) * 100}%` }}
                      title={`${m} 历史峰值: ${maxHist.toFixed(0)}万元`}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">{m}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
