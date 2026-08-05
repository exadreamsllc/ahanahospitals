"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WelcomeVideo.module.css";

type Track = {
  id: string;
  label: string;
  src: string;
  /** Accessible description announced for the selected track. */
  ariaLabel: string;
};

const TRACKS: readonly Track[] = [
  {
    id: "en",
    label: "English",
    src: "/assets/video/welcome-english.mp4",
    ariaLabel: "Welcome to Ahana in English",
  },
  {
    id: "ta",
    label: "தமிழ்",
    src: "/assets/video/welcome-tamil.mp4",
    ariaLabel: "அஹானா வரவேற்பு காணொளி தமிழில்",
  },
];

/**
 * Welcome video with an English/Tamil toggle, matching the approved V2 hero.
 *
 * Uses the native video element so browser controls, captions support and
 * keyboard handling come from the platform. Switching language swaps the
 * source and pauses — it never autoplays.
 */
export function WelcomeVideo() {
  const [activeId, setActiveId] = useState(TRACKS[0].id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasSelectedTrack = useRef(false);

  const active = TRACKS.find((track) => track.id === activeId) ?? TRACKS[0];

  function selectTrack(track: Track) {
    hasSelectedTrack.current = true;
    if (track.id === activeId) {
      void videoRef.current?.play().catch(() => undefined);
      return;
    }
    setActiveId(track.id);
  }

  useEffect(() => {
    if (!hasSelectedTrack.current) return;
    const video = videoRef.current;
    if (!video) return;
    video.load();
    void video.play().catch(() => undefined);
  }, [activeId]);

  return (
    <figure className={styles.card}>
      <video
        ref={videoRef}
        key={active.id}
        className={styles.video}
        src={active.src}
        poster="/assets/founder.webp"
        preload="metadata"
        controls
        playsInline
        aria-label={active.ariaLabel}
      />

      <div className={styles.languages} role="group" aria-label="Video language">
        {TRACKS.map((track) => {
          const isActive = track.id === activeId;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => selectTrack(track)}
              aria-pressed={isActive}
              className={`${styles.language} ${isActive ? styles.languageActive : ""}`}
            >
              {track.label}
            </button>
          );
        })}
      </div>

      <figcaption className={styles.caption}>A welcome from our doctor</figcaption>
    </figure>
  );
}
