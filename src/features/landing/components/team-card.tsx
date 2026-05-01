"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { ICON_MAP } from "@/lib/icon-map"

type TeamCardProps = {
  name: string
  description: string
  iconName: string
  color: string
}

const COLLAPSED_HEIGHT = 60

const renderIcon = (iconName: string) => {
  const Icon = ICON_MAP[iconName]
  if (!Icon) return null
  return <Icon size={26} className="text-white" />
}


export const TeamCard = ({ name, description, iconName, color }: TeamCardProps) => {
  const [expanded, setExpanded] = useState(false)
  const [needsToggle, setNeedsToggle] = useState(false)
  const [fullHeight, setFullHeight] = useState(500)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!textRef.current) return
    const h = textRef.current.scrollHeight
    setFullHeight(h)
    setNeedsToggle(h > COLLAPSED_HEIGHT)
  }, [description])

  return (
    <div className="flex flex-col rounded-2xl bg-[#F8FAFC] p-8 transition-shadow hover:shadow-lg">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-3xl shadow-lg"
        style={{ backgroundColor: color, boxShadow: `0 10px 15px -3px ${color}33` }}
      >
        {renderIcon(iconName)}
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">{name}</h3>

      <div
        className="relative mt-2 overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: expanded ? `${fullHeight}px` : `${COLLAPSED_HEIGHT}px` }}
      >
        <p
          ref={textRef}
          className="text-sm leading-relaxed text-slate-600"
        >
          {description}
        </p>

        {!expanded && needsToggle && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
        )}
      </div>

      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 inline-flex items-center gap-1 self-start text-xs font-bold text-indigo-600 transition-colors hover:text-indigo-700"
          tabIndex={0}
          aria-expanded={expanded}
          aria-label={expanded ? "Show less" : "Show more"}
        >
          {expanded ? "Show less" : "Read more"}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  )
}
