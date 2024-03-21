import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useCallback, useMemo, useRef } from "react";

type Library =
  | "core"
  | "maps"
  | "places"
  | "geocoding"
  | "routes"
  | "marker"
  | "geometry"
  | "elevation"
  | "streetView"
  | "journeySharing"
  | "drawing"
  | "visualization";

type Props = {
  apiKey: string;
  handlePlaceChanged: (place: string | undefined) => Promise<void>;
};

const PlacesSearch = ({ apiKey, handlePlaceChanged }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const libraries: Library[] = useMemo(() => ["places"], []);
  const loadScriptRef = useRef(null);
  const handle = useCallback(() => {
    handlePlaceChanged(inputRef.current?.value || "");
  }, [handlePlaceChanged]);

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
      ref={loadScriptRef}
    >
      <Autocomplete
        className="text-black "
        onLoad={() => {
          return;
        }}
        onPlaceChanged={() => {
          handle();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Look up a property"
          className="w-full rounded-lg
                  bg-white text-black p-2 py-3"
        />
      </Autocomplete>
    </LoadScript>
  );
};

export default PlacesSearch;
