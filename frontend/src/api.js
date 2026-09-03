const BASE_URL = "/api";

function getToken() {
  return localStorage.getItem("teamtask_token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data;
}

export const api = {
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: { name, email, password } }),

  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),

  getTasks: () => request("/tasks", { auth: true }),

  createTask: (title, description) =>
    request("/tasks", { method: "POST", body: { title, description }, auth: true }),

  updateTask: (id, changes) =>
    request(`/tasks/${id}`, { method: "PATCH", body: changes, auth: true }),

  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE", auth: true }),
};

export function saveToken(token) {
  localStorage.setItem("teamtask_token", token);
}
export function clearToken() {
  localStorage.removeItem("teamtask_token");
}
export function hasToken() {
  return Boolean(getToken());
}