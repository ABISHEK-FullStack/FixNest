import React, { useState } from 'react';
import { TicketProvider, useTickets } from './context/TicketContext';
import Navbar from './components/Navbar';
import ResidentView from './components/resident/ResidentView';
import ReportModal from './components/resident/ReportModal';
import TriageBoard from './components/maintenance/TriageBoard';
import WorkerView from './components/worker/WorkerView';
import AdminDashboard from './components/admin/AdminDashboard';

function AppContent() {
  const { currentRole } = useTickets();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Bootstrap 5 Navbar */}
      <Navbar onOpenReportModal={() => setIsReportModalOpen(true)} />

      {/* Main Container */}
      <main className="container py-4 flex-grow-1">
        {currentRole === 'RESIDENT' && (
          <ResidentView onOpenReportModal={() => setIsReportModalOpen(true)} />
        )}

        {currentRole === 'MAINTENANCE' && (
          <TriageBoard />
        )}

        {currentRole === 'WORKER' && (
          <WorkerView />
        )}

        {currentRole === 'ADMIN' && (
          <AdminDashboard />
        )}
      </main>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-top py-3 text-secondary small mt-auto">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary">FN</span>
            <strong className="text-dark">FixNest Operations Platform</strong>
            <span>•</span>
            <span>Enterprise Apartment Maintenance Tracking</span>
          </div>

          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
            <span>Built with HTML5, CSS3, Bootstrap 5, JavaScript & React</span>
            <span className="mx-2">•</span>
            <span>Offline localStorage Persistence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TicketProvider>
      <AppContent />
    </TicketProvider>
  );
}
