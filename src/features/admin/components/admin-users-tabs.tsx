"use client"

import { useState, type ReactNode } from "react"

type AdminUsersTabsProps = {
  pendingCount: number
  allCount: number
  pendingPanel: ReactNode
  allUsersPanel: ReactNode
}

export const AdminUsersTabs = ({
  pendingCount,
  allCount,
  pendingPanel,
  allUsersPanel,
}: AdminUsersTabsProps) => {
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending")

  const tabs = [
    {
      id: "pending" as const,
      label: "Pending Approval",
      count: pendingCount,
    },
    {
      id: "all" as const,
      label: "All Users",
      count: allCount,
    },
  ]

  return (
    <div>
      <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
            tabIndex={0}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
            <span
              className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                activeTab === tab.id
                  ? tab.id === "pending" && tab.count > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-200 text-slate-600"
                  : "bg-slate-200/70 text-slate-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {activeTab === "pending" ? pendingPanel : allUsersPanel}
      </div>
    </div>
  )
}
