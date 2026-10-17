import React, { useState, useRef } from 'react';
import { 
  Waves, 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Globe2, 
  Cpu, 
  TrendingUp,
  Activity,
  Layers,
  MapPin,
  Compass,
  Play,
  Pause,
  Upload,
  RotateCcw,
  Film,
  Coins
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: { name: string; role: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin_shandong');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'admin' | 'researcher' | 'enterprise'>('admin');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [customVideoName, setCustomVideoName] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Default video background matching user provided footage (Qingdao Zhanqiao Huilan Pavilion coastline)
  const defaultVideoUrl = `${import.meta.env.BASE_URL}videos/login_bg.mp4`;
  const activeVideoUrl = customVideoUrl || defaultVideoUrl;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: username === 'admin_shandong' ? '省海洋局高级核算员' : username,
        role: role === 'admin' ? '系统总调度中心' : role === 'enterprise' ? '控排与碳交易企业' : '科研院士团队',
      });
    }, 600);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (customVideoUrl && customVideoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(customVideoUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setCustomVideoUrl(newUrl);
      setCustomVideoName(file.name);
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.src = newUrl;
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleResetToDefaultVideo = () => {
    if (customVideoUrl && customVideoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(customVideoUrl);
    }
    setCustomVideoUrl(null);
    setCustomVideoName('');
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.src = defaultVideoUrl;
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col lg:flex-row bg-[#020712] select-none text-slate-100 font-sans">
      {/* ========================================================================= */}
      {/* LEFT SECTION (60%): High-Grade Visual / Video / Zhanqiao Coastal Scenic */}
      {/* ========================================================================= */}
      <div className="relative flex-1 lg:w-[62%] h-[40vh] lg:h-full overflow-hidden bg-gradient-to-b from-[#031525] via-[#05233a] to-[#010915] flex flex-col justify-between p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-cyan-500/25">
        
        {/* Background Layer: Permanent Looping Video Footage (Default or Custom Uploaded) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            src={activeVideoUrl}
            poster={`${import.meta.env.BASE_URL}images/stations/qingdao.jpg`}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-90 scale-105"
          />

          {/* Sci-Fi Vignette Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020712] via-transparent to-[#020712]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#020712]" />
        </div>

        {/* Top Brand Banner & Multimedia Controls */}
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-sm font-semibold backdrop-blur-md shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>国家级海洋碳汇数字化标杆工程 · 山东省重点生态专网</span>
            </div>
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 drop-shadow-md">
              山东省蓝碳智能监测与碳汇资产核算云平台
            </h1>
            <p className="text-sm lg:text-base font-mono text-cyan-400 tracking-wider">
              SHANDONG MARINE BLUE CARBON DIGITAL TWIN PLATFORM
            </p>
          </div>

          {/* Video Controls & Custom Dynamic Video Upload */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleVideoFileChange}
              accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={handleTriggerUpload}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/90 border border-cyan-400/60 text-cyan-200 hover:bg-cyan-900 hover:text-white hover:border-cyan-300 transition-all text-xs font-semibold backdrop-blur-md shadow-lg cursor-pointer"
              title="点击上传本地动态视频（MP4/WebM格式），不上传则默认播放青岛实况航拍"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-300" />
              <span>{customVideoUrl ? '更换动态视频' : '上传动态视频'}</span>
            </button>

            {customVideoUrl && (
              <button
                type="button"
                onClick={handleResetToDefaultVideo}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-950/90 border border-slate-700 text-slate-300 hover:text-rose-300 hover:border-rose-500/60 hover:bg-slate-900 transition-all text-xs font-semibold backdrop-blur-md shadow-md cursor-pointer"
                title="清除自定义视频，恢复系统默认青岛栈桥实况航拍"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">恢复默认</span>
              </button>
            )}

            <button
              type="button"
              onClick={togglePlay}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-slate-900 transition-all text-xs font-semibold backdrop-blur-md shadow-md cursor-pointer"
              title={isPlaying ? "暂停当前视频播放" : "继续播放视频"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="hidden sm:inline">{isPlaying ? '实况播放中' : '已暂停'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Left: 4 Live Macro Ecosystem Telemetry Cards */}
        <div className="relative z-10 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/85 border border-cyan-500/35 backdrop-blur-md">
              <span className="text-xs text-slate-300 block font-medium">纳管蓝碳湿地与藻场</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="font-num text-2xl font-bold text-cyan-300">128,000</span>
                <span className="text-xs text-slate-400 font-mono">公顷</span>
              </div>
              <span className="text-xs text-emerald-400 block mt-1">全省5大核心基地</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/85 border border-cyan-500/35 backdrop-blur-md">
              <span className="text-xs text-slate-300 block font-medium">全省年度核算固碳量</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="font-num text-2xl font-bold text-emerald-400">432.8</span>
                <span className="text-xs text-slate-200 font-mono font-bold">万吨 CO₂e</span>
              </div>
              <span className="text-xs text-cyan-400 block mt-1">同比增长 +12.4%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/85 border border-amber-500/35 backdrop-blur-md">
              <span className="text-xs text-slate-300 block font-medium">CCER 累计交易总额</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="font-num text-2xl font-bold text-amber-400">¥3.86</span>
                <span className="text-xs text-slate-400 font-mono">亿元</span>
              </div>
              <span className="text-xs text-amber-400 block mt-1">均价 ¥89.2/吨</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/85 border border-cyan-500/35 backdrop-blur-md">
              <span className="text-xs text-slate-300 block font-medium">原位浮标遥测在线率</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="font-num text-2xl font-bold text-cyan-300">99.8</span>
                <span className="text-xs text-slate-400 font-mono">%</span>
              </div>
              <span className="text-xs text-emerald-400 block mt-1">全网时延 &lt; 28ms</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>当前实况全景：青岛·胶州湾栈桥与回澜阁海岸带</span>
            </span>
            <span className="hidden sm:inline text-slate-400 font-mono">
              天基高分六号 · 涡度通量塔 · 原位浮标阵群联动
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SECTION (38%): Clean High-Tech Login Card Window (Right Side)       */}
      {/* ========================================================================= */}
      <div className="flex-1 lg:w-[38%] h-full flex items-center justify-center p-6 lg:p-12 relative z-10 bg-[#020712]/95 backdrop-blur-xl">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-slate-950/90 border border-cyan-500/35 shadow-[0_0_60px_rgba(4,13,26,0.95)] tech-border">
          {/* Brand Icon & Heading */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/25 via-emerald-500/20 to-blue-500/10 border border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.35)] mb-3">
              <Waves className="w-9 h-9 text-cyan-300 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              调度中枢系统登录验证
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1.5">
              AUTHORIZED PERSONNEL SECURITY LOGIN
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="flex p-1.5 mb-6 rounded-xl bg-slate-900/90 border border-cyan-500/25 text-sm">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              调度监管中心
            </button>
            <button
              type="button"
              onClick={() => setRole('enterprise')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                role === 'enterprise'
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              碳资产交易商
            </button>
            <button
              type="button"
              onClick={() => setRole('researcher')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                role === 'researcher'
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              海洋科研院士
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                认证账号 / User Account
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400/70">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-cyan-500/30 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all"
                  placeholder="请输入管理账号"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                安全密码 / Security Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400/70">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-cyan-500/30 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all"
                  placeholder="请输入安全密令"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0" />
                <span>记住登录凭证</span>
              </label>
              <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium">
                国标CCER密钥接入
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-emerald-600 text-slate-950 font-extrabold text-sm tracking-wider uppercase hover:opacity-95 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>安全核验中...</span>
                </>
              ) : (
                <>
                  <span>登 录 进 入 云 平 台</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Fast Demo Login Tips */}
          <div className="mt-7 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>国家级数据密级合规</span>
            </div>
            <span className="font-mono text-cyan-400/80">VERSION 4.8.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
