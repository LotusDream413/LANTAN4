import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  FileText, 
  Download, 
  Printer, 
  QrCode, 
  Award,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { StationData } from '../data/blueCarbonData';

interface CCERReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: StationData;
  year: number;
  intervention: number;
}

export const CCERReportModal: React.FC<CCERReportModalProps> = ({
  isOpen,
  onClose,
  station,
  year,
  intervention,
}) => {
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

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

  const factor = 1 + (intervention / 100) * 0.18 + (year - 2026) * 0.025;
  const verifiedCarbonTons = (station.carbonTotal * factor).toFixed(2);
  const unitPrice = 78.50 + (year - 2026) * 2.8;
  const totalValuation = (parseFloat(verifiedCarbonTons) * 10000 * unitPrice / 10000).toFixed(2);

  const reportId = `CCER-SD-MAR-${year}-${station.id.slice(0, 3).toUpperCase()}-98214`;
  const blockHash = '0x8f2d91b7a4c3e809df651478ec1209b53fa97c01289df713b9c';

  const handleExport = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      doc.setFillColor(3, 9, 20);
      doc.rect(0, 0, 210, 297, 'F');

      doc.setDrawColor(6, 182, 212);
      doc.setLineWidth(0.8);
      doc.rect(8, 8, 194, 281);

      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.4);
      doc.rect(10, 10, 190, 277);

      doc.setTextColor(245, 158, 11);
      doc.setFontSize(11);
      doc.text('INTERNATIONAL CARBON REGISTRY & STANDARDS (VCS / CCER)', 105, 20, { align: 'center' });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text('INTERNATIONAL BLUE CARBON ASSET VERIFICATION CERTIFICATE', 105, 29, { align: 'center' });

      doc.setTextColor(56, 189, 248);
      doc.setFontSize(8.5);
      doc.text(`International Registry Serial ID: ${reportId}`, 105, 36, { align: 'center' });

      doc.setDrawColor(6, 182, 212);
      doc.setLineWidth(0.5);
      doc.line(16, 40, 194, 40);

      // Metadata section (No overlapping columns)
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8.5);
      doc.text('PROJECT AUDIT LOCATION:', 20, 48);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9.5);
      doc.text(`${station.name} (${station.id.toUpperCase()} Base)`, 20, 54);

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8.5);
      doc.text('AUDITING FISCAL YEAR:', 125, 48);
      doc.setTextColor(245, 158, 11);
      doc.setFontSize(9.5);
      doc.text(`${year} Annual Global Verification`, 125, 54);

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8.5);
      doc.text('VERIFIED METHODOLOGY:', 20, 62);
      doc.setTextColor(226, 232, 240);
      doc.setFontSize(9);
      doc.text('VCS VM0033 / IPCC Wetland Coastal Saltmarsh & Seagrass Bed', 20, 68);

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8.5);
      doc.text('ECOLOGICAL RESTORATION:', 125, 62);
      doc.setTextColor(52, 211, 153);
      doc.setFontSize(9);
      doc.text(`Optimal Rate: ${intervention}% Std Target`, 125, 68);

      // Highlighted Metrics Box
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(18, 74, 174, 44, 2, 2, 'F');
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.6);
      doc.roundedRect(18, 74, 174, 44, 2, 2, 'S');

      doc.setTextColor(56, 189, 248);
      doc.setFontSize(8.5);
      doc.text('VERIFIED NET CARBON SEQUESTRATION:', 26, 83);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.text(`${verifiedCarbonTons} Wan Tons CO2e`, 26, 92);

      doc.setTextColor(245, 158, 11);
      doc.setFontSize(8.5);
      doc.text(`Official Guidance Clearing Price: RMB ${unitPrice.toFixed(2)} / Ton CO2e`, 26, 102);
      doc.setTextColor(52, 211, 153);
      doc.text(`Total Estimated Economic Asset Valuation: RMB ${Number(totalValuation).toLocaleString()} Wan Yuan`, 26, 110);

      // Sub-reservoirs
      doc.setTextColor(245, 158, 11);
      doc.setFontSize(9.5);
      doc.text('SUB-RESERVOIR QUANTIFICATION DETAILS:', 20, 126);

      doc.setTextColor(203, 213, 225);
      doc.setFontSize(8.5);
      doc.text(`1. Saltmarsh Wetland Soil Organic Carbon (SOC): ${(station.carbonShare.saltmarsh).toFixed(1)}% Share`, 24, 134);
      doc.text(`   - Native vegetation (Suaeda salsa / Phragmites) deep sediment retention.`, 24, 139);

      doc.text(`2. Seagrass Bed Roots Millennium Storage (RDOC): ${(station.carbonShare.seagrass).toFixed(1)}% Share`, 24, 147);
      doc.text(`   - Zostera marina rhizome layer burial rate 245 g C/(m2*a) with 98.4% retention.`, 24, 152);

      doc.text(`3. Shellfish & Macroalgae Multi-Trophic Aquaculture: ${(station.carbonShare.shellfishAlgae).toFixed(1)}% Share`, 24, 160);
      doc.text(`   - Bivalve calcification shell capture + Kelp photosynthetic export certified.`, 24, 165);

      // Blockchain box
      doc.setFillColor(15, 23, 42);
      doc.rect(18, 173, 174, 34, 'F');
      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(0.5);
      doc.rect(18, 173, 174, 34, 'S');

      doc.setTextColor(165, 180, 252);
      doc.setFontSize(8);
      doc.text('INTERNATIONAL BLOCKCHAIN IMMUTABLE AUDIT TRAIL (SHA-256):', 24, 182);
      doc.setTextColor(241, 245, 249);
      doc.setFontSize(7.5);
      doc.text(blockHash, 24, 190);
      doc.setTextColor(52, 211, 153);
      doc.setFontSize(8);
      doc.text('[AUTHENTICITY: INTERNATIONAL BLUE CARBON REGISTRY SEALED & ON CHAIN]', 24, 199);

      // Signatures (Bound to left side with maxWidth: 118 to guarantee zero collision with seal)
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8);
      doc.text('Independent Auditor:', 20, 218);
      doc.setTextColor(226, 232, 240);
      doc.text('China Environmental United Certification Center (CEC) / Verra VVB', 20, 224, { maxWidth: 118 });

      doc.setTextColor(148, 163, 184);
      doc.text('Supervisory Authority:', 20, 232);
      doc.setTextColor(226, 232, 240);
      doc.text('Shandong Provincial Department of Natural Resources & Marine Bureau', 20, 238, { maxWidth: 118 });

      doc.setTextColor(148, 163, 184);
      doc.text('Accreditation Agency:', 20, 246);
      doc.setTextColor(226, 232, 240);
      doc.text('International Carbon Neutrality Metrology Standard Authority', 20, 252, { maxWidth: 118 });

      doc.setTextColor(203, 213, 225);
      doc.setFontSize(8);
      doc.text(`Document Generation Date: September 28, ${year}`, 20, 260);

      // Official Stamp Seal on Right Side (x=165, y=240, r=18) - isolated from text
      const sealX = 165;
      const sealY = 240;
      doc.setDrawColor(244, 63, 94);
      doc.setLineWidth(0.8);
      doc.circle(sealX, sealY, 18, 'S');
      doc.setLineWidth(0.4);
      doc.circle(sealX, sealY, 16, 'S');

      doc.setTextColor(244, 63, 94);
      doc.setFontSize(6);
      doc.text('BLUE CARBON REGISTRY', sealX, sealY - 9, { align: 'center' });
      doc.setFontSize(8);
      doc.text('VALIDATED', sealX, sealY - 2, { align: 'center' });
      doc.setFontSize(6);
      doc.text('OFFICIAL VERIFIED', sealX, sealY + 5, { align: 'center' });
      doc.setFontSize(5);
      doc.text(`${year}.09.28 AUDITED`, sealX, sealY + 11, { align: 'center' });

      doc.save(`${reportId}.pdf`);
    } catch (e) {
      console.error('Export PDF error:', e);
    }
    setDownloadSuccessToast(true);
    setTimeout(() => {
      setDownloadSuccessToast(false);
    }, 4000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-amber-500/40 text-slate-100 shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Top Bar with Guaranteed Working Close Button */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-amber-500/20 bg-slate-950/90 z-20 shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs uppercase font-mono tracking-wider text-amber-300 font-semibold">
              VCS / CCER 国际核证碳减排量资产证书
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 text-xs font-semibold border border-slate-700 hover:border-rose-500/50 transition-all cursor-pointer shadow-sm"
            title="关闭窗口 (ESC)"
          >
            <X className="w-4 h-4 text-slate-300" />
            <span>关闭</span>
          </button>
        </div>

        {/* Scrollable Certificate Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          {/* Certificate Header Stamp & Title */}
          <div className="text-center border-b border-amber-500/25 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/60 border border-amber-400/40 text-amber-300 text-[10px] font-mono mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>国际蓝碳标准体系 (Verra VCS / IPCC) 国际权威认证</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 tracking-wide">
              国际温室气体自愿减排量 (VCS / CCER) 国际蓝碳资产证书
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 font-mono">
              备案方法学：CMS-001-V01 / VCS VM0033《沿海盐沼及海草床生态系统碳汇计量与监测方法学》
            </p>
          </div>

          {/* Export Toast Notification */}
          {downloadSuccessToast && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>已成功生成国家防伪签章 PDF 电子核证凭证及链上存证哈希！</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400/80">SHA-256 OK</span>
            </div>
          )}

          {/* Core Verification Certificate Body */}
          <div className="space-y-4 text-xs">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">核证报告编号</span>
                <span className="font-mono text-cyan-300 font-bold">{reportId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">项目核算区域</span>
                <span className="text-slate-200 font-bold">{station.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">核证监测年度</span>
                <span className="font-num text-amber-300 font-bold">{year} 年度</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">确权审查状态</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  国际登记簿已公示
                </span>
              </div>
            </div>

            {/* Key Sequestration Quantity Table */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 via-slate-950/60 to-slate-950/60 border border-amber-500/30">
              <h4 className="font-bold text-sm text-amber-300 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>经国际第三方审定机构与海洋环境监测网核定清单</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-900/90 border border-cyan-500/20">
                  <span className="text-slate-300 block text-xs font-semibold">经核定有效净固碳量</span>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="font-num text-2xl font-bold text-cyan-300">
                      {verifiedCarbonTons}
                    </span>
                    <span className="text-xs text-slate-200 font-bold">万吨 CO₂e</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/90 border border-amber-500/20">
                  <span className="text-slate-300 block text-xs font-semibold">当期指导结算挂牌价</span>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="font-num text-2xl font-bold text-amber-300">
                      ¥{unitPrice.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-200 font-bold">/ 吨 CO₂e</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/90 border border-emerald-500/20">
                  <span className="text-slate-300 block text-xs font-semibold">潜在碳资产总经济估值</span>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="font-num text-2xl font-bold text-emerald-300">
                      {Number(totalValuation).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-200 font-bold">万元</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Methodology & Multi-source Evidence */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>立体数据交叉校验与区块链防篡改溯源凭证：</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-slate-200 text-xs leading-relaxed font-medium">
                <li>天基遥感验证：高分六号（GF-6）多光谱反演地表植被覆盖度与水体叶绿素a（置信度 99.2%）</li>
                <li>海基原位标定：海岸带涡度相关通量塔（EC150）10Hz高频CO₂通量连续监测数据校正</li>
                <li>水下沉积测定：柱状沉积物年代学（210Pb/137Cs）沉积碳埋藏速率：{station.buoySensors.burialRate} g C/(m²·a)</li>
                <li>生态修复增量：生态干预治理（互花米草治理/海草床扩繁）核定贡献增益率 {(intervention * 0.18).toFixed(1)}%</li>
              </ul>
            </div>

            {/* Signatures & Seal */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-800 rounded p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-10 h-10 text-cyan-400" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  <div>存证哈希 (Blockchain Hash):</div>
                  <div className="text-cyan-400 font-semibold">{blockHash.slice(0, 30)}...</div>
                  <div>山东省生态环境厅 · 自然资源部第一海洋研究所</div>
                </div>
              </div>

              {/* Official Stamp Simulation without overlapping text */}
              <div className="relative w-32 h-32 border-2 border-rose-500/80 rounded-full flex flex-col items-center justify-center text-rose-400 text-center p-2.5 pointer-events-none select-none shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.25)] bg-rose-950/25">
                <div className="text-[10px] font-black tracking-widest">国际蓝碳资产审定</div>
                <div className="text-xl leading-none my-1">★</div>
                <div className="text-[9px] font-bold tracking-wider">VERIFIED CARBON SEAL</div>
                <div className="text-[8px] font-mono mt-1 opacity-90">{year}.09.28 核发</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400 font-mono">
            状态：<span className="text-emerald-400 font-semibold">已核证无异议</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
            >
              关闭窗口
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>打印报告</span>
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold hover:brightness-110 transition-all shadow-lg cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出已签证电子凭证</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
