import Image, { getImageProps } from "next/image";
import { preload } from "react-dom";
import { resolveSlot } from "@/lib/media-server";
import { slots, type SlotName } from "@/lib/media";
import { Placeholder } from "./Placeholder";

const MOBILE_MQ = "(max-width: 767px)";
const DESKTOP_MQ = "(min-width: 768px)";

/**
 * Server image for a named slot. Fills its parent (parent sets size/aspect).
 * Desktop and mobile files are art-directed with <picture>, both through the image optimizer,
 * so each screen downloads one right-sized image. For the LCP image (priority) we add one
 * media-scoped preload per source, so a phone never preloads the desktop file. No lazy loading on it.
 */
export function Media({ slot, sizes = "100vw", priority = false, alt, color }: { slot: SlotName; sizes?: string; priority?: boolean; alt?: string; color?: string }) {
  const img = resolveSlot(slot);
  const s = slots[slot] as { alt: string; label?: string };
  if (!img) return <Placeholder label={s.label ?? s.alt} color={color} />;
  const a = alt ?? img.alt;
  if (img.mobile) {
    const common = { alt: a, sizes, loading: priority ? ("eager" as const) : ("lazy" as const) };
    const { props: { srcSet: dSet, ...rest } } = getImageProps({ ...common, src: img.src, width: img.w, height: img.h });
    const { props: { srcSet: mSet } } = getImageProps({ ...common, src: img.mobile.src, width: img.mobile.w, height: img.mobile.h });
    if (priority) {
      if (mSet) preload(img.mobile.src, { as: "image", imageSrcSet: mSet, imageSizes: sizes, fetchPriority: "high", media: MOBILE_MQ } as Parameters<typeof preload>[1]);
      if (dSet) preload(img.src, { as: "image", imageSrcSet: dSet, imageSizes: sizes, fetchPriority: "high", media: DESKTOP_MQ } as Parameters<typeof preload>[1]);
    }
    return (
      <picture>
        <source media={MOBILE_MQ} srcSet={mSet} sizes={sizes} width={img.mobile.w} height={img.mobile.h} />
        <source media={DESKTOP_MQ} srcSet={dSet} sizes={sizes} />
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img {...rest} fetchPriority={priority ? "high" : undefined} />
      </picture>
    );
  }
  return <Image src={img.src} alt={a} width={img.w} height={img.h} sizes={sizes} priority={priority} />;
}
