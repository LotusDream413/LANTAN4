import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Navigation, 
  Radio, 
  RotateCcw,
  Sparkles,
  Waves,
  Eye,
  ChevronDown,
  Check,
  Compass,
  ArrowRight,
  Globe,
  Sliders,
  ShieldCheck,
  Rotate3d,
  Camera
} from 'lucide-react';
import { StationData, STATIONS, PROVINCE_OVERVIEW } from '../data/blueCarbonData';
import { lookupGeoLocation, GeoLocationInfo } from '../utils/geoLookup';
import { Station3DDigitalTwinModal } from './Station3DDigitalTwinModal';

type BasemapType = 'satellite' | 'dark' | 'ocean' | 'topo' | 'osm';

interface ShandongWebGISMapProps {
  currentStation: StationData;
  onSelectStation: (station: StationData) => void;
  year: number;
  intervention: number;
}

export const ShandongWebGISMap: React.FC<ShandongWebGISMapProps> = ({
  currentStation,
  onSelectStation,
  year,
  intervention,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  const fluxLayerRef = useRef<L.LayerGroup | null>(null);
  const currentsLayerRef = useRef<L.LayerGroup | null>(null);

  const [basemap, setBasemap] = useState<BasemapType>('satellite');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showStations, setShowStations] = useState<boolean>(true);
  const [showZones, setShowZones] = useState<boolean>(true);
  const [showFluxField, setShowFluxField] = useState<boolean>(true);
  const [showCurrents, setShowCurrents] = useState<boolean>(true);
  const [clickedLocation, setClickedLocation] = useState<GeoLocationInfo | null>(null);
  const [is3DModalOpen, setIs3DModalOpen] = useState<boolean>(false);
  const [selected3DStation, setSelected3DStation] = useState<StationData | null>(null);

  // Basemap Tile URLs (100% Reliable, Public, Zero API Key Required)
  const basemapConfigs: Record<BasemapType, { name: string; tag: string; url: string; attribution: string }> = {
    satellite: {
      name: '高清卫星遥感底图',
      tag: '高分辨率遥感',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '© Esri World Imagery / Natural Color Satellite',
    },
    dark: {
      name: '暗夜深海数字孪生',
      tag: '极客夜视',
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
      attribution: '© CartoDB Voyager Digital Twin',
    },
    ocean: {
      name: '海洋等深水文底图',
      tag: '海陆水深',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: '© Esri Ocean Basemap / Marine Bathymetry',
    },
    topo: {
      name: '地形等高线底图',
      tag: '陆海立体地形',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: '© Esri Topographic Basemap',
    },
    osm: {
      name: '标准开放地理底图',
      tag: '开放矢量',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors',
    },
  };

  // Close basemap dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.basemap-menu-container')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered at Shandong Peninsula [36.9, 120.6], zoom level 7.5
    const map = L.map(mapContainerRef.current, {
      center: [36.9, 120.6],
      zoom: 7.5,
      zoomControl: false,
      attributionControl: true,
      minZoom: 4,
      maxZoom: 18,
    });

    // Custom positioned zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer
    const initialConfig = basemapConfigs[basemap];
    const tileLayer = L.tileLayer(initialConfig.url, {
      attribution: initialConfig.attribution,
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Layer groups for markers, blue carbon zones, satellite flux grid & ocean currents
    const markersGroup = L.layerGroup().addTo(map);
    const zonesGroup = L.layerGroup().addTo(map);
    const fluxGroup = L.layerGroup().addTo(map);
    const currentsGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    zonesLayerRef.current = zonesGroup;
    fluxLayerRef.current = fluxGroup;
    currentsLayerRef.current = currentsGroup;

    // Map Click Listener for interactive click-to-lookup
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (!e || !e.latlng) return;
      const { lat, lng } = e.latlng;
      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return;

      const locationInfo = lookupGeoLocation(lat, lng);
      setClickedLocation(locationInfo);

      // If user clicked near or at a blue carbon station, auto switch dashboard
      if (locationInfo.blueCarbonStationId && STATIONS[locationInfo.blueCarbonStationId]) {
        onSelectStation(STATIONS[locationInfo.blueCarbonStationId]);
      }
    });

    mapInstanceRef.current = map;

    // Attach ResizeObserver to automatically adapt map viewport on panel toggle
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          try {
            map.invalidateSize({ animate: false, pan: false });
          } catch {
            // ignore potential leaflet re-entrancy edge case
          }
        }
      }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when basemap changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const currentConfig = basemapConfigs[basemap];
    const newLayer = L.tileLayer(currentConfig.url, {
      attribution: currentConfig.attribution,
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [basemap]);

  // Render Blue Carbon Polygons, Station Markers, Satellite Carbon Flux Grid & Ocean Currents
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !zonesLayerRef.current || !fluxLayerRef.current || !currentsLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    zonesLayerRef.current.clearLayers();
    fluxLayerRef.current.clearLayers();
    currentsLayerRef.current.clearLayers();

    // 0. Render Satellite Carbon Flux Grid Cells (if enabled)
    if (showFluxField) {
      const fluxCells = [
        {
          id: 'B01',
          bounds: [[37.8, 118.8], [38.2, 119.5]] as L.LatLngBoundsLiteral,
          name: '黄河口-渤海湾高通量反演网格 #B01',
          flux: -12.4,
          chl: 4.12,
          sst: 15.8,
          level: '极强吸收汇',
          color: '#10b981',
          zone: '东营潮滩湿地',
        },
        {
          id: 'B02',
          bounds: [[37.3, 119.2], [37.7, 120.1]] as L.LatLngBoundsLiteral,
          name: '莱州湾南岸底栖固碳网格 #B02',
          flux: -9.8,
          chl: 3.45,
          sst: 16.5,
          level: '强吸收汇',
          color: '#06b6d4',
          zone: '潍坊-莱州海域',
        },
        {
          id: 'B03',
          bounds: [[37.9, 120.3], [38.4, 121.1]] as L.LatLngBoundsLiteral,
          name: '庙岛群岛-长岛深水碳泵网格 #B03',
          flux: -8.6,
          chl: 2.85,
          sst: 15.2,
          level: '强吸收汇',
          color: '#06b6d4',
          zone: '烟台长岛零碳群岛',
        },
        {
          id: 'Y01',
          bounds: [[37.6, 121.1], [38.0, 121.9]] as L.LatLngBoundsLiteral,
          name: '烟台北岸海带藻场养殖网格 #Y01',
          flux: -7.8,
          chl: 2.60,
          sst: 16.0,
          level: '中强吸收汇',
          color: '#38bdf8',
          zone: '芝罘-牟平近海',
        },
        {
          id: 'W01',
          bounds: [[37.3, 122.2], [37.8, 122.9]] as L.LatLngBoundsLiteral,
          name: '成山头-桑沟湾海草床极强汇网格 #W01',
          flux: -11.6,
          chl: 3.90,
          sst: 14.8,
          level: '极强吸收汇',
          color: '#10b981',
          zone: '威海荣成大叶藻区',
        },
        {
          id: 'W02',
          bounds: [[36.8, 122.1], [37.3, 122.8]] as L.LatLngBoundsLiteral,
          name: '荣成近海贝藻立体养殖网格 #W02',
          flux: -10.2,
          chl: 3.55,
          sst: 15.4,
          level: '极强吸收汇',
          color: '#10b981',
          zone: '荣成石岛-靖海湾',
        },
        {
          id: 'Q01',
          bounds: [[36.1, 120.5], [36.5, 121.2]] as L.LatLngBoundsLiteral,
          name: '青岛崂山湾碳通量监测网格 #Q01',
          flux: -8.2,
          chl: 2.95,
          sst: 16.8,
          level: '强吸收汇',
          color: '#06b6d4',
          zone: '青岛崂山头近海',
        },
        {
          id: 'Q02',
          bounds: [[35.9, 120.0], [36.3, 120.5]] as L.LatLngBoundsLiteral,
          name: '青岛胶州湾海-气通量核心网格 #Q02',
          flux: -9.4,
          chl: 3.20,
          sst: 17.2,
          level: '强吸收汇',
          color: '#06b6d4',
          zone: '青岛胶州湾口',
        },
        {
          id: 'R01',
          bounds: [[35.1, 119.4], [35.6, 120.2]] as L.LatLngBoundsLiteral,
          name: '日照前三岛经济海藻碳汇网格 #R01',
          flux: -8.9,
          chl: 3.10,
          sst: 17.6,
          level: '强吸收汇',
          color: '#06b6d4',
          zone: '日照岚山-前三岛',
        },
        {
          id: 'YS01',
          bounds: [[36.0, 121.5], [36.8, 122.4]] as L.LatLngBoundsLiteral,
          name: '南黄海中部冷水团沉积网格 #YS01',
          flux: -5.4,
          chl: 1.85,
          sst: 15.0,
          level: '常规稳态汇',
          color: '#6366f1',
          zone: '黄海深水冷水团',
        },
      ];

      fluxCells.forEach((cell) => {
        const rect = L.rectangle(cell.bounds, {
          color: cell.color,
          weight: 1.5,
          dashArray: '3 5',
          fillColor: cell.color,
          fillOpacity: 0.24,
        });

        const tooltipContent = `
          <div style="background-color: #030914; border: 1px solid ${cell.color}; padding: 8px 10px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.8); color: #f8fafc; font-family: sans-serif; font-size: 11px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 4px; margin-bottom: 4px;">
              <span style="color: #38bdf8; font-family: monospace; font-size: 10px;">🛰️ Sentinel-3 遥感反演</span>
              <span style="color: ${cell.color}; font-weight: bold; font-size: 10px;">${cell.level}</span>
            </div>
            <div style="font-weight: bold; color: #fff; margin-bottom: 4px;">${cell.name}</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-family: monospace; font-size: 10px; color: #cbd5e1;">
              <div>海-气通量: <b style="color: ${cell.color}; font-size: 11px;">${cell.flux} g C/(m²·d)</b></div>
              <div>海表水温: <b style="color: #38bdf8;">${cell.sst} °C</b></div>
              <div>叶绿素-a: <b style="color: #f59e0b;">${cell.chl} mg/m³</b></div>
              <div>归属海区: <b style="color: #fff;">${cell.zone}</b></div>
            </div>
          </div>
        `;

        rect.bindTooltip(tooltipContent, {
          sticky: true,
          direction: 'top',
          className: 'custom-flux-tooltip',
          opacity: 1,
        });

        rect.addTo(fluxLayerRef.current!);
      });
    }

    // 0.5. Render Dynamic Ocean Currents (if enabled)
    if (showCurrents) {
      const oceanCurrents = [
        {
          name: '渤海沿岸流 (Bohai Coastal Current)',
          coords: [[38.3, 119.0], [38.0, 119.3], [37.6, 119.8], [37.3, 120.2]] as L.LatLngExpression[],
          color: '#38bdf8',
          weight: 3,
          desc: '输运黄河入海细颗粒悬浮有机碳 (POC) 向莱州湾沉降',
        },
        {
          name: '鲁北沿岸流 (Lubei Current)',
          coords: [[37.6, 119.9], [37.8, 120.6], [38.0, 121.3], [38.1, 121.8]] as L.LatLngExpression[],
          color: '#06b6d4',
          weight: 2.5,
          desc: '搬运莱州湾无机营养盐至渤海海峡激发浮游植物增汇',
        },
        {
          name: '黄海暖流外海分支 (YSWC Branch)',
          coords: [[35.2, 122.1], [36.1, 122.3], [37.0, 122.5], [37.6, 122.7]] as L.LatLngExpression[],
          color: '#10b981',
          weight: 3,
          desc: '高盐温暖水团涌升，为成山头与桑沟湾海草床提供稳定水化环境',
        },
        {
          name: '胶东半岛南岸冲淡水团',
          coords: [[36.0, 120.6], [35.5, 120.1], [35.0, 119.6]] as L.LatLngExpression[],
          color: '#38bdf8',
          weight: 2.5,
          desc: '胶州湾向日照近海输运陆源硅酸盐与颗粒碳扩散带',
        },
      ];

      oceanCurrents.forEach((curr) => {
        const polyline = L.polyline(curr.coords, {
          color: curr.color,
          weight: curr.weight,
          dashArray: '6 8',
          opacity: 0.85,
        });

        polyline.bindTooltip(`
          <div style="background-color: #030914; border: 1px solid ${curr.color}; padding: 6px 8px; border-radius: 6px; font-size: 11px; color: #fff;">
            <div style="font-weight: bold; color: ${curr.color};">🌊 ${curr.name}</div>
            <div style="font-size: 10px; color: #cbd5e1; margin-top: 2px;">${curr.desc}</div>
          </div>
        `, {
          sticky: true,
          direction: 'top',
        });

        polyline.addTo(currentsLayerRef.current!);
      });
    }

    // 1. Draw High-Tech Blue Carbon Marine Zones (if enabled)
    if (showZones) {
      // Dongying Yellow River Estuary Saltmarsh Zone
      L.polygon(
        [
          [37.65, 118.95],
          [37.95, 119.05],
          [37.88, 119.38],
          [37.62, 119.25],
        ],
        {
          color: '#10b981',
          weight: 2,
          fillColor: '#10b981',
          fillOpacity: 0.22,
          dashArray: '4 6',
        }
      ).bindTooltip('东营·黄河口滨海盐沼湿地保护区 (6,420公顷)', {
        direction: 'top',
        className: 'bg-slate-900 text-emerald-300 text-xs border border-emerald-500/40 px-2 py-1 rounded shadow-lg',
      }).addTo(zonesLayerRef.current);

      // Weihai Sanggou Bay & Rongcheng Seagrass Zone
      L.polygon(
        [
          [37.05, 122.38],
          [37.28, 122.45],
          [37.25, 122.75],
          [36.98, 122.65],
        ],
        {
          color: '#06b6d4',
          weight: 2,
          fillColor: '#06b6d4',
          fillOpacity: 0.22,
          dashArray: '4 6',
        }
      ).bindTooltip('威海·桑沟湾大叶藻海草床与贝藻IMTA区', {
        direction: 'top',
        className: 'bg-slate-900 text-cyan-300 text-xs border border-cyan-500/40 px-2 py-1 rounded shadow-lg',
      }).addTo(zonesLayerRef.current);

      // Qingdao Jiaozhou Bay Coastal Zone
      L.polygon(
        [
          [36.02, 120.08],
          [36.22, 120.12],
          [36.25, 120.35],
          [36.05, 120.32],
        ],
        {
          color: '#38bdf8',
          weight: 2,
          fillColor: '#38bdf8',
          fillOpacity: 0.2,
          dashArray: '4 6',
        }
      ).bindTooltip('青岛·胶州湾海岸带海-气碳通量核心网格', {
        direction: 'top',
        className: 'bg-slate-900 text-sky-300 text-xs border border-sky-500/40 px-2 py-1 rounded shadow-lg',
      }).addTo(zonesLayerRef.current);

      // Yantai Changdao Marine Ranching Zone
      L.circle([37.95, 120.72], {
        radius: 22000,
        color: '#f59e0b',
        weight: 1.5,
        fillColor: '#f59e0b',
        fillOpacity: 0.18,
        dashArray: '3 5',
      }).bindTooltip('烟台·长岛深远海藻场与MCP微型生物固碳区', {
        direction: 'top',
        className: 'bg-slate-900 text-amber-300 text-xs border border-amber-500/40 px-2 py-1 rounded shadow-lg',
      }).addTo(zonesLayerRef.current);

      // Rizhao Qiansandao Reef Algae Zone
      L.circle([35.18, 119.95], {
        radius: 18000,
        color: '#10b981',
        weight: 1.5,
        fillColor: '#10b981',
        fillOpacity: 0.18,
        dashArray: '3 5',
      }).bindTooltip('日照·前三岛大型经济海藻生态固碳试验区', {
        direction: 'top',
        className: 'bg-slate-900 text-emerald-300 text-xs border border-emerald-500/40 px-2 py-1 rounded shadow-lg',
      }).addTo(zonesLayerRef.current);
    }

    // 2. Add 5 Core Station Markers (if enabled)
    if (showStations) {
      Object.values(STATIONS).forEach((station) => {
        const isSelected = currentStation.id === station.id;
        const { lat, lon } = station.coordinates;

        // Custom DivIcon with glowing pulsing neon ring and name badge
        const iconHtml = `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
            <!-- Pulsing outer ring -->
            <div class="absolute w-12 h-12 rounded-full ${isSelected ? 'bg-emerald-500/35 ring-2 ring-emerald-400' : 'bg-cyan-500/25 ring-1 ring-cyan-400/50'} animate-ping opacity-60"></div>
            <!-- Second ring -->
            <div class="absolute w-8 h-8 rounded-full ${isSelected ? 'border border-emerald-400' : 'border border-cyan-400'} opacity-80"></div>
            <!-- Center core beacon -->
            <div class="w-4 h-4 rounded-full ${isSelected ? 'bg-emerald-400 ring-2 ring-white shadow-[0_0_12px_#34d399]' : 'bg-cyan-400 ring-2 ring-slate-900 shadow-[0_0_10px_#06b6d4]'}"></div>
            
            <!-- Label tag below -->
            <div class="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-slate-950/92 border ${isSelected ? 'border-emerald-400 text-emerald-300 font-bold' : 'border-cyan-500/50 text-slate-100 font-semibold'} text-[11px] shadow-lg flex items-center gap-1 backdrop-blur-sm">
              <span class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-cyan-400'}"></span>
              <span>${station.shortName}</span>
              <span class="text-[9px] text-emerald-300 font-mono bg-emerald-950/70 border border-emerald-500/40 px-1 rounded ml-0.5">双击实景</span>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-station-icon',
          iconSize: [0, 0],
        });

        const marker = L.marker([lat, lon], { icon: customIcon });

        // On Click Marker: Switch station & open location info
        marker.on('click', () => {
          onSelectStation(station);
          const info = lookupGeoLocation(lat, lon);
          setClickedLocation(info);
          safeFlyTo(lat, lon, 9.5);
        });

        // On DOUBLE-CLICK Marker: Open 3D Digital Twin & Real Aerial Panorama View!
        marker.on('dblclick', (e) => {
          L.DomEvent.stopPropagation(e);
          onSelectStation(station);
          setSelected3DStation(station);
          setIs3DModalOpen(true);
        });

        marker.addTo(markersLayerRef.current!);
      });
    }
  }, [showStations, showZones, showFluxField, showCurrents, currentStation]);

  const isInitialMount = useRef<boolean>(true);

  // Safe flyTo helper function
  const safeFlyTo = (targetLat: number, targetLon: number, zoomLevel: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (typeof targetLat !== 'number' || typeof targetLon !== 'number' || isNaN(targetLat) || isNaN(targetLon)) {
      return;
    }
    try {
      map.flyTo([targetLat, targetLon], zoomLevel, { duration: 1.2 });
    } catch {
      try {
        map.setView([targetLat, targetLon], zoomLevel);
      } catch {
        // safety fallback
      }
    }
  };

  // Fly to selected station when changed from outside
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    // Don't trigger animated flyTo on initial component mount because map was already centered at [36.9, 120.6]
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (currentStation.id === 'all') {
      safeFlyTo(36.9, 120.6, 7.5);
    } else if (currentStation?.coordinates) {
      const { lat, lon } = currentStation.coordinates;
      safeFlyTo(lat, lon, 9.5);
    }
  }, [currentStation]);

  const handleResetView = () => {
    onSelectStation(PROVINCE_OVERVIEW);
    setClickedLocation(null);
    safeFlyTo(36.9, 120.6, 7.5);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#030914] overflow-hidden select-none">
      {/* Top Map HUD Controls & Clean Dropdown Menu */}
      <div className="relative z-20 flex items-center justify-between px-4 py-2 border-b border-cyan-500/20 bg-slate-950/85 backdrop-blur-md">
        {/* Left: Compact Dropdown Menu for Basemap Selection */}
        <div className="flex items-center gap-3">
          <div className="relative basemap-menu-container">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-semibold bg-slate-900/90 border border-cyan-500/35 text-cyan-300 hover:bg-slate-800/90 hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)] group cursor-pointer"
              title={`当前底图: ${basemapConfigs[basemap].name} (点击切换)`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>底图</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Options Popup */}
            {isMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-60 rounded-xl bg-slate-950/95 border border-cyan-500/35 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                  选择 GIS 测绘底图源
                </div>
                {(Object.keys(basemapConfigs) as BasemapType[]).map((key) => {
                  const cfg = basemapConfigs[key];
                  const isActive = basemap === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setBasemap(key);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                        isActive 
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40' 
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-medium flex items-center gap-1.5">
                          {key === 'satellite' && <Eye className="w-3 h-3 text-cyan-400" />}
                          {key === 'dark' && <Layers className="w-3 h-3 text-cyan-400" />}
                          {key === 'ocean' && <Waves className="w-3 h-3 text-cyan-400" />}
                          {key === 'topo' && <Compass className="w-3 h-3 text-cyan-400" />}
                          {key === 'osm' && <Globe className="w-3 h-3 text-cyan-400" />}
                          <span>{cfg.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block pl-4.5">
                          {cfg.tag}
                        </span>
                      </div>
                      {isActive && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Current Station Focus Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <span>当前聚焦:</span>
            <span className="font-semibold text-cyan-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              {currentStation.shortName}
            </span>
          </div>
        </div>

        {/* Right: Functional Layer Toggles & Reset View */}
        <div className="flex items-center gap-2">
          {/* Toggle Stations */}
          <button
            onClick={() => setShowStations(!showStations)}
            className={`px-2.5 py-1 text-xs rounded border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showStations
                ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300'
                : 'border-slate-800 bg-slate-900/60 text-slate-400'
            }`}
            title="切换显示山东5大国家级野外原位观测站"
          >
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>5大基站</span>
          </button>

          {/* Toggle Zones */}
          <button
            onClick={() => setShowZones(!showZones)}
            className={`px-2.5 py-1 text-xs rounded border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showZones
                ? 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300'
                : 'border-slate-800 bg-slate-900/60 text-slate-400'
            }`}
            title="切换显示重点蓝碳生态功能多边形区"
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>功能保护区</span>
          </button>

          {/* Toggle Carbon Flux Satellite Grid */}
          <button
            onClick={() => setShowFluxField(!showFluxField)}
            className={`px-2.5 py-1 text-xs rounded border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showFluxField
                ? 'border-emerald-400/50 bg-emerald-950/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.3)] font-semibold'
                : 'border-slate-800 bg-slate-900/60 text-slate-400'
            }`}
            title="切换海-气碳吸收通量卫星遥感反演云图 (Sentinel-3 OLCI & MODIS 反演)"
          >
            <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>碳通量反演云图</span>
          </button>

          {/* Toggle Ocean Currents */}
          <button
            onClick={() => setShowCurrents(!showCurrents)}
            className={`px-2.5 py-1 text-xs rounded border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showCurrents
                ? 'border-sky-400/50 bg-sky-950/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.3)] font-semibold'
                : 'border-slate-800 bg-slate-900/60 text-slate-400'
            }`}
            title="切换近海洋流碳搬运矢量流场 (黄海暖流/渤海沿岸流/颗粒碳输运)"
          >
            <Waves className="w-3 h-3 text-sky-400" />
            <span>近海洋流场</span>
          </button>

          {/* Station Real Photo & Satellite GIS Viewer Button */}
          <button
            onClick={() => {
              setSelected3DStation(currentStation.id === 'all' ? STATIONS.dongying : currentStation);
              setIs3DModalOpen(true);
            }}
            className="px-2.5 py-1 text-xs rounded border border-emerald-400/60 bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 text-emerald-200 hover:text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5 cursor-pointer font-bold"
            title="开启当前站点的超清全景现场实景与卫星遥感视界（也可直接双击地图基站）"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>基站实景与遥感</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800" />

          {/* Reset Map View */}
          <button
            onClick={handleResetView}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-slate-900/80 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950 hover:text-white transition-colors cursor-pointer"
            title="复位到山东全省总览视角"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>复位总览</span>
          </button>
        </div>
      </div>

      {/* Leaflet Real Interactive Map Stage */}
      <div className="relative flex-1 w-full h-full min-h-0">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Quick Compass / Scientific Legend HUD (Bottom-Left) */}
        <div className="absolute left-4 bottom-4 z-20 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 text-[11px] text-slate-300 space-y-2 pointer-events-auto shadow-2xl max-w-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>WebGIS 空间地理测绘系统</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400">Sentinel-3 遥测</span>
          </div>

          {/* Satellite Flux Color Scale Legend */}
          {showFluxField && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>海气碳吸收通量强度:</span>
                <span className="font-mono text-cyan-300">g C/(m²·d)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 via-sky-500 to-indigo-500 shadow-inner" />
              <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-0.5">
                <span className="text-emerald-300">&lt; -11.0 (极强汇)</span>
                <span className="text-cyan-300">-8.5 (强汇)</span>
                <span className="text-indigo-300">-5.0 (弱汇)</span>
              </div>
            </div>
          )}

          <div className="text-[10px] text-slate-400 font-mono leading-tight">
            提示: 点击地图任意点可调出地名与生态资产探针；悬浮网格可读取卫星物化参数。
          </div>
        </div>

        {/* Interactive Click Details Popup Card */}
        {clickedLocation && (
          <div className="absolute right-4 top-4 z-20 w-84 p-4 rounded-xl bg-slate-950/92 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_30px_rgba(4,13,26,0.9)] tech-border animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-cyan-500/20 pb-2.5 mb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      clickedLocation.type === 'blue-carbon'
                        ? 'bg-emerald-400 animate-ping'
                        : clickedLocation.type === 'city'
                        ? 'bg-cyan-400'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span className="font-bold text-sm text-white">
                    {clickedLocation.name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {clickedLocation.country} · {clickedLocation.region}
                </div>
              </div>

              <button
                onClick={() => setClickedLocation(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors text-xs"
              >
                ✕
              </button>
            </div>

            {/* Coordinates & Elevation/Depth */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="p-2 rounded bg-slate-900/80 border border-cyan-500/15">
                <span className="text-slate-400 block text-[10px]">经纬度坐标</span>
                <span className="font-mono text-cyan-300 font-medium">
                  {clickedLocation.lat.toFixed(4)}°N, {clickedLocation.lng.toFixed(4)}°E
                </span>
              </div>

              <div className="p-2 rounded bg-slate-900/80 border border-cyan-500/15">
                <span className="text-slate-400 block text-[10px]">地貌/高程水深</span>
                <span className="font-mono text-emerald-300 font-medium">
                  {clickedLocation.elevationOrDepth || '近海大陆架'}
                </span>
              </div>
            </div>

            {/* If Blue Carbon Zone: show full telemetry */}
            {clickedLocation.type === 'blue-carbon' && clickedLocation.blueCarbonStationId && (
              <div className="space-y-2 mb-3">
                <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-300 font-semibold block mb-1">
                    🌿 蓝碳生态系统核心物种与指标
                  </span>
                  <div className="text-xs text-slate-200">
                    核心优势物种: <span className="text-emerald-400 font-semibold">{STATIONS[clickedLocation.blueCarbonStationId]?.coreSpecies}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 mt-1">
                    <span>年固碳储量: <strong className="font-num text-cyan-300">{STATIONS[clickedLocation.blueCarbonStationId]?.carbonTotal} 万吨</strong></span>
                    <span>有机碳埋藏: <strong className="font-num text-amber-300">{STATIONS[clickedLocation.blueCarbonStationId]?.buoySensors.burialRate} g/(m²·a)</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 text-center text-xs">
                  <div className="p-1.5 rounded bg-slate-900/70 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">水下DO</span>
                    <span className="font-num text-emerald-300 font-bold">
                      {STATIONS[clickedLocation.blueCarbonStationId]?.buoySensors.do} mg/L
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900/70 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">pH 酸碱度</span>
                    <span className="font-num text-cyan-300 font-bold">
                      {STATIONS[clickedLocation.blueCarbonStationId]?.buoySensors.ph}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900/70 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">水体盐度</span>
                    <span className="font-num text-amber-300 font-bold">
                      {STATIONS[clickedLocation.blueCarbonStationId]?.buoySensors.salinity} PSU
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (clickedLocation.blueCarbonStationId) {
                      onSelectStation(STATIONS[clickedLocation.blueCarbonStationId]);
                    }
                  }}
                  className="w-full py-1.5 px-3 rounded bg-emerald-600/30 border border-emerald-400/50 text-emerald-200 text-xs font-semibold hover:bg-emerald-500/40 transition-colors flex items-center justify-center gap-1.5 mt-2"
                >
                  <span>已联动大屏专属数据集</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>

                <button
                  onClick={() => {
                    if (clickedLocation.blueCarbonStationId && STATIONS[clickedLocation.blueCarbonStationId]) {
                      const st = STATIONS[clickedLocation.blueCarbonStationId];
                      onSelectStation(st);
                      setSelected3DStation(st);
                      setIs3DModalOpen(true);
                    }
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-emerald-600/40 via-cyan-500/30 to-emerald-600/40 border border-emerald-400/70 text-emerald-200 text-xs font-bold hover:bg-emerald-500/40 transition-all flex items-center justify-center gap-1.5 mt-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>查看该站点超清实景与卫星遥感 (双击基站)</span>
                </button>
              </div>
            )}

            {/* Non Blue-Carbon or Regional Description */}
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800">
              {clickedLocation.description}
            </div>
          </div>
        )}
      </div>

      {/* Station 3D Digital Twin & Real Scene Panorama Modal */}
      <Station3DDigitalTwinModal
        isOpen={is3DModalOpen}
        station={selected3DStation || (currentStation.id === 'all' ? STATIONS.dongying : currentStation)}
        onClose={() => setIs3DModalOpen(false)}
        onSelectStation={(st) => {
          onSelectStation(st);
          setSelected3DStation(st);
        }}
      />
    </div>
  );
};
