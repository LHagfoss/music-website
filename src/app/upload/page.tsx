'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaUpload, FaMusic, FaImage } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MiniPlayer from '@/components/MiniPlayer';

export default function UploadMusic() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [songFile, setSongFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleSongFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('audio/')) {
        setSongFile(file);
        setError(null);
      } else {
        alert('Please upload a valid audio file (MP3, WAV, or OGG)');
      }
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setCoverFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setError(null);
      } else {
        alert('Please upload a valid image file');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError('Please sign in to upload music');
      return;
    }

    if (!songFile || !formData.title || !formData.artist) {
      setError('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setError(null);
    const uploadData = new FormData();
    uploadData.append('audio', songFile);
    if (coverFile) uploadData.append('cover', coverFile);
    uploadData.append('title', formData.title);
    uploadData.append('artist', formData.artist);
    uploadData.append('album', formData.album);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Upload failed');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      alert('Song uploaded successfully!');
      // Reset form
      setSongFile(null);
      setCoverFile(null);
      setCoverPreview(null);
      setFormData({ title: '', artist: '', album: '' });
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload song. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen pt-24 pb-28">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Upload Music</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="glass-effect p-6 rounded-lg">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-100">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Song Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Artist Name *</label>
                  <input
                    type="text"
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Album</label>
                  <input
                    type="text"
                    name="album"
                    value={formData.album}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Audio File *</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleSongFileChange}
                      className="hidden"
                      id="audio-upload"
                      required
                    />
                    <label
                      htmlFor="audio-upload"
                      className="flex items-center justify-center w-full h-32 px-4 py-2 rounded-md bg-zinc-800/50 cursor-pointer hover:bg-zinc-700/50 transition-colors"
                    >
                      <div className="text-center">
                        <FaMusic className="mx-auto text-3xl mb-2" />
                        <span className="text-sm">{songFile ? songFile.name : 'Choose audio file'}</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cover Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileChange}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="flex items-center justify-center w-full h-32 px-4 py-2 rounded-md bg-zinc-800/50 cursor-pointer hover:bg-zinc-700/50 transition-colors overflow-hidden"
                    >
                      {coverPreview ? (
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="text-center">
                          <FaImage className="mx-auto text-3xl mb-2" />
                          <span className="text-sm">Choose cover image</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={isUploading}
                className="w-full px-6 py-3 rounded-md bg-purple-500 hover:bg-purple-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaUpload />
                {isUploading ? 'Uploading...' : 'Upload Song'}
              </button>
            </div>
          </form>

          <div className="glass-effect p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Preview</h2>
            <div className="glass-effect p-4 rounded-lg">
              <div className="aspect-square bg-zinc-800 rounded-md mb-4 overflow-hidden">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                    <FaMusic className="text-4xl text-zinc-600" />
                  </div>
                )}
              </div>
              <div className="font-medium truncate">{formData.title || 'Song Title'}</div>
              <div className="text-sm text-neutral-400 truncate">{formData.artist || 'Artist Name'}</div>
              {session?.user?.name && (
                <div className="text-xs text-neutral-500 mt-1 truncate">
                  Uploaded by {session.user.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <MiniPlayer />
    </main>
  );
}