"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: { image_url: string; display_order: number }[];
  productName: string;
}

export default function ProductGallery({ images, productName }: Props) {
  const [current, setCurrent] = useState(0);

  if (!images.length) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="space-y-3">
      {/* Imagem principal */}
      <div className="relative aspect-square bg-zinc-50 overflow-hidden">
        <Image
          src={images[current].image_url}
          alt={`${productName} - Foto ${current + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-6 md:p-10"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 shadow-md transition-all z-10"
            >
              <ChevronLeft className="h-5 w-5 text-zinc-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 shadow-md transition-all z-10"
            >
              <ChevronRight className="h-5 w-5 text-zinc-700" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 w-2 transition-all ${
                    i === current ? "bg-brand-blue w-6" : "bg-zinc-300"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative h-16 w-16 md:h-20 md:w-20 shrink-0 border-2 overflow-hidden transition-all ${
                i === current ? "border-brand-blue" : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <Image
                src={img.image_url}
                alt={`Thumb ${i + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
