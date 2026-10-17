import React from 'react';
import { Layers, Fish, Sparkles, Anchor } from 'lucide-react';

export const BioCarbonVerticalProfile: React.FC = () => {
  const depthLayers = [
    {
      depth: '0 - 5 米',
      title: '表层透光带 · 大型经济海藻光合固碳层',
      species: '海带 (Saccharina) / 裙带菜 / 龙须菜',
      mechanism: '强烈光合作用高效吸收溶解无机碳(DIC)，年固碳 112.7 万吨 CO₂e',
      rate: '1.85 tCO₂e/ha·a',
      color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      depth: '5 - 15 米',
      title: '中层水体带 · 滤食性双壳贝类净水与钙化层',
      species: '栉孔扇贝 / 太平洋牡蛎 / 贻贝',
      mechanism: '滤食悬浮有机颗粒与浮游微藻，外壳碳酸钙生物矿化永久固定 100.6 万吨碳',
      rate: '0.98 tCO₂e/ha·a (以贝净水93.5亿吨)',
      color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300',
      badgeColor: 'bg-cyan-500/20 text-cyan-300',
    },
    {
      depth: '15 - 30 米',
      title: '次深水层 · 微型生物碳泵 (MCP) 惰性碳沉降',
      species: '海洋超微原核生物 / 噬菌体裂解产物 (RDOC)',
      mechanism: '将可利用溶解有机碳转化为数百年难以微生物降解的惰性有机碳库(RDOC)',
      rate: '0.28 tCO₂e/ha·a (年汇量21.8万吨)',
      color: 'border-indigo-500/50 bg-indigo-950/20 text-indigo-300',
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
    },
    {
      depth: '30 米以下底质',
      title: '深海海底带 · 沉积物千年地质埋藏碳库 (SOC)',
      species: '大叶藻海草床根系沉积 / 贝壳生物残体碎屑 / 潮滩泥沙',
      mechanism: '厌氧还原环境下隔绝氧气矿化，形成百年至千年尺度的稳定地质沉积碳封存',
      rate: '268.4 g C/(m²·a) (稳定埋藏)',
      color: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
  ];

  return (
    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-slate-100 tracking-wide">
            山东黄渤海近海多营养层级 (IMTA) 立体水深固碳剖面图
          </h4>
        </div>
        <span className="text-[10px] text-cyan-400 font-mono">
          焦念志院士MCP理论 / 唐启升院士碳汇渔业
        </span>
      </div>

      <div className="space-y-2.5">
        {depthLayers.map((layer, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl border transition-all hover:scale-[1.01] ${layer.color}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${layer.badgeColor}`}>
                  深度: {layer.depth}
                </span>
                <span className="text-xs font-bold text-white">{layer.title}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-300">
                通量指标: {layer.rate}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              代表物种与载体：<span className="text-white font-semibold">{layer.species}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              生物化学过程：{layer.mechanism}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
