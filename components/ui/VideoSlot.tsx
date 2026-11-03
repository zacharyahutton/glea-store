import { Media } from "./Media";
import { BgVideo } from "./BgVideo";
import { resolveVideo } from "@/lib/video-server";
import type { SlotName } from "@/lib/media";

/**
 * Background video slot: a still poster (the LCP image, preloaded when priority) with a muted loop on top.
 * The video starts only after the page has loaded and the browser is idle, never with reduced motion or Save-Data,
 * and fades in over the poster (.3s). Missing mp4 = still image only.
 */
export function VideoSlot({ base, still, priority = false, sizes = "100vw" }: { base: string; still: SlotName; priority?: boolean; sizes?: string }) {
  const v = resolveVideo(base, still);
  return (
    <>
      <Media slot={still} image={v.poster} priority={priority} sizes={sizes} />
      {v.d ? <BgVideo d={v.d} m={v.m ?? v.d} /> : null}
    </>
  );
}
