'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../src/context/AuthContext';
import Navbar from '../../../src/components/Navbar';
import Footer from '../../../src/components/Footer';

interface Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  author: string;
  is_featured: number;
  published: number;
  created_at: string;
  updated_at: string;
}

export default function AdminArticlesPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    author: 'TamtechAI Research',
    hero_emoji: '🚀',
    hero_gradient: 'blue,purple,pink',
    related_tickers: '',
    is_featured: 1,
    published: 1
  });

  useEffect(() => {
    if (!isLoggedIn) {
      setError('Please login first. Redirecting to login page...');
      setTimeout(() => {
        router.push('/account?message=Please login to access admin panel');
      }, 2000);
      setLoading(false);
      return;
    }
    fetchArticles();
  }, [isLoggedIn]);

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/articles-list`, {
        credentials: 'include' // Send HTTP-only cookies
      });

      if (response.status === 401) {
        setError('Session expired. Redirecting to login page...');
        setTimeout(() => {
          router.push('/account?message=Session expired. Please login again');
        }, 2000);
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setArticles(data.articles);
      } else {
        setError('Failed to fetch articles');
      }
    } catch (err) {
      setError('Error loading articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse related tickers to JSON array
      const tickers = formData.related_tickers
        .split(',')
        .map(t => t.trim().toUpperCase())
        .filter(t => t.length > 0);

      const payload = {
        ...formData,
        related_tickers: JSON.stringify(tickers)
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        alert('Article created successfully!');
        setShowCreateForm(false);
        setFormData({
          title: '',
          slug: '',
          description: '',
          content: '',
          author: 'TamtechAI Research',
          hero_emoji: '🚀',
          hero_gradient: 'blue,purple,pink',
          related_tickers: '',
          is_featured: 1,
          published: 1
        });
        fetchArticles();
      } else {
        alert(`Error: ${data.detail || 'Failed to create article'}`);
      }
    } catch (err) {
      alert('Error creating article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        alert('Article deleted successfully');
        fetchArticles();
      } else {
        alert('Error deleting article');
      }
    } catch (err) {
      alert('Error deleting article');
      console.error(err);
    }
  };

  const toggleFeatured = async (id: number, currentStatus: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          is_featured: currentStatus === 1 ? 0 : 1
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const emojiOptions = ['🚀', '📈', '💰', '🏆', '⚡', '🔥', '💎', '🌟', '📊', '🎯', '🌊', '⭐'];
  const gradientOptions = [
    { name: 'Purple Dream', value: 'blue,purple,pink' },
    { name: 'Ocean', value: 'blue,cyan,teal' },
    { name: 'Sunset', value: 'orange,red,pink' },
    { name: 'Forest', value: 'green,emerald,teal' },
    { name: 'Gold Rush', value: 'yellow,orange,amber' },
    { name: 'Tech', value: 'indigo,blue,purple' }
  ];

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-2xl">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Article Management</h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              {showCreateForm ? 'Cancel' : '+ Create New Article'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Create Article Form */}
          {showCreateForm && (
            <form onSubmit={handleCreateArticle} className="mb-8 bg-white/5 p-6 rounded-lg space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Create New Article</h2>

              <div>
                <label className="block text-white mb-2 font-semibold">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Bitcoin's Rise to $100K: What Investors Need to Know"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Slug (Auto-generated)</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  placeholder="bitcoin-rise-to-100k-what-investors-need-to-know"
                />
                <p className="text-white/60 text-sm mt-1">URL: tamtechai.com/articles/{formData.slug}</p>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Description (SEO Meta) *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  rows={2}
                  maxLength={160}
                  placeholder="Brief description for Google search results (max 160 characters)"
                />
                <p className="text-white/60 text-sm mt-1">{formData.description.length}/160 characters</p>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Content (HTML/Markdown) *</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 font-mono text-sm"
                  rows={12}
                  placeholder="Write your article content here. You can use HTML tags like <h2>, <p>, <strong>, <ul>, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Hero Emoji</label>
                  <div className="grid grid-cols-6 gap-2">
                    {emojiOptions.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, hero_emoji: emoji })}
                        className={`text-4xl p-2 rounded-lg transition-all ${
                          formData.hero_emoji === emoji
                            ? 'bg-purple-500 scale-110'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Hero Gradient</label>
                  <select
                    value={formData.hero_gradient}
                    onChange={(e) => setFormData({ ...formData, hero_gradient: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {gradientOptions.map(gradient => (
                      <option key={gradient.value} value={gradient.value} className="bg-slate-800">
                        {gradient.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Related Tickers (comma-separated)</label>
                <input
                  type="text"
                  value={formData.related_tickers}
                  onChange={(e) => setFormData({ ...formData, related_tickers: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  placeholder="AAPL, MSFT, GOOGL, TSLA"
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.is_featured === 1}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">⭐ Set as "Article of the Day"</span>
                </label>

                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.published === 1}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked ? 1 : 0 })}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">📢 Publish Immediately</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : '✅ Create Article'}
              </button>
            </form>
          )}

          {/* Articles List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              All Articles ({articles.length})
            </h2>

            {articles.length === 0 ? (
              <div className="text-white/60 text-center py-12">
                No articles yet. Create your first article!
              </div>
            ) : (
              articles.map(article => (
                <div
                  key={article.id}
                  className="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{article.title}</h3>
                        {article.is_featured === 1 && (
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm font-semibold rounded-full border border-yellow-500/30">
                            ⭐ Featured
                          </span>
                        )}
                        {article.published === 0 && (
                          <span className="px-3 py-1 bg-gray-500/20 text-gray-300 text-sm font-semibold rounded-full border border-gray-500/30">
                            📝 Draft
                          </span>
                        )}
                      </div>
                      <p className="text-white/70 mb-3">{article.description}</p>
                      <div className="flex gap-4 text-sm text-white/50">
                        <span>Slug: /{article.slug}</span>
                        <span>Created: {new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => toggleFeatured(article.id, article.is_featured)}
                        className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-all"
                        title={article.is_featured === 1 ? 'Unfeature' : 'Set as Featured'}
                      >
                        {article.is_featured === 1 ? '⭐' : '☆'}
                      </button>
                      <button
                        onClick={() => router.push(`/articles/${article.slug}`)}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id, article.title)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
