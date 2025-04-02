import { useState } from 'react';
import api from '../api';

function CreatePost({ onPostCreated }) {
  const [form, setForm] = useState({
    user_id: 1,
    image_url: '',
    caption: ''
  });

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await api.post('/posts', form);
      onPostCreated(response.data); // Notifica al padre
      setForm({ user_id: 1, image_url: '', caption: '' }); // Limpia
    } catch (error) {
      console.error('Error al crear post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Crear nueva publicación</h2>
      <input
        type="text"
        name="image_url"
        value={form.image_url}
        onChange={handleChange}
        placeholder="URL de la imagen"
        className="w-full border p-2 rounded mb-3"
        required
      />
      <input
        type="text"
        name="caption"
        value={form.caption}
        onChange={handleChange}
        placeholder="Descripción"
        className="w-full border p-2 rounded mb-3"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Publicar
      </button>
    </form>
  );
}

export default CreatePost;
