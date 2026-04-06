import React, { useEffect } from "react";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return <div className={`toast toast-${type}`}>{message}</div>;
}

export default Toast;
