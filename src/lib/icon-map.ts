import {
  Users,
  Mic2,
  BookOpen,
  Shield,
  Heart,
  Music,
  Megaphone,
  Palette,
  Globe,
  HandHeart,
  Drama,
  Pen,
  Camera,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react"

export const ICON_MAP: Record<string, LucideIcon> = {
  users: Users,
  "mic-2": Mic2,
  "book-open": BookOpen,
  shield: Shield,
  heart: Heart,
  music: Music,
  megaphone: Megaphone,
  palette: Palette,
  globe: Globe,
  "hand-heart": HandHeart,
  drama: Drama,
  pen: Pen,
  camera: Camera,
  star: Star,
  zap: Zap,
}

export const ICON_OPTIONS = Object.keys(ICON_MAP)

export const getIcon = (name: string): LucideIcon => {
  return ICON_MAP[name] ?? Users
}
