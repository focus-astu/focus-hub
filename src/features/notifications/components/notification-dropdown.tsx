"use client"

import { Shield, UserPlus, UserMinus, CheckCircle, Info, Check } from "lucide-react"

type NotificationItem = {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

type NotificationDropdownProps = {
  notifications: NotificationItem[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onClose: () => void
}

const TYPE_ICONS: Record<string, typeof Shield> = {
  role_assigned: UserPlus,
  role_removed: UserMinus,
  account_approved: CheckCircle,
  general: Info,
}

const TYPE_COLORS: Record<string, string> = {
  role_assigned: "bg-blue-100 text-blue-600",
  role_removed: "bg-red-100 text-red-600",
  account_approved: "bg-emerald-100 text-emerald-600",
  general: "bg-slate-100 text-slate-600",
}

const formatTimeAgo = (dateStr: string) => {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export const NotificationDropdown = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: NotificationDropdownProps) => {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed left-2 right-2 top-[4.5rem] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:absolute sm:left-auto sm:top-full sm:mt-2 sm:w-96 sm:right-0">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
              tabIndex={0}
              aria-label="Mark all notifications as read"
            >
              <Check className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Info className="mx-auto mb-2 h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const IconComponent = TYPE_ICONS[notification.type] ?? Info
              const iconColor = TYPE_COLORS[notification.type] ?? TYPE_COLORS.general

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => {
                    if (!notification.read) onMarkAsRead(notification.id)
                  }}
                  className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                    !notification.read ? "bg-blue-50/30" : ""
                  }`}
                  tabIndex={0}
                  aria-label={`${notification.read ? "" : "Unread: "}${notification.title}`}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconColor}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-slate-900">
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                      {notification.message}
                    </p>
                    <span className="mt-1 block text-[11px] text-slate-400">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
