import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { getUpdateById } from "@/core/shared/infrastructure/config/dependencies"
import { EntityNotFoundError } from "@/core/shared"

const CATEGORY_STYLES: Record<string, { color: string, bg: string }> = {
  prayer: { color: "text-blue-600", bg: "bg-blue-50" },
  fellowship: { color: "text-purple-600", bg: "bg-purple-50" },
  worship: { color: "text-amber-600", bg: "bg-amber-50" },
  outreach: { color: "text-emerald-600", bg: "bg-emerald-50" },
  other: { color: "text-slate-600", bg: "bg-slate-100" },
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function UpdateDetailPage({ params }: PageProps) {
  const { id } = await params

  let update
  try {
    update = await getUpdateById(id)
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      notFound()
    }
    throw error
  }

  const style = CATEGORY_STYLES[update.category] ?? CATEGORY_STYLES.other
  const formattedDate = new Date(update.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
          <Link
            href="/#updates"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
            tabIndex={0}
            aria-label="Back to updates"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Updates
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <article>
          <div className="mb-6 flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${style.bg} ${style.color}`}>
              {update.category}
            </span>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              <time>{formattedDate}</time>
            </div>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {update.title}
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            By {update.authorName}
          </p>

          {update.imageUrl && (
            <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl">
              <Image
                src={update.imageUrl}
                alt={update.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-slate-700 sm:text-lg">
            {update.description}
          </div>
        </article>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <Link
            href="/#updates"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
            tabIndex={0}
          >
            <ArrowLeft className="h-4 w-4" />
            All Updates
          </Link>
        </div>
      </main>
    </div>
  )
}
