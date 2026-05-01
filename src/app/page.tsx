import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Megaphone } from "lucide-react"
import { LandingHeader, DonateSection, LandingFooter, TeamCard } from "@/features/landing"
import { getUpdates, getTeams, getTopPosts } from "@/core/shared/infrastructure/config/dependencies"

const CATEGORY_STYLES: Record<string, { color: string, bg: string }> = {
  prayer: { color: "text-blue-600", bg: "bg-blue-50" },
  fellowship: { color: "text-purple-600", bg: "bg-purple-50" },
  worship: { color: "text-amber-600", bg: "bg-amber-50" },
  outreach: { color: "text-emerald-600", bg: "bg-emerald-50" },
  other: { color: "text-slate-600", bg: "bg-slate-100" },
}

const HeroSection = () => (
  <section className="overflow-hidden bg-white px-6 py-24 lg:px-8 lg:py-32">
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-12">
      <div className="flex flex-1 flex-col gap-6">
        <h1 className="text-3xl font-black leading-[1.1em] tracking-tight text-slate-900 sm:text-5xl lg:text-7xl">
          Building
          <br />
          Spiritually
          <br />
          Strong and
          <br />
          Purpose-Driven
          <br />
          Students
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-slate-600 lg:text-xl">
          A Christ-centered student fellowship at Adama Science and Technology University dedicated to nurturing faith, leadership, and academic excellence.
        </p>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap sm:gap-4">
          <a
            href="/signup"
            className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-4 text-center text-base font-bold text-white shadow-lg shadow-black/10 transition-shadow hover:shadow-xl sm:text-lg"
          >
            Join the Community
          </a>
          <a
            href="/login"
            className="rounded-3xl border-2 border-slate-200 px-8 py-4 text-center text-base font-bold text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:text-lg"
          >
            Login
          </a>
        </div>
      </div>

      <div className="relative flex-1">
        <div className="absolute -inset-4 rounded-3xl bg-indigo-500/20 blur-[40px]" />
        <div className="relative overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
          <Image
            src="/assets/hero-image.jpg"
            alt="Students in fellowship"
            width={584}
            height={576}
            className="h-auto w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  </section>
)

const AboutSection = () => (
  <section id="about" className="bg-[#FDF4F0] px-6 py-24 lg:px-8">
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-sm font-bold uppercase tracking-[0.1em] text-indigo-600">
        Our Mission
      </p>
      <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-4xl">
        About Our Fellowship
      </h2>
      <p className="mt-6 text-lg leading-loose text-slate-700 lg:text-xl">
        Focus ASTU is committed to nurturing a community where students grow spiritually while pursuing academic excellence. We believe in building a generation that leads with purpose, integrity, and faith. Through discipleship, fellowship, and outreach, we empower students to be light in their campus and beyond.
      </p>
    </div>
  </section>
)

type TeamData = {
  id: string
  name: string
  description: string
  iconName: string
  color: string
}

const TeamsSection = ({ teams }: { teams: TeamData[] }) => (
  <section id="teams" className="bg-white px-6 py-24 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
          Ministry Teams
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-slate-600">
          Discover where you can serve and grow within our fellowship.
        </p>
      </div>

      {teams.length > 0 ? (
        <div className="mt-16 grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map(team => (
            <TeamCard
              key={team.id}
              name={team.name}
              description={team.description}
              iconName={team.iconName}
              color={team.color}
            />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-sm text-slate-500">Teams coming soon.</p>
      )}
    </div>
  </section>
)

type UpdateData = {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string | null
}

const UpdatesSection = ({ updates }: { updates: UpdateData[] }) => (
  <section id="updates" className="bg-[#F8FAFC] px-6 py-24 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            Latest Updates
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Stay informed about our journey and upcoming events.
          </p>
        </div>
      </div>

      {updates.length > 0 ? (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {updates.map(update => {
            const style = CATEGORY_STYLES[update.category] ?? CATEGORY_STYLES.other
            return (
              <article
                key={update.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {update.imageUrl ? (
                  <div className="relative h-52">
                    <Image src={update.imageUrl} alt={update.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className={`h-52 ${style.bg}`} />
                )}
                <div className="flex flex-col gap-2 p-6">
                  <span className={`text-xs font-bold uppercase tracking-[0.05em] ${style.color}`}>
                    {update.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{update.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{update.description}</p>
                  <Link
                    href={`/updates/${update.id}`}
                    className="mt-4 flex items-center gap-1 text-sm font-bold text-slate-900 transition-colors hover:text-blue-600"
                    tabIndex={0}
                    aria-label={`Read more about ${update.title}`}
                  >
                    Read More
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-slate-500">No updates yet. Check back soon!</p>
      )}
    </div>
  </section>
)

type PostData = {
  id: string
  title: string | null
  content: string
  authorName: string
  imageUrl: string | null
  createdAt: string
}

const AnnouncementsSection = ({ posts }: { posts: PostData[] }) => {
  if (posts.length === 0) return null

  return (
    <section className="bg-white px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5">
            <Megaphone className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">From the fellowship</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            Announcements
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-slate-600">
            Recent messages and announcements from our leaders.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <article
              key={post.id}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-[#F8FAFC] shadow-sm transition-shadow hover:shadow-md"
            >
              {post.imageUrl && (
                <div className="relative h-48">
                  <Image src={post.imageUrl} alt={post.title ?? "Post"} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-indigo-600">{post.authorName}</span>
                  <span>&middot;</span>
                  <time>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>
                </div>
                {post.title && (
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{post.title}</h3>
                )}
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{post.content}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const JoinCTASection = () => (
  <section className="bg-white px-6 py-24 lg:px-8">
    <div
      className="mx-auto max-w-7xl rounded-3xl border border-indigo-200 px-6 py-16 text-center sm:px-8 sm:py-20 lg:px-20"
      style={{ background: "linear-gradient(173deg, #EEF2FF 0%, #FAF5FF 100%)" }}
    >
      <h2 className="mx-auto max-w-4xl text-2xl font-black text-slate-900 sm:text-4xl lg:text-6xl">
        Become Part of Something Greater
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:mt-8 sm:text-lg lg:text-2xl">
        Your journey at ASTU doesn&apos;t have to be walked alone. Join a community that supports your faith and your future.
      </p>
      <a
        href="/signup"
        className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-4 text-base font-black text-white shadow-lg shadow-black/10 transition-shadow hover:shadow-xl sm:mt-10 sm:px-12 sm:py-5 sm:text-xl"
      >
        Get Involved Today
      </a>
    </div>
  </section>
)

export default async function Home() {
  const [updatesResult, teamsResult, topPostsResult] = await Promise.all([
    getUpdates({ page: 1, limit: 6 }).catch(() => ({ updates: [], total: 0 })),
    getTeams().catch(() => []),
    getTopPosts(3).catch(() => []),
  ])

  const updates = updatesResult.updates
  const teams = Array.isArray(teamsResult) ? teamsResult : []
  const topPosts = topPostsResult

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      <LandingHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <TeamsSection teams={teams} />
        <AnnouncementsSection posts={topPosts} />
        <DonateSection />
        <UpdatesSection updates={updates} />
        <JoinCTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
