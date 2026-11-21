import React, { useState } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { ProfessionalLiveEditor } from './ProfessionalLiveEditor';
import { ArrowLeft, Loader2, Code2, Sparkles } from 'lucide-react';

interface LiveCodingPageProps {
  setView: (view: string) => void;
}

const LiveCodingPage: React.FC<LiveCodingPageProps> = ({ setView }) => {
  const { user: clerkUser } = useUser();
  const [roomCode, setRoomCode] = useState<string>('');
  const [isJoining, setIsJoining] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleJoinRoom = async (code: string) => {
    if (!code.trim()) {
      alert('Please enter a room code');
      return;
    }

    setIsJoining(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/v1/rooms/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomCode: code,
            userId: clerkUser?.id || 'candidate-1',
            candidateName: clerkUser?.fullName || 'Candidate',
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setShowEditor(true);
      } else {
        alert('Failed to join room: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Error joining room. Entering practice mode.');
      setShowEditor(true);
    } finally {
      setIsJoining(false);
    }
  };

  if (showEditor) {
    return (
      <div className="h-full w-full">
        <ProfessionalLiveEditor />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col text-white">
      {/* Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          <div className="h-4 w-px bg-slate-700"></div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Code2 className="text-amber-400" size={22} />
            <span>LeetCode Live Arena</span>
          </h1>
        </div>

        <button
          onClick={() => setShowEditor(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-lg text-sm shadow-lg shadow-amber-500/20 transition"
        >
          <Sparkles size={16} />
          <span>Launch Solo Studio</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl p-8 space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Code2 size={26} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Live Coding & Practice
              </h2>
              <p className="text-slate-400 text-xs">
                Solve algorithms with real evaluation or join an interview session
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowEditor(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Sparkles size={18} />
                <span>Open LeetCode Practice Studio</span>
              </button>

              <div className="flex items-center gap-3 my-2 text-xs text-slate-500 uppercase tracking-widest font-bold text-center">
                <div className="h-px bg-slate-700 flex-1"></div>
                <span>Or Join With Code</span>
                <div className="h-px bg-slate-700 flex-1"></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Enter 6-Digit Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="E.g., ABC123"
                  className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white font-mono tracking-wider focus:outline-none focus:border-amber-400 placeholder-slate-600 text-sm"
                  maxLength={8}
                />
              </div>

              <button
                onClick={() => handleJoinRoom(roomCode)}
                disabled={isJoining || !roomCode}
                className="w-full px-4 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm"
              >
                {isJoining ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Join Room'
                )}
              </button>
            </div>

            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3.5 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400 shrink-0" />
              <span>Features Python 3 & Node.js code execution with LeetCode test cases!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCodingPage;
