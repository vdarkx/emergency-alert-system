import React, { useState } from "react";

function EmergencyForm({ onSubmit, isSubmitting }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [nameError, setNameError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setLocation("");
    setPriority("NORMAL");
    setLatitude("");
    setLongitude("");
    setNameError("");
    setLocationError("");
  };

  const validate = () => {
    let valid = true;

    if (!name.trim()) {
      setNameError("Name is required.");
      valid = false;
    } else {
      setNameError("");
    }

    if (!location.trim()) {
      setLocationError("Location is required.");
      valid = false;
    } else {
      setLocationError("");
    }

    return valid;
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setLocationLoading(false);
      },
      () => {
        setLocationError("Could not fetch current location.");
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const didSave = await onSubmit({
      name: name.trim(),
      location: location.trim(),
      priority,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null
    });

    if (didSave) {
      resetForm();
    }
  };

  return (
    <div className="panel-card">
      <h2 className="card-title">🚨 New Emergency Request</h2>
      <p className="card-subtitle">Capture a request quickly and send it to responders.</p>

      <form onSubmit={handleSubmit} className="form-grid">
        <label htmlFor="name" className="field-label">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter name"
        />
        {nameError && <p className="field-error">{nameError}</p>}

        <label htmlFor="location" className="field-label">
          Location
        </label>
        <input
          id="location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Area / street / landmark"
        />
        {locationError && <p className="field-error">{locationError}</p>}

        <label htmlFor="priority" className="field-label">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          className={priority === "CRITICAL" ? "priority-critical" : ""}
        >
          <option value="NORMAL">NORMAL</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>

        <div className="location-row">
          <input
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
            placeholder="Latitude"
          />
          <input
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
            placeholder="Longitude"
          />
        </div>

        <button type="button" className="secondary-button" onClick={handleGetCurrentLocation}>
          {locationLoading ? "Finding location..." : "📍 Use current location"}
        </button>

        <button type="submit" className="danger-button" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Emergency Alert"}
        </button>
      </form>
    </div>
  );
}

export default EmergencyForm;
