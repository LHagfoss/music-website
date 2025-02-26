import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-zinc-900/50 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">NextMusic</h3>
            <p className="text-zinc-400">The Next Level Music Player on the web</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><Link href="/music-player">Music Player</Link></li>
              <li><Link href="/upload">Upload Music</Link></li>
              <li><Link href="/settings">Settings</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/copyright">Copyright</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-400 hover:text-white"><FaGithub size={24} /></a>
              <a href="#" className="text-zinc-400 hover:text-white"><FaTwitter size={24} /></a>
              <a href="#" className="text-zinc-400 hover:text-white"><FaDiscord size={24} /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-400">
          <p>© {new Date().getFullYear()} NextMusic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}