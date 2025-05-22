import React, { useState } from 'react';

type User = {
  username: string;
  password: string;
};

type Post = {
  id: number;
  author: string;
  content: string;
  image?: string;
  likes: string[]; // usernames who liked
  comments: { user: string; text: string }[];
  sharedWith: string[]; // usernames who received this post
};

const colors = {
  bg: "#fafafa",
  card: "#fff",
  accent: "#dbdbdb",
  text: "#262626",
  button: "#0095f6",
  buttonText: "#fff",
  input: "#efefef",
  border: "#dbdbdb",
  logo: "#0095f6",
};

const inputStyle: React.CSSProperties = {
  background: colors.input,
  color: colors.text,
  border: `1px solid ${colors.border}`,
  borderRadius: 6,
  padding: "8px 12px",
  margin: "6px 0",
  width: "100%",
  fontSize: 16,
};

const buttonStyle: React.CSSProperties = {
  background: colors.button,
  color: colors.buttonText,
  border: "none",
  borderRadius: 6,
  padding: "8px 18px",
  margin: "6px 6px 6px 0",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 16,
};

const cardStyle: React.CSSProperties = {
  background: colors.card,
  color: colors.text,
  borderRadius: 16,
  boxShadow: "0 1px 3px #0001",
  padding: 0,
  margin: "24px auto",
  maxWidth: 420,
  border: `1px solid ${colors.border}`,
};

const avatarStyle: React.CSSProperties = {
  background: colors.accent,
  color: "#fff",
  borderRadius: "50%",
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: 18,
  marginRight: 12,
  border: `2px solid ${colors.button}`,
};

