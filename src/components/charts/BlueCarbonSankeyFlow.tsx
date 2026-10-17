import React, { useState } from 'react';
import { 
  GitBranch, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Coins, 
  Info,
  Maximize2,
  Filter
} from 'lucide-react';

interface SankeyNode {
  id: string;
  stage: 0 | 1 | 2 | 3;
  name: string;
  subname: string;
  value: number; // 万吨 CO2e
  share: number; // 阶段占比 %
  color: string;
  glowColor: string;
  description: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number; // 万吨 CO2e
  flowType: 'nature' | 'bio' | 'sink' | 'market' | 'fishery';
  description: string;
}

export const BlueCarbonSankeyFlow: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [highlightFlow, setHighlightFlow] = useState<'all' | 'ccer' | 'geological' | 'fishery'>('all');

  // Stage 0: Nature Influx (总输入 160.2 万吨)
  // Stage 1: Ecosystem Capture
  // Stage 2: Sinks & Storage Destination
  // Stage 3: Asset Capitalization & Flow

  const nodes: SankeyNode[] = [
    // Stage 0: 碳源汇输入
    {
      id: 'src_air',
      stage: 0,
      name: '海-气界面CO₂物理净吸收',
      subname: '大气溶入海水分压梯度驱动',
      value: 71.3,
      share: 44.5,
      color: '#06b6d4',
      glowColor: 'rgba(6,182,212,0.4)',
      description: '依托黄渤海冷水团和海气温差，大气CO₂通过物理溶解扩散进入表层海水，经碳酸盐平衡体系形成溶解无机碳(DIC)。',
    },
    {
      id: 'src_river',
      stage: 0,
      name: '黄河与陆源径流无机/有机碳',
      subname: '流域泥沙与冲积沉积输运',
      value: 32.8,
      share: 20.5,
      color: '#10b981',
      glowColor: 'rgba(16,185,129,0.4)',
      description: '黄河年均入海泥沙与淡水冲析输入大量颗粒有机碳(POC)与溶解有机碳(DOC)，在三角洲咸淡水交汇带快速絮凝沉积。',
    },
    {
      id: 'src_algae',
      stage: 0,
      name: '大型海藻与贝类生理固碳',
      subname: '人工多营养层级(IMTA)增汇',
      value: 56.1,
      share: 35.0,
      color: '#f59e0b',
      glowColor: 'rgba(245,158,11,0.4)',
      description: '海带、裙带菜等大型藻类利用高光合速率直接固定DIC，滤食性双壳贝类通过钙化外壳固定碳酸钙生物矿化。',
    },

    // Stage 1: 生态捕获中枢
    {
      id: 'cap_seagrass',
      stage: 1,
      name: '大叶藻海草床生态系统',
      subname: '威海成山头/荣成天鹅湖',
      value: 38.4,
      share: 24.0,
      color: '#06b6d4',
      glowColor: 'rgba(6,182,212,0.4)',
      description: '大叶藻密集根系阻滞近岸水流促沉悬浮颗粒碳，地下生物量长期处于厌氧潮间带，碳埋藏年限达数百年以上。',
    },
    {
      id: 'cap_saltmarsh',
      stage: 1,
      name: '黄河三角洲滨海盐沼湿地',
      subname: '东营柽柳/芦苇/盐地碱蓬',
      value: 42.6,
      share: 26.6,
      color: '#10b981',
      glowColor: 'rgba(16,185,129,0.4)',
      description: '全国最大暖温带滨海湿地，耐盐植被地下根系极其发达，高沉积淤积速率将大量有机碳永久封装于还原沉积层。',
    },
    {
      id: 'cap_imta',
      stage: 1,
      name: '浅海立体贝藻养殖综合体',
      subname: '威海桑沟湾/日照前三岛',
      value: 54.2,
      share: 33.8,
      color: '#f59e0b',
      glowColor: 'rgba(245,158,11,0.4)',
      description: '上层海带固碳、中层贝类滤食水质净化、下层海参底播增殖，形成“以藻促贝、以贝净水、协同增汇”高效立体碳循环。',
    },
    {
      id: 'cap_mcp',
      stage: 1,
      name: '微型生物碳泵 (MCP) 介质',
      subname: '长岛群岛与深水海区微生物',
      value: 25.0,
      share: 15.6,
      color: '#818cf8',
      glowColor: 'rgba(129,140,248,0.4)',
      description: '焦念志院士原创理论，海洋超微原核生物将活性有机碳转化为数百年不可被生物利用的惰性溶解有机碳(RDOC)。',
    },

    // Stage 2: 碳归宿与储存转化
    {
      id: 'dst_sediment',
      stage: 2,
      name: '深海潮滩沉积百年稳定埋藏',
      subname: '地质级厌氧还原碳库 (SOC)',
      value: 88.6,
      share: 55.3,
      color: '#10b981',
      glowColor: 'rgba(16,185,129,0.4)',
      description: '沉积物孔隙水处于强厌氧还原状态，抑制好氧异养呼吸，形成极难降解的稳定地质固碳层。',
    },
    {
      id: 'dst_rdoc',
      stage: 2,
      name: '海水惰性溶解有机碳 (RDOC)',
      subname: '超长半衰期海洋水体深存',
      value: 41.2,
      share: 25.7,
      color: '#818cf8',
      glowColor: 'rgba(129,140,248,0.4)',
      description: '经微型生物化学转化后的难降解分子，在深水冷水团中稳定封存长达数百至数千年。',
    },
    {
      id: 'dst_harvest',
      stage: 2,
      name: '水产捕捞移出碳与高值固化',
      subname: '贝壳碳酸钙与海藻多糖深加工',
      value: 30.4,
      share: 19.0,
      color: '#f59e0b',
      glowColor: 'rgba(245,158,11,0.4)',
      description: '收获移出水体避免水体二次分解释放，贝壳制备环保建材与土壤调理剂，实现永久碳固定。',
    },

    // Stage 3: 资产化流转与应用通道
    {
      id: 'val_ccer',
      stage: 3,
      name: '国家 CCER 注册簿核证签发',
      subname: '进入全国自愿减排量交易系统',
      value: 62.8,
      share: 39.2,
      color: '#10b981',
      glowColor: 'rgba(16,185,129,0.4)',
      description: '严格执行自然资源部 HY/T 0305 标准，完成第三方DOE核证并登记于国家CCER注册簿，直接面向全国碳市场变现。',
    },
    {
      id: 'val_offset',
      stage: 3,
      name: '重点排放单位 5% 配额抵销',
      subname: '电力/钢铁/石化行业履约降本',
      value: 44.6,
      share: 27.8,
      color: '#06b6d4',
      glowColor: 'rgba(6,182,212,0.4)',
      description: '为山东省内68家重点控排企业提供法定5%上限的CCER低成本对冲指标，平均为企业节支 18.2% 履约成本。',
    },
    {
      id: 'val_finance',
      stage: 3,
      name: '海洋碳汇预期收益权质押贷款',
      subname: '农发行/兴业银行绿色金融授信',
      value: 28.5,
      share: 17.8,
      color: '#f59e0b',
      glowColor: 'rgba(245,158,11,0.4)',
      description: '以未来3-5年经核证的蓝碳汇量作为增信资产，撬动金融机构海洋绿色基建与生态保护专项低息贷款。',
    },
    {
      id: 'val_inclusive',
      stage: 3,
      name: '“齐鲁蓝碳”全民碳普惠激励',
      subname: '个人减碳积分/生态研学研学消纳',
      value: 24.3,
      share: 15.2,
      color: '#a855f7',
      glowColor: 'rgba(168,85,247,0.4)',
      description: '联通“齐鲁碳普惠”小程序，吸纳公众绿色低碳出行积分认领滩涂红树林/海草床，惠及全省195万实名用户。',
    },
  ];

  // Flow links connecting stages
  const links: SankeyLink[] = [
    // Stage 0 -> Stage 1
    { source: 'src_air', target: 'cap_seagrass', value: 24.2, flowType: 'nature', description: '表层海水吸收CO₂供给海草床光合生长' },
    { source: 'src_air', target: 'cap_imta', value: 28.1, flowType: 'nature', description: '表层水体DIC被筏式养殖海带高密度吸收' },
    { source: 'src_air', target: 'cap_mcp', value: 19.0, flowType: 'nature', description: '开阔海域表层微藻与微型生物初级生产' },

    { source: 'src_river', target: 'cap_saltmarsh', value: 26.4, flowType: 'nature', description: '黄河泥沙颗粒有机碳在河口盐沼截留沉降' },
    { source: 'src_river', target: 'cap_seagrass', value: 6.4, flowType: 'nature', description: '近岸沿岸流运移养分促进海草群落扩展' },

    { source: 'src_algae', target: 'cap_imta', value: 26.1, flowType: 'bio', description: '养殖藻类同化与贝类外壳碳酸钙生物结晶' },
    { source: 'src_algae', target: 'cap_saltmarsh', value: 16.2, flowType: 'bio', description: '潮间带互花米草治理区替换为高汇盐地碱蓬' },
    { source: 'src_algae', target: 'cap_mcp', value: 6.0, flowType: 'bio', description: '微藻藻体自溶产生溶解有机物输入MCP反应器' },

    // Stage 1 -> Stage 2
    { source: 'cap_seagrass', target: 'dst_sediment', value: 28.4, flowType: 'sink', description: '海草地下根茎残体在厌氧潮下带永久封存' },
    { source: 'cap_seagrass', target: 'dst_rdoc', value: 10.0, flowType: 'sink', description: '海草淋溶释放难降解多酚与DOC长久留存' },

    { source: 'cap_saltmarsh', target: 'dst_sediment', value: 36.8, flowType: 'sink', description: '黄河口潮滩重盐碱厌氧还原深层地质埋藏' },
    { source: 'cap_saltmarsh', target: 'dst_rdoc', value: 5.8, flowType: 'sink', description: '沼泽渗流水体输入难生物利用腐殖质' },

    { source: 'cap_imta', target: 'dst_harvest', value: 28.4, flowType: 'fishery', description: '海带成品与贝壳碳酸钙采收移出海洋' },
    { source: 'cap_imta', target: 'dst_sediment', value: 16.2, flowType: 'sink', description: '贝类生物沉积物与藻体碎屑沉底矿化' },
    { source: 'cap_imta', target: 'dst_rdoc', value: 9.6, flowType: 'sink', description: '大型藻类快速生长释放顽固性多糖溶解物' },

    { source: 'cap_mcp', target: 'dst_rdoc', value: 18.2, flowType: 'sink', description: '噬菌体裂解细菌生成的RDOC在冷水团封存' },
    { source: 'cap_mcp', target: 'dst_sediment', value: 6.8, flowType: 'sink', description: '原核颗粒聚合形成海洋雪加速下沉埋藏' },

    // Stage 2 -> Stage 3 (Asset Flow)
    { source: 'dst_sediment', target: 'val_ccer', value: 42.6, flowType: 'market', description: '经第三方核查具备额外性且基线明确的沉积汇' },
    { source: 'dst_sediment', target: 'val_finance', value: 20.5, flowType: 'market', description: '基于稳定沉积碳储量质押获得长期绿贷授信' },
    { source: 'dst_sediment', target: 'val_inclusive', value: 14.5, flowType: 'market', description: '划定公众认领保护区换算齐鲁个人碳积分' },
    { source: 'dst_sediment', target: 'val_offset', value: 11.0, flowType: 'market', description: '部分核定配额直接供给控排电厂协议抵销' },

    { source: 'dst_rdoc', target: 'val_ccer', value: 12.2, flowType: 'market', description: '长岛MCP示范工程核准入国家自愿减排新方法学' },
    { source: 'dst_rdoc', target: 'val_offset', value: 21.0, flowType: 'market', description: '海洋惰性碳深存指标优先用于石化重工达峰冲抵' },
    { source: 'dst_rdoc', target: 'val_finance', value: 8.0, flowType: 'market', description: '科技创新型海洋碳汇信托凭证发行支撑' },

    { source: 'dst_harvest', target: 'val_ccer', value: 8.0, flowType: 'market', description: '贝藻移出碳国际标准核算注册资产' },
    { source: 'dst_harvest', target: 'val_offset', value: 12.6, flowType: 'market', description: '地方重点控排企业专项履约清缴采购' },
    { source: 'dst_harvest', target: 'val_inclusive', value: 9.8, flowType: 'market', description: '向高校与公众开放海洋牧场碳积分兑换' },
  ];

  // Stage column definitions with coordinates
  const stageTitles = [
    { stage: 0, title: '阶段一：自然碳源与通量输入', total: '160.2 万吨', color: 'text-cyan-400' },
    { stage: 1, title: '阶段二：生态系统捕获中枢', total: '160.2 万吨', color: 'text-emerald-400' },
    { stage: 2, title: '阶段三：碳归宿与储存转化', total: '160.2 万吨', color: 'text-amber-400' },
    { stage: 3, title: '阶段四：资产化流转与应用通道', total: '160.2 万吨', color: 'text-purple-400' },
  ];

  // Filter links based on user selection
  const isLinkActive = (l: SankeyLink) => {
    if (selectedNode) {
      return l.source === selectedNode || l.target === selectedNode;
    }
    if (highlightFlow === 'ccer') return l.target === 'val_ccer' || l.source === 'val_ccer';
    if (highlightFlow === 'geological') return l.target === 'dst_sediment' || l.source === 'dst_sediment';
    if (highlightFlow === 'fishery') return l.flowType === 'fishery' || l.source === 'src_algae' || l.target === 'cap_imta';
    return true;
  };

  const selectedNodeObj = nodes.find(n => n.id === selectedNode);

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/30 to-emerald-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.35)]">
            <GitBranch className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                山东省黄渤海蓝碳全景通量流向与价值流转桑基图 (Blue Carbon Flux & Asset Sankey Flow)
              </h3>
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono">
                全省总通量 160.2 万吨 CO₂e
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              严格遵循 IPCC 湿地清单指南与自然资源部 HY/T 0305-2021 · 展现自然通量输入至资产化终端的全链路闭环
            </p>
          </div>
        </div>

        {/* Quick highlight toggle filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
          <span className="text-slate-500 px-2 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            通道过滤:
          </span>
          {[
            { id: 'all', label: '全景总览' },
            { id: 'ccer', label: 'CCER国家登记通道' },
            { id: 'geological', label: '沉积地质封存通道' },
            { id: 'fishery', label: '贝藻碳汇渔业通道' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                setHighlightFlow(f.id as any);
                setSelectedNode(null);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                highlightFlow === f.id && !selectedNode
                  ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Stage Columns Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        {stageTitles.map((st) => (
          <div key={st.stage} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <span className={`font-bold ${st.color}`}>{st.title}</span>
            <span className="font-mono text-slate-300 font-semibold">{st.total}</span>
          </div>
        ))}
      </div>

      {/* Main Interactive Sankey Matrix Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((stageIdx) => {
          const stageNodes = nodes.filter((n) => n.stage === stageIdx);
          return (
            <div key={stageIdx} className="space-y-2.5 flex flex-col justify-start">
              {stageNodes.map((node) => {
                const isSelected = selectedNode === node.id;
                const isDimmed = selectedNode && selectedNode !== node.id && !links.some(l => 
                  (l.source === selectedNode && l.target === node.id) ||
                  (l.target === selectedNode && l.source === node.id)
                );

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(isSelected ? null : node.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer select-none relative group ${
                      isSelected
                        ? 'border-white bg-slate-800 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.02] z-10'
                        : isDimmed
                        ? 'opacity-40 bg-slate-950/60 border-slate-850 hover:opacity-80'
                        : 'bg-slate-950/90 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900'
                    }`}
                    style={{
                      borderLeftWidth: '4px',
                      borderLeftColor: node.color,
                    }}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-bold text-xs text-white group-hover:text-cyan-200 transition-colors">
                        {node.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-300 shrink-0">
                        {node.value} 万吨
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 line-clamp-1 mb-2">
                      {node.subname}
                    </div>

                    {/* Stage share progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${node.share}%`,
                          backgroundColor: node.color,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
                      <span>阶段权重: {node.share}%</span>
                      <span className="text-cyan-400 group-hover:underline">点击查看链路</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Selected Node or Flow Inspector Bar */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
        {selectedNodeObj ? (
          <div className="space-y-2 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedNodeObj.color }} />
                <span className="font-bold text-sm text-white">当前选中节点：{selectedNodeObj.name}</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[11px]">
                  通量: {selectedNodeObj.value} 万吨 CO₂e ({selectedNodeObj.share}%)
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 cursor-pointer"
              >
                重置查看全景
              </button>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-cyan-300">机理与核算依据：</strong>
              {selectedNodeObj.description}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                提示：点击任意节点方块，可瞬时点亮该节点在上下游各阶段的全部通量输入与流向归宿分支；亦可通过右上角快捷键筛选 CCER / 沉积封存 / 碳汇渔业。
              </span>
            </div>
            <span className="text-emerald-400 font-mono shrink-0">
              数据源：自然资源部北海局监测中心 & 山东省海洋局
            </span>
          </div>
        )}
      </div>

      {/* Summary KPI Footnotes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-850">
          <span className="text-slate-400 text-[10px] block">年度海气净吸收总通量</span>
          <span className="font-num text-sm font-bold text-cyan-300">160.20 万吨 CO₂e</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-850">
          <span className="text-slate-400 text-[10px] block">百年尺度深海沉积封存率</span>
          <span className="font-num text-sm font-bold text-emerald-300">55.3% (88.6万吨)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-850">
          <span className="text-slate-400 text-[10px] block">国家 CCER 转化备案核发量</span>
          <span className="font-num text-sm font-bold text-purple-300">62.80 万吨 (¥4,929.8万)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-850">
          <span className="text-slate-400 text-[10px] block">控排企业低成本履约冲抵节支</span>
          <span className="font-num text-sm font-bold text-amber-300">¥780.5 万元 (44.6万吨)</span>
        </div>
      </div>
    </div>
  );
};
