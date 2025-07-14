"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AnimatedSparkles } from "@/components/visual-effects"
import { ArrowLeft, Calendar, CheckCircle, Clock, Plus, Trash2, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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

export default function ChoresPage() {
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [chores, setChores] = useState<Chore[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newChore, setNewChore] = useState({
    name: "",
    description: "",
    assignedTo: "",
    dueDate: "",
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
      setChores(data.chores || [])
      setUsers(data.users || [user])
    }
  }, [router])

  const handleCreateChore = async () => {
    if (!currentUser || !newChore.name || !newChore.assignedTo || !newChore.dueDate) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

    const assignedUser = users.find((u) => u.id === newChore.assignedTo)
    const chore: Chore = {
      id: Date.now().toString(),
      name: newChore.name,
      description: newChore.description,
      assignedTo: newChore.assignedTo,
      assignedToName: assignedUser?.name || "",
      dueDate: newChore.dueDate,
      status: "pending",
      createdBy: currentUser.id,
    }

    const updatedChores = [...chores, chore]
    setChores(updatedChores)

    // Update localStorage
    const choreboardData = JSON.parse(localStorage.getItem("choreboardData") || "{}")
    choreboardData.chores = updatedChores
    localStorage.setItem("choreboardData", JSON.stringify(choreboardData))

    setNewChore({ name: "", description: "", assignedTo: "", dueDate: "" })
    setIsCreateDialogOpen(false)
    setIsLoading(false)
  }

  const handleCompleteChore = async (choreId: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API call

    const updatedChores = chores.map((chore) =>
      chore.id === choreId ? { ...chore, status: "completed" as const } : chore,
    )
    setChores(updatedChores)

    // Update localStorage
    const choreboardData = JSON.parse(localStorage.getItem("choreboardData") || "{}")
    choreboardData.chores = updatedChores
    localStorage.setItem("choreboardData", JSON.stringify(choreboardData))
    setIsLoading(false)
  }

  const handleDeleteChore = async (choreId: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API call

    const updatedChores = chores.filter((chore) => chore.id !== choreId)
    setChores(updatedChores)

    // Update localStorage
    const choreboardData = JSON.parse(localStorage.getItem("choreboardData") || "{}")
    choreboardData.chores = updatedChores
    localStorage.setItem("choreboardData", JSON.stringify(choreboardData))
    setIsLoading(false)
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  const myChores = chores.filter((chore) => chore.assignedTo === currentUser.id)
  const allChores = currentUser.isAdmin ? chores : myChores

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative transition-all duration-500">
      <AnimatedSparkles />

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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chore Management
              </h1>
              <p className="text-muted-foreground">Manage and track household tasks</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {currentUser.isAdmin && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 animate-pulse-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Chore
                  </Button>
                </DialogTrigger>
                <DialogContent className="animate-bounce-in">
                  <DialogHeader>
                    <DialogTitle>Create New Chore</DialogTitle>
                    <DialogDescription>Assign a new task to a roommate</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="choreName">Chore Name</Label>
                      <Input
                        id="choreName"
                        placeholder="e.g., Take out trash"
                        value={newChore.name}
                        onChange={(e) => setNewChore({ ...newChore, name: e.target.value })}
                        className="transition-all duration-300 focus:glow-blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="choreDescription">Description</Label>
                      <Textarea
                        id="choreDescription"
                        placeholder="Detailed description of the task"
                        value={newChore.description}
                        onChange={(e) => setNewChore({ ...newChore, description: e.target.value })}
                        className="transition-all duration-300 focus:glow-blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignTo">Assign To</Label>
                      <Select
                        value={newChore.assignedTo}
                        onValueChange={(value) => setNewChore({ ...newChore, assignedTo: value })}
                      >
                        <SelectTrigger className="transition-all duration-300 focus:glow-blue">
                          <SelectValue placeholder="Select a roommate" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="datetime-local"
                        value={newChore.dueDate}
                        onChange={(e) => setNewChore({ ...newChore, dueDate: e.target.value })}
                        className="transition-all duration-300 focus:glow-blue"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCreateChore}
                        disabled={isLoading}
                        className="flex-1 transition-all duration-300"
                      >
                        {isLoading ? "Creating..." : "Create Chore"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
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
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chores</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground animate-float" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allChores.length}</div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-green"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {allChores.filter((c) => c.status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in glow-purple"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500 animate-bounce" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {allChores.filter((c) => c.status === "completed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chores List */}
        <Card className="animate-slide-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 animate-bounce" />
              {currentUser.isAdmin ? "All Chores" : "My Chores"}
            </CardTitle>
            <CardDescription>
              {currentUser.isAdmin ? "Manage all household chores" : "Your assigned tasks"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allChores.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-float" />
                <p className="text-muted-foreground text-lg">No chores yet</p>
                <p className="text-muted-foreground/70">
                  {currentUser.isAdmin ? "Create your first chore to get started" : "Wait for chores to be assigned"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allChores.map((chore, index) => (
                  <div
                    key={chore.id}
                    className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md animate-slide-in ${
                      chore.status === "completed"
                        ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className={`font-semibold text-lg transition-all duration-300 ${
                              chore.status === "completed" ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {chore.name}
                          </h3>
                          <Badge
                            variant={chore.status === "completed" ? "default" : "secondary"}
                            className="animate-pulse"
                          >
                            {chore.status}
                          </Badge>
                        </div>

                        {chore.description && <p className="text-muted-foreground mb-3">{chore.description}</p>}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>Assigned to: {chore.assignedToName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {new Date(chore.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {chore.status === "pending" && chore.assignedTo === currentUser.id && (
                          <Button
                            onClick={() => handleCompleteChore(chore.id)}
                            disabled={isLoading}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 transition-all duration-300"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {isLoading ? "..." : "Complete"}
                          </Button>
                        )}
                        {currentUser.isAdmin && (
                          <Button
                            onClick={() => handleDeleteChore(chore.id)}
                            disabled={isLoading}
                            size="sm"
                            variant="destructive"
                            className="transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                        {chore.status === "completed" && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5 animate-bounce" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
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
