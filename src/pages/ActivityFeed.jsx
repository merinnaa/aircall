import React, { useEffect, useState } from "react";

const BASE_URL = "https://aircall-api.onrender.com";

const ActivityFeed = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await fetch(`${BASE_URL}/activities`);
        if (!response.ok) {
          throw new Error("Failed to fetch call data");
        }
        const data = await response.json();
        setCalls(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  // Group calls by date
  const groupCallsByDate = (calls) => {
    return calls.reduce((acc, call) => {
      const date = new Date(call.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(call);
      return acc;
    }, {});
  };

  const groupedCalls = groupCallsByDate(calls);

  if (loading) return <p> Loading....</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div id="app">
      <div className="container">
        <div className="container-view">
          <h1>Activity Feed</h1>
          {Object.entries(groupedCalls).map(([date, callGroup]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="date-line">
                <span>{date}</span>
              </div>
              {/* Call Details */}
              {callGroup.map((call) => (
                <div key={call.id} className="call-item">
                  <div className="call-header">
                    {/* Dynamic Icon Based on Call Type */}
                    <span className="phone-icon">
                      {call.call_type === "missed" ? "❌" : "📞"}
                    </span>
                    <span className="caller-info">
                      {call.from} — {new Date(call.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="via-info">{call.via}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
