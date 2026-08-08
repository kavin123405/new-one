import React, { useState, useEffect } from 'react';
import { getConfig, saveConfig, uploadMedia, getMediaUrl } from '../utils/api';
import { 
  Heart, Save, Upload, Plus, Trash2, Music, Stars, Lock, 
  Smile, Image as ImageIcon, Sparkles, MessageSquare, AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  // Load configuration on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getConfig();
        setConfig(data);
      } catch (err) {
        console.error("Failed to load config", err);
        setStatusMessage('Error loading website configuration.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle simple input field changes
  const handleInputChange = (path, value) => {
    setConfig(prev => {
      const copy = { ...prev };
      const keys = path.split('.');
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  // Handle file uploads (images or audio)
  const handleFileUpload = async (e, path) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setStatusMessage('Uploading file...');
      const response = await uploadMedia(file);
      handleInputChange(path, response.url);
      setStatusMessage('File uploaded successfully!');
      setTimeout(() => setStatusMessage(''), 2000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Failed to upload file.');
    }
  };

  // Save full configuration back to database.json
  const handleSave = async () => {
    setSaving(true);
    setStatusMessage('Saving configuration...');
    try {
      await saveConfig(config);
      setStatusMessage('All changes saved successfully! 💗');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error saving configuration.');
    } finally {
      setSaving(false);
    }
  };

  // Timeline Memory Helpers
  const addMemory = () => {
    setConfig(prev => ({
      ...prev,
      memories: [
        ...prev.memories,
        {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          title: 'New Memory Event',
          description: 'Tell a cute story about this memory...',
          image: ''
        }
      ]
    }));
  };

  const removeMemory = (id) => {
    setConfig(prev => ({
      ...prev,
      memories: prev.memories.filter(m => m.id !== id)
    }));
  };

  // Appreciation List Helpers
  const addAppreciation = () => {
    setConfig(prev => ({
      ...prev,
      appreciations: [...prev.appreciations, 'Enter something you love about her...']
    }));
  };

  const updateAppreciation = (index, value) => {
    setConfig(prev => {
      const copy = { ...prev };
      copy.appreciations[index] = value;
      return copy;
    });
  };

  const removeAppreciation = (index) => {
    setConfig(prev => ({
      ...prev,
      appreciations: prev.appreciations.filter((_, i) => i !== index)
    }));
  };

  // Playlist Track Helpers
  const addTrack = () => {
    setConfig(prev => ({
      ...prev,
      playlist: [
        ...prev.playlist,
        {
          id: Date.now().toString(),
          title: 'New Love Song',
          artist: 'Artist Name',
          url: ''
        }
      ]
    }));
  };

  const removeTrack = (id) => {
    setConfig(prev => ({
      ...prev,
      playlist: prev.playlist.filter(t => t.id !== id)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center font-sans text-gray-500">
          <Heart className="w-12 h-12 text-heart-pink fill-heart-pink/30 animate-bounce mx-auto mb-4" />
          <p className="font-semibold">Loading Config Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-700 font-sans pb-12">
      {/* Header bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-heart-pink">
            <Heart className="w-5 h-5 fill-heart-pink" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-800">Customize Surprise Site</h1>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-gray-500 hover:text-pink-600 border border-gray-300 rounded-full px-4 py-2 hover:bg-pink-50 transition-colors"
          >
            Preview Live Site 🔗
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </header>

      {/* Main container */}
      <div className="max-w-6xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar tabs */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-1 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs h-fit">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'general' ? 'bg-pink-50 text-pink-600' : 'hover:bg-slate-50 text-gray-600'
            }`}
          >
            <Smile className="w-4 h-4" /> General Details
          </button>
          
          <button
            onClick={() => setActiveTab('welcome')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'welcome' ? 'bg-pink-50 text-pink-600' : 'hover:bg-slate-50 text-gray-600'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Welcome Page
          </button>
          
          <button
            onClick={() => setActiveTab('memories')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'memories' ? 'bg-pink-50 text-pink-600' : 'hover:bg-slate-50 text-gray-600'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Memories Timeline
          </button>

          <button
            onClick={() => setActiveTab('letters')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'letters' ? 'bg-pink-50 text-pink-600' : 'hover:bg-slate-50 text-gray-600'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> \"Open When\" Letters
          </button>

          <button
            onClick={() => setActiveTab('gift')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'gift' ? 'bg-pink-50 text-pink-600' : 'hover:bg-slate-50 text-gray-600'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Mystery Gift Box
          </button>

          <button
            onClick={() => setActiveTab('appreciations')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'appreciations' ? 'bg-pink-50 text-pink-600' : 'hover:bg-slate-50 text-gray-600'
            }`}
          >
            <Heart className="w-4 h-4" /> Appreciation Cards
          </button>

          <button
            onClick={() => setActiveTab('playlist')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'playlist' ? 'bg-pink-50 text-pink-600' : 'hover:bg-slate-50 text-gray-600'
            }`}
          >
            <Music className="w-4 h-4" /> Music Playlist
          </button>

          <button
            onClick={() => setActiveTab('stars')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'stars' ? 'bg-pink-50 text-pink-600' : 'hover:bg-slate-50 text-gray-600'
            }`}
          >
            <Stars className="w-4 h-4" /> Starry Sky Thoughts
          </button>

          <button
            onClick={() => setActiveTab('secret')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'secret' ? 'bg-pink-50 text-pink-600' : 'hover:bg-slate-50 text-gray-600'
            }`}
          >
            <Lock className="w-4 h-4" /> Secret Heart Page
          </button>
        </aside>

        {/* Edit fields form panel */}
        <main className="flex-1 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-xs relative">
          
          {/* Toast / Status messages */}
          {statusMessage && (
            <div className="absolute top-4 right-4 bg-slate-800 text-white text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md">
              <AlertCircle className="w-3.5 h-3.5 text-pink-300" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* TAB 1: General Info */}
          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">General Configuration</h2>
              <div className="grid gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Her Name / Partner Name</label>
                  <input
                    type="text"
                    value={config.partnerName}
                    onChange={(e) => handleInputChange('partnerName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300"
                    placeholder="E.g., Sweetheart, Maya, Sarah"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">This name will be displayed on the Opening Screen and throughout the site headers.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Welcome Section */}
          {activeTab === 'welcome' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Welcome Page Setup</h2>
              <div className="grid gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Welcome Photo (Polaroid Image)</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {config.welcome.image && (
                      <img 
                        src={getMediaUrl(config.welcome.image)} 
                        alt="Welcome Preview" 
                        className="w-24 h-24 object-cover rounded-lg border border-pink-100" 
                      />
                    )}
                    <label className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-gray-600 rounded-xl cursor-pointer text-xs font-semibold">
                      <Upload className="w-4 h-4" /> Upload Custom Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'welcome.image')} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Headline Greeting</label>
                  <input
                    type="text"
                    value={config.welcome.title}
                    onChange={(e) => handleInputChange('welcome.title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Subtext Message</label>
                  <textarea
                    value={config.welcome.text}
                    onChange={(e) => handleInputChange('welcome.text', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 h-28 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Memories Timeline */}
          {activeTab === 'memories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Memories Timeline</h2>
                <button
                  onClick={addMemory}
                  className="flex items-center gap-1 bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-bold px-3 py-2 rounded-full cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Memory
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {config.memories.map((memory, index) => (
                  <div key={memory.id} className="p-5 border border-slate-100 bg-slate-50/50 rounded-2xl flex flex-col gap-4 relative">
                    <button
                      onClick={() => removeMemory(memory.id)}
                      className="absolute top-4 right-4 p-1.5 hover:bg-red-50 text-red-500 rounded-full cursor-pointer"
                      title="Delete Memory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <h4 className="font-bold text-sm text-gray-500">Memory #{index + 1}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Event Title</label>
                        <input
                          type="text"
                          value={memory.title}
                          onChange={(e) => handleInputChange(`memories.${index}.title`, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Date</label>
                        <input
                          type="date"
                          value={memory.date}
                          onChange={(e) => handleInputChange(`memories.${index}.date`, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Short Description</label>
                      <textarea
                        value={memory.description}
                        onChange={(e) => handleInputChange(`memories.${index}.description`, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white h-20 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Photo Upload</label>
                      <div className="flex items-center gap-3">
                        {memory.image && (
                          <img 
                            src={getMediaUrl(memory.image)} 
                            alt="Memory Preview" 
                            className="w-16 h-16 object-cover rounded-lg border border-pink-100" 
                          />
                        )}
                        <label className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-gray-500 rounded-lg cursor-pointer text-xs font-semibold">
                          <Upload className="w-3.5 h-3.5" /> Upload File
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleFileUpload(e, `memories.${index}.image`)} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Open When Letters */}
          {activeTab === 'letters' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">\"Open When...\" Letters</h2>
              <div className="grid gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Open when you're happy 😊</label>
                  <textarea
                    value={config.letters.happy}
                    onChange={(e) => handleInputChange('letters.happy', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Open when you're having a difficult day 🌧️</label>
                  <textarea
                    value={config.letters.difficult}
                    onChange={(e) => handleInputChange('letters.difficult', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Open when you need motivation 🌟</label>
                  <textarea
                    value={config.letters.motivation}
                    onChange={(e) => handleInputChange('letters.motivation', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Open when you want to laugh 😂</label>
                  <textarea
                    value={config.letters.laugh}
                    onChange={(e) => handleInputChange('letters.laugh', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Open when you miss our conversations 💗</label>
                  <textarea
                    value={config.letters.miss}
                    onChange={(e) => handleInputChange('letters.miss', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Open when you can't sleep 🌙</label>
                  <textarea
                    value={config.letters.sleep}
                    onChange={(e) => handleInputChange('letters.sleep', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 h-24 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Mystery Gift Box */}
          {activeTab === 'gift' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Mystery Gift Box Setup</h2>
              <div className="grid gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Gift Reveal Image (Collage Photo)</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {config.mysteryGift.image && (
                      <img 
                        src={getMediaUrl(config.mysteryGift.image)} 
                        alt="Gift Preview" 
                        className="w-24 h-24 object-cover rounded-lg border border-pink-100" 
                      />
                    )}
                    <label className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-gray-600 rounded-xl cursor-pointer text-xs font-semibold">
                      <Upload className="w-4 h-4" /> Upload Custom Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'mysteryGift.image')} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Gift Headline / Card Title</label>
                  <input
                    type="text"
                    value={config.mysteryGift.title}
                    onChange={(e) => handleInputChange('mysteryGift.title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Sweet Message inside Gift</label>
                  <textarea
                    value={config.mysteryGift.message}
                    onChange={(e) => handleInputChange('mysteryGift.message', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 h-28 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Things I Appreciate */}
          {activeTab === 'appreciations' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Things I Appreciate Cards</h2>
                <button
                  onClick={addAppreciation}
                  className="flex items-center gap-1 bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-bold px-3 py-2 rounded-full cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add card
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {config.appreciations.map((apprec, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-gray-400 w-8">{index + 1}.</span>
                    <input
                      type="text"
                      value={apprec}
                      onChange={(e) => updateAppreciation(index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200"
                    />
                    <button
                      onClick={() => removeAppreciation(index)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-full cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Music Playlist */}
          {activeTab === 'playlist' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Our Songs Playlist</h2>
                <button
                  onClick={addTrack}
                  className="flex items-center gap-1 bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-bold px-3 py-2 rounded-full cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Track
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {config.playlist.map((track, index) => (
                  <div key={track.id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl flex flex-col gap-4 relative">
                    <button
                      onClick={() => removeTrack(track.id)}
                      className="absolute top-4 right-4 p-1.5 hover:bg-red-50 text-red-500 rounded-full cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <h4 className="font-bold text-sm text-gray-500">Track #{index + 1}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Song Title</label>
                        <input
                          type="text"
                          value={track.title}
                          onChange={(e) => handleInputChange(`playlist.${index}.title`, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Artist Name</label>
                        <input
                          type="text"
                          value={track.artist}
                          onChange={(e) => handleInputChange(`playlist.${index}.artist`, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Audio Source File (.mp3) or URL</label>
                      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <input
                          type="text"
                          value={track.url}
                          onChange={(e) => handleInputChange(`playlist.${index}.url`, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs"
                          placeholder="Select custom audio file or paste direct MP3 URL"
                        />
                        <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-gray-600 rounded-lg cursor-pointer text-xs font-semibold">
                          <Upload className="w-3.5 h-3.5" /> Upload MP3
                          <input 
                            type="file" 
                            accept="audio/mp3, audio/*" 
                            onChange={(e) => handleFileUpload(e, `playlist.${index}.url`)} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: Starry sky messages */}
          {activeTab === 'stars' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Starry Sky Messages</h2>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">⭐ Star 1 (Admire about you...)</label>
                  <textarea
                    value={config.stars[0]}
                    onChange={(e) => handleInputChange('stars.0', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">⭐ Star 2 (Memory that makes me smile...)</label>
                  <textarea
                    value={config.stars[1]}
                    onChange={(e) => handleInputChange('stars.1', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">⭐ Star 3 (Something I hope you achieve...)</label>
                  <textarea
                    value={config.stars[2]}
                    onChange={(e) => handleInputChange('stars.2', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">⭐ Star 4 (Something I never want you to forget...)</label>
                  <textarea
                    value={config.stars[3]}
                    onChange={(e) => handleInputChange('stars.3', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 h-20 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: Secret Page */}
          {activeTab === 'secret' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Secret Heart Page Setup</h2>
              <div className="grid gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Secret Photo Reveal (Inside Joke image)</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {config.secret.image && (
                      <img 
                        src={getMediaUrl(config.secret.image)} 
                        alt="Secret Preview" 
                        className="w-24 h-24 object-cover rounded-lg border border-pink-100" 
                      />
                    )}
                    <label className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-gray-600 rounded-xl cursor-pointer text-xs font-semibold">
                      <Upload className="w-4 h-4" /> Upload Custom Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'secret.image')} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Secret Message (Inside joke details)</label>
                  <textarea
                    value={config.secret.message}
                    onChange={(e) => handleInputChange('secret.message', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 h-28 resize-none"
                  />
                </div>
              </div>
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
}
