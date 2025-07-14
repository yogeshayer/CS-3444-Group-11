"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Plus, ArrowLeft, Mail, Crown, UserCheck, Star, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FloatingHearts } from "@/components/visual-effects"
import { ThemeToggle } from "@/components/theme-toggle"

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

export default function RoommatesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
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
      setUsers(data.users || [user])
    } else {
      setUsers([user])
    }
  }, [router])

  const handleInviteRoommate = async () => {
    if (!inviteEmail || !currentUser) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

    // Simulate adding a new roommate
    const newRoommate: User = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      isAdmin: false,
    }

    const updatedUsers = [...users, newRoommate]
    setUsers(updatedUsers)

    // Update localStorage
    const choreboardData = JSON.parse(localStorage.getItem("choreboardData") || "{}")
    choreboardData.users = updatedUsers
    localStorage.setItem("choreboardData", JSON.stringify(choreboardData))

    setInviteEmail("")
    setIsInviteDialogOpen(false)
    setIsLoading(false)
  }

  const handleRemoveRoommate = async (userId: string) => {
    if (userId === currentUser?.id) return // Can't remove yourself

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API call

    const updatedUsers = users.filter((user) => user.id !== userId)
    setUsers(updatedUsers)

    // Update localStorage
    const choreboardData = JSON.parse(localStorage.getItem("choreboardData") || "{}")
    choreboardData.users = updatedUsers
    localStorage.setItem("choreboardData", JSON.stringify(choreboardData))
    setIsLoading(false)
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-pink-900 dark:to-purple-900 relative transition-all duration-500">
      <FloatingHearts />

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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Roommates
              </h1>
              <p className="text-muted-foreground">Manage your household members</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {currentUser.isAdmin && (
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transition-all duration-300 animate-pulse-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Roommate
                  </Button>
                </DialogTrigger>
                <DialogContent className="animate-bounce-in">
                  <DialogHeader>
                    <DialogTitle>Invite New Roommate</DialogTitle>
                    <DialogDescription>Send an invitation to join your household</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="roommate@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="transition-all duration-300 focus:glow-pink"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleInviteRoommate}
                        disabled={isLoading}
                        className="flex-1 transition-all duration-300"
                      >
                        {isLoading ? "Sending..." : "Send Invitation"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-pink">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Roommates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground animate-float" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-purple"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Crown className="h-4 w-4 text-yellow-500 animate-bounce" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{users.filter((u) => u.isAdmin).length}</div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-blue"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{users.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Roommates List */}
        <Card className="animate-slide-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 animate-bounce" />
              Household Members
            </CardTitle>
            <CardDescription>All members of your shared living space</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <Card
                  key={user.id}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-float">
                      <span className="text-white font-bold text-xl">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex justify-center gap-2 mb-3">
                      {user.isAdmin && (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300">
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {user.id === currentUser.id && (
                        <Badge
                          variant="outline"
                          className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          You
                        </Badge>
                      )}
                    </div>
                    {currentUser.isAdmin && user.id !== currentUser.id && (
                      <Button
                        onClick={() => handleRemoveRoommate(user.id)}
                        disabled={isLoading}
                        size="sm"
                        variant="destructive"
                        className="transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {users.length === 1 && (
              <div className="text-center py-8 mt-6">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-float" />
                <p className="text-muted-foreground text-lg">You're the only member so far</p>
                <p className="text-muted-foreground/70 mb-4">
                  {currentUser.isAdmin
                    ? "Invite your roommates to get started"
                    : "Ask an admin to invite more roommates"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
