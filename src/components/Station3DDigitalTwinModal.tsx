import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  X, 
  Layers, 
  MapPin, 
  Sparkles, 
  Radio, 
  Activity, 
  Compass, 
  Info, 
  Camera,
  Globe
} from 'lucide-react';
import { StationData, STATIONS } from '../data/blueCarbonData';

interface Station3DDigitalTwinModalProps {
  isOpen: boolean;
  station: StationData | null;
  onClose: () => void;
  onSelectStation?: (station: StationData) => void;
}

type StationViewTab = 'real_photo' | 'satellite_gis';

export const Station3DDigitalTwinModal: React.FC<Station3DDigitalTwinModalProps> = ({
  isOpen,
  station,
  onClose,
  onSelectStation,
}) => {
  const currentStation = station || STATIONS.dongying;

  const [activeTab, setActiveTab] = useState<StationViewTab>('real_photo');
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Permanent high-resolution real scenic images matching user's provided photos
  const defaultPhotos: Record<string, { url: string; title: string; subtitle: string }> = {
    dongying: {
      url: `${import.meta.env.BASE_URL}images/stations/dongying.jpg`,
      title: '东营黄河入海口 · 黄蓝交汇奇观实景',
      subtitle: '黄河泥沙沉积浑水与渤海湛蓝海水交汇一线 · 鸥鸟掠水 · 湿地泥炭核心区',
    },
    weihai: {
      url: `${import.meta.env.BASE_URL}images/stations/weihai.jpg`,
      title: '威海荣成桑沟湾与天鹅湖湿地 · 泻湖全景实景',
      subtitle: '碧波浩渺的浅海泻湖 · 沿岸绿色湿地生态长廊 · 全国最大大叶藻海草床原位样地',
    },
    qingdao: {
      url: `${import.meta.env.BASE_URL}images/stations/qingdao.jpg`,
      title: '青岛胶州湾海洋生态实验站 · 前海一线实景',
      subtitle: '红瓦绿树与湛蓝海湾 · 中科院海洋所科学实验平台与近海科考船停泊海域',
    },
    yantai: {
      url: `${import.meta.env.BASE_URL}images/stations/yantai.jpg`,
      title: '烟台长岛深远海藻场 · 海洋牧场与风机群实景',
      subtitle: '长岛国际零碳岛 · 连绵绿丘上的巨型风电机群 · 蓝色海湾与现代深远海网箱码头',
    },
    rizhao: {
      url: `${import.meta.env.BASE_URL}images/stations/rizhao.jpg`,
      title: '日照前三岛海域 · 达山岛海中孤岛与灯塔实景',
      subtitle: '海中绝壁与礁盘巨石 · 岛巅白色航标灯塔 · 外海清澈冷水团与万亩人工藻礁',
    },
  };

  const currentPhotoConfig = defaultPhotos[currentStation.id] || defaultPhotos.dongying;
  const currentPhotoUrl = currentPhotoConfig.url;

  // Real-Scene Interactive POI Beacons on the Photo
  const stationPois: Record<string, { id: string; name: string; xPct: number; yPct: number; telemetry: string; desc: string }[]> = {
    dongying: [
      { id: 'dy1', name: '黄蓝交汇涌浪监测断面', xPct: 48, yPct: 42, telemetry: '通量: -12.4 g C/(m²·d)', desc: '泥沙悬浮颗粒吸附大量陆源有机碳，在此发生重力絮凝沉降' },
      { id: 'dy2', name: '河口微型生物碳泵原位采样点', xPct: 68, yPct: 35, telemetry: 'pCO₂: 348 μatm | 盐度: 26.8 PSU', desc: '监测河海交界带异养细菌利用高活性溶解有机碳合成惰性RDOC速率' },
      { id: 'dy3', name: '潮滩翅碱蓬样方观测塔', xPct: 22, yPct: 58, telemetry: '覆盖度: 88.5% | 生物量: 1420 g/m²', desc: '中国暖温带最年轻湿地，耐盐碱植物根系沉积千年有机碳库' },
    ],
    weihai: [
      { id: 'wh1', name: '大叶藻海草床水下连续观测样地', xPct: 52, yPct: 54, telemetry: '密度: 240 株/m² | 固碳量: 54.2 万吨', desc: '海草叶片与地下根状茎固碳能力极强，碳封存速率为同面积森林的2倍' },
      { id: 'wh2', name: '立体生态养殖(IMTA)智能筏架群', xPct: 32, yPct: 45, telemetry: 'DO: 8.6 mg/L | pH: 8.16', desc: '上层海带固碳、中层扇贝滤食净化、下层海参生态增殖的零碳闭环' },
      { id: 'wh3', name: '成山头外海水质生态浮标', xPct: 75, yPct: 32, telemetry: '水温: 16.8 °C | 浊度: 1.8 NTU', desc: '监测黄海暖流外海分支水文水化与近海酸化前兆指标' },
    ],
    qingdao: [
      { id: 'qd1', name: '中科院野外海洋生态实验观测楼', xPct: 26, yPct: 62, telemetry: '连续序列: 38 年 | 仪器入网: 100%', desc: '胶州湾国家级野外站核心实验室，开展长期海洋生物地球化学过程监测' },
      { id: 'qd2', name: '湾口高频二氧化碳分压(pCO₂)系统', xPct: 58, yPct: 46, telemetry: '海气交换通量: -8.6 g C/(m²·d)', desc: '毫秒级自动捕捉海面微气象与碳汇呼吸日夜节律' },
      { id: 'qd3', name: '科学考查船专用取样锚泊区', xPct: 78, yPct: 38, telemetry: '海水DO: 8.4 mg/L | 盐度: 31.4 PSU', desc: '定期巡航采集表层至深水层浮游植物群落结构与叶绿素数据' },
    ],
    yantai: [
      { id: 'yt1', name: '“耕海1号”智能化深远海网箱码头', xPct: 62, yPct: 68, telemetry: '养殖容积: 3.2万m³ | 固碳转化: 86%', desc: '全国领先现代海洋牧场综合体，集成环境光伏、微藻增殖与在线物联' },
      { id: 'yt2', name: '长岛国际零碳岛风电机群', xPct: 68, yPct: 32, telemetry: '清洁能源占比: 98% | 碳减排: 28万吨/年', desc: '海岛绿电直驱全自动原位监测仪器，实现零碳离网连续自给' },
      { id: 'yt3', name: '庙岛海峡微型生物与噬菌体采样浮标', xPct: 24, yPct: 78, telemetry: '水温: 15.2 °C | 沉积率: 295 g/(m²·a)', desc: '深水海峡冷水团沉积原位生化自动取样系统' },
    ],
    rizhao: [
      { id: 'rz1', name: '前三岛达山岛核心灯塔观测基准站', xPct: 35, yPct: 32, telemetry: '基准高度: 82米 | 雷达视界: 30海里', desc: '南黄海前哨天然生态样板，无人干扰环境下的原始海岛生态演进' },
      { id: 'rz2', name: '外海冷水团万亩人工藻礁示范区', xPct: 65, yPct: 56, telemetry: '投放量: 12.8万空方 | 藻场面积: 1.2万亩', desc: '大型马尾藻与羊栖菜立体附着，构建人工礁与生物固碳复合生态系统' },
      { id: 'rz3', name: '深水悬浮颗粒碳(POC)捕获锚系', xPct: 78, yPct: 74, telemetry: 'POC通量: 11.2 mg/m²·d', desc: '海底沉积物捕获器测定有机碳向深海地质层永久埋藏速率' },
    ],
  };

  const pois = stationPois[currentStation.id] || stationPois.dongying;

  // Initialize Satellite GIS Leaflet Map when switching to satellite_gis tab
  useEffect(() => {
    if (!isOpen || activeTab !== 'satellite_gis') return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const { lat, lon } = currentStation.coordinates;

      // High-resolution Leaflet satellite map
      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // Public reliable satellite imagery tile
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      ).addTo(map);

      // Add Zoom Control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Station Core Radar Marker
      const pulsingIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 rounded-full border-2 border-emerald-400 animate-ping opacity-75"></div>
            <div class="absolute w-8 h-8 rounded-full border border-cyan-400 bg-cyan-500/20"></div>
            <div class="w-4 h-4 rounded-full bg-emerald-400 ring-4 ring-white shadow-[0_0_15px_#10b981]"></div>
          </div>
        `,
        className: 'custom-satellite-beacon',
        iconSize: [0, 0],
      });

      L.marker([lat, lon], { icon: pulsingIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; color: #0f172a; padding: 4px;">
            <strong style="font-size: 13px; color: #0284c7;">📍 ${currentStation.name}</strong>
            <div style="font-size: 11px; margin-top: 4px;">精准遥感坐标: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E</div>
            <div style="font-size: 11px; color: #059669; font-weight: bold; margin-top: 2px;">核心优势物种: ${currentStation.coreSpecies}</div>
            <div style="font-size: 11px; color: #d97706; margin-top: 2px;">年固碳储量: ${currentStation.carbonTotal} 万吨</div>
          </div>
        `)
        .openPopup();

      // Draw Redline Conservation Zone around the station
      const radiusOffset = 0.035;
      const zoneBounds: [number, number][] = [
        [lat + radiusOffset, lon - radiusOffset * 1.2],
        [lat + radiusOffset * 1.1, lon + radiusOffset],
        [lat - radiusOffset * 0.8, lon + radiusOffset * 1.3],
        [lat - radiusOffset * 1.2, lon - radiusOffset * 0.9],
      ];

      L.polygon(zoneBounds, {
        color: '#10b981',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#06b6d4',
        fillOpacity: 0.18,
      }).addTo(map);

      // Add POI buoy markers on the satellite map
      pois.forEach((poi, index) => {
        const offsetLat = (index === 0 ? 0.012 : index === 1 ? -0.015 : 0.008);
        const offsetLon = (index === 0 ? -0.015 : index === 1 ? 0.018 : 0.022);

        const subIcon = L.divIcon({
          html: `
            <div class="px-2 py-0.5 rounded bg-slate-950/90 border border-cyan-400 text-[10px] text-cyan-200 font-mono shadow-md flex items-center gap-1 whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>${poi.name.slice(0, 8)}</span>
            </div>
          `,
          className: 'sub-poi-tag',
          iconSize: [0, 0],
        });

        L.marker([lat + offsetLat, lon + offsetLon], { icon: subIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; color: #0f172a; padding: 2px;">
              <strong style="font-size: 12px; color: #0d9488;">${poi.name}</strong>
              <div style="font-size: 10px; color: #0284c7; font-family: monospace; margin-top: 2px;">${poi.telemetry}</div>
              <div style="font-size: 10px; color: #475569; margin-top: 2px;">${poi.desc}</div>
            </div>
          `);
      });

      mapInstanceRef.current = map;
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, activeTab, currentStation]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in select-none">
      <div 
        className="relative w-full max-w-6xl h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-cyan-500/40 text-slate-100 shadow-[0_0_80px_rgba(6,182,212,0.35)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/25 bg-slate-950/95 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/30 to-emerald-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.35)]">
              <Camera className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-2.5">
                  <span>{currentStation.name}</span>
                  <span className="text-cyan-400 text-sm font-mono font-normal">
                    [{currentStation.coordinates.lat}°N, {currentStation.coordinates.lon}°E]
                  </span>
                </h2>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold">
                  实景与遥感视界
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                {currentPhotoConfig.subtitle}
              </p>
            </div>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-3">
            {/* View Mode Switcher: Real Photo vs Satellite GIS */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium">
              <button
                onClick={() => setActiveTab('real_photo')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'real_photo'
                    ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-200 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="切换至现场超清全景摄影实景与测绘标注"
              >
                <Camera className="w-4 h-4" />
                <span>超清全景实景</span>
              </button>

              <button
                onClick={() => setActiveTab('satellite_gis')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'satellite_gis'
                    ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="切换至高分辨率天地图/卫星遥感数字底图（支持红线与微观地理俯瞰）"
              >
                <Globe className="w-4 h-4" />
                <span>卫星遥感底图</span>
              </button>
            </div>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
              title="关闭实景视界"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Five Stations Switcher Tab Strip */}
        <div className="flex items-center gap-2.5 px-6 py-2.5 border-b border-slate-800 bg-slate-950/70 shrink-0 overflow-x-auto text-sm font-semibold">
          <span className="text-slate-300 text-xs shrink-0 flex items-center gap-1.5 font-bold">
            <MapPin className="w-4 h-4 text-cyan-400" />
            观测站切换:
          </span>
          {Object.values(STATIONS).map((st) => {
            const isSelected = st.id === currentStation.id;
            return (
              <button
                key={st.id}
                onClick={() => onSelectStation && onSelectStation(st)}
                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-500/25 border border-cyan-400 text-white shadow-sm font-bold'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
                <span>{st.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Main Stage Viewport */}
        <div className="relative flex-1 w-full h-full min-h-0 bg-[#030914] overflow-hidden">
          {/* TAB 1: Real Photographic Panorama with Overlaid POI Beacons */}
          {activeTab === 'real_photo' && (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
              {/* The Real Field Photo */}
              <img
                src={currentPhotoUrl}
                alt={currentStation.name}
                className="w-full h-full object-cover object-center filter saturate-110 contrast-105 select-none"
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

              {/* Floating Real-Photo Name HUD (Top Center) */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 text-sm text-cyan-200 font-bold shadow-xl pointer-events-none flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>{currentPhotoConfig.title}</span>
              </div>

              {/* Floating Interactive POI Beacons on the Photo */}
              {pois.map((poi) => {
                const isSelected = selectedPoiId === poi.id;
                return (
                  <div
                    key={poi.id}
                    style={{ left: `${poi.xPct}%`, top: `${poi.yPct}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                    onClick={() => setSelectedPoiId(isSelected ? null : poi.id)}
                  >
                    {/* Pulsing Radar Ring */}
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-10 h-10 rounded-full border border-cyan-400 animate-ping opacity-75" />
                      <div className="w-5 h-5 rounded-full bg-emerald-400 ring-4 ring-white shadow-[0_0_15px_#10b981]" />
                    </div>

                    {/* POI Badge */}
                    <div className={`mt-2.5 -translate-x-1/2 left-1/2 absolute whitespace-nowrap px-3.5 py-2 rounded-xl border backdrop-blur-md shadow-2xl transition-all ${
                      isSelected
                        ? 'bg-slate-950/95 border-emerald-400 scale-105 z-30'
                        : 'bg-slate-950/85 border-cyan-500/40 hover:border-cyan-300'
                    }`}>
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span>{poi.name}</span>
                      </div>
                      <div className="text-xs font-mono text-cyan-300 mt-1">
                        {poi.telemetry}
                      </div>

                      {/* Expanded description on click */}
                      {isSelected && (
                        <div className="text-xs text-slate-300 pt-1.5 mt-1.5 border-t border-slate-800 max-w-[240px] leading-relaxed">
                          {poi.desc}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Telemetry Floating Card (Bottom Left) */}
              <div className="absolute bottom-5 left-5 p-4 rounded-2xl bg-slate-950/95 backdrop-blur-md border border-cyan-500/40 text-sm space-y-3 pointer-events-auto shadow-2xl max-w-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-2 text-sm">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>原位多参数物联遥测矩阵</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">5G实时物联</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-xs block">水下溶解氧 (DO)</span>
                    <span className="font-num font-bold text-base text-cyan-300">{currentStation.buoySensors.do} mg/L</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-xs block">pH 酸碱度</span>
                    <span className="font-num font-bold text-base text-emerald-300">{currentStation.buoySensors.ph}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-xs block">水体实用盐度</span>
                    <span className="font-num font-bold text-base text-amber-300">{currentStation.buoySensors.salinity} PSU</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-xs block">表层海温 (SST)</span>
                    <span className="font-num font-bold text-base text-sky-300">{currentStation.buoySensors.temperature} °C</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-slate-800">
                  <span>优势物种：<strong className="text-emerald-400 text-sm">{currentStation.coreSpecies}</strong></span>
                  <span>碳储量：<strong className="font-num text-cyan-300 text-sm">{currentStation.carbonTotal} 万吨</strong></span>
                </div>
              </div>

              {/* Instructions Pill (Bottom Right) */}
              <div className="absolute bottom-5 right-5 p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs text-slate-400 pointer-events-none">
                点击图中发光雷达点可读取微观测绘数据
              </div>
            </div>
          )}

          {/* TAB 2: High-Resolution Satellite GIS Topographic Map */}
          {activeTab === 'satellite_gis' && (
            <div className="relative w-full h-full min-h-0">
              <div ref={mapContainerRef} className="w-full h-full z-10" />

              {/* Satellite GIS HUD Overlay (Top-Left) */}
              <div className="absolute top-5 left-5 z-20 p-4 rounded-2xl bg-slate-950/95 backdrop-blur-md border border-cyan-500/40 text-sm shadow-2xl max-w-sm space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-base">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <span>天地图/全球高分辨率遥感数字底图</span>
                </div>
                <div className="text-xs text-slate-200">
                  当前中心：<span className="font-bold text-white text-sm">{currentStation.name}</span>
                </div>
                <div className="text-xs font-mono text-emerald-400 font-semibold">
                  遥感层级：Zoom 14 亚米级超清地表分辨率
                </div>
                <div className="text-xs text-slate-300 border-t border-slate-800 pt-1.5 leading-relaxed">
                  绿色虚线框：国家海洋生态保护红线核心区与碳汇样方断面
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Description */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              {activeTab === 'real_photo' 
                ? `当前为【现场全景摄影实景】：${currentPhotoConfig.title}` 
                : `当前为【卫星遥感数字底图】：高分辨率俯瞰该海域生态保护红线与地理全貌`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-emerald-400 font-bold text-sm">
              有机碳年埋藏率：{currentStation.buoySensors.burialRate} g/(m²·a)
            </span>
            <button
              onClick={onClose}
              className="px-5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer text-sm"
            >
              返回 WebGIS 主屏
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
