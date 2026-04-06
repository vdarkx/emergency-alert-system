import React, { useCallback, useEffect, useMemo, useState } from "react";
import EmergencyForm from "../components/EmergencyForm";
import EmergencyDashboard from "../components/EmergencyDashboard";
import Toast from "../components/Toast";
import {
  createEmergencyRequest,
  fetchEmergencyRequestsByRole
} from "../services/emergencyApi";

function UserDashboard({ auth, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const data = await fetchEmergencyRequestsByRole(auth.token, "USER");
      setRequests((previous) => {
        if (!previous.length) {
          return data;
        }

        const oldIds = new Set(previous.map((item) => item.id));
        const newIds = data.filter((item) => !oldIds.has(item.id)).map((item) => item.id);
        if (newIds.length > 0) {
          setHighlightIds(newIds);
          setTimeout(() => setHighlightIds([]), 5000);
        }
        return data;
      });
    } catch (error) {
      showToast(error.message || "Could not load your requests.", "error");
    } finally {
      setLoadingRequests(false);
    }
  }, [auth.token, showToast]);

  useEffect(() => {
    loadRequests();
    const intervalId = setInterval(loadRequests, 6000);
    return () => clearInterval(intervalId);
  }, [loadRequests]);

  const handleCreateRequest = async (payload) => {
    try {
      setIsSubmitting(true);
      await createEmergencyRequest(auth.token, payload);
      await loadRequests();
      showToast("Emergency request created.", "success");
      return true;
    } catch (error) {
      showToast(error.message || "Could not create request.", "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h1 className="sidebar-title">👤 USER Dashboard</h1>
        <p className="sidebar-subtitle">Welcome, {auth.name}. Create alerts and track your own requests.</p>
        <EmergencyForm onSubmit={handleCreateRequest} isSubmitting={isSubmitting} />
        <button type="button" className="secondary-button logout-btn" onClick={onLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <EmergencyDashboard
          requests={filteredRequests}
          loading={loadingRequests}
          updatingId={null}
          highlightIds={highlightIds}
          priorityFilter={priorityFilter}
          statusFilter={statusFilter}
          onPriorityFilterChange={setPriorityFilter}
          onStatusFilterChange={setStatusFilter}
          onUpdateStatus={() => {}}
          canUpdateStatus={false}
          showNearest={true}
          dashboardTitle="My Emergency Requests"
        />
      </main>

      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
      )}
    </div>
  );
}

export default UserDashboard;
