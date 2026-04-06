import React from "react";
import { formatDateTime } from "../utils/locationUtils";

const getBadgeClass = (value) => {
  const key = (value || "").toUpperCase();
  if (key === "CRITICAL") {
    return "badge badge-critical";
  }
  if (key === "NORMAL") {
    return "badge badge-normal";
  }
  if (key === "COMPLETED") {
    return "badge badge-completed";
  }
  if (key === "ACCEPTED") {
    return "badge badge-accepted";
  }
  return "badge";
};

function EmergencyCard({ request, onUpdateStatus, updating, highlighted, canUpdateStatus }) {
  const hasCoordinates =
    Number.isFinite(request.latitude) && Number.isFinite(request.longitude);

  return (
    <article className={`request-card ${highlighted ? "request-card-highlight" : ""}`}>
      <div className="request-header">
        <h3>🚑 {request.name}</h3>
        <span className={getBadgeClass(request.priority)}>{request.priority}</span>
      </div>

      <p className="request-line">
        <strong>📍 Location:</strong> {request.location}
      </p>
      <p className="request-line">
        <strong>🟢 Status:</strong> <span className={getBadgeClass(request.status)}>{request.status}</span>
      </p>
      <p className="request-line">
        <strong>🕒 Created:</strong> {formatDateTime(request.createdAt)}
      </p>
      <p className="request-line">
        <strong>🙋 Reported by:</strong> {request.createdByEmail || "N/A"}
      </p>
      <p className="request-line">
        <strong>🌐 Coordinates:</strong>{" "}
        {hasCoordinates ? `${request.latitude}, ${request.longitude}` : "Not provided"}
      </p>

      {hasCoordinates && (
        <a
          className="map-link"
          href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
          target="_blank"
          rel="noreferrer"
        >
          Open map
        </a>
      )}

      {canUpdateStatus && (
        <div className="actions-row">
          <button
            type="button"
            className="small-button accept"
            disabled={updating || request.status === "ACCEPTED" || request.status === "COMPLETED"}
            onClick={() => onUpdateStatus(request.id, "ACCEPTED")}
          >
            Accept
          </button>
          <button
            type="button"
            className="small-button complete"
            disabled={updating || request.status === "COMPLETED"}
            onClick={() => onUpdateStatus(request.id, "COMPLETED")}
          >
            Complete
          </button>
        </div>
      )}
    </article>
  );
}

export default EmergencyCard;
