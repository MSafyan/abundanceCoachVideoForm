"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for video responses
const videoResponses = [
  { id: 1, title: "Introduction to React", author: "John Doe", submittedAt: "2023-04-15" },
  { id: 2, title: "Advanced CSS Techniques", author: "Jane Smith", submittedAt: "2023-04-16" },
  { id: 3, title: "Node.js Fundamentals", author: "Bob Johnson", submittedAt: "2023-04-17" },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/admin/check-auth')
      if (!res.ok) {
        router.push('/admin/login')
      } else {
        setIsAuthenticated(true)
      }
    }
    checkAuth()
  }, [router])

  if (!isAuthenticated) {
    return null // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Video Responses</h1>
      <div className="grid gap-4">
        {videoResponses.map((video) => (
          <Card key={video.id}>
            <CardHeader>
              <CardTitle>{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Author:</strong> {video.author}</p>
              <p><strong>Submitted:</strong> {video.submittedAt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}