"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertCircle, Bell, Calendar, CheckCircle, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"

interface Notification {
  id: string
  type: "chore" | "expense" | "reminder" | "achievement"
  title: string
  message: string
  time: string
  read: boolean
}

interface NotificationPanelProps {
  user?: any
  data?: any
}

export function NotificationPanel({ user, data }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const generateNotifications = (userData: any, choreboardData: any): Notification[] => {
    if (!userData || !choreboardData) return []

    const notifications: Notification[] = []
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    // Check for chores due soon (within 24 hours)
    choreboardData.chores?.forEach((chore: any) => {
      if (!chore.completed) {
        const dueDate = new Date(chore.dueDate)
        const isAssignedToUser = chore.assignedTo === userData.id
        const isDueSoon = dueDate <= tomorrow && dueDate > now

        if (isDueSoon && isAssignedToUser) {
          notifications.push({
            id: `chore-due-${chore.id}`,
            type: "chore",
            title: "Chore Due Soon",
            message: `${chore.title} is due ${dueDate.toLocaleDateString()}`,
            time: new Date(now.getTime() - Math.random() * 2 * 60 * 60 * 1000).toISOString(),
            read: false,
          })
        }

        // Check for overdue chores
        if (dueDate < now && isAssignedToUser) {
          notifications.push({
            id: `chore-overdue-${chore.id}`,
            type: "reminder",
            title: "Chore Overdue",
            message: `${chore.title} was due ${dueDate.toLocaleDateString()}`,
            time: new Date(now.getTime() - Math.random() * 4 * 60 * 60 * 1000).toISOString(),
            read: false,
          })
        }
      }
    })

    // Check for recent expenses (last 24 hours)
    choreboardData.expenses?.forEach((expense: any) => {
      const expenseDate = new Date(expense.date)
      const isRecent = now.getTime() - expenseDate.getTime() < 24 * 60 * 60 * 1000
      const isInvolved = expense.paidBy === userData.id || expense.splitBetween?.includes(userData.id)

      if (isRecent && isInvolved && expense.paidBy !== userData.id) {
        notifications.push({
          id: `expense-${expense.id}`,
          type: "expense",
          title: "New Expense Added",
          message: `${expense.title} expense of $${expense.amount.toFixed(2)} was added`,
          time: expenseDate.toISOString(),
          read: false,
        })
      }
    })

    // Check for completed chores (achievements)
    const completedChoresThisWeek = choreboardData.chores?.filter((chore: any) => {
      if (!chore.completed || chore.completedBy !== userData.id) return false
      const completedDate = new Date(chore.completedAt)
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return completedDate >= weekAgo
    })

    if (completedChoresThisWeek?.length >= 3) {
      notifications.push({
        id: `achievement-weekly-${now.getTime()}`,
        type: "achievement",
        title: "Achievement Unlocked!",
        message: `You've completed ${completedChoresThisWeek.length} chores this week`,
        time: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
      })
    }

    // Check for household alerts
    choreboardData.householdAlerts?.forEach((alert: any) => {
      const alertDate = new Date(alert.reportedAt)
      const isRecent = now.getTime() - alertDate.getTime() < 24 * 60 * 60 * 1000

      if (isRecent && alert.status === "open") {
        notifications.push({
          id: `alert-${alert.id}`,
          type: "reminder",
          title: "New Household Alert",
          message: `${alert.title} - ${alert.priority} priority`,
          time: alertDate.toISOString(),
          read: false,
        })
      }
    })

    // Sort by time (newest first) and limit to 10
    return notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10)
  }

  useEffect(() => {
    if (!user) return

    // Load existing notifications from localStorage
    const savedNotifications = localStorage.getItem(`notifications_${user.id}`)
    let existingNotifications: Notification[] = []

    if (savedNotifications) {
      existingNotifications = JSON.parse(savedNotifications)
    }

    // Generate new notifications based on current data
    const newNotifications = generateNotifications(user, data)

    // Merge with existing notifications, avoiding duplicates
    const allNotifications = [...existingNotifications]

    newNotifications.forEach((newNotif) => {
      const exists = allNotifications.some((existing) => existing.id === newNotif.id)
      if (!exists) {
        allNotifications.push(newNotif)
      }
    })

    // Sort by time and limit
    const finalNotifications = allNotifications
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 15)

    setNotifications(finalNotifications)
    setUnreadCount(finalNotifications.filter((n) => !n.read).length)

    // Save to localStorage
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(finalNotifications))
  }, [user, data])

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    setNotifications(updatedNotifications)
    setUnreadCount(Math.max(0, unreadCount - 1))

    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications))
    }
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updatedNotifications)
    setUnreadCount(0)

    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications))
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "chore":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "expense":
        return <DollarSign className="w-4 h-4 text-blue-500" />
      case "reminder":
        return <Calendar className="w-4 h-4 text-orange-500" />
      case "achievement":
        return <AlertCircle className="w-4 h-4 text-purple-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const formatTime = (time: string) => {
    const now = new Date()
    const notificationTime = new Date(time)
    const diffInHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 px-0">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.read ? "bg-muted/50" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{notification.title}</p>
                    <span className="text-xs text-muted-foreground ml-2">{formatTime(notification.time)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  {!notification.read && <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
