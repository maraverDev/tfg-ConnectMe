import { useState } from 'react';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';

export default function App() {
  const [refresh, setRefresh] = useState(false);

  const handlePostCreated = () => {
    setRefresh(prev => !prev); // Cambia para forzar recarga
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">ConnectMe 📸</h1>
      <CreatePost onPostCreated={handlePostCreated} />
      <PostList refresh={refresh} />
    </div>
  );
}
