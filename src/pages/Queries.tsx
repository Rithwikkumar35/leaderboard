import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import QueryCard from '../components/queries/QueryCard';
import type { Database } from '../types/database';

type Query = Database['public']['Tables']['queries']['Row'] & {
  profiles: { username: string };
};

type Response = Database['public']['Tables']['query_responses']['Row'] & {
  profiles: { username: string } | null;
};

interface QueriesProps {
  onNavigate: (page: string) => void;
  userId: string;
}

export default function Queries({ onNavigate, userId }: QueriesProps) {
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    const { data } = await supabase
      .from('queries')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false });

    if (data) {
      setQueries(data as Query[]);
    }
  };

  const loadResponses = async (queryId: string) => {
    const { data } = await supabase
      .from('query_responses')
      .select('*, profiles(username)')
      .eq('query_id', queryId)
      .order('created_at', { ascending: true });

    if (data) {
      setResponses(data as Response[]);
    }
  };

  const handleCreateQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('queries').insert({
      user_id: userId,
      title,
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    if (error) {
      alert('Failed to create query: ' + error.message);
    } else {
      setTitle('');
      setContent('');
      setTags('');
      setShowCreateModal(false);
      loadQueries();
    }

    setLoading(false);
  };

  const handleAddResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuery) return;

    setLoading(true);

    const { error } = await supabase.from('query_responses').insert({
      query_id: selectedQuery.id,
      user_id: userId,
      content: responseText,
      is_ai_response: false,
    });

    if (error) {
      alert('Failed to add response: ' + error.message);
    } else {
      setResponseText('');
      loadResponses(selectedQuery.id);
    }

    setLoading(false);
  };

  const handleQueryClick = async (query: Query) => {
    setSelectedQuery(query);
    await loadResponses(query.id);
  };

  const getResponseCount = async (queryId: string) => {
    const { count } = await supabase
      .from('query_responses')
      .select('*', { count: 'exact', head: true })
      .eq('query_id', queryId);
    return count || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (selectedQuery) {
                setSelectedQuery(null);
              } else {
                onNavigate('dashboard');
              }
            }}
            className="text-white hover:text-blue-400 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            {selectedQuery ? 'Back to Questions' : 'Back to Dashboard'}
          </button>
          {!selectedQuery && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Ask Question
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedQuery ? (
          <>
            <h1 className="text-4xl font-bold text-white mb-8">Q&A Forum</h1>
            <div className="grid gap-6">
              {queries.map((query) => (
                <QueryCard
                  key={query.id}
                  title={query.title}
                  content={query.content}
                  username={query.profiles.username}
                  createdAt={query.created_at}
                  tags={query.tags}
                  responseCount={0}
                  onClick={() => handleQueryClick(query)}
                />
              ))}
            </div>
            {queries.length === 0 && (
              <div className="text-center text-gray-400 py-16">
                <p className="text-lg">No questions yet. Be the first to ask!</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h1 className="text-3xl font-bold text-white mb-4">{selectedQuery.title}</h1>
              <p className="text-gray-300 mb-4">{selectedQuery.content}</p>
              <div className="flex flex-wrap gap-2">
                {selectedQuery.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Responses</h2>
              <div className="space-y-4">
                {responses.map((response) => (
                  <div key={response.id} className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-300 mb-2">{response.content}</p>
                    <p className="text-sm text-gray-400">
                      {response.is_ai_response ? 'AI' : response.profiles?.username || 'Unknown'}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddResponse} className="mt-6">
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your response..."
                  rows={4}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send Response'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Ask a Question</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateQuery} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Question</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., arrays, recursion, time complexity"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Posting...' : 'Post Question'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
