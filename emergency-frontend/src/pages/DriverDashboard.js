import React, { useCallback, useEffect, useMemo, useState } from "react";
import EmergencyDashboard from "../components/EmergencyDashboard";
import Toast from "../components/Toast";
import {
  fetchEmergencyRequestsByRole,
  updateEmergencyStatus
} from "../services/emergencyApi";

function DriverDashboard({ auth, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [highlightIds, setHighlightIds] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const priorityMatches = priorityFilter === "ALL" || request.priority === priorityFilter;
      const statusMatches = statusFilter === "ALL" || request.status === statusFilter;
      return priorityMatches && statusMatches;
    });
  }, [requests, priorityFilter, statusFilter]);

  const loadRequests = useCallback(async () => {
    try {
      const data = await fetchEmergencyRequestsByRole(auth.token, "DRIVER");
      setRequests((previous) => {
        if (!previous.length) {
          return data;
        }

        const oldIds = new Set(previous.map((item) => item.id));
        const newIds = data.filter((item) => !oldIds.has(item.id)).map((item) => item.id);
        if (newIds.length > 0) {
          setHighlightIds(newIds);
          showToast(`New emergency request received (${newIds.length})`, "info");
          setTimeout(() => setHighlightIds([]), 5000);
        }
        return data;
      });
    } catch (error) {
      showToast(error.message || "Could not load requests.", "error");
    } finally {
      setLoadingRequests(false);
    }
  }, [auth.token, showToast]);

  useEffect(() => {
    loadRequests();
    const intervalId = setInterval(loadRequests, 6000);
    return () => clearInterval(intervalId);
  }, [loadRequests]);

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateEmergencyStatus(auth.token, id, status);
      await loadRequests();
      showToast(`Request marked as ${status}.`, "success");
    } catch (error) {
      showToast(error.message || "Could not update status.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h1 className="sidebar-title">🚗 DRIVER Dashboard</h1>
        <p className="sidebar-subtitle">Welcome, {auth.name}. View and respond to emergency alerts.</p>
        <button type="button" className="secondary-button logout-btn" onClick={onLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <EmergencyDashboard
          requests={filteredRequests}
          loading={loadingRequests}
          updatingId={updatingId}
          highlightIds={highlightIds}
          priorityFilter={priorityFilter}
          statusFilter={statusFilter}
          onPriorityFilterChange={setPriorityFilter}
          onStatusFilterChange={setStatusFilter}
          onUpdateStatus={handleStatusUpdate}
          canUpdateStatus={true}
          showNearest={true}
          dashboardTitle="All Emergency Requests"
        />
      </main>

      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
      )}
    </div>
  );
}

export default DriverDashboard;
