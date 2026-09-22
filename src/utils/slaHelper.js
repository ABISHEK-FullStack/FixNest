/**
 * SLA calculation & helper utilities for FixNest (Bootstrap 5 edition)
 */

export function getSLAStatus(ticket) {
  if (ticket.status === 'VERIFIED' || ticket.status === 'RESOLVED') {
    const resolvedTime = new Date(ticket.resolvedAt || ticket.verifiedAt || ticket.createdAt).getTime();
    const dueTime = new Date(ticket.slaDueAt).getTime();
    if (resolvedTime <= dueTime) {
      return { 
        status: 'MET', 
        label: 'SLA Met', 
        isBreached: false, 
        badgeClass: 'bg-success text-white',
        icon: 'bi-check-circle-fill'
      };
    } else {
      const breachedByMins = Math.round((resolvedTime - dueTime) / (60 * 1000));
      return { 
        status: 'BREACHED', 
        label: `Breached (+${formatDurationMins(breachedByMins)})`, 
        isBreached: true, 
        badgeClass: 'bg-danger text-white',
        icon: 'bi-exclamation-triangle-fill'
      };
    }
  }

  const now = Date.now();
  const due = new Date(ticket.slaDueAt).getTime();
  const created = new Date(ticket.createdAt).getTime();
  const diffMs = due - now;

  if (diffMs < 0) {
    const overdueMins = Math.round(Math.abs(diffMs) / (60 * 1000));
    return {
      status: 'BREACHED',
      label: `Overdue by ${formatDurationMins(overdueMins)}`,
      isBreached: true,
      diffMs,
      badgeClass: 'bg-danger text-white sla-breached-pulse',
      icon: 'bi-exclamation-octagon-fill'
    };
  }

  const totalWindow = due - created;
  const ratioLeft = diffMs / totalWindow;

  if (ratioLeft < 0.25 || diffMs < 45 * 60 * 1000) {
    return {
      status: 'WARNING',
      label: `${formatDurationMins(Math.round(diffMs / 60000))} left`,
      isBreached: false,
      diffMs,
      badgeClass: 'bg-warning text-dark',
      icon: 'bi-exclamation-triangle-fill'
    };
  }

  return {
    status: 'HEALTHY',
    label: `${formatDurationMins(Math.round(diffMs / 60000))} remaining`,
    isBreached: false,
    diffMs,
    badgeClass: 'bg-info text-dark',
    icon: 'bi-clock-fill'
  };
}

export function formatDurationMins(minutes) {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function calculateMetrics(tickets) {
  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'OPEN').length;
  const accepted = tickets.filter(t => t.status === 'ACCEPTED').length;
  const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const resolved = tickets.filter(t => t.status === 'RESOLVED').length;
  const verified = tickets.filter(t => t.status === 'VERIFIED').length;
  
  const activeCount = open + accepted + inProgress;
  const completedCount = resolved + verified;

  let slaMetCount = 0;
  let slaEvaluatedCount = 0;
  let totalResolutionTimeMinutes = 0;
  let totalCost = 0;

  tickets.forEach(ticket => {
    if (ticket.cost) {
      totalCost += Number(ticket.cost) || 0;
    }

    if (ticket.resolvedAt || ticket.verifiedAt) {
      slaEvaluatedCount++;
      const resolvedAt = new Date(ticket.resolvedAt || ticket.verifiedAt).getTime();
      const dueAt = new Date(ticket.slaDueAt).getTime();
      const createdAt = new Date(ticket.createdAt).getTime();

      if (resolvedAt <= dueAt) {
        slaMetCount++;
      }

      totalResolutionTimeMinutes += Math.max(0, (resolvedAt - createdAt) / (60 * 1000));
    }
  });

  const slaRate = slaEvaluatedCount > 0 ? Math.round((slaMetCount / slaEvaluatedCount) * 100) : 100;
  const avgResolutionHours = slaEvaluatedCount > 0 ? (totalResolutionTimeMinutes / slaEvaluatedCount / 60).toFixed(1) : 0;

  return {
    total,
    activeCount,
    open,
    accepted,
    inProgress,
    resolved,
    verified,
    completedCount,
    slaRate,
    avgResolutionHours,
    totalCost
  };
}

export function formatTimestamp(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) + ', ' + 
         d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
