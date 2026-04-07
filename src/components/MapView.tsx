"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import {
  MicroMarket,
  getPriceColor,
  getInvestColor,
  getSafetyColor,
  getAqiColor,
  getAqiLabel,
  getFloodColor,
  formatPrice,
} from "@/data/mumbai";

type Overlay = "price" | "invest" | "safety" | "aqi";

interface MapViewProps {
  markets: MicroMarket[];
  overlay: Overlay;
  selectedArea: MicroMarket | null;
  compareMode: boolean;
  compareList: MicroMarket[];
  onAreaClick: (market: MicroMarket) => void;
}

const getNodeColor = (m: MicroMarket, overlay: Overlay): string => {
  switch (overlay) {
    case "price":
      return getPriceColor(m.pricePerSqft);
    case "invest":
      return getInvestColor(m.investScore);
    case "safety":
      return getSafetyColor(m.safety);
    case "aqi":
      return getAqiColor(m.aqi);
    default:
      return "#666";
  }
};

const getMarkerSize = (m: MicroMarket, overlay: Overlay): number => {
  switch (overlay) {
    case "price":
      return Math.max(16, Math.min(36, m.pricePerSqft / 2000));
    case "invest":
      return Math.max(16, m.investScore * 3.2);
    default:
      return 22;
  }
};

const getMarkerLabel = (m: MicroMarket, overlay: Overlay): string => {
  switch (overlay) {
    case "price":
      return `${(m.pricePerSqft / 1000).toFixed(0)}K`;
    case "invest":
      return `${m.investScore}`;
    case "safety":
      return `${m.safety}`;
    case "aqi":
      return `${m.aqi}`;
    default:
      return "";
  }
};

