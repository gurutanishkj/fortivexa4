// FORTIVEXA API Client Service

const API_BASE = '/api';

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function fetchComplaints(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/complaints?${query}`);
  if (!res.ok) throw new Error('Failed to fetch complaints');
  return res.json();
}

export async function fetchComplaintById(id) {
  const res = await fetch(`${API_BASE}/complaints/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch complaint ${id}`);
  return res.json();
}

export async function createComplaint(payload) {
  const res = await fetch(`${API_BASE}/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create complaint');
  return res.json();
}

export async function updateComplaint(id, payload) {
  const res = await fetch(`${API_BASE}/complaints/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update complaint');
  return res.json();
}

export async function resetComplaints() {
  const res = await fetch(`${API_BASE}/complaints/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset complaints dataset');
  return res.json();
}

export async function fetchTransactions(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/transactions?${query}`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function fetchAccounts() {
  const res = await fetch(`${API_BASE}/accounts`);
  if (!res.ok) throw new Error('Failed to fetch accounts network');
  return res.json();
}

export async function fetchAllRings() {
  const res = await fetch(`${API_BASE}/linkage`);
  if (!res.ok) throw new Error('Failed to fetch fraud rings');
  return res.json();
}

export async function fetchCaseLinkage(caseId) {
  const res = await fetch(`${API_BASE}/linkage/${caseId}`);
  if (!res.ok) throw new Error(`Failed to fetch linkage for ${caseId}`);
  return res.json();
}

export async function runPrediction(caseId) {
  const res = await fetch(`${API_BASE}/predict/${caseId}`, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to run prediction for ${caseId}`);
  return res.json();
}

export async function fetchPipeline() {
  const res = await fetch(`${API_BASE}/pipeline`);
  if (!res.ok) throw new Error('Failed to fetch pipeline metadata');
  return res.json();
}

export async function fetchHotspots() {
  const res = await fetch(`${API_BASE}/map/hotspots`);
  if (!res.ok) throw new Error('Failed to fetch map hotspots');
  return res.json();
}

export async function fetchIntelligence() {
  const res = await fetch(`${API_BASE}/intelligence`);
  if (!res.ok) throw new Error('Failed to fetch actionable intelligence');
  return res.json();
}

export async function fetchBlockchain() {
  const res = await fetch(`${API_BASE}/blockchain`);
  if (!res.ok) throw new Error('Failed to fetch blockchain ledger');
  return res.json();
}

export async function verifyBlockchain() {
  const res = await fetch(`${API_BASE}/blockchain/verify`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to verify blockchain integrity');
  return res.json();
}

export async function fetchTrl3Evaluation() {
  const res = await fetch(`${API_BASE}/trl3`);
  if (!res.ok) throw new Error('Failed to fetch TRL 3 evaluation metrics');
  return res.json();
}
