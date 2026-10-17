import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Zap,
  Leaf
} from 'lucide-react';
import { EcologicalAlert } from '../data/blueCarbonData';

interface AIExpertPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: EcologicalAlert | null;
}

export const AIExpertPrescriptionModal: React.FC<AIExpertPrescriptionModalProps> = ({
  isOpen,
  onClose,
  alert,
}) => {
  const [isDispatched, setIsDispatched] = useState(false);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsDispatched(false);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !alert) return null;

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsDispatched(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-slate-900 border border-emerald-500/40 text-slate-100 shadow-[0_0_50px_rgba(16,185,129,0.2)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button with High Z-Index & Cursor Pointer */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-md cursor-pointer"
          title="关闭处方窗口"
        >
          <X className="w-5 h-5 pointer-events-none" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-emerald-500/25 pb-4 mb-4 pr-8">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">
                AI 小蓝 · 生态靶向修复决策处方
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                AI-DIAGNOSTIC VER 4.2
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              基于空天地海多源时空数据深度研判与海洋碳汇生态动力学模拟
            </p>
          </div>
        </div>

        {isDispatched && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>工单派发成功！无人机巡查机巢与海岸带修复工程作业队已实时接收电子指令。</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">DISPATCHED #OK</span>
          </div>
        )}

        {/* Content Body */}
        <div className="space-y-4 text-xs">
          {/* Alert Title Banner */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{alert.location}</span>
                <span>·</span>
                <span className="font-mono text-slate-400">{alert.time}</span>
              </div>
              <h3 className="text-sm font-bold text-cyan-300">
                {alert.title}
              </h3>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                alert.level === 'critical'
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  : alert.level === 'warning'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {alert.level === 'critical' ? '严重态势' : alert.level === 'warning' ? '重点预警' : '常态窗口'}
            </span>
          </div>

          {/* Section 1: Ecological Mechanism Analysis */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <h4 className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5 text-emerald-400">
              <ShieldAlert className="w-4 h-4" />
              <span>生态机理与致险成因分析</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {alert.prescription.problemAnalysis}
            </p>
          </div>

          {/* Section 2: AI Recommended Prescription */}
          <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/35">
            <h4 className="font-bold text-emerald-300 mb-1.5 flex items-center gap-1.5 text-xs">
              <Leaf className="w-4 h-4" />
              <span>靶向工程治理与生态置换方案</span>
            </h4>
            <p className="text-slate-200 leading-relaxed text-[11px]">
              {alert.prescription.suggestedMethod}
            </p>
          </div>

          {/* Section 3: Three-Stage Roadmap */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>精准推进执行阶段与作业时序</span>
            </h4>
            <div className="space-y-1.5">
              {alert.prescription.executionStages.map((stage, idx) => (
                <div key={idx} className="flex items-start gap-2 p-1.5 rounded bg-slate-900/60">
                  <span className="font-num text-[11px] font-bold text-cyan-400 shrink-0">
                    0{idx + 1}.
                  </span>
                  <span className="text-slate-300 text-[11px] leading-relaxed">
                    {stage}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Target Blue Carbon Gain */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-cyan-500/25">
              <span className="text-slate-400 block text-[10px]">预计预期增汇增量</span>
              <div className="text-xs font-semibold text-cyan-300 mt-0.5 leading-snug">
                {alert.prescription.targetGain}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-emerald-500/25">
              <span className="text-slate-400 block text-[10px]">综合生态效益</span>
              <div className="text-xs font-semibold text-emerald-300 mt-0.5 leading-snug">
                {alert.prescription.ecologicalBenefit}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors cursor-pointer"
          >
            关闭处方
          </button>
          <button
            type="button"
            onClick={() => {
              setIsDispatched(true);
              setTimeout(() => {
                handleClose();
              }, 1600);
            }}
            disabled={isDispatched}
            className="flex items-center gap-1.5 px-4 py-2 rounded bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors shadow-lg disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isDispatched ? '电子工单已派发' : '采纳处方并派发生态工单'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