export default function MapView({
  markets,
  overlay,
  selectedArea,
  compareMode,
  compareList,
  onAreaClick,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [19.076, 72.877],
      zoom: 11,
      zoomControl: true,
      attributionControl: true,
      minZoom: 10,
      maxZoom: 18,
    });

    // Dark map tiles from CartoDB
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Build popup HTML
  const buildPopup = useCallback(
    (m: MicroMarket): string => {
      const twoHBKCost = formatPrice(m.pricePerSqft * 650);
      const estRent = Math.round(
        (m.pricePerSqft * 650 * m.rentYield) / 1200
      ).toLocaleString("en-IN");

      return `
      <div style="font-family: -apple-system, sans-serif; min-width: 240px; padding: 4px;">
        <div style="font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 2px;">
          ${m.name}
        </div>
        <div style="font-size: 11px; color: #888; margin-bottom: 10px;">
          ${m.zone} &bull; ${m.type}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
          <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 8px;">
            <div style="font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Price/sqft</div>
            <div style="font-size: 16px; font-weight: 700; color: ${getPriceColor(m.pricePerSqft)};">
              ₹${(m.pricePerSqft / 1000).toFixed(1)}K
            </div>
            <div style="font-size: 10px; color: #00e676;">+${m.priceChange}% YoY</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 8px;">
            <div style="font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Invest Score</div>
            <div style="font-size: 16px; font-weight: 700; color: ${getInvestColor(m.investScore)};">
              ${m.investScore}/10
            </div>
            <div style="font-size: 10px; color: #888;">Yield ${m.rentYield}%</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-bottom: 10px;">
          <div style="text-align: center; background: rgba(255,255,255,0.03); border-radius: 6px; padding: 6px 4px;">
            <div style="font-size: 9px; color: #888;">Safety</div>
            <div style="font-size: 13px; font-weight: 600; color: ${getSafetyColor(m.safety)};">${m.safety}/10</div>
          </div>
          <div style="text-align: center; background: rgba(255,255,255,0.03); border-radius: 6px; padding: 6px 4px;">
            <div style="font-size: 9px; color: #888;">AQI</div>
            <div style="font-size: 13px; font-weight: 600; color: ${getAqiColor(m.aqi)};">${m.aqi}</div>
          </div>
          <div style="text-align: center; background: rgba(255,255,255,0.03); border-radius: 6px; padding: 6px 4px;">
            <div style="font-size: 9px; color: #888;">Flood</div>
            <div style="font-size: 13px; font-weight: 600; color: ${getFloodColor(m.flooding)};">${m.flooding}</div>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.03); border-radius: 6px; padding: 6px 8px; margin-bottom: 8px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #888;">Water Supply</span>
            <span style="color: ${m.waterHrs >= 18 ? "#00e676" : "#ff6d00"};">${m.waterHrs}h/day</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #888;">Metro</span>
            <span style="color: #ccc;">${m.metroProximity}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #888;">Upcoming Projects</span>
            <span style="color: #ccc;">${m.upcoming}</span>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, rgba(255,109,0,0.1), rgba(255,23,68,0.1)); border-radius: 8px; padding: 8px; border: 1px solid rgba(255,109,0,0.2);">
          <div style="font-size: 9px; color: #ff6d00; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Est. 2BHK (650 sqft)</div>
          <div style="font-size: 18px; font-weight: 700; color: #fff;">₹${twoHBKCost}</div>
          <div style="font-size: 10px; color: #888;">Est. rent: ₹${estRent}/mo</div>
        </div>
      </div>
    `;
    },
    []
  );

  // Update markers when data or overlay changes
  useEffect(() => {
    if (!markersRef.current || !mapRef.current) return;

    markersRef.current.clearLayers();

    markets.forEach((m) => {
      const color = getNodeColor(m, overlay);
      const size = getMarkerSize(m, overlay);
      const label = getMarkerLabel(m, overlay);
      const isSelected = selectedArea?.id === m.id;
      const isCompared = compareList.some((c) => c.id === m.id);

      const borderColor = isSelected
        ? "#ffffff"
        : isCompared
          ? "#00e676"
          : "rgba(255,255,255,0.25)";
      const borderWidth = isSelected || isCompared ? 3 : 1.5;

      const icon = L.divIcon({
        className: "area-marker",
        html: `
          <div style="
            position: relative;
            width: ${size}px;
            height: ${size}px;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: ${size * 2.5}px;
              height: ${size * 2.5}px;
              border-radius: 50%;
              background: radial-gradient(circle, ${color}30 0%, transparent 70%);
              pointer-events: none;
            "></div>
            <div style="
              position: relative;
              width: ${size}px;
              height: ${size}px;
              border-radius: 50%;
              background: radial-gradient(circle at 35% 35%, ${color}, ${color}aa);
              border: ${borderWidth}px solid ${borderColor};
              box-shadow: 0 0 ${size / 2}px ${color}88, 0 2px 8px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              ${
                size > 20
                  ? `<span style="font-size: ${Math.max(8, size / 3.5)}px; font-weight: 700; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.8); pointer-events: none;">${label}</span>`
                  : ""
              }
            </div>
          </div>
          <div style="
            position: absolute;
            top: ${size + 4}px;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            font-size: 10px;
            font-weight: ${isSelected ? "700" : "500"};
            color: ${isSelected ? "#fff" : "#bbb"};
            text-shadow: 0 1px 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1);
            text-align: center;
            pointer-events: none;
            letter-spacing: 0.3px;
          ">${m.name.length > 16 ? m.name.split("(")[0].trim() : m.name}</div>
        `,
        iconSize: [size, size + 20],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2 - 4],
      });

      const marker = L.marker([m.lat, m.lng], { icon })
        .bindPopup(buildPopup(m), {
          maxWidth: 280,
          minWidth: 250,
          closeButton: true,
        })
        .on("click", () => {
          onAreaClick(m);
        });

      markersRef.current!.addLayer(marker);
    });
  }, [markets, overlay, selectedArea, compareMode, compareList, onAreaClick, buildPopup]);

  // Fly to selected area
  useEffect(() => {
    if (!mapRef.current || !selectedArea) return;
    mapRef.current.flyTo([selectedArea.lat, selectedArea.lng], 14, {
      duration: 1,
    });
  }, [selectedArea]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", minHeight: 500 }}
    />
  );
}
