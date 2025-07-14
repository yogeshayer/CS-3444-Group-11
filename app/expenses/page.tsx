"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DollarSign, Plus, ArrowLeft, Calendar, UserIcon, Check, X, TrendingUp, Star, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FloatingMoney } from "@/components/visual-effects"
import { ThemeToggle } from "@/components/theme-toggle"

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

const categories = ["Utilities", "Food", "Rent", "Internet", "Cleaning", "Other"]

export default function ExpensesPage() {
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    category: "",
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    const choreboardData = localStorage.getItem("choreboardData")
    if (choreboardData) {
      const data = JSON.parse(choreboardData)
      setExpenses(data.expenses || [])
      setUsers(data.users || [user])
    }
  }, [router])

  const handleCreateExpense = async () => {
    if (!currentUser || !newExpense.amount || !newExpense.description || !newExpense.category) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

    const expense: Expense = {
      id: Date.now().toString(),
      amount: Number.parseFloat(newExpense.amount),
      description: newExpense.description,
      category: newExpense.category,
      paidBy: currentUser.id,
      paidByName: currentUser.name,
      date: new Date().toISOString(),
      status: currentUser.isAdmin ? "approved" : "pending",
      splitBetween: [currentUser.id],
    }

    const updatedExpenses = [...expenses, expense]
    setExpenses(updatedExpenses)

    // Update localStorage
    const choreboardData = JSON.parse(localStorage.getItem("choreboardData") || "{}")
    choreboardData.expenses = updatedExpenses
    localStorage.setItem("choreboardData", JSON.stringify(choreboardData))

    setNewExpense({ amount: "", description: "", category: "" })
    setIsCreateDialogOpen(false)
    setIsLoading(false)
  }

  const handleApproveExpense = async (expenseId: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API call

    const updatedExpenses = expenses.map((expense) =>
      expense.id === expenseId ? { ...expense, status: "approved" as const } : expense,
    )
    setExpenses(updatedExpenses)

    // Update localStorage
    const choreboardData = JSON.parse(localStorage.getItem("choreboardData") || "{}")
    choreboardData.expenses = updatedExpenses
    localStorage.setItem("choreboardData", JSON.stringify(choreboardData))
    setIsLoading(false)
  }

  const handleRejectExpense = async (expenseId: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API call

    const updatedExpenses = expenses.filter((expense) => expense.id !== expenseId)
    setExpenses(updatedExpenses)

    // Update localStorage
    const choreboardData = JSON.parse(localStorage.getItem("choreboardData") || "{}")
    choreboardData.expenses = updatedExpenses
    localStorage.setItem("choreboardData", JSON.stringify(choreboardData))
    setIsLoading(false)
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  const totalExpenses = expenses
    .filter((e) => e.status === "approved")
    .reduce((sum, expense) => sum + expense.amount, 0)
  const pendingExpenses = expenses.filter((e) => e.status === "pending")
  const myShare = totalExpenses / Math.max(users.length, 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-teal-900 relative transition-all duration-500">
      <FloatingMoney />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 animate-slide-in">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Expense Tracker
              </h1>
              <p className="text-muted-foreground">Manage and split shared expenses</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transition-all duration-300 animate-pulse-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="animate-bounce-in">
                <DialogHeader>
                  <DialogTitle>Log New Expense</DialogTitle>
                  <DialogDescription>Add a shared expense to be split among roommates</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      className="transition-all duration-300 focus:glow-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="e.g., Electricity bill"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      className="transition-all duration-300 focus:glow-green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                    >
                      <SelectTrigger className="transition-all duration-300 focus:glow-green">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateExpense}
                      disabled={isLoading}
                      className="flex-1 transition-all duration-300"
                    >
                      {isLoading ? "Logging..." : "Log Expense"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-green">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground animate-float" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-blue"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Share</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500 animate-bounce" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${myShare.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-purple"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Star className="h-4 w-4 text-orange-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingExpenses.length}</div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-pink"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground animate-float" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {expenses
                  .filter((e) => {
                    const expenseDate = new Date(e.date)
                    const now = new Date()
                    return (
                      expenseDate.getMonth() === now.getMonth() &&
                      expenseDate.getFullYear() === now.getFullYear() &&
                      e.status === "approved"
                    )
                  })
                  .reduce((sum, e) => sum + e.amount, 0)
                  .toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals (Admin Only) */}
        {currentUser.isAdmin && pendingExpenses.length > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 animate-bounce-in glow-pink">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <Star className="w-5 h-5 animate-sparkle" />
                Pending Approvals
              </CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Review and approve expense submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingExpenses.map((expense, index) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 bg-card rounded-lg border transition-all duration-300 hover:shadow-md animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div>
                      <h4 className="font-semibold">{expense.description}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${expense.amount.toFixed(2)} • {expense.category} • Paid by {expense.paidByName}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveExpense(expense.id)}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 transition-all duration-300"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        {isLoading ? "..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectExpense(expense.id)}
                        disabled={isLoading}
                        className="transition-all duration-300"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expenses List */}
        <Card className="animate-slide-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 animate-bounce" />
              All Expenses
            </CardTitle>
            <CardDescription>Track all shared household expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-float" />
                <p className="text-muted-foreground text-lg">No expenses logged yet</p>
                <p className="text-muted-foreground/70">Start by logging your first shared expense</p>
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.map((expense, index) => (
                  <div
                    key={expense.id}
                    className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md animate-slide-in ${
                      expense.status === "approved"
                        ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                        : "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{expense.description}</h3>
                          <Badge
                            variant={expense.status === "approved" ? "default" : "secondary"}
                            className="animate-pulse"
                          >
                            {expense.status}
                          </Badge>
                          <Badge variant="outline">{expense.category}</Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            <span>Paid by: {expense.paidByName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <p>
                            Split between {users.length} roommate(s): ${(expense.amount / users.length).toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">${expense.amount.toFixed(2)}</div>
                        </div>
                        {currentUser.isAdmin && (
                          <Button
                            onClick={() => handleRejectExpense(expense.id)}
                            disabled={isLoading}
                            size="sm"
                            variant="destructive"
                            className="transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
