import Image from "next/image";

export type PublicIconName = "globe" | "window" | "file" | "next" | "vercel";

const iconSources: Record<PublicIconName, string> = {
  globe: "/globe.svg",
  window: "/window.svg",
  file: "/file.svg",
  next: "/next.svg",
  vercel: "/vercel.svg",
};

const sizes = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export default function PublicIcon({
  name,
  size = "md",
  className = "",
}: {
  name: PublicIconName;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <Image
      src={iconSources[name]}
      alt=""
      width={sizes[size]}
      height={sizes[size]}
      aria-hidden="true"
      className={className}
    />
  );
}
