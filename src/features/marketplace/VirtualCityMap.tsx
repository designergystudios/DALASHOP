import React, { useState } from 'react';
import { MapPin, Users, Store, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Stall } from '../../types';

interface VirtualCityMapProps {
  onSelectStall: (stall: Stall) => void;
}

export const VirtualCityMap: React.FC<VirtualCityMapProps> = ({ onSelectStall }) => {
  const { districts, stalls, selectedDistrictId, setSelectedDistrictId } = useAppStore();
  const [hoveredPlot, setHoveredPlot] = useState<string | null>(null);

  const activeDistrict = districts.find((d) => d.id === selectedDistrictId) || districts[0];
  const districtStalls = stalls.filter((s) => selectedDistrictId === 'all' || s.districtId === selectedDistrictId);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 relative overflow-hidden shadow-2xl">
      {/* City Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white font-heading tracking-wide uppercase">
              Interactive Virtual City Grid
            </h3>
            <span className="text-[11px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
              {activeDistrict.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual plot matrix displaying live digital stalls, citizen footfall, and occupied commercial plots.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>{activeDistrict.activeCitizens.toLocaleString()} live visitors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-orange-400" />
            <span>{districtStalls.length} active kiosks</span>
          </div>
        </div>
      </div>

      {/* Isometric/Orthogonal Grid Simulation */}
      <div className="relative w-full aspect-[21/9] min-h-[220px] rounded-xl bg-slate-950 border border-slate-800/90 p-4 overflow-hidden flex items-center justify-center">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ea580c 1px, transparent 1px), linear-gradient(to bottom, #0284c7 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Ambient District Glow */}
        <div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: activeDistrict.accentColor }}
        />

        {/* City Plots Representation */}
        <div className="relative z-10 w-full max-w-2xl grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-3">
          {stalls.map((stall, idx) => {
            const isMatchingDistrict = selectedDistrictId === 'all' || stall.districtId === selectedDistrictId;
            const isHovered = hoveredPlot === stall.id;

            return (
              <div
                key={stall.id}
                onMouseEnter={() => setHoveredPlot(stall.id)}
                onMouseLeave={() => setHoveredPlot(null)}
                onClick={() => onSelectStall(stall)}
                className={`group relative p-2 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isMatchingDistrict
                    ? 'border-slate-700 bg-slate-900/90 hover:border-orange-500 hover:bg-slate-800/90 hover:scale-105 shadow-lg'
                    : 'border-slate-850 bg-slate-950/40 opacity-40 hover:opacity-80'
                }`}
                style={{
                  boxShadow: isHovered ? `0 0 15px ${stall.themeColor}40` : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-slate-400 group-hover:text-orange-400">
                    {stall.plotNumber}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: stall.themeColor }}
                  />
                </div>

                <div className="my-1.5 text-center">
                  <div className="w-7 h-7 mx-auto rounded-lg bg-slate-800 flex items-center justify-center text-xs group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    🏪
                  </div>
                  <p className="text-[10px] font-semibold text-slate-200 truncate mt-1">
                    {stall.name}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>★ {stall.rating}</span>
                  <span className="text-emerald-400">{stall.footfallToday}v</span>
                </div>
              </div>
            );
          })}

          {/* Reserved / Vacant Plots for expansion */}
          {[1, 2, 3, 4].map((v) => (
            <div
              key={`empty-${v}`}
              className="p-2 rounded-xl border border-dashed border-slate-800 bg-slate-950/30 flex flex-col items-center justify-center text-center opacity-60"
            >
              <span className="text-[8px] font-mono text-slate-500">PLOT {v + 10}</span>
              <span className="text-[10px] text-slate-500 mt-1">Vacant</span>
              <span className="text-[8px] text-emerald-500 mt-0.5 font-semibold">Leaseable</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
