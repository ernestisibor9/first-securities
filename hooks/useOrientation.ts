import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

export type Orientation = "PORTRAIT" | "LANDSCAPE";

export function useOrientation() {
  const { width, height } = useWindowDimensions();
  const [orientation, setOrientation] = useState<Orientation>(
    width > height ? "LANDSCAPE" : "PORTRAIT"
  );

  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      const o = event.orientationInfo.orientation;
      const isLandscape = 
        o === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;
      setOrientation(isLandscape ? "LANDSCAPE" : "PORTRAIT");
    });

    // Ensure we are unlocked
    ScreenOrientation.unlockAsync();

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  // Update orientation if width/height change (backup to the listener)
  useEffect(() => {
    setOrientation(width > height ? "LANDSCAPE" : "PORTRAIT");
  }, [width, height]);

  // Dynamic scale factor
  // We use the smaller dimension (width in portrait, height in landscape) as the base (375px)
  const baseWidth = 375;
  const shortDimension = width < height ? width : height;
  const scale = shortDimension / baseWidth;

  return { 
    orientation, 
    isLandscape: orientation === "LANDSCAPE", 
    scale, 
    width, 
    height 
  };
}
