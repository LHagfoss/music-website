import Link from 'next/link';
import { FaMusic, FaUpload, FaGlobe, FaHeart, FaListAlt, FaUserFriends } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute w-[500px] h-[500px] -top-64 -left-64 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-500/0 blur-3xl" />
      <div className="absolute w-[500px] h-[500px] -bottom-64 -right-64 rounded-full bg-gradient-to-l from-indigo-500/20 to-indigo-500/0 blur-3xl" />
      
      <header className="w-full min-h-[70vh] flex flex-col justify-center items-center relative">
        <div className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm rounded-3xl" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
            NextMusic
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mt-4">
            The Next<span className="text-xs">.js</span> Level Music Player on the web
          </p>
        </div>
      </header>
      <div className="max-w-7xl w-full text-center space-y-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <FeatureCard
            icon={<FaMusic className="w-8 h-8" />}
            title="Music Player"
            description="Listen to your favorite tracks with our advanced music player"
            href="/music-player"
          />
          <FeatureCard
            icon={<FaUpload className="w-8 h-8" />}
            title="Upload Music"
            description="Share your music with the world by uploading your tracks"
            href="/upload"
          />
          <FeatureCard
            icon={<FaGlobe className="w-8 h-8" />}
            title="Global Access"
            description="Access your music from anywhere in the world"
            href="/music-player"
          />
          <FeatureCard
            icon={<FaHeart className="w-8 h-8" />}
            title="Favorites"
            description="Create your personal collection of favorite tracks"
            href="/favorites"
          />
          <FeatureCard
            icon={<FaListAlt className="w-8 h-8" />}
            title="Playlists"
            description="Organize your music into custom playlists"
            href="/playlists"
          />
          <FeatureCard
            icon={<FaUserFriends className="w-8 h-8" />}
            title="Social Features"
            description="Share and discover music with other users"
            href="/social"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, href }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="group p-6 bg-zinc-900/50 backdrop-blur-md rounded-xl hover:bg-zinc-800/50 transition-all cursor-pointer border border-zinc-800/50 hover:border-purple-500/50">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-purple-500 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h3 className="text-xl font-semibold group-hover:text-purple-400 transition-colors">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}
