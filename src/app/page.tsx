import Link from 'next/link';
import { FaMusic, FaUpload, FaGlobe } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <header className="w-full min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
          NextMusic
        </h1>
        <p className="text-xl md:text-2xl text-gray-300">
          The Next Level Music Player on the web
        </p>
      </header>
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
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
        </div>
      </div>

      <footer className="mt-16 text-center text-gray-400">
        <p>© {new Date().getFullYear()} NextMusic. All rights reserved.</p>
      </footer>
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
      <div className="p-6 bg-zinc-800 bg-opacity-50 rounded-xl hover:bg-opacity-70 transition-all cursor-pointer">
        <div className="flex flex-col items-center space-y-4">
          {icon}
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}
