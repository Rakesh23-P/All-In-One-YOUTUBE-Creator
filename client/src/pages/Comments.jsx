import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import Table from '../components/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaComments, 
  FaCheck, 
  FaTimes, 
  FaTrash, 
  FaSmile, 
  FaMeh, 
  FaFrown,
  FaHeart
} from 'react-icons/fa';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sentiment counters state
  const [sentimentMetrics, setSentimentMetrics] = useState({
    positive: 0,
    neutral: 0,
    negative: 0
  });

  const fetchComments = async () => {
    try {
      const res = await axios.get('/api/comments');
      if (res.data.success) {
        const list = res.data.data;
        setComments(list);

        // Count sentiments
        const pos = list.filter(c => c.sentiment === 'positive').length;
        const neu = list.filter(c => c.sentiment === 'neutral').length;
        const neg = list.filter(c => c.sentiment === 'negative').length;
        setSentimentMetrics({ positive: pos, neutral: neu, negative: neg });
      }
    } catch (error) {
      console.error('Error fetching comments list', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleApproveToggle = async (id) => {
    try {
      const res = await axios.put(`/api/comments/${id}/approve`);
      if (res.data.success) {
        setComments(comments.map(c => c._id === id ? { ...c, isApproved: res.data.data.isApproved } : c));
        toast.success(res.data.data.isApproved ? 'Comment approved and visible' : 'Comment restricted');
      }
    } catch (error) {
      toast.error('Failed to change comment approval status');
    }
  };

  const handleDeleteComment = async (id) => {
    const confirm = window.confirm('Are you sure you want to permanently delete this comment from the video?');
    if (confirm) {
      try {
        const res = await axios.delete(`/api/comments/${id}`);
        if (res.data.success) {
          toast.success('Comment deleted.');
          fetchComments();
        }
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  // Helper to format sentiment badge
  const renderSentiment = (sentiment) => {
    if (sentiment === 'positive') return <span className="badge flex-align" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}><FaSmile /> Positive</span>;
    if (sentiment === 'negative') return <span className="badge flex-align" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}><FaFrown /> Negative</span>;
    return <span className="badge flex-align" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}><FaMeh /> Neutral</span>;
  };

  if (loading) return <Loader fullScreen />;

  const totalComments = comments.length;
  const positiveRatio = totalComments > 0 ? Math.round((sentimentMetrics.positive / totalComments) * 100) : 0;
  const neutralRatio = totalComments > 0 ? Math.round((sentimentMetrics.neutral / totalComments) * 100) : 0;
  const negativeRatio = totalComments > 0 ? Math.round((sentimentMetrics.negative / totalComments) * 100) : 0;

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <h1 className="mb-3" style={{ fontSize: '2rem', fontWeight: 800 }}>
          Comment <span className="gradient-text">Moderation</span>
        </h1>

        {/* Sentiment Analysis Board */}
        <div className="grid-3 mb-3">
          <div className="glass-card flex-align" style={{ gap: '1rem' }}>
            <FaSmile style={{ fontSize: '2.2rem', color: 'var(--success)' }} />
            <div>
              <h3 style={{ fontSize: '1.4rem' }}>{positiveRatio}%</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Positive Sentiment ({sentimentMetrics.positive})</span>
            </div>
          </div>

          <div className="glass-card flex-align" style={{ gap: '1rem' }}>
            <FaMeh style={{ fontSize: '2.2rem', color: 'var(--warning)' }} />
            <div>
              <h3 style={{ fontSize: '1.4rem' }}>{neutralRatio}%</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Neutral Comments ({sentimentMetrics.neutral})</span>
            </div>
          </div>

          <div className="glass-card flex-align" style={{ gap: '1rem' }}>
            <FaFrown style={{ fontSize: '2.2rem', color: 'var(--danger)' }} />
            <div>
              <h3 style={{ fontSize: '1.4rem' }}>{negativeRatio}%</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Critical/Spam Sentiments ({sentimentMetrics.negative})</span>
            </div>
          </div>
        </div>

        {/* Comments table list */}
        <div className="glass-card">
          <div className="flex-align mb-3">
            <FaComments style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Viewer Feedback Mod Queue</h3>
          </div>

          {comments.length > 0 ? (
            <Table headers={['Author', 'Comment Content', 'Source Video', 'Sentiment', 'Visibility', 'Actions']}>
              {comments.map((comment) => (
                <tr key={comment._id} style={{ opacity: comment.isApproved ? 1 : 0.6 }}>
                  <td>
                    <div className="flex-align" style={{ gap: '0.75rem' }}>
                      {comment.userIcon ? (
                        <img src={comment.userIcon} alt={comment.authorName} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                          {comment.authorName.charAt(0)}
                        </div>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{comment.authorName}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ maxWidth: '300px', fontSize: '0.875rem', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                    "{comment.text}"
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 550 }}>
                    {comment.videoId?.title || 'Unknown Video'}
                  </td>
                  <td>
                    {renderSentiment(comment.sentiment)}
                  </td>
                  <td>
                    <span className={`badge ${comment.isApproved ? 'badge-published' : 'badge-draft'}`}>
                      {comment.isApproved ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div className="flex-align" style={{ gap: '0.5rem' }}>
                      <button 
                        className="nav-icon-btn" 
                        onClick={() => handleApproveToggle(comment._id)}
                        title={comment.isApproved ? 'Hide from Channel' : 'Approve to Channel'}
                        style={{ color: comment.isApproved ? 'var(--warning)' : 'var(--success)' }}
                      >
                        {comment.isApproved ? <FaTimes /> : <FaCheck />}
                      </button>
                      <button 
                        className="nav-icon-btn" 
                        onClick={() => handleDeleteComment(comment._id)}
                        title="Delete Comment"
                        style={{ color: 'var(--danger)' }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem' }}>
              No comments recorded on your videos yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Comments;
