/** Intentional-looking tile for an image that has not arrived yet. Swap by dropping the file into /public/media. */
export function Placeholder({ label, color, note = "Photo coming soon" }: { label?: string; color?: string; note?: string | null }) {
  return (
    <div className="ph" style={color ? ({ ["--ph-c" as string]: color } as React.CSSProperties) : undefined} role="img" aria-label={label ? `${label}, photo coming soon` : "Photo coming soon"}>
      <div className="ph__in" aria-hidden="true">
        <span className="ph__mark" />
        {label ? <span className="ph__label">{label}</span> : null}
        {note ? <span className="ph__note">{note}</span> : null}
      </div>
    </div>
  );
}
