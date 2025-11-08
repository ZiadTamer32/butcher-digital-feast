import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialAddress?: string;
}

export const LocationPicker = ({ onLocationSelect, initialAddress = "" }: LocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem("googleMapsApiKey") || "");
  const [needsKey, setNeedsKey] = useState(!localStorage.getItem("googleMapsApiKey"));
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!apiKey) return;

    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error("Error loading Google Maps");
      setNeedsKey(true);
    };
    
    // Check if script is already loaded
    if (window.google?.maps) {
      setScriptLoaded(true);
    } else {
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey]);

  useEffect(() => {
    if (!scriptLoaded || !mapRef.current || !window.google) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: { lat: 30.0444, lng: 31.2357 }, // Cairo, Egypt
      zoom: 12,
      mapTypeControl: false,
    });

    const markerInstance = new google.maps.Marker({
      map: mapInstance,
      position: { lat: 30.0444, lng: 31.2357 },
      draggable: true,
    });

    // Handle marker drag
    markerInstance.addListener("dragend", () => {
      const position = markerInstance.getPosition();
      if (position) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            onLocationSelect({
              lat: position.lat(),
              lng: position.lng(),
              address: results[0].formatted_address,
            });
          }
        });
      }
    });

    // Handle map click
    mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        markerInstance.setPosition(e.latLng);
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: e.latLng }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            onLocationSelect({
              lat: e.latLng!.lat(),
              lng: e.latLng!.lng(),
              address: results[0].formatted_address,
            });
          }
        });
      }
    });

    setMap(mapInstance);
    setMarker(markerInstance);
  }, [scriptLoaded, onLocationSelect]);

  const handleKeySubmit = () => {
    if (apiKey) {
      localStorage.setItem("googleMapsApiKey", apiKey);
      setNeedsKey(false);
      window.location.reload();
    }
  };

  if (needsKey) {
    return (
      <div className="gradient-card p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-5 h-5" />
          <p className="text-sm">
            الرجاء إدخال مفتاح Google Maps API لاستخدام خريطة الموقع
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="أدخل مفتاح Google Maps API"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1"
          />
          <button
            onClick={handleKeySubmit}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            حفظ
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          يمكنك الحصول على مفتاح API مجاني من{" "}
          <a
            href="https://console.cloud.google.com/google/maps-apis"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Cloud Console
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>انقر على الخريطة أو اسحب العلامة لتحديد موقعك</span>
      </div>
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-xl border border-border overflow-hidden"
      />
    </div>
  );
};
