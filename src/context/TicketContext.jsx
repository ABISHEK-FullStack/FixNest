import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_TICKETS, WORKERS, APARTMENT_INFO, PRIORITIES } from '../data/mockData';

const TicketContext = createContext(null);

const STORAGE_KEY = 'fixnest_bootstrap_tickets_v1';
const ROLE_KEY = 'fixnest_bootstrap_active_role_v1';
const RESIDENT_KEY = 'fixnest_bootstrap_active_resident_v1';
const WORKER_KEY = 'fixnest_bootstrap_active_worker_v1';

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading tickets from localStorage', e);
    }
    return INITIAL_TICKETS;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem(ROLE_KEY) || 'RESIDENT'; // RESIDENT | MAINTENANCE | WORKER | ADMIN
  });

  const [currentResident, setCurrentResident] = useState(() => {
    const savedId = localStorage.getItem(RESIDENT_KEY);
    const found = APARTMENT_INFO.residents.find(r => r.id === savedId);
    return found || APARTMENT_INFO.residents[0];
  });

  const [currentWorker, setCurrentWorker] = useState(() => {
    const savedId = localStorage.getItem(WORKER_KEY);
    const found = WORKERS.find(w => w.id === savedId);
    return found || WORKERS[0];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.error('Failed to save tickets', e);
    }
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, currentRole);
  }, [currentRole]);

  useEffect(() => {
    if (currentResident) {
      localStorage.setItem(RESIDENT_KEY, currentResident.id);
    }
  }, [currentResident]);

  useEffect(() => {
    if (currentWorker) {
      localStorage.setItem(WORKER_KEY, currentWorker.id);
    }
  }, [currentWorker]);

  // Actions
  const createTicket = ({ title, description, category, block, floor, flat, priority, beforePhoto, residentName, residentPhone }) => {
    const now = new Date();
    const slaHours = PRIORITIES[priority]?.slaHours || 24;
    const slaDueAt = new Date(now.getTime() + slaHours * 3600 * 1000).toISOString();
    
    const newId = `FN-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket = {
      id: newId,
      title,
      description,
      category,
      block,
      floor: Number(floor) || 1,
      flat: flat || 'Common Area',
      residentName: residentName || currentResident.name,
      residentPhone: residentPhone || currentResident.phone,
      priority,
      status: 'OPEN',
      createdAt: now.toISOString(),
      slaDueAt,
      assignedWorkerId: null,
      assignedWorkerName: null,
      beforePhoto: beforePhoto || null,
      afterPhoto: null,
      resolutionNotes: null,
      cost: null,
      verification: null,
      timeline: [
        {
          step: 'Created',
          time: now.toISOString(),
          note: `Complaint logged by ${residentName || currentResident.name} with ${priority} priority (${slaHours}h SLA).`
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const acceptTicket = (ticketId, note) => {
    const now = new Date().toISOString();
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        status: 'ACCEPTED',
        timeline: [
          ...t.timeline,
          {
            step: 'Accepted',
            time: now,
            note: note || 'Issue reviewed and acknowledged by Facility Management Supervisor.'
          }
        ]
      };
    }));
  };

  const assignTicket = (ticketId, workerId, note) => {
    const worker = WORKERS.find(w => w.id === workerId);
    const workerName = worker ? worker.name : 'Staff Technician';
    const now = new Date().toISOString();

    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        assignedWorkerId: workerId,
        assignedWorkerName: workerName,
        status: t.status === 'OPEN' ? 'ACCEPTED' : t.status,
        timeline: [
          ...t.timeline,
          {
            step: 'Assigned',
            time: now,
            note: note || `Dispatched to ${workerName} (${worker?.trade || 'Technician'}).`
          }
        ]
      };
    }));
  };

  const startWork = (ticketId, note) => {
    const now = new Date().toISOString();
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        status: 'IN_PROGRESS',
        timeline: [
          ...t.timeline,
          {
            step: 'In Progress',
            time: now,
            note: note || `${t.assignedWorkerName || 'Technician'} arrived on site and commenced repair work.`
          }
        ]
      };
    }));
  };

  const resolveTicket = (ticketId, { afterPhoto, resolutionNotes, cost }) => {
    const now = new Date().toISOString();
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        status: 'RESOLVED',
        resolvedAt: now,
        afterPhoto: afterPhoto || t.afterPhoto,
        resolutionNotes: resolutionNotes || 'Work completed successfully. Awaiting resident inspection.',
        cost: cost !== undefined ? Number(cost) : t.cost,
        timeline: [
          ...t.timeline,
          {
            step: 'Fixed',
            time: now,
            note: `Fix completed by ${t.assignedWorkerName || 'Technician'}. Proof uploaded; waiting for resident verification.`
          }
        ]
      };
    }));
  };

  const verifyTicket = (ticketId, { rating, feedback, verifiedBy }) => {
    const now = new Date().toISOString();
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        status: 'VERIFIED',
        verifiedAt: now,
        verification: {
          rating: rating || 5,
          feedback: feedback || 'Satisfied with resolution.',
          verifiedBy: verifiedBy || currentResident.name
        },
        timeline: [
          ...t.timeline,
          {
            step: 'Verified & Closed',
            time: now,
            note: `Resident confirmed fix (${rating}★). Feedback: "${feedback || 'No comments'}"`
          }
        ]
      };
    }));
  };

  const reopenTicket = (ticketId, reason) => {
    const now = new Date().toISOString();
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        status: 'IN_PROGRESS',
        timeline: [
          ...t.timeline,
          {
            step: 'Reopened',
            time: now,
            note: `Resident marked issue not resolved properly: "${reason || 'Work needs further attention'}"`
          }
        ]
      };
    }));
  };

  const resetData = () => {
    setTickets(INITIAL_TICKETS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        currentRole,
        setCurrentRole,
        currentResident,
        setCurrentResident,
        currentWorker,
        setCurrentWorker,
        createTicket,
        acceptTicket,
        assignTicket,
        startWork,
        resolveTicket,
        verifyTicket,
        reopenTicket,
        resetData
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
