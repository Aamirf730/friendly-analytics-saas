import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const Dashboard = () => {
    const [authStatus, setAuthStatus] = useState({ authenticated: false, property_id: '' });
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Check auth status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Fetch properties when authenticated
    useEffect(() => {
        if (authStatus.authenticated) {
            fetchProperties();
        }
    }, [authStatus.authenticated]);

    // Fetch summary when property selected
    useEffect(() => {
        if (selectedProperty) {
            fetchSummary();
        }
    }, [selectedProperty]);

    const checkAuthStatus = async () => {
        try {
            const response = await apiFetch({ path: '/simple-analytics/v1/auth/status' });
            setAuthStatus(response);
            if (response.property_id) {
                setSelectedProperty(response.property_id);
            }
            setLoading(false);
        } catch (err) {
            console.error('Auth check failed:', err);
            setLoading(false);
        }
    };

    const fetchProperties = async () => {
        try {
            const response = await apiFetch({ path: '/simple-analytics/v1/properties' });
            if (response.error) {
                setError(response.error);
            } else if (Array.isArray(response)) {
                setProperties(response);
                if (response.length > 0 && !selectedProperty) {
                    setSelectedProperty(response[0].id);
                }
            }
        } catch (err) {
            console.error('Properties fetch failed:', err);
            setError('Failed to load properties');
        }
    };

    const fetchSummary = async () => {
        if (!selectedProperty) return;

        setLoading(true);
        try {
            const response = await apiFetch({
                path: `/simple-analytics/v1/summary?property_id=${selectedProperty}`
            });
            if (response.error) {
                setError(response.error);
            } else {
                setSummary(response);
                setError(null);
            }
        } catch (err) {
            console.error('Summary fetch failed:', err);
            setError('Failed to load analytics data');
        }
        setLoading(false);
    };

    const handleConnect = async () => {
        try {
            const response = await apiFetch({ path: '/simple-analytics/v1/auth/url' });
            if (response.url) {
                window.location.href = response.url;
            }
        } catch (err) {
            console.error('Failed to get auth URL:', err);
        }
    };

    const handleDisconnect = async () => {
        try {
            await apiFetch({
                path: '/simple-analytics/v1/auth/disconnect',
                method: 'POST'
            });
            setAuthStatus({ authenticated: false, property_id: '' });
            setSummary(null);
            setProperties([]);
        } catch (err) {
            console.error('Disconnect failed:', err);
        }
    };

    const handlePropertyChange = async (e) => {
        const newProperty = e.target.value;
        setSelectedProperty(newProperty);
        try {
            await apiFetch({
                path: '/simple-analytics/v1/property',
                method: 'POST',
                data: { property_id: newProperty }
            });
        } catch (err) {
            console.error('Failed to save property:', err);
        }
    };

    // Loading state
    if (loading && !summary) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', background: '#f9fafb' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', border: '4px solid #e5e7eb', borderTopColor: '#5865F2', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                    <p style={{ color: '#6b7280', fontWeight: 600 }}>Loading Friendly Analytics...</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Not authenticated - show connect button
    if (!authStatus.authenticated) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '24px', margin: '20px' }}>
                <div style={{ textAlign: 'center', color: '#fff', maxWidth: '500px', padding: '40px' }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>📊</div>
                    <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px' }}>Friendly Analytics</h1>
                    <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '40px', lineHeight: 1.6 }}>
                        Connect your Google Analytics to see beautiful, human-friendly insights right in your WordPress dashboard.
                    </p>
                    <button
                        onClick={handleConnect}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            padding: '16px 32px',
                            fontSize: '18px',
                            fontWeight: 700,
                            backgroundColor: '#fff',
                            color: '#374151',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s',
                            margin: '0 auto',
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '24px', height: '24px' }} />
                        Connect with Google
                    </button>
                </div>
            </div>
        );
    }

    // Main dashboard
    return (
        <div style={{ display: 'flex', minHeight: '600px' }}>
            {/* Sidebar */}
            <aside style={{ width: '256px', backgroundColor: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#5865F2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📊 Friendly Analytics
                    </h1>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                        Live Data
                    </p>
                </div>

                <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['overview', 'realtime', 'reports'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: activeTab === tab ? '#5865F2' : 'transparent',
                                color: activeTab === tab ? '#fff' : '#4b5563',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                            }}
                        >
                            {tab === 'overview' && '📈'}
                            {tab === 'realtime' && '👥'}
                            {tab === 'reports' && '📊'}
                            {tab}
                        </button>
                    ))}
                </nav>

                <div style={{ padding: '16px', borderTop: '1px solid #f3f4f6' }}>
                    <button
                        onClick={handleDisconnect}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            fontWeight: 600,
                        }}
                    >
                        🔌 Disconnect
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto', padding: '40px', backgroundColor: '#f9fafb' }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', textTransform: 'capitalize' }}>
                            {activeTab} Dashboard
                        </h2>
                        <p style={{ color: '#6b7280', marginTop: '4px' }}>
                            {summary ? `Data for ${summary.chartData?.length || 0} days` : 'Select a property to view data'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <select
                            value={selectedProperty}
                            onChange={handlePropertyChange}
                            style={{
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                backgroundColor: '#fff',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            {properties.map(prop => (
                                <option key={prop.id} value={prop.id}>
                                    {prop.displayName}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={fetchSummary}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#5865F2',
                                color: '#fff',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            🔄 Refresh
                        </button>
                    </div>
                </header>

                {error && (
                    <div style={{ padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', marginBottom: '24px', color: '#dc2626' }}>
                        ⚠️ {error}
                    </div>
                )}

                {summary && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {/* Metric Cards */}
                        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <span style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(88, 101, 242, 0.1)', fontSize: '24px' }}>👥</span>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '9999px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                                    Live
                                </span>
                            </div>
                            <h3 style={{ color: '#6b7280', fontWeight: '500', fontSize: '14px' }}>Total Users</h3>
                            <div style={{ fontSize: '30px', fontWeight: 'bold', marginTop: '4px', color: '#111827' }}>{summary.totalUsers?.toLocaleString() || 0}</div>
                            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>Last 30 days</p>
                        </div>

                        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <span style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', fontSize: '24px' }}>📈</span>
                            </div>
                            <h3 style={{ color: '#6b7280', fontWeight: '500', fontSize: '14px' }}>Total Sessions</h3>
                            <div style={{ fontSize: '30px', fontWeight: 'bold', marginTop: '4px', color: '#111827' }}>{summary.totalSessions?.toLocaleString() || 0}</div>
                            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>Last 30 days</p>
                        </div>

                        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <span style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(249, 115, 22, 0.1)', fontSize: '24px' }}>👁️</span>
                            </div>
                            <h3 style={{ color: '#6b7280', fontWeight: '500', fontSize: '14px' }}>Page Views</h3>
                            <div style={{ fontSize: '30px', fontWeight: 'bold', marginTop: '4px', color: '#111827' }}>{summary.totalPageViews?.toLocaleString() || 0}</div>
                            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>Last 30 days</p>
                        </div>

                        {/* Active Users Card */}
                        <div style={{ backgroundColor: '#5865F2', padding: '24px', borderRadius: '16px', color: '#fff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <span style={{ fontSize: '24px' }}>🔴</span>
                                <span style={{ fontWeight: 600 }}>Real-time</span>
                            </div>
                            <h3 style={{ fontWeight: '500', fontSize: '14px', opacity: 0.8 }}>Active Now</h3>
                            <div style={{ fontSize: '48px', fontWeight: 'bold', marginTop: '8px' }}>{summary.activeUsers || 0}</div>
                        </div>

                        {/* Traffic Chart */}
                        <div style={{ gridColumn: 'span 2', backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '300px' }}>
                            <h3 style={{ fontWeight: 'bold', color: '#111827', fontSize: '18px', marginBottom: '24px' }}>📊 Traffic Overview</h3>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', paddingTop: '20px' }}>
                                {summary.chartData?.slice(-7).map((point, i) => {
                                    const maxUsers = Math.max(...summary.chartData.slice(-7).map(d => d.users || 1));
                                    const height = ((point.users || 0) / maxUsers) * 150;
                                    return (
                                        <div key={i} style={{ textAlign: 'center' }}>
                                            <div style={{
                                                width: '40px',
                                                height: `${Math.max(height, 10)}px`,
                                                backgroundColor: '#5865F2',
                                                borderRadius: '8px 8px 0 0',
                                                opacity: 0.7 + (i / 10),
                                            }}></div>
                                            <span style={{ fontSize: '10px', color: '#9ca3af', display: 'block', marginTop: '8px' }}>
                                                {point.date}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {!summary && !loading && !error && (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
                        <p style={{ fontSize: '18px', fontWeight: 600 }}>Select a property above to view your analytics</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
