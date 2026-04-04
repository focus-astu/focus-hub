import Image from "next/image"

const HERO_IMAGE_URL =
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80"

export const AuthHeroBg = ({ children }: { children?: React.ReactNode }) => (
    <div className="relative hidden w-1/2 shrink-0 overflow-hidden lg:flex lg:items-center lg:justify-center">
        <Image
            src={HERO_IMAGE_URL}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#135BEC]/80 via-[#135BEC]/60 to-purple-600/70" />
        {children}
    </div>
)
