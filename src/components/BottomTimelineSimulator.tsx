import React, { useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Calendar, 
  ShieldCheck, 
  TrendingUp, 
  Leaf, 
  Sparkles,
  Zap
} from 'lucide-react';

interface BottomTimelineSimulatorProps {
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  intervention: number;
  setIntervention: React.Dispatch<React.SetStateAction<number>>;
}

export const BottomTimelineSimulator: React.FC<BottomTimelineSimulatorProps> = ({
  year,
  setYear,
  intervention,
  setIntervention,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto playback of years
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setYear((prev) => {
          if (prev >= 2035) {
            setIsPlaying(false);
            return 2015;
          }
          return prev + 1;
        });
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, setYear]);

  // Year list from 2015 to 2035 with 5-year primary ticks
  const years = Array.from({ length: 21 }, (_, i) => 2015 + i);

  // Preset scenarios
  const applyPreset = (rate: number) => {
    setIntervention(rate);
  };

  return (
    <div className="relative z-30 h-20 w-full px-4 py-2 border-t border-cyan-500/20 bg-slate-950/90 backdrop-blur-md flex items-center justify-between gap-6 select-none">
      {/* Glow highlight line */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      {/* Zone 1: Year Playback & Timeline Scrubber */}
      <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-[420px]">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 hover:text-white transition-colors"
              title={isPlaying ? '暂停时空推演' : '播放2015-2035推演'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                  <span className="text-[11px]">暂停</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                  <span className="text-[11px]">时空推演</span>
                </>
              )}
            </button>

            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
              <Calendar className="w-3 h-3 text-cyan-400" />
              推演时段:
            </span>
            <span className="font-num text-sm font-bold text-cyan-300">
              {year} 年
            </span>
            {year > 2026 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                双碳预测模型
              </span>
            )}
            {year <= 2026 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                实测复核期
              </span>
            )}
          </div>

          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-3">
            <span>2015 (基准年)</span>
            <span>2030 (碳达峰)</span>
            <span>2035 (生态强省愿景)</span>
          </div>
        </div>

        {/* Custom Timeline Slider Rail */}
        <div className="relative flex items-center">
          <input
            type="range"
            min={2015}
            max={2035}
            step={1}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
          {/* Tick markers */}
          <div className="absolute top-3 inset-x-0 flex justify-between pointer-events-none px-1">
            {[2015, 2020, 2025, 2030, 2035].map((y) => (
              <span
                key={y}
                className={`text-[9px] font-mono transition-colors ${
                  year === y ? 'text-cyan-300 font-bold' : 'text-slate-500'
                }`}
              >
                {y}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="h-10 w-[1px] bg-slate-800 shrink-0" />

      {/* Zone 2: Ecological Restoration Intervention Slider */}
      <div className="w-[380px] flex flex-col justify-center gap-1 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200 text-[11px]">
              生态修复干预强度
            </span>
            <span className="text-[10px] text-slate-400">
              (互花米草清除 / 海草补植)
            </span>
          </div>
          <span className="font-num text-xs font-bold text-emerald-300">
            {intervention}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={intervention}
            onChange={(e) => setIntervention(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
          />
          <button
            onClick={() => setIntervention(85)}
            className="px-2 py-0.5 text-[10px] rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60 whitespace-nowrap"
          >
            高标准修复
          </button>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span>预设情景:</span>
          <button
            onClick={() => applyPreset(20)}
            className={`hover:text-emerald-300 transition-colors ${intervention === 20 ? 'text-emerald-400 underline font-semibold' : ''}`}
          >
            自然演替(20%)
          </button>
          <span>·</span>
          <button
            onClick={() => applyPreset(60)}
            className={`hover:text-emerald-300 transition-colors ${intervention === 60 ? 'text-emerald-400 underline font-semibold' : ''}`}
          >
            适度工程(60%)
          </button>
          <span>·</span>
          <button
            onClick={() => applyPreset(95)}
            className={`hover:text-emerald-300 transition-colors ${intervention === 95 ? 'text-emerald-400 underline font-semibold' : ''}`}
          >
            国家公园全面攻坚(95%)
          </button>
        </div>
      </div>

      <div className="h-10 w-[1px] bg-slate-800 shrink-0" />

      {/* Zone 3: Computed Delta Summary */}
      <div className="flex items-center gap-4 text-xs shrink-0">
        <div className="p-2 rounded bg-slate-900/80 border border-cyan-500/20 text-right">
          <span className="text-[10px] text-slate-400 block">推演蓝碳增量</span>
          <span className="font-num text-sm font-bold text-cyan-300">
            +{((year - 2015) * 4.8 + intervention * 0.42).toFixed(1)} 万吨
          </span>
        </div>

        <div className="p-2 rounded bg-slate-900/80 border border-emerald-500/20 text-right">
          <span className="text-[10px] text-slate-400 block">综合生态效益</span>
          <span className="font-num text-sm font-bold text-emerald-300">
            +{(intervention * 0.85).toFixed(0)}% 增益
          </span>
        </div>
      </div>
    </div>
  );
};
