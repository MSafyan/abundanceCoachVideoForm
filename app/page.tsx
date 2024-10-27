import VideoContentForm from "@/components/VideoContentForm";
import VimeoPlayer from "@/components/VideoPlayer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        {/* <VimeoPlayer /> */}
        <VideoContentForm />
      </div>
    </main>
  );
}
