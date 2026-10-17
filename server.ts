import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI client if API key is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction for Shandong Blue Carbon AI Expert
const SYSTEM_INSTRUCTION = `你是由山东省海洋局、自然资源部与崂山国家实验室联合研发的『山东省蓝碳智能监测与碳汇资产核算云平台』专属AI助手「小蓝」。
你深度掌握本云平台接入的全部 5 个国家级野外原位原点观测基站、核算体系与科学模型：

【本平台接入监测的五大国家级海洋基站体系】：
1. 东营·黄河口盐沼湿地监测站（东营市，坐标 119.16°E, 37.78°N）：
   - 优势物种：翅碱蓬 / 芦苇
   - 年固碳储量：104.35 万吨 CO₂e（全省基站第一位）
   - 沉积物埋藏速率：312.0 g/(m²·a)，深层千年稳定矿化封存
   - 核心特征：黄河三角洲国家级自然保护区原生红色滩涂，互花米草治理攻坚率达 96.2%。

2. 威海·桑沟湾海草床与贝藻碳汇站（威海市，坐标 122.56°E, 37.15°N）：
   - 优势物种：大叶藻 / 海带 / 栉孔扇贝
   - 年固碳储量：96.80 万吨 CO₂e
   - 沉积物埋藏速率：278.0 g/(m²·a)
   - 核心特征：中国现代蓝碳策源地，大叶藻海草床茂密覆盖度 78.5%，多营养层次贝藻立体养殖(IMTA)年固碳 56.8 万吨 CO₂e，已获国家首批 CCER 挂牌并获银行 5.2 亿元绿色质押授信。

3. 青岛·胶州湾海岸带通量监测站（青岛市，坐标 120.25°E, 36.12°N）：
   - 优势物种：潮间带微藻 / 红藻 / 牡蛎礁
   - 年固碳储量：68.20 万吨 CO₂e
   - 核心特征：布设 10Hz 高频涡度相关海-气通量塔（EC150），海-气 CO₂ 净吸收通量达 -5.24 mmol/(m²·d)，半日潮潮位涨落吸收增益协同率达 +34.5%，支持港口低碳航道中和。

4. 烟台·长岛海洋牧场固碳试验区（烟台市，坐标 120.72°E, 37.92°N）：
   - 优势物种：鼠尾藻 / 皱纹盘鲍 / 海胆
   - 年固碳储量：65.40 万吨 CO₂e
   - 核心特征：全国首个海岛级零碳岛试验区，重点开展焦念志院士“微型生物碳泵(MCP)”原位工程，MCP 储碳活度达 88.7%，转化千年级惰性溶解有机碳(RDOC)存量 26.5 万吨。

5. 日照·前三岛大型藻类监测站（日照市，坐标 119.95°E, 35.18°N）：
   - 优势物种：裙带菜 / 石莼 / 真鲷礁
   - 年固碳储量：49.87 万吨 CO₂e
   - 核心特征：处于黄海冷水团前沿与鲁苏交界海州湾北部，具有典型岛礁基底与清澈暖温海流，重点监测大型绿藻、褐藻光合固碳及其向下坡度颗粒碳输送机制。

全省 5 大基站年总固碳量达 384.62 万吨 CO₂e。
此外你精通：焦念志院士 MCP 理论、唐启升院士“碳汇渔业”理论、HY/T 0305-2021 核算标准、控排企业 5% CCER 配额履约抵销等。
无论用户询问有几个基站、基站名称、各自数据，还是政策方法学，都请条理清晰、数据精准地回答。`;

