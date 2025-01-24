import React, { useState, useEffect } from "react";
import {
  FaPhoneAlt,
  FaPhoneSlash,
  FaArchive,
  FaInbox,
} from "react-icons/fa";


const BASE_URL = "https://aircall-api.onrender.com";

const ActivityFeed = () => {
  const [activeTab, setActiveTab] = useState("activityFeed");
  const [activeCalls, setActiveCalls] = useState([]);
  const [archivedCalls, setArchivedCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch calls from the API
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await fetch(`${BASE_URL}/activities`);
        if (!response.ok) {
          throw new Error("Failed to fetch calls.");
        }
        const data = await response.json();

        // Separate calls into active and archived
        const active = data.filter((call) => !call.is_archived);
        const archived = data.filter((call) => call.is_archived);

        setActiveCalls(active);
        setArchivedCalls(archived);
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
    return calls.reduce((groups, call) => {
      const date = new Date(call.created_at).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(call);
      return groups;
    }, {});
  };

  const activeCallsByDate = groupCallsByDate(activeCalls);
  const archivedCallsByDate = groupCallsByDate(archivedCalls);

  // Archive all calls
  const archiveAllCalls = async () => {
    try {
      await Promise.all(
        activeCalls.map((call) =>
          fetch(`${BASE_URL}/activities/${call.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ is_archived: true }),
          })
        )
      );
      setArchivedCalls([...archivedCalls, ...activeCalls]);
      setActiveCalls([]);
    } catch (err) {
      setError("Failed to archive all calls.");
    }
  };

  // Unarchive all calls
  const unarchiveAllCalls = async () => {
    try {
      await Promise.all(
        archivedCalls.map((call) =>
          fetch(`${BASE_URL}/activities/${call.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ is_archived: false }),
          })
        )
      );
      setActiveCalls([...activeCalls, ...archivedCalls]);
      setArchivedCalls([]);
    } catch (err) {
      setError("Failed to unarchive all calls.");
    }
  };

  // Render grouped calls by date
  const renderCallsByDate = (callsByDate) => {
    return Object.entries(callsByDate).map(([date, calls]) => (
      <div key={date} className="date-group">
        <h3>{date}</h3>
        {calls.map((call) => (
          <div key={call.id} className="call-item">
            <div className="caller">
              {call.call_type === "answered" ? (
                <FaPhoneAlt color="green" size="1.2em" title="Answered call" />
              ) : call.call_type === "missed" ? (
                <FaPhoneSlash color="red" size="1.2em" title="Missed call" />
              ) : null}
              <div className="call-info">
                <p className="call-main">{call.from || call.to}</p>
                
              </div>
            </div>
            <div className="call-details">
              {new Date(call.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        ))}
      </div>
    ));
  };

  if (loading) return <p>Loading....</p>
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container-view">
      {/* Tab Headers */}
      <div className="tab-header">
        <button
          className={`tab-button ${
            activeTab === "activityFeed" ? "active" : ""
          }`}
          onClick={() => setActiveTab("activityFeed")}
        >
          Activity Feed
        </button>
        <button
          className={`tab-button ${
            activeTab === "archivedCalls" ? "active" : ""
          }`}
          onClick={() => setActiveTab("archivedCalls")}
        >
          Archived Calls
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "activityFeed" && (
          <div className="activity-feed">
            <h2>Activity Feed</h2>
            {Object.keys(activeCallsByDate).length > 0 ? (
              <>
                <button className="archive-button" onClick={archiveAllCalls}>
                  <FaArchive size="1.2em" color="green" /> Archive all calls
                </button>
                {renderCallsByDate(activeCallsByDate)}
              </>
            ) : (
              <p>No active calls to display.</p>
            )}
          </div>
        )}

        {activeTab === "archivedCalls" && (
          <div className="archived-calls">
            <h2>Archived Calls</h2>
            {Object.keys(archivedCallsByDate).length > 0 ? (
              <>
                <button
                  className="unarchive-button"
                  onClick={unarchiveAllCalls}
                >
                  <FaInbox size="1.2em" color="green" /> Unarchive all calls
                </button>
                {renderCallsByDate(archivedCallsByDate)}
              </>
            ) : (
              <p>No archived calls to display.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