const App: React.FC = () => {
  const [page, setPage] = useState<'login' | 'signup' | 'home' | 'create'>('login');
  const [users, setUsers] = useState<User[]>([
    { username: "alice", password: "123" },
    { username: "bob", password: "123" },
    { username: "charlie", password: "123" },
  ]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', password: '' });
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<string | undefined>();
  const [shareModal, setShareModal] = useState<{ open: boolean; postId: number | null }>({ open: false, postId: null });

  // Authentication handlers
  const handleSignup = () => {
    if (!signupData.username || !signupData.password) return;
    if (users.some(u => u.username === signupData.username)) {
      alert("Username already exists!");
      return;
    }
    setUsers([...users, { ...signupData }]);
    setSignupData({ username: '', password: '' });
    setPage('login');
  };

  const handleLogin = () => {
    const user = users.find(
      u => u.username === loginData.username && u.password === loginData.password
    );
    if (user) {
      setCurrentUser(user.username);
      setPage('home');
    } else {
      alert('Invalid credentials');
    }
  };

  // Post handlers
  const handleCreatePost = () => {
    if (!postContent && !postImage) return;
    setPosts([
      {
        id: Date.now(),
        author: currentUser!,
        content: postContent,
        image: postImage,
        likes: [],
        comments: [],
        sharedWith: [],
      },
      ...posts,
    ]);
    setPostContent('');
    setPostImage(undefined);
    setPage('home');
  };

  const handleLike = (id: number) => {
    if (!currentUser) return;
    setPosts(posts.map(p =>
      p.id === id
        ? {
            ...p,
            likes: p.likes.includes(currentUser)
              ? p.likes.filter(u => u !== currentUser)
              : [...p.likes, currentUser],
          }
        : p
    ));
  };

  const handleComment = (id: number, text: string) => {
    if (!currentUser) return;
    setPosts(posts.map(p =>
      p.id === id
        ? { ...p, comments: [...p.comments, { user: currentUser, text }] }
        : p
    ));
  };

  // Share post to a friend
  const handleShare = (postId: number, friend: string) => {
    setPosts(posts.map(p =>
      p.id === postId && !p.sharedWith.includes(friend)
        ? { ...p, sharedWith: [...p.sharedWith, friend] }
        : p
    ));
    setShareModal({ open: false, postId: null });
    alert("Post shared!");
  };

  // Switch account
  const handleSwitchAccount = (username: string) => {
    setCurrentUser(username);
    setPage('home');
  };

  // Shows all posts to all users
  const visiblePosts = posts;

  // Logo and top bar
  const TopBar = () => (
    <div style={{
      background: "#fff",
      borderBottom: `1px solid ${colors.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 0 0 0",
      height: 64,
      position: "sticky",
      top: 0,
      zIndex: 10,
      boxShadow: "0 2px 8px #0001"
    }}>
      <div style={{ display: "flex", alignItems: "center", marginLeft: 32 }}>
        <span style={{
          fontWeight: 900,
          fontSize: 28,
          color: colors.logo,
          letterSpacing: 2,
          fontFamily: "Segoe UI, Arial, sans-serif",
          display: "flex",
          alignItems: "center"
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" style={{ marginRight: 8 }}>
            <circle cx="16" cy="16" r="14" fill={colors.button} />
            <text x="16" y="22" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold">S</text>
          </svg>
          SOCIAL HUB
        </span>
      </div>
      {currentUser && (
        <div style={{ display: "flex", alignItems: "center", marginRight: 32 }}>
          <span style={{ marginRight: 10, fontWeight: 600, color: colors.text }}>
            <span style={avatarStyle}>{currentUser[0].toUpperCase()}</span>
            {currentUser}
          </span>
          <select
            style={{
              ...inputStyle,
              width: 120,
              margin: 0,
              fontWeight: 600,
              background: "#fff",
              color: colors.text,
              border: `1px solid ${colors.border}`,
              cursor: "pointer"
            }}
            value={currentUser}
            onChange={e => handleSwitchAccount(e.target.value)}
          >
            {users.map(u => (
              <option key={u.username} value={u.username}>{u.username}</option>
            ))}
          </select>
          <button
            style={{ ...buttonStyle, background: "#F02849", marginLeft: 10 }}
            onClick={() => { setCurrentUser(null); setPage('login'); }}
          >Logout</button>
        </div>
      )}
    </div>
  );

  // Pages
  if (page === 'signup') {
    return (
      <div style={centeredBg}>
        <TopBar />
        <div style={{ ...cardStyle, marginTop: 48, padding: 32 }}>
          <h2 style={{ textAlign: "center", marginBottom: 24 }}>Sign Up</h2>
          <input
            style={inputStyle}
            placeholder="Username"
            value={signupData.username}
            onChange={e => setSignupData({ ...signupData, username: e.target.value })}
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={signupData.password}
            onChange={e => setSignupData({ ...signupData, password: e.target.value })}
          />
          <button style={buttonStyle} onClick={handleSignup}>Sign Up</button>
          <p style={{ textAlign: "center" }}>
            Already have an account? <button style={{ ...buttonStyle, background: "transparent", color: colors.button, boxShadow: "none" }} onClick={() => setPage('login')}>Login</button>
          </p>
        </div>
      </div>
    );
  }

  if (page === 'login') {
    return (
      <div style={centeredBg}>
        <TopBar />
        <div style={{ ...cardStyle, marginTop: 48, padding: 32 }}>
          <h2 style={{ textAlign: "center", marginBottom: 24 }}>Login</h2>
          <input
            style={inputStyle}
            placeholder="Username"
            value={loginData.username}
            onChange={e => setLoginData({ ...loginData, username: e.target.value })}
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={e => setLoginData({ ...loginData, password: e.target.value })}
          />
          <button style={buttonStyle} onClick={handleLogin}>Login</button>
          <p style={{ textAlign: "center" }}>
            Don't have an account? <button style={{ ...buttonStyle, background: "transparent", color: colors.button, boxShadow: "none" }} onClick={() => setPage('signup')}>Sign Up</button>
          </p>
        </div>
      </div>
    );
  }

  if (page === 'create') {
    return (
      <div style={centeredBg}>
        <TopBar />
        <div style={{ ...cardStyle, marginTop: 32, padding: 32 }}>
          <h2 style={{ textAlign: "center" }}>Create Post</h2>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            placeholder="What's on your mind?"
            value={postContent}
            onChange={e => setPostContent(e.target.value)}
          />
          <input
            style={inputStyle}
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = ev => setPostImage(ev.target?.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
          {postImage && <img src={postImage} alt="preview" style={{ maxWidth: 320, margin: "10px 0", borderRadius: 12, display: "block" }} />}
          <div>
            <button style={buttonStyle} onClick={handleCreatePost}>Post</button>
            <button style={{ ...buttonStyle, background: colors.accent, color: colors.text }} onClick={() => setPage('home')}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // Home/feed page
  return (
    <div style={centeredBg}>
      <TopBar />
      <div style={{ maxWidth: 540, margin: "0 auto", marginTop: 32 }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 24,
        }}>
          <button style={buttonStyle} onClick={() => setPage('create')}>+ New Post</button>
        </div>
        {visiblePosts.length === 0 && <p style={{ color: "#aaa", textAlign: "center" }}>No posts yet.</p>}
        {visiblePosts.map(post => (
          <div key={post.id} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", padding: 16, borderBottom: `1px solid ${colors.accent}` }}>
              <div style={avatarStyle}>{post.author[0].toUpperCase()}</div>
              <b style={{ fontSize: 16 }}>{post.author}</b>
              {post.author !== currentUser && post.sharedWith.includes(currentUser!) && (
                <span style={{ marginLeft: 8, color: "#888", fontSize: 13 }}>(Shared with you)</span>
              )}
            </div>
            {post.image && <img src={post.image} alt="post" style={{ width: "100%", maxHeight: 340, objectFit: "cover", borderRadius: "0 0 16px 16px" }} />}
            <div style={{ padding: 16 }}>
              <p style={{ margin: "8px 0", fontSize: 15 }}>{post.content}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0" }}>
                <button
                  style={{
                    ...buttonStyle,
                    background: post.likes.includes(currentUser!) ? "#ed4956" : colors.button,
                    color: "#fff",
                    padding: "6px 14px",
                    fontSize: 15,
                  }}
                  onClick={() => handleLike(post.id)}
                >❤️ {post.likes.length}</button>
                <button
                  style={{
                    ...buttonStyle,
                    background: "#f7b731",
                    color: "#fff",
                    padding: "6px 14px",
                    fontSize: 15,
                  }}
                  onClick={() => setShareModal({ open: true, postId: post.id })}
                >📤 Share</button>
              </div>
              <CommentSection post={post} onComment={handleComment} currentUser={currentUser} />
              <div style={{ marginTop: 10 }}>
                <b>Comments:</b>
                {post.comments.length === 0 && <span style={{ color: "#aaa" }}> No comments yet.</span>}
                {post.comments.map((c, i) => (
                  <div key={i} style={{ margin: "4px 0", paddingLeft: 10 }}>
                    <span style={{ color: "#0095f6", fontWeight: 600 }}>{c.user}:</span> {c.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {shareModal.open && (
        <ShareModal
          users={users}
          currentUser={currentUser!}
          postId={shareModal.postId!}
          onShare={handleShare}
          onClose={() => setShareModal({ open: false, postId: null })}
        />
      )}
    </div>
  );
};

const centeredBg: React.CSSProperties = {
  background: colors.bg,
  minHeight: "100vh",
  padding: "0",
  margin: "0",
};

const CommentSection: React.FC<{
  post: Post;
  onComment: (id: number, text: string) => void;
  currentUser: string | null;
}> = ({ post, onComment, currentUser }) => {
  const [comment, setComment] = React.useState('');
  return (
    <div style={{ margin: "10px 0" }}>
      <input
        style={{ ...inputStyle, width: "70%", display: "inline-block" }}
        placeholder="Add a comment"
        value={comment}
        disabled={!currentUser}
        onChange={e => setComment(e.target.value)}
      />
      <button
        style={{ ...buttonStyle, background: "#0095f6" }}
        disabled={!comment || !currentUser}
        onClick={() => {
          if (comment && currentUser) {
            onComment(post.id, comment);
            setComment('');
          }
        }}
      >Comment</button>
    </div>
  );
};

const ShareModal: React.FC<{
  users: User[];
  currentUser: string;
  postId: number;
  onShare: (postId: number, friend: string) => void;
  onClose: () => void;
}> = ({ users, currentUser, postId, onShare, onClose }) => {
  const friends = users.filter(u => u.username !== currentUser);
  const [selected, setSelected] = useState(friends[0]?.username || "");
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "#0006",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: 32,
        minWidth: 280,
        boxShadow: "0 4px 24px #0002",
        textAlign: "center"
      }}>
        <h3 style={{ marginBottom: 18 }}>Share Post</h3>
        <select
          style={{ ...inputStyle, width: "100%", marginBottom: 18, color: colors.text, background: "#fff" }}
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          {friends.map(f => (
            <option key={f.username} value={f.username}>{f.username}</option>
          ))}
        </select>
        <button style={buttonStyle} onClick={() => onShare(postId, selected)}>Share</button>
        <button style={{ ...buttonStyle, background: colors.accent, color: colors.text, marginLeft: 10 }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default App;
