"use client"

export const GLMobileMenu = () => {
  const handleOpen = () => {
    window.dispatchEvent(new CustomEvent("open-gl-sidebar"))
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden"
      aria-label="Open navigation menu"
      tabIndex={0}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>
  )
}
