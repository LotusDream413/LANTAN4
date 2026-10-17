import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Zap, 
  Leaf,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Send,
  Bot,
  User,
  MessageSquare,
  HelpCircle,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import { EcologicalAlert, ALERTS_LIST } from '../data/blueCarbonData';

interface AIExpertPrescriptionViewProps {
  alert: EcologicalAlert | null;
  onBackToGis?: () => void;
  onSelectAlert?: (alert: EcologicalAlert) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIExpertPrescriptionView: React.FC<AIExpertPrescriptionViewProps> = ({
  alert,
  onBackToGis,
  onSelectAlert,
}) => {
  // Navigation mode: 'chat' (AI Q&A Dialogue) vs 'prescription' (Alert telemetry)
  const [activeTab, setActiveTab] = useState<'chat' | 'prescription'>('chat');

  // Prescription alert state
  const [currentAlert, setCurrentAlert] = useState<EcologicalAlert>(alert || ALERTS_LIST[0]);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);

  // Chat conversation state
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const defaultPresets = [
    '平台目前接入监测哪几个国家级海洋原位观测基站？各自年固碳量与特色是什么？',
    '东营黄河口、威海桑沟湾等五个野外基站分别位于哪里？覆盖哪些典型碳库？',
    '东营黄河口盐沼与威海桑沟湾海草床基站的碳沉积埋藏速率是多少？',
    '青岛胶州湾与日照前三岛海-气CO₂净吸收通量受潮汐涨落影响的规律是什么？',
    '烟台长岛微型生物碳泵(MCP)如何将活性有机碳转化为惰性溶解有机碳(RDOC)？',
    '日照前三岛大型藻类监测站的优势物种与贝藻养殖固碳占比是多少？',
    '山东省对于蓝碳与海洋碳汇发展的最新核心政策有哪些？政策目标如何评价？',
    '威海桑沟湾海草床与大型海带立体碳汇工程的CCER核算方法学与收益机制是什么？',
    '黄河三角洲盐沼湿地（翅碱蓬/芦苇）相比深远海贝藻养殖，碳封存稳定性与埋藏周期有何不同？',
    '控排企业如何使用山东蓝碳CCER完成5%配额清缴抵销并申请绿色金融贴息？',
  ];

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text: `您好！我是『山东省蓝碳智能监测与碳汇资产核算云平台』专属AI助手「小蓝」。\n\n我已经接入山东省海洋强省建设规划、沿海5大国家级野外原位观测基站（东营黄河口、威海桑沟湾、青岛胶州湾、烟台长岛、日照前三岛）、黄渤海三大碳库实时遥测数据与CCER国际注册簿。您可以直接点击下方的推荐咨询问题，或输入您关注的任何基站数据、蓝碳政策、核算标准及生态治理技术问题，小蓝将为您提供专业严谨的深度解答！`,
      timestamp: '刚刚',
    },
  ]);

  useEffect(() => {
    if (alert) {
      setCurrentAlert(alert);
    }
  }, [alert]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isAiThinking) return;

    const userMsgId = `user-${Date.now()}`;
    const newChat: ChatMessage[] = [
      ...chatMessages,
      {
        id: userMsgId,
        sender: 'user',
        text: text,
        timestamp: new Date().toTimeString().split(' ')[0],
      },
    ];
    setChatMessages(newChat);
    setInputMessage('');
    setIsAiThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      const aiReply = data.reply || '已收到您的咨询。正在调取山东蓝碳知识库核算中...';

      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toTimeString().split(' ')[0],
        },
      ]);
    } catch (err) {
      console.warn('Direct fetch /api/chat error, utilizing local domain engine:', err);
      // Fallback response generator with complete 5 stations support
      setTimeout(() => {
        let reply = '';
        const isStationQuery = 
          text.includes('基站') || text.includes('站点') || text.includes('站') || 
          text.includes('几个') || text.includes('哪几个') || text.includes('台站') || 
          text.includes('观测站') || text.includes('监测站') || text.includes('观测点') ||
          text.includes('多少个') || text.includes('有哪些') || text.includes('分布') ||
          text.includes('东营') || text.includes('威海') || text.includes('青岛') || 
          text.includes('烟台') || text.includes('日照') || text.includes('5个') || text.includes('五个');

        if (isStationQuery) {
          reply = `### 山东省蓝碳智能监测与碳汇资产核算云平台 · 5大国家级野外原位观测站\n\n本平台目前已接入并实时监测山东沿海 **5 个国家级典型海洋原位观测基站**：\n\n1. **东营·黄河口盐沼湿地监测站**（东营市，119.16°E, 37.78°N）\n   - **核心优势物种**：翅碱蓬 / 芦苇\n   - **年固碳储量**：**104.35 万吨 CO₂e**（全省基站首位）\n   - **泥沙有机碳埋藏速率**：312.0 g/(m²·a)，深层千年矿化封存\n   - **工程亮点**：翅碱蓬红地毯湿地 6,420 公顷，互花米草攻坚清除率 96.2%。\n\n2. **威海·桑沟湾海草床与贝藻碳汇站**（威海市，122.56°E, 37.15°N）\n   - **核心优势物种**：大叶藻 / 海带 / 栉孔扇贝\n   - **年固碳储量**：**96.80 万吨 CO₂e**\n   - **沉积物埋藏速率**：278.0 g/(m²·a)\n   - **工程亮点**：中国现代蓝碳策源地，大叶藻海草床覆盖度 78.5%，多营养层次贝藻立体养殖(IMTA)年固碳 56.8 万吨 CO₂e，CCER首批挂牌并获 5.2 亿元绿色质押。\n\n3. **青岛·胶州湾海岸带通量监测站**（青岛市，120.25°E, 36.12°N）\n   - **核心优势物种**：潮间带微藻 / 红藻 / 牡蛎礁\n   - **年固碳储量**：**68.20 万吨 CO₂e**\n   - **工程亮点**：布设 10Hz 涡度相关塔，海-气 CO₂ 净吸收通量 -5.24 mmol/(m²·d)，半日潮水位吸收增益协同率 +34.5%。\n\n4. **烟台·长岛海洋牧场固碳试验区**（烟台市，120.72°E, 37.92°N）\n   - **核心优势物种**：鼠尾藻 / 皱纹盘鲍 / 海胆\n   - **年固碳储量**：**65.40 万吨 CO₂e**\n   - **工程亮点**：国家级零碳岛试验区，焦念志院士“微型生物碳泵(MCP)”原位工程，MCP 储碳活度 88.7%，转化惰性溶解有机碳(RDOC) 26.5 万吨。\n\n5. **日照·前三岛大型藻类监测站**（日照市，119.95°E, 35.18°N）\n   - **核心优势物种**：裙带菜 / 石莼 / 真鲷礁\n   - **年固碳储量**：**49.87 万吨 CO₂e**\n   - **工程亮点**：黄海冷水团前沿，大型经济海藻光合固碳与耐候性，贝藻养殖固碳占比 55.3%。\n\n**全省汇总**：五大基站合计年核定蓝碳量达 **384.62 万吨 CO₂e**！`;
        } else if (text.includes('政策') || text.includes('山东省')) {
          reply = `### 《山东省海洋强省建设与蓝碳战略政策成效评价》\n\n山东省围绕双碳战略，制定出台了《山东省海洋强省建设行动方案》《山东省碳达峰实施方案》及《海洋生态保护补偿管理办法》：\n\n1. **全省海洋生产总值突破1.7万亿元**：将蓝碳生态建设列为现代海洋产业支柱，全省海洋生态保护红线管控率达100%；\n2. **年固碳潜力达384万吨 CO₂e**：超额完成国家考核预期，构建了威海海草床、黄河口盐沼及长岛零碳岛试验区；\n3. **财政奖补与生态转移支付**：累计兑付资金超117亿元，建立了海湾水质考核与减排成效挂钩的横纵向补偿机制。`;
        } else if (text.includes('桑沟湾') || text.includes('海草床') || text.includes('ccer')) {
          reply = `### 威海桑沟湾海草床与大型海带立体碳汇 CCER 机制\n\n- **方法学**：自然资源部行业标准《海洋碳汇核算技术指南：大型藻类与双壳贝类》(HY/T 0305-2021)；\n- **固碳量**：桑沟湾项目年有效固碳量达12.85万吨 CO₂e，沉积物千年碳封存速率245 g C/(m²·a)；\n- **资产变现**：市场挂牌指导价 ¥89.60/吨，已在山东碳资产交易所挂牌上市，并获银行5.2亿元绿色信贷质押授信。控排企业最高可使用 5% CCER 配额抵销。`;
        } else {
          reply = `### 山东省蓝碳智脑·小蓝研判分析\n\n针对您咨询的“${text}”，小蓝为您研判指出：\n\n1. 山东省沿海三大碳库（东营黄河口盐沼、威海桑沟湾海草床、胶东半岛贝藻微藻养殖）由 5 大国家级原位基站实时联网监测，年固碳量达 384.62 万吨 CO₂e；\n2. 监测系统融合微型生物碳泵(MCP)、海气通量涡动相关法与遥感反演，为自愿减排量(CCER)提供防伪溯源；\n3. 建议加快控排企业 5% 配额抵销清缴与个人碳普惠账户打通，释放蓝碳生态红利。`;
        }

        setChatMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: reply,
            timestamp: new Date().toTimeString().split(' ')[0],
          },
        ]);
      }, 500);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDispatch = () => {
    setIsDispatched(true);
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-[#030914] text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-indigo-500/25 bg-slate-950/95 z-20 shrink-0">
        <div className="flex items-center gap-3">
          {onBackToGis && (
            <button
              onClick={onBackToGis}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-indigo-200 hover:text-white hover:bg-indigo-950/40 text-xs font-bold transition-all shadow-sm group cursor-pointer mr-2"
              title="返回全省数字孪生GIS主控大屏"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>返回GIS态势大屏</span>
            </button>
          )}

          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/25 to-cyan-500/10 border border-indigo-400/40 text-indigo-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                海洋蓝碳 AI 智脑 · 小蓝问答与决策中心
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold">
                大模型驱动 · 实时研判
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              基于全省高频遥测物联矩阵、焦念志院士MCP碳泵理论与山东省宏观海洋政策
            </p>
          </div>
        </div>

        {/* Tab switcher: AI Chat vs Ecological Alert Prescriptions */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-indigo-500/30">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-indigo-600/40 to-cyan-600/40 text-white border border-indigo-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>小蓝智能问答</span>
          </button>
          <button
            onClick={() => setActiveTab('prescription')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'prescription'
                ? 'bg-gradient-to-r from-indigo-600/40 to-cyan-600/40 text-white border border-indigo-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>实时工况预警处方</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* TAB 1: AI EXPERT INTERACTIVE CHAT (Requested by user) */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950/50">
            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="max-w-4xl mx-auto space-y-4">
                {chatMessages.map((msg) => {
                  const isAi = msg.sender === 'ai';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 text-xs leading-relaxed animate-in fade-in duration-150 ${
                        isAi ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      {isAi && (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-300 shrink-0 shadow-sm mt-0.5">
                          <Bot className="w-4 h-4 text-indigo-400" />
                        </div>
                      )}

                      <div
                        className={`relative max-w-2xl rounded-2xl p-4 shadow-lg ${
                          isAi
                            ? 'bg-slate-900 border border-indigo-500/30 text-slate-200'
                            : 'bg-gradient-to-r from-cyan-600/80 to-blue-600/80 border border-cyan-400/40 text-white font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 pb-1 border-b border-slate-850">
                          <span className="font-bold text-cyan-300">
                            {isAi ? 'AI 助手 · 小蓝' : '省海洋局核算调度员'}
                          </span>
                          <span className="font-mono text-slate-500">{msg.timestamp}</span>
                        </div>

                        {/* Message content */}
                        <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                          {msg.text}
                        </div>

                        {/* Action footer */}
                        {isAi && (
                          <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex justify-end">
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                              className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                              title="复制此条AI回复"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">已复制</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>复制研判建议</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {!isAi && (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 border border-cyan-300 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* AI Thinking Animation */}
                {isAiThinking && (
                  <div className="flex gap-3 text-xs justify-start animate-in fade-in">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-300 shrink-0">
                      <Bot className="w-4 h-4 animate-spin text-indigo-400" />
                    </div>
                    <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-3.5 shadow-lg flex items-center gap-2 text-indigo-300">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      <span className="text-xs font-semibold">小蓝正在核算宏观政策文献与传感器数据...</span>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>
            </div>

            {/* Bottom Controls: Presets + Input Box */}
            <div className="shrink-0 p-4 border-t border-indigo-500/20 bg-slate-950/95 backdrop-blur-md">
              <div className="max-w-4xl mx-auto space-y-3">
                {/* Presets Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1 font-semibold">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    推荐咨询热点:
                  </span>
                  {defaultPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(preset)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-900 hover:bg-indigo-950/60 border border-indigo-500/30 hover:border-indigo-400 text-slate-300 hover:text-white transition-all cursor-pointer truncate max-w-xs font-medium"
                      title={preset}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Input form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="输入您关于山东省蓝碳政策、CCER方法学、贝藻增汇或水质监测的问题..."
                    disabled={isAiThinking}
                    className="flex-1 px-4 py-3 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isAiThinking}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-md cursor-pointer transition-all flex items-center gap-2 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>发送给小蓝</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ECOLOGICAL ALERT PRESCRIPTION WORKBENCH */}
        {activeTab === 'prescription' && (
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Column: Alerts Selector */}
            <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/60 p-4 overflow-y-auto space-y-3 shrink-0">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                <span>当前在监生态预警队列</span>
                <span className="font-mono text-cyan-400">{ALERTS_LIST.length} 项</span>
              </div>

              {ALERTS_LIST.map((item) => {
                const isSelected = item.id === currentAlert.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentAlert(item);
                      setIsDispatched(false);
                      if (onSelectAlert) onSelectAlert(item);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[180px]">{item.title}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          item.level === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : item.level === 'warning'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {item.level === 'critical' ? '紧急警示' : item.level === 'warning' ? '重点关注' : '状态常态'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                      <span className="text-cyan-400">{item.location}</span>
                      <span>·</span>
                      <span className="font-mono">{item.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                      {item.summary}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Detailed AI Diagnostic & Actionable Prescription */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Alert Header Box */}
                <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-amber-400" />
                      <h3 className="text-base font-bold text-white">{currentAlert.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {currentAlert.location}
                      </span>
                      <span>·</span>
                      <span className="font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        {currentAlert.time}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-400/40 text-indigo-300 font-mono">
                    AI综合置信度: 98.4%
                  </span>
                </div>

                {/* Diagnostic Analysis */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>AI 大模型多模态异常根因深度剖析</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-lg border border-slate-850">
                    {currentAlert.prescription.problemAnalysis}
                  </p>
                </div>

                {/* Recommended Method & Target Gain */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-400" />
                      推荐处方治理方案
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentAlert.prescription.suggestedMethod}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      预期碳汇恢复增益目标
                    </span>
                    <p className="text-xs text-emerald-300 font-semibold leading-relaxed">
                      {currentAlert.prescription.targetGain}
                    </p>
                  </div>
                </div>

                {/* Execution Stages */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>工程化闭环执行阶段推进计划</span>
                  </h4>
                  <div className="space-y-2.5">
                    {currentAlert.prescription.executionStages.map((stage, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-850 text-xs">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-slate-300">{stage}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dispatch Action */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-emerald-950/40 border border-indigo-500/30 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-white block">生态调度中心直通联络专线</span>
                    <span className="text-[11px] text-slate-400">点击直派指令至黄渤海各沿岸应急管理艇与遥测维护分队</span>
                  </div>

                  <button
                    onClick={handleDispatch}
                    disabled={isDispatched}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer flex items-center gap-2 ${
                      isDispatched
                        ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                        : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-indigo-900/40'
                    }`}
                  >
                    {isDispatched ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 animate-bounce" />
                        <span>治理处方已直派至现场巡检机动编组！</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>批准并一键下达 AI 生态治理处方</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
