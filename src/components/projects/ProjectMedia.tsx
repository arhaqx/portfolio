"use client";

import Image from "next/image";
import { useState } from "react";
import { Column, Icon, Text } from "@once-ui-system/core";
import { projectImageDetails } from "@/resources/project-images";
import { ImageLightbox } from "./ImageLightbox";
import styles from "./VisualDesign.module.scss";

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export function ImageGallery({ images, label }: { images: GalleryImage[]; label: string }) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className={styles.artworkGrid} role="group" aria-label={label}>
        {images.map((image) => (
          <Column as="figure" key={image.src} gap="12" margin="0">
            <button type="button" className={styles.artworkButton} onClick={() => setSelected(image)} aria-label={"Perbesar " + image.caption} aria-haspopup="dialog">
              <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 600px) 85vw, (max-width: 900px) 42vw, 340px" className={styles.artworkImage} />
              <span className={styles.zoomHint} aria-hidden="true"><Icon name="arrowUpRight" size="s" /></span>
            </button>
            <Text as="figcaption" variant="body-default-s">{image.caption}</Text>
          </Column>
        ))}
      </div>
      <ImageLightbox open={selected !== null} src={selected?.src || ""} alt={selected?.alt || ""} onClose={() => setSelected(null)} />
    </>
  );
}

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const galleryImages = images.map((src, index) => {
    const details = projectImageDetails[src] ?? { width: 1024, height: 576, caption: `Tangkapan layar ${index + 1}` };
    return { src, ...details, alt: `${title} — ${details.caption}` };
  });

  return <ImageGallery images={galleryImages} label="Galeri gambar proyek" />;
}
