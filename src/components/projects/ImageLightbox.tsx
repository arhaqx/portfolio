"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./ProjectMedia.module.scss";

interface ImageLightboxProps {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageLightbox({ open, src, alt, onClose }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // The native dialog's top layer escapes card clipping and stacking contexts.
    dialog.showModal();

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.lightbox}
      data-lenis-prevent
      aria-label={alt || "Pratinjau gambar proyek"}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      <div className={styles.lightboxHeader}>
        <p className={styles.imageTitle}>{alt}</p>
        <button type="button" className={styles.closeButton} onClick={() => dialogRef.current?.close()} aria-label="Tutup gambar" autoFocus>
          Tutup <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className={styles.lightboxViewport}>
        {open ? <Image src={src} alt={alt} fill sizes="100vw" unoptimized loading="eager" className={styles.fullImage} /> : null}
      </div>
    </dialog>
  );
}
