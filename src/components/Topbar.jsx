export default function Topbar({ user, onNew, onLogout, showNew = true }) {
  return (
    <nav className="topbar">
      <div className="topbar-brand">
        <div className="topbar-brand-icon">◈</div>
        SmartBuy AI
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {user && (
          <div className="user-chip">
            <div className="user-avatar">
              {(user.name || 'U')[0].toUpperCase()}
            </div>
            {user.name}
          </div>
        )}
        {showNew && (
          <button className="btn btn-outline" onClick={onNew}>
            + New analysis
          </button>
        )}
        <button className="btn btn-outline" onClick={onLogout}>
          Sign out
        </button>
      </div>
    </nav>
  )
}
