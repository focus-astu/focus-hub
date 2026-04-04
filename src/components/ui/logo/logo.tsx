import type { LogoProps } from "./logo.types"

const sizeConfig = {
  sm: { height: 32, focusSize: "text-xl", astuSize: "text-sm", gap: "gap-0.5", dotSize: 3, ringSize: 9, ringStroke: 2.2 },
  md: { height: 44, focusSize: "text-2xl", astuSize: "text-base", gap: "gap-0.5", dotSize: 4, ringSize: 12, ringStroke: 2.8 },
  lg: { height: 60, focusSize: "text-4xl", astuSize: "text-xl", gap: "gap-1", dotSize: 5, ringSize: 16, ringStroke: 3.2 },
  xl: { height: 80, focusSize: "text-6xl", astuSize: "text-3xl", gap: "gap-1", dotSize: 7, ringSize: 22, ringStroke: 4 },
} as const

const iconSizeMap = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
} as const

export const Logo = ({
  variant = "full",
  size = "md",
  className = "",
  inverted = false,
}: LogoProps) => {
  const color = inverted ? "#FFFFFF" : "#0D5BB5"
  const config = sizeConfig[size]

  if (variant === "icon") {
    const s = iconSizeMap[size]
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label="Focus ASTU"
      >
        <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="5" fill="none" />
        <circle cx="24" cy="24" r="5" fill={color} />
      </svg>
    )
  }

  return (
    <div
      className={`inline-flex flex-col items-center leading-none ${config.gap} ${className}`}
      role="img"
      aria-label="Focus ASTU"
    >
      {/* FOCUS — with the O replaced by a target/ring SVG */}
      <div className="flex items-center" style={{ height: config.height }}>
        <span
          className={`${config.focusSize} font-black tracking-tight`}
          style={{ color, lineHeight: 1 }}
        >
          F
        </span>
        <FocusO color={color} dotSize={config.dotSize} ringSize={config.ringSize} strokeWidth={config.ringStroke} height={config.height} />
        <span
          className={`${config.focusSize} font-black tracking-tight`}
          style={{ color, lineHeight: 1 }}
        >
          CUS
        </span>
      </div>

      {/* ASTU — lighter weight, slightly smaller, tracked out */}
      <span
        className={`${config.astuSize} font-semibold tracking-[0.22em]`}
        style={{ color, lineHeight: 1 }}
      >
        ASTU
      </span>
    </div>
  )
}

type FocusOProps = {
  color: string
  dotSize: number
  ringSize: number
  strokeWidth: number
  height: number
}

const FocusO = ({ color, dotSize, ringSize, strokeWidth, height }: FocusOProps) => {
  const svgSize = ringSize * 2 + strokeWidth + 2
  const center = svgSize / 2

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ marginTop: height * 0.04 }}
    >
      <circle cx={center} cy={center} r={ringSize} stroke={color} strokeWidth={strokeWidth} fill="none" />
      <circle cx={center} cy={center} r={dotSize} fill={color} />
    </svg>
  )
}
