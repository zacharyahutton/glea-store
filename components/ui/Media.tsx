import Image from "next/image";
import { resolveSlot } from "@/lib/media-server";
import { slots, type SlotName } from "@/lib/media";
import { Placeholder } from "./Placeholder";

/**
 * Server image for a named slot. Fills its parent (parent sets size/aspect).
 * Desktop and mobile files are served with <picture> so each screen downloads one image.
 */
export function Media({ slot, sizes = "100vw", priority = false, alt, color }: { slot: SlotName; sizes?: string; priority?: boolean; alt?: string; color?: string }) {
  const img = resolveSlot(slot);
  const s = slots[slot] as { alt: string; label?: string };
  if (!img) return <Placeholder label={s.label ?? s.alt} color={color} />;
  const a = alt ?? img.alt;
  if (img.mobile) {
    return (
      <picture>
        <source media="(max-width: 767px)" srcSet={img.mobile.src} width={img.mobile.w} height={img.mobile.h} />
        <Image src={img.src} alt={a} width={img.w} height={img.h} sizes={sizes} priority={priority} fetchPriority={priority ? "high" : undefined} />
      </picture>
    );
  }
  return <Image src={img.src} alt={a} width={img.w} height={img.h} sizes={sizes} priority={priority} />;
}
