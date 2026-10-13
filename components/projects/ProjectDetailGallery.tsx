"use client";

import { useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, Cross2Icon, EnterFullScreenIcon } from "@radix-ui/react-icons";
import type { StudioProjectImage } from "@/lib/content-api";
import { PortfolioImage } from "./PortfolioImage";
import styles from "./ProjectDetailGallery.module.css";

export function ProjectDetailGallery({ images, title }: { images: StudioProjectImage[]; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(0);
  const image = images[selected];
  function open(index: number) { setSelected(index); dialog.current?.showModal(); }
  function step(direction: number) { setSelected((index) => (index + direction + images.length) % images.length); }
  if (!images.length) return <div className={styles.empty}>Project photography coming soon.</div>;

  return <>
    <div className={styles.mosaic} data-count={Math.min(images.length, 4)}>
      {images.slice(0, 4).map((item, index) => <button key={`${item.image_url}-${index}`} type="button" className={index === 0 ? styles.main : styles.preview}
        aria-label={index === 3 ? (images.length > 4 ? `Open gallery: +${images.length - 4} more photos of ${title}` : `View all ${images.length} photos of ${title}`) : `Open photo ${index + 1} of ${title}`} onClick={() => open(index)}>
        <PortfolioImage image={item} sizes={index === 0 ? "(max-width: 767px) 100vw, 70vw" : "(max-width: 767px) 30vw, 24vw"} eager={index === 0} />
        {index === 0 && <span className={styles.expand}><EnterFullScreenIcon aria-hidden="true" /><span>View gallery</span></span>}
        {index === 3 && <span className={styles.more}>{images.length > 4 ? <>+{images.length - 4}<span className={styles.photoWord}> photos</span></> : <EnterFullScreenIcon aria-hidden="true" />}</span>}
      </button>)}
    </div>
    <dialog ref={dialog} className={styles.dialog} aria-label={`${title} photo gallery`}
      onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); step(event.key === "ArrowRight" ? 1 : -1); }
      }}>
      <div className={styles.viewer}>
        <header><span>{title}</span><button type="button" aria-label="Close gallery" onClick={() => dialog.current?.close()}><Cross2Icon aria-hidden="true" /></button></header>
        <div key={selected} className={styles.fullImage}>
          <PortfolioImage key={image.image_url} image={image} sizes="95vw" eager />
        </div>
        <footer>
          <button type="button" aria-label="Previous photo" disabled={images.length < 2} onClick={() => step(-1)}><ArrowLeftIcon aria-hidden="true" /></button>
          <div aria-live="polite" aria-atomic="true"><span>{selected + 1} / {images.length}</span>{image.caption && <p>{image.caption}</p>}</div>
          <button type="button" aria-label="Next photo" disabled={images.length < 2} onClick={() => step(1)}><ArrowRightIcon aria-hidden="true" /></button>
        </footer>
      </div>
    </dialog>
  </>;
}