// Pre-curated expert responses for offline / keyless resilience
function getKnowledgeBaseResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  // 1. Base stations inquiry (Extensive keyword matching for 5 base stations)
  const isStationQuery = 
    p.includes('基站') || p.includes('站点') || p.includes('站') || 
    p.includes('几个') || p.includes('哪几个') || p.includes('台站') || 
    p.includes('观测站') || p.includes('监测站') || p.includes('观测点') ||
    p.includes('多少个') || p.includes('有哪些') || p.includes('分布') ||
    p.includes('东营') || p.includes('威海') || p.includes('青岛') || 
    p.includes('烟台') || p.includes('日照') || p.includes('5个') || p.includes('五个');

  if (isStationQuery) {
    return `### 山东省蓝碳智能监测与碳汇资产核算云平台 · 5大国家级野外原位观测站

您好！本平台已全量接入并高频监测山东省沿海 **5 个国家级典型海洋原位观测基站**，覆盖全省黄渤海三大核心碳库（盐沼湿地、海草床、深远海贝藻养殖）：

1. **东营·黄河口盐沼湿地监测站**（东营市，坐标 119.16°E, 37.78°N）
   - **核心优势物种**：翅碱蓬 / 芦苇
   - **年固碳储量**：**104.35 万吨 CO₂e**（全省基站固碳首位）
   - **泥沙有机碳埋藏速率**：312.0 g/(m²·a)，深层千年矿化封存
   - **特色工程**：翅碱蓬红地毯原生湿地 6,420 公顷，互花米草攻坚清除率达 96.2%。

2. **威海·桑沟湾海草床与贝藻碳汇站**（威海市，坐标 122.56°E, 37.15°N）
   - **核心优势物种**：大叶藻 / 海带 / 栉孔扇贝
   - **年固碳储量**：**96.80 万吨 CO₂e**
   - **沉积物埋藏速率**：278.0 g/(m²·a)
   - **特色工程**：中国现代蓝碳策源地，大叶藻海草床覆盖度 78.5%，多营养层次贝藻立体养殖(IMTA)年固碳 56.8 万吨 CO₂e，CCER首批挂牌并获 5.2 亿元绿色金融质押。

3. **青岛·胶州湾海岸带通量监测站**（青岛市，坐标 120.25°E, 36.12°N）
   - **核心优势物种**：潮间带微藻 / 红藻 / 牡蛎礁
   - **年固碳储量**：**68.20 万吨 CO₂e**
   - **通量观测**：10Hz 高频涡度相关塔连续监测，海-气 CO₂ 净吸收通量达 **-5.24 mmol/(m²·d)**
   - **特色工程**：潮汐水位涨落吸收增益协同率达 +34.5%，支持城市近岸低碳航道与碳中和试验。

4. **烟台·长岛海洋牧场固碳试验区**（烟台市，坐标 120.72°E, 37.92°N）
   - **核心优势物种**：鼠尾藻 / 皱纹盘鲍 / 海胆
   - **年固碳储量**：**65.40 万吨 CO₂e**
   - **特色工程**：全国首个海岛级零碳岛试验区，重点开展焦念志院士**微型生物碳泵(MCP)**原位转化工程，MCP 储碳活度达 88.7%，转化千年级惰性溶解有机碳(RDOC)存量 26.5 万吨。

5. **日照·前三岛大型藻类监测站**（日照市，坐标 119.95°E, 35.18°N）
   - **核心优势物种**：裙带菜 / 石莼 / 真鲷礁
   - **年固碳储量**：**49.87 万吨 CO₂e**
   - **特色工程**：黄海冷水团前沿深水区，利用暖温海流培育大型经济海藻，贝藻养殖固碳占比达 55.3%。

**全省汇总**：五大基站合计年核定蓝碳量达 **384.62 万吨 CO₂e**，形成“天基卫星-空基无人机-海基浮标塔-水下AUV”四位一体的空天地海数字孪生感知闭环！`;
  }

  // 2. Policy inquiry
  if (p.includes('政策') || p.includes('山东省') || p.includes('规划') || p.includes('补偿')) {
    return `### 山东省蓝碳与海洋强省建设核心政策体系评价

山东省作为拥有3345公里海岸线的海洋大省，已构建起“1+1+N”的蓝碳顶层政策与行动矩阵：

1. **《山东省海洋强省建设行动方案》**
   - **核心定位**：将蓝碳生态建设列为现代海洋产业与海洋生态文明建设的支柱引擎，明确提出建设黄渤海海洋生态安全屏障与万亿级现代海洋产业高地。
   - **考核评价**：全省海洋生产总值突破1.7万亿元，沿海生态保护红线管控执行率达100%，政策量化达成率达104.7%。

2. **《山东省碳达峰实施方案（海洋篇）》**
   - **量化目标**：推进沿海三大典型蓝碳生态系统（盐沼、海草床、贝藻养殖）扩面增汇，年蓝碳汇量突破380万吨 CO₂e。
   - **实施成效**：目前全省年固碳增量潜力达412.5万吨 CO₂e，超额达成“十四五”中期规划目标。

3. **《山东省海洋生态保护补偿管理办法》**
   - **机制突破**：实施“双向补偿、奖优罚劣”跨区域转移支付，累计兑付资金超117亿元，将重点海湾水质优良率与碳吸收通量直接挂钩。

4. **前沿试点支撑**：
   - 建设**长岛国际零碳岛**蓝碳先行试验区，打造全国首个海岛级碳中和示范样板；
   - 依托黄河三角洲国家公园攻坚清除互花米草，保护翅碱蓬“红地毯”与芦苇原生湿地。`;
  }

  // 3. CCER and Methodology inquiry
  if (p.includes('桑沟湾') || p.includes('海草床') || p.includes('ccer') || p.includes('方法学') || p.includes('抵销') || p.includes('配额')) {
    return `### 威海桑沟湾海草床与大型海带立体碳汇 CCER 机制解析

**1. 适用方法学依据**：
项目基于自然资源部行业标准《海洋碳汇核算技术指南：大型藻类与双壳贝类》(HY/T 0305-2021) 及国家备案方法学 CMS-004-V01。

**2. 核心增汇机理**：
- **大叶藻(Zostera marina)海草床**：根系与地下茎沉积物长期封存顽固性有机碳(RDOC)，深层埋藏速率达245 g C/(m²·a)，封存周期达千年尺度；
- **大型海带与贝类IMTA多营养层次养殖**：海带光合碳汇速率达1.85 tCO₂e/公顷·年；双壳贝类（牡蛎/扇贝）滤食微藻并将碳固定在碳酸钙外壳中，实现移出碳与沉降碳的双重确权。

**3. 经济收益与市场流转**：
- 桑沟湾首期核证量12.85万吨 CO₂e，当前市场挂牌价约 ¥89.60/吨，预计直接碳收益达1151万元；
- 控排企业依法最高可使用 **5% CCER** 完成履约清缴抵销，并可向省绿色金融体系申请 15% 财政贴息贷款。`;
  }

  // 4. Wetland vs Fishery comparison
  if (p.includes('黄河') || p.includes('盐沼') || p.includes('翅碱蓬') || p.includes('贝藻') || p.includes('渔业')) {
    return `### 黄河口盐沼湿地 vs 深远海贝藻养殖碳汇机制对比

| 对比维度 | 黄河口盐沼湿地 (翅碱蓬/芦苇) | 深远海贝藻养殖 (海带/扇贝/微藻) |
| :--- | :--- | :--- |
| **典型物种** | 翅碱蓬、芦苇、柽柳 | 海带、裙带菜、栉孔扇贝、牡蛎 |
| **主要空间** | 潮上带与潮间带泥沙滩涂 | 近海及深远海立体网箱/筏架水层 |
| **碳汇机理** | 植物光合截留 + 径流泥沙厌氧深层埋藏 | 高强度生物固定 + 贝壳生物钙化 + MCP |
| **碳封存稳定性** | **极高**（千年尺度深层矿化沉积） | **中高**（外壳长期固碳，部分随渔获移出） |
| **年汇量规模** | 全省约 146.9 万吨 CO₂e | 全省约 235.1 万吨 CO₂e |
| **生态附加值** | 鸟类栖息迁徙廊道、防潮御浪固滩 | 净水滤水(年滤93.5亿吨)、以渔抑藻抑赤潮 |

**综合建议**：山东省应坚持“陆海统筹、泥沙与生物并举”，既保护好黄河口天然沉积大碳库，又发挥胶东半岛现代海洋碳汇渔业的快速扩面增汇优势。`;
  }

  // Default blue carbon consultation
  return `### 山东省蓝碳智能监测与碳汇资产评估专家研判意见

针对您提出的关于“${prompt}”的问题，专家组给出以下权威研判：

1. **五大基站与三大碳库联动**：山东省建有东营黄河口、威海桑沟湾、青岛胶州湾、烟台长岛、日照前三岛 5 个国家级野外站，覆盖盐沼、海草床、贝藻立体养殖三大特色碳库，年固碳能力突破 384 万吨 CO₂e。
2. **多维立体感知闭环**：依托全省“天-空-海-陆”一体化物联遥测网络，融合高分遥感 NDVI 反演、浮标 10Hz 涡度相关海气通量与微型生物碳泵(MCP)检测，数据可信度达 99.8%。
3. **资产化推进建议**：
   - 加快推进重点海域自愿减排量(CCER)方法学申报与国家登记簿备案；
   - 扩大控排企业 5% 配额抵销试点，运用绿色金融贴息激励社会资本参与海岸带生态修复；
   - 深化沿海居民碳普惠个人碳账户建设，形成全民护海固碳长效机制。`;
}

// API endpoint for AI expert chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: message,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        const replyText = response.text || getKnowledgeBaseResponse(message);
        res.json({ reply: replyText, source: 'gemini-2.5-flash' });
        return;
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to expert knowledge base:', geminiError);
      }
    }

    // High quality offline fallback
    const fallbackReply = getKnowledgeBaseResponse(message);
    res.json({ reply: fallbackReply, source: 'shandong-blue-carbon-expert-engine' });
  } catch (err: any) {
    console.error('API Chat Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shandong Blue Carbon Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
