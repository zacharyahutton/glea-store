const paths: Record<string, string> = {
  cart: "M5.6 8.5h12.8l-.85 10.6a1.6 1.6 0 0 1-1.6 1.4H8.05a1.6 1.6 0 0 1-1.6-1.4L5.6 8.5ZM9 8.5V7a3 3 0 0 1 6 0v1.5",
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Zm4.7-1.8L20 20",
  menu: "M3.5 7.5h17M3.5 12h17M3.5 16.5h17",
  close: "M6 6l12 12M18 6 6 18",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  left: "M15 6l-6 6 6 6",
  right: "M9 6l6 6-6 6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  check: "M5 12.5 10 17l9-10",
  x: "M7 7l10 10M17 7 7 17",
  truck: "M3 6h11v10H3zM14 9h4l3 3v4h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  return: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
  box: "M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9ZM3 7.5 12 12l9-4.5M12 12v9",
  chat: "M4 5h16v11H9l-5 4V5Z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  clip: "M8 3v9a4 4 0 0 0 8 0V6a2.5 2.5 0 0 0-5 0v6a1 1 0 0 0 2 0V7",
  neck: "M6 20c0-6 2-9 6-11s5-4 5-6M15 3h4v4",
  battery: "M3 8h15v8H3zM21 11v2M6 11h6",
  sun: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-13v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4",
  palette: "M12 3a9 9 0 0 0 0 18c1 0 1.5-.7 1.5-1.5 0-1.2-1-1.5-1-2.5S13.3 15 14.5 15H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8ZM7.5 11.5h.01M10 7.5h.01M15 7.5h.01",
  moon: "M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z",
  gift: "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1-3-5-3-5 0m5 0c1-3 5-3 5 0",
  pause: "M9 6v12M15 6v12",
  play: "M8 5v14l11-7L8 5Z",
  bot: "M5 9h14v10H5zM12 9V5M9 14h.01M15 14h.01M3 13v2M21 13v2",
  instagram: "M4 4h16v16H4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm5.5-9.5h.01",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0",
  lock: "M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z",
};

export type IconName = keyof typeof paths | string;

export function Icon({ name, size = 22, stroke = 1.6, className, label }: { name: IconName; size?: number; stroke?: number; className?: string; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
    >
      <path d={paths[name] ?? paths.plus} />
    </svg>
  );
}
