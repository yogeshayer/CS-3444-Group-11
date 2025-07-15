"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Home, CheckCircle, DollarSign, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { FallingStars } from "@/components/visual-effects"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    isAdmin: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Store user data in localStorage for demo purposes
    const userData = {
      email: formData.email,
      name: formData.name || formData.email.split("@")[0],
      isAdmin: formData.isAdmin,
      id: Date.now().toString(),
    }
    localStorage.setItem("currentUser", JSON.stringify(userData))

    // Initialize demo data if first time
    if (!localStorage.getItem("choreboardData")) {
      const initialData = {
        users: [userData],
        chores: [
          {
            id: "1",
            name: "Take out trash",
            description: "Empty all trash bins and take to curb",
            assignedTo: userData.id,
            assignedToName: userData.name,
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: "pending",
            createdBy: userData.id,
          },
          {
            id: "2",
            name: "Clean kitchen",
            description: "Wipe counters, clean sink, and sweep floor",
            assignedTo: userData.id,
            assignedToName: userData.name,
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: "pending",
            createdBy: userData.id,
          },
        ],
        expenses: [
          {
            id: "1",
            amount: 120.5,
            description: "Electricity bill",
            category: "Utilities",
            paidBy: userData.id,
            paidByName: userData.name,
            date: new Date().toISOString(),
            status: "approved",
            splitBetween: [userData.id],
          },
          {
            id: "2",
            amount: 85.3,
            description: "Groceries",
            category: "Food",
            paidBy: userData.id,
            paidByName: userData.name,
            date: new Date().toISOString(),
            status: "pending",
            splitBetween: [userData.id],
          },
        ],
      }
      localStorage.setItem("choreboardData", JSON.stringify(initialData))
    }

    setIsLoading(false)
    router.push("/dashboard")
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative transition-all duration-500">
      <FallingStars />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 animate-bounce-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl animate-pulse-glow">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-float">
              ChoreBoard
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-in">
            Streamline chore and expense management for roommates. Create harmony in your shared living space with smart
            automation and beautiful design.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-blue">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2 animate-float">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Smart Chore Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Assign, track, and rotate chores among roommates with automated scheduling and smart reminders.
              </p>
            </CardContent>
          </Card>

          <Card
            className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-green"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader>
              <div
                className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2 animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Expense Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Log shared expenses and automatically calculate each roommate's fair contribution with approval
                workflows.
              </p>
            </CardContent>
          </Card>

          <Card
            className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-purple"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader>
              <div
                className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2 animate-float"
                style={{ animationDelay: "1s" }}
              >
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Smart Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get intelligent reminders for upcoming chores, payment deadlines, and household updates.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Auth Form */}
        <div className="max-w-md mx-auto">
          <Card className="backdrop-blur-sm bg-card/90 shadow-xl border-2 animate-bounce-in glow-pink">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{isLogin ? "Welcome Back" : "Join ChoreBoard"}</CardTitle>
              <CardDescription>
                {isLogin ? "Sign in to your account" : "Create your account to get started"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={isLogin ? "login" : "register"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" onClick={() => setIsLogin(true)} className="transition-all duration-300">
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    onClick={() => setIsLogin(false)}
                    className="transition-all duration-300"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="transition-all duration-300 focus:glow-blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        className="transition-all duration-300 focus:glow-blue"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 animate-pulse-glow"
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4 mt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="transition-all duration-300 focus:glow-blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-register">Email</Label>
                      <Input
                        id="email-register"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="transition-all duration-300 focus:glow-blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-register">Password</Label>
                      <Input
                        id="password-register"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        className="transition-all duration-300 focus:glow-blue"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="admin"
                        checked={formData.isAdmin}
                        onCheckedChange={(checked) => handleInputChange("isAdmin", checked as boolean)}
                      />
                      <Label htmlFor="admin" className="text-sm">
                        I want to be an Admin Roommate (can manage chores and expenses)
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 animate-pulse-glow"
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground animate-slide-in">
          <p>&copy; 2025 ChoreBoard. Making shared living harmonious with beautiful design.</p>
        </div>
      </div>
    </div>
  )
}
