"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Star,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface VideoResponse {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  isLocked: boolean;
  unlockCriteria: string;
  amtPointsRequired: number | null;
  userId: number;
  rating: string;
  reviewCount: number;
  isProcessed: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  categories: { id: number; category: string }[];
  tags: { id: number; tag: string }[];
  user: {
    id: number;
    userName: string;
    avatar: string;
    email: string;
  };
  videoDetail?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    supplementalMaterialUrl: string;
    subCategory: string;
    keywords: string[];
    transcript: string;
  };
}

function getVimeoId(url: string): string {
  const regex =
    /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
  const match = url?.match(regex);
  return match ? match[1] : "";
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [videoResponses, setVideoResponses] = useState<VideoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check-auth");
        if (!res.ok) {
          router.push("/admin/login");
        } else {
          setIsAuthenticated(true);
          await fetchVideoResponses();
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setError("Failed to authenticate. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const fetchVideoResponses = async () => {
    try {
      const res = await fetch("/api/admin/videos");
      if (!res.ok) {
        throw new Error(`Failed to fetch video responses: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setVideoResponses(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch video responses");
      }
    } catch (error) {
      console.error("Error fetching video responses:", error);
      setError("Failed to load video responses. Please try again.");
    }
  };

  const updateVideoStatus = async (videoId: number, isVerified: boolean) => {
    try {
      const res = await fetch(`/api/admin/videos/${videoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isVerified }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update video status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setVideoResponses((prevVideos) =>
          prevVideos.map((video) =>
            video.id === videoId ? { ...video, isVerified } : video
          )
        );
        toast({
          title: "Success",
          description: "Video status updated successfully",
        });
      } else {
        throw new Error(data.message || "Failed to update video status");
      }
    } catch (error) {
      console.error("Error updating video status:", error);
      toast({
        title: "Error",
        description: "Failed to update video status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteVideo = async (videoId: number) => {
    try {
      const res = await fetch(`/api/admin/videos/${videoId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete video: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setVideoResponses((prevVideos) =>
          prevVideos.filter((video) => video.id !== videoId)
        );
        toast({
          title: "Success",
          description: "Video deleted successfully",
        });
      } else {
        throw new Error(data.message || "Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast({
        title: "Error",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Video Responses</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {videoResponses.map((video) => (
          <Card key={video.id} className="overflow-hidden bg-card">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <iframe
                  src={`https://player.vimeo.com/video/${getVimeoId(
                    video.url
                  )}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                ></iframe>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="text-2xl mb-2">{video.title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-4">
                {video.description}
              </p>
              <div className="flex items-center mb-4">
                {video.userId ? (
                  <>
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={video.user.avatar}
                        alt={video.user.userName}
                      />
                      <AvatarFallback>{video.user.userName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{video.user.userName}</span>
                  </>
                ) : (
                  <>
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback>
                        {video.videoDetail?.firstName?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="font-medium">
                          {video.videoDetail?.firstName}{" "}
                          {video.videoDetail?.lastName}
                        </span>
                        <Badge
                          variant="outline"
                          className="ml-2 text-xs bg-red-500 text-white"
                        >
                          Not Registered
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {video.videoDetail?.email}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {Math.floor(video.duration / 60)} min
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {video.rating} ({video.reviewCount})
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  {video.isProcessed ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                  )}
                  <span className="text-sm">
                    {video.isProcessed ? "Processed" : "Unprocessed"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {video.categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.category}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted p-6 flex justify-between items-center">
              <div className="flex gap-2">
                <Select
                  defaultValue={video.isVerified ? "verified" : "unverified"}
                  onValueChange={(value) =>
                    updateVideoStatus(video.id, value === "verified")
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    router.push(`/?videoId=${video.id}&update=true`)
                  }
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the video and remove all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteVideo(video.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
