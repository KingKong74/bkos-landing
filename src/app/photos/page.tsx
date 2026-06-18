"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPhotos, type Photo } from "@/lib/photos";

export default function PhotosPage() {
  const photos = getAllPhotos();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? null : Math.max(0, i - 1)));
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? null : Math.min(photos.length - 1, i + 1)));
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, photos.length]);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px 64px" }}>
      <div style={{ marginBottom: 32 }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "#a8a59c",
            textDecoration: "none",
          }}
        >
          ← bkos.dev
        </Link>
        <h1 style={{ fontSize: 32, fontWeight: 500, margin: "12px 0 4px", letterSpacing: "-0.02em" }}>
          Photos
        </h1>
        <p style={{ fontSize: 14, color: "#a8a59c", margin: 0 }}>
          {photos.length} moment{photos.length === 1 ? "" : "s"}.
        </p>
      </div>

      <PhotoGrid photos={photos} onOpen={(i) => setOpenIndex(i)} />

      {openIndex !== null && (
        <Lightbox
          photos={photos}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((i) => (i === null ? null : Math.max(0, i - 1)))}
          onNext={() => setOpenIndex((i) => (i === null ? null : Math.min(photos.length - 1, i + 1)))}
        />
      )}
    </main>
  );
}

function PhotoGrid({ photos, onOpen }: { photos: Photo[]; onOpen: (i: number) => void }) {
  return (
    <div
      style={{
        columnCount: 3,
        columnGap: 12,
      }}
    >
      <style>{`
        @media (max-width: 900px) { .pg-col { column-count: 2 !important; } }
        @media (max-width: 560px) { .pg-col { column-count: 1 !important; } }
      `}</style>
      <div className="pg-col" style={{ columnCount: 3, columnGap: 12 }}>
        {photos.map((p, i) => (
          <button
            key={p.src}
            onClick={() => onOpen(i)}
            style={{
              all: "unset",
              cursor: "zoom-in",
              display: "block",
              breakInside: "avoid",
              marginBottom: 12,
              width: "100%",
              borderRadius: 8,
              overflow: "hidden",
              background: "#1a1916",
            }}
          >
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                aspectRatio: `${p.width} / ${p.height}`,
                objectFit: "cover",
                background: "#26241f",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[index];
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.95)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        disabled={index === 0}
        aria-label="Previous"
        style={navStyle("left")}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        disabled={index === photos.length - 1}
        aria-label="Next"
        style={navStyle("right")}
      >
        ›
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: 20,
          right: 24,
          background: "transparent",
          border: "none",
          color: "#f4f4f1",
          fontSize: 28,
          cursor: "pointer",
        }}
      >
        ×
      </button>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "100%", maxHeight: "100%", textAlign: "center" }}>
        <img
          src={photo.src}
          alt={photo.alt}
          style={{
            maxWidth: "100%",
            maxHeight: "80vh",
            objectFit: "contain",
            borderRadius: 8,
          }}
        />
        <p style={{ fontSize: 13, color: "#a8a59c", marginTop: 12 }}>
          {photo.alt}
          {photo.date && <span style={{ marginLeft: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "#56544f" }}>{photo.date}</span>}
        </p>
      </div>
    </div>
  );
}

function navStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    [side]: 16,
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(38,36,31,0.7)",
    border: "1px solid #3a3935",
    borderRadius: "50%",
    width: 44,
    height: 44,
    color: "#f4f4f1",
    fontSize: 24,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}
