"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckSquare, DollarSign, LayoutDashboard, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface AppUser {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Chores",
    href: "/chores",
    icon: CheckSquare,
  },
  {
    name: "Expenses",
    href: "/expenses",
    icon: DollarSign,
  },
  {
    name: "Roommates",
    href: "/roommates",
    icon: Users,
  },
]

export function AppNavigation() {
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const visibleItems = navigationItems

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-1 py-3">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2 h-10",
                    isActive
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
