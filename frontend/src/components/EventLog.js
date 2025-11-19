/**
 * Event Log Component
 */

import React, { useRef, useEffect } from 'react';
import './EventLog.css';

function EventLog({ events }) {
  const logRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new events arrive
    if (logRef.current) {
      logRef.current.scrollTop = 0; // Scroll to top since newest is first
    }
  }, [events]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'warning':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 22h20L12 2z" />
            <path d="M12 9v4" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
        );
      case 'error':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4m0-4h.01" strokeLinecap="round" />
          </svg>
        );
    }
  };

  const getEventClass = (type) => {
    return `event-${type}`;
  };

  return (
    <div className="event-log">
      <div className="log-header">
        <h3 className="log-title">
          <svg className="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 12h6m-6 4h6" strokeLinecap="round" />
          </svg>
          Event Log
        </h3>
        <span className="event-count">{events.length} events</span>
      </div>
      
      <div className="log-container" ref={logRef}>
        {events.length === 0 ? (
          <div className="no-events">
            <p>No events yet...</p>
            <p className="text-muted">Waiting for vehicle data</p>
          </div>
        ) : (
          events.map((event) => (
            <div 
              key={event.id} 
              className={`event-item ${getEventClass(event.type)}`}
            >
              <span className="event-icon">{getEventIcon(event.type)}</span>
              <div className="event-content">
                <p className="event-message">{event.message}</p>
                <p className="event-time">
                  {event.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EventLog;
