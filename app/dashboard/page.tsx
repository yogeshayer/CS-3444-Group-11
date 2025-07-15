"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Home, CheckCircle, Clock, DollarSign, Users, Bell, Settings, LogOut, Star, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FloatingParticles } from "@/components/visual-effects"
import { ThemeToggle } from "@/components/theme-toggle"

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

interface Chore {
  id: string
  name: string
  description: string
  assignedTo: string
  assignedToName: string
  dueDate: string
  status: "pending" | "completed"
  createdBy: string
}

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  paidBy: string
  paidByName: string
  date: string
  status: "pending" | "approved"
  splitBetween: string[]
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [chores, setChores] = useState<Chore[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [notifications, setNotifications] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    // Load data
    const choreboardData = localStorage.getItem("choreboardData")
    if (choreboardData) {
      const data = JSON.parse(choreboardData)
      setChores(data.chores || [])
      setExpenses(data.expenses || [])
    }

    // Generate notifications
    const notifs = []
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Check for due chores
    const dueChores = (JSON.parse(choreboardData || "{}").chores || []).filter((chore: Chore) => {
      const dueDate = new Date(chore.dueDate)
      return chore.status === "pending" && dueDate <= tomorrow && chore.assignedTo === user.id
    })

    if (dueChores.length > 0) {
      notifs.push(`You have ${dueChores.length} chore(s) due soon!`)
    }

    // Check for pending expenses
    const pendingExpenses = (JSON.parse(choreboardData || "{}").expenses || []).filter(
      (expense: Expense) => expense.status === "pending",
    )

    if (pendingExpenses.length > 0 && user.isAdmin) {
      notifs.push(`${pendingExpenses.length} expense(s) need approval`)
    }

    setNotifications(notifs)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  const myChores = chores.filter((chore) => chore.assignedTo === currentUser.id)
  const completedChores = myChores.filter((chore) => chore.status === "completed")
  const pendingChores = myChores.filter((chore) => chore.status === "pending")

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const myShare = totalExpenses / Math.max(1, expenses.length) // Simplified calculation

  const completionRate = myChores.length > 0 ? (completedChores.length / myChores.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative transition-all duration-500">
      <FloatingParticles />

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-20 transition-all duration-300">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 animate-slide-in">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg animate-pulse-glow">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ChoreBoard
                  </h1>
                  <p className="text-sm text-muted-foreground">Welcome back, {currentUser.name}!</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {currentUser.isAdmin && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 animate-bounce-in"
                  >
                    Admin
                  </Badge>
                )}
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {notifications.length > 0 && (
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      {notifications.length}
                    </Badge>
                  )}
                </div>
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="mb-6 animate-bounce-in">
              <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 glow-pink">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-600 animate-bounce" />
                    <CardTitle className="text-lg text-orange-800 dark:text-orange-200">Notifications</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {notifications.map((notif, index) => (
                      <li
                        key={index}
                        className="text-orange-700 dark:text-orange-300 flex items-center gap-2 animate-slide-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Star className="w-4 h-4 animate-sparkle" />
                        {notif}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-blue">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Chores</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground animate-float" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myChores.length}</div>
                <p className="text-xs text-muted-foreground">{completedChores.length} completed</p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-green"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingChores.length}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-purple"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Share</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground animate-bounce" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${myShare.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Of ${totalExpenses.toFixed(2)} total</p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-pink"
              style={{ animationDelay: "0.3s" }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground animate-float" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
                <Progress value={completionRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="animate-slide-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 animate-bounce" />
                  Recent Chores
                </CardTitle>
                <CardDescription>Your upcoming and recent tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myChores.slice(0, 3).map((chore, index) => (
                    <div
                      key={chore.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-all duration-300 animate-slide-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div>
                        <p className="font-medium">{chore.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(chore.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={chore.status === "completed" ? "default" : "secondary"} className="animate-pulse">
                        {chore.status}
                      </Badge>
                    </div>
                  ))}
                  {myChores.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No chores assigned yet</p>
                  )}
                </div>
                <div className="mt-4">
                  <Link href="/chores">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent hover:bg-primary/10 transition-all duration-300"
                    >
                      View All Chores
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-in" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 animate-bounce" />
                  Recent Expenses
                </CardTitle>
                <CardDescription>Latest shared expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenses.slice(0, 3).map((expense, index) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-all duration-300 animate-slide-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-muted-foreground">{expense.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${expense.amount.toFixed(2)}</p>
                        <Badge
                          variant={expense.status === "approved" ? "default" : "secondary"}
                          className="animate-pulse"
                        >
                          {expense.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {expenses.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No expenses logged yet</p>
                  )}
                </div>
                <div className="mt-4">
                  <Link href="/expenses">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent hover:bg-primary/10 transition-all duration-300"
                    >
                      View All Expenses
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/chores">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 animate-bounce-in glow-blue">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2 animate-float">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Manage Chores</CardTitle>
                  <CardDescription>View and complete your tasks</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/expenses">
              <Card
                className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 animate-bounce-in glow-green"
                style={{ animationDelay: "0.1s" }}
              >
                <CardHeader className="text-center">
                  <div
                    className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2 animate-float"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Track Expenses</CardTitle>
                  <CardDescription>Log and split shared costs</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/roommates">
              <Card
                className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 animate-bounce-in glow-purple"
                style={{ animationDelay: "0.2s" }}
              >
                <CardHeader className="text-center">
                  <div
                    className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2 animate-float"
                    style={{ animationDelay: "1s" }}
                  >
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Roommates</CardTitle>
                  <CardDescription>Manage household members</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {currentUser.isAdmin && (
              <Link href="/settings">
                <Card
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 animate-bounce-in glow-pink"
                  style={{ animationDelay: "0.3s" }}
                >
                  <CardHeader className="text-center">
                    <div
                      className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-2 animate-float"
                      style={{ animationDelay: "1.5s" }}
                    >
                      <Settings className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Admin controls</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
