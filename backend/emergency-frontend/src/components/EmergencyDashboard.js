import React, { useMemo } from "react";
import EmergencyCard from "./EmergencyCard";
import { getNearestEmergency } from "../utils/locationUtils";

function EmergencyDashboard({
  requests,
  loading,
  updatingId,
  highlightIds,
  priorityFilter,
  statusFilter,
  onPriorityFilterChange,
  onStatusFilterChange,
  onUpdateStatus,
  canUpdateStatus = true,
  showNearest = true,
  dashboardTitle = "Emergency Dashboard"
}) {
  return (
    <section>
      <div className="panel-card">
        <div className="dashboard-top">
          <h2 className="card-title">📊 {dashboardTitle}</h2>
          <p className="refresh-tag">Auto-refresh every 6 seconds</p>
        </div>

        <div className="filters-row">
          <label>
            Priority
            <select value={priorityFilter} onChange={(event) => onPriorityFilterChange(event.target.value)}>
              <option value="ALL">ALL</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="NORMAL">NORMAL</option>
            </select>
          </label>

          <label>
            Status
            <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)}>
              <option value="ALL">ALL</option>
              <option value="PENDING">PENDING</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </label>
        </div>

        {loading ? (
          <p className="loading-text">Loading emergency requests...</p>
        ) : requests.length === 0 ? (
          <p className="loading-text">No requests found for selected filters.</p>
        ) : (
          <div className="request-grid">
            {requests.map((request) => (
              <EmergencyCard
                key={request.id}
                request={request}
                onUpdateStatus={onUpdateStatus}
                updating={updatingId === request.id}
                highlighted={highlightIds.includes(request.id)}
                canUpdateStatus={canUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>

      {showNearest && (
        <div className="panel-card">
          <h2 className="card-title">🧭 Nearest Emergency (Simulation)</h2>
          <NearestEmergencyPanel requests={requests} />
        </div>
      )}
    </section>
  );
}

function NearestEmergencyPanel({ requests }) {
  const [currentPosition, setCurrentPosition] = React.useState(null);

  const nearest = useMemo(() => getNearestEmergency(requests, currentPosition), [requests, currentPosition]);

  const loadCurrentPosition = () => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    });
  };

  return (
    <div>
      <button type="button" className="secondary-button" onClick={loadCurrentPosition}>
        📍 Check nearest emergency
      </button>

      {!currentPosition && (
        <p className="loading-text">Use your location to find the nearest emergency request.</p>
      )}

      {currentPosition && !nearest && (
        <p className="loading-text">No emergency with saved coordinates is available yet.</p>
      )}

      {nearest && (
        <div className="nearest-box">
          <p>
            <strong>Name:</strong> {nearest.request.name}
          </p>
          <p>
            <strong>Location:</strong> {nearest.request.location}
          </p>
          <p>
            <strong>Distance:</strong> {nearest.distanceKm} km
          </p>
          <a
            className="map-link"
            href={`https://www.google.com/maps?q=${nearest.request.latitude},${nearest.request.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            View nearest on map
          </a>
        </div>
      )}
    </div>
  );
}

export default EmergencyDashboard;
