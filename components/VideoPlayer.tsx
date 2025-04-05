// components/VideoPlayer.tsx
"use client";

import ReactPlayer from "react-player";
import { useState, useEffect } from "react";

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="relative aspect-video bg-gray-200 animate-pulse rounded-lg">
        {/* Optional loading skeleton */}
      </div>
    );
  }

  return (
    <div className="relative aspect-video">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        playing={false}
        fallback={<div>Loading video player...</div>}
      />
    </div>
  );
};