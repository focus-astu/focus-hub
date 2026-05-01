"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { NotificationDropdown } from "./notification-dropdown"

type NotificationItem = {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/v1/notifications")
      if (res.ok) {
        const data = await res.json()
        const items = data.data ?? []
        setNotifications(items)
        setUnreadCount(items.filter((n: NotificationItem) => !n.read).length)
      }
    } catch {
      /* silent */
    }
  }

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const res = await fetch("/api/v1/notifications?countOnly=true")
        if (res.ok) {
          const data = await res.json()
          setUnreadCount(data.count ?? 0)
        }
      } catch {
        /* silent */
      }
    }

    void loadUnreadCount()
    const interval = setInterval(() => {
      void loadUnreadCount()
    }, 30_000)
    return () => clearInterval(interval)
  }, [])

  const handleOpen = () => {
    if (!isOpen) fetchNotifications()
    setIsOpen(!isOpen)
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/v1/notifications/${id}/read`, { method: "PATCH" })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      /* silent */
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/v1/notifications/read-all", { method: "POST" })
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch {
      /* silent */
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        tabIndex={0}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
