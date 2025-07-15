"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Bell, RotateCcw, Shield, Palette, Star, Download } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ElectricSparks } from "@/components/visual-effects"
import { ThemeToggle } from "@/components/theme-toggle"

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    notifications: {
      choreReminders: true,
      expenseAlerts: true,
      weeklyReports: false,
    },
    choreRotation: {
      enabled: false,
      frequency: "weekly",
    },
    general: {
      theme: "light",
      autoApproveExpenses: false,
    },
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

    // Check if user is admin
    if (!user.isAdmin) {
      router.push("/dashboard")
      return
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem("choreboardSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [router])

  const updateSettings = async (newSettings: typeof settings) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API call

    setSettings(newSettings)
    localStorage.setItem("choreboardSettings", JSON.stringify(newSettings))
    setIsLoading(false)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    }
    updateSettings(newSettings)
  }

  const handleRotationChange = (key: string, value: boolean | string) => {
    const newSettings = {
      ...settings,
      choreRotation: {
        ...settings.choreRotation,
        [key]: value,
      },
    }
    updateSettings(newSettings)
  }

  const handleGeneralChange = (key: string, value: boolean | string) => {
    const newSettings = {
      ...settings,
      general: {
        ...settings.general,
        [key]: value,
      },
    }
    updateSettings(newSettings)
  }

  const handleExportData = () => {
    const choreboardData = localStorage.getItem("choreboardData")
    if (choreboardData) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(choreboardData)
      const downloadAnchorNode = document.createElement("a")
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", "choreboard-data.json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    }
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  if (!currentUser.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Admin privileges required to access settings.</p>
            <Link href="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-orange-900 dark:to-amber-900 relative transition-all duration-500">
      <ElectricSparks />

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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Admin Settings
              </h1>
              <p className="text-muted-foreground">Configure ChoreBoard for your household</p>
            </div>
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 animate-bounce-in">
              <Shield className="w-3 h-3 mr-1" />
              Admin Only
            </Badge>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notification Settings */}
          <Card className="animate-bounce-in glow-blue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 animate-bounce" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure when and how users receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Chore Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send reminders for upcoming chores</p>
                </div>
                <Switch
                  checked={settings.notifications.choreReminders}
                  onCheckedChange={(checked) => handleNotificationChange("choreReminders", checked)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Expense Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify when new expenses need approval</p>
                </div>
                <Switch
                  checked={settings.notifications.expenseAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("expenseAlerts", checked)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Send weekly summary reports</p>
                </div>
                <Switch
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Chore Rotation Settings */}
          <Card className="animate-bounce-in glow-green" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 animate-spin" />
                Chore Rotation
              </CardTitle>
              <CardDescription>Automatically rotate chores among roommates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Rotation</Label>
                  <p className="text-sm text-muted-foreground">Automatically reassign chores periodically</p>
                </div>
                <Switch
                  checked={settings.choreRotation.enabled}
                  onCheckedChange={(checked) => handleRotationChange("enabled", checked)}
                  disabled={isLoading}
                />
              </div>

              {settings.choreRotation.enabled && (
                <div className="space-y-2 animate-slide-in">
                  <Label htmlFor="frequency">Rotation Frequency</Label>
                  <Select
                    value={settings.choreRotation.frequency}
                    onValueChange={(value) => handleRotationChange("frequency", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="transition-all duration-300 focus:glow-green">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <Star className="w-4 h-4 inline mr-1 animate-sparkle" />
                  Rotation ensures fair distribution of chores among all roommates
                </p>
              </div>
            </CardContent>
          </Card>

          {/* General Settings */}
          <Card className="animate-bounce-in glow-purple" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 animate-float" />
                General Settings
              </CardTitle>
              <CardDescription>Configure general application behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.general.theme}
                  onValueChange={(value) => handleGeneralChange("theme", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="transition-all duration-300 focus:glow-purple">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-approve Expenses</Label>
                  <p className="text-sm text-muted-foreground">Automatically approve expenses under $50</p>
                </div>
                <Switch
                  checked={settings.general.autoApproveExpenses}
                  onCheckedChange={(checked) => handleGeneralChange("autoApproveExpenses", checked)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card className="animate-bounce-in glow-pink" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 animate-pulse" />
                System Information
              </CardTitle>
              <CardDescription>Application details and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">Version</p>
                  <p className="text-muted-foreground">1.2.0</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Last Updated</p>
                  <p className="text-muted-foreground">Today</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Security</p>
                  <p className="text-muted-foreground">15-min timeout</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Backup</p>
                  <p className="text-muted-foreground">Auto-enabled</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full bg-transparent hover:bg-primary/10 transition-all duration-300"
                  onClick={handleExportData}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Status */}
        <div className="mt-8 text-center">
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg inline-block animate-bounce-in">
            <p className="text-green-700 dark:text-green-300 flex items-center gap-2">
              <Star className="w-4 h-4 animate-sparkle" />
              {isLoading ? "Saving settings..." : "Settings are automatically saved"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
