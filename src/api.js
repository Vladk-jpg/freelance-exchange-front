import Cookies from "js-cookie";

const API_BASE = "http://localhost:3000";

const getToken = () => Cookies.get("accessToken");

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// 🔐 Auth
export const checkAuthStatus = async () => {
  const token = getToken();
  if (!token) return { isAuth: false, role: "" };

  try {
    const res = await fetch(`${API_BASE}/auth/status`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) return { isAuth: false, role: "" };

    const data = await res.json();
    return { isAuth: true, role: data.role };
  } catch {
    return { isAuth: false, role: "" };
  }
};

export const loginUser = async (email, password) => {
  return await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
};

// 👤 User
export const registerUser = async (email, password, confirmPassword, username, role) => {
  return await fetch(`${API_BASE}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, confirmPassword, username, role }),
  });
};

export const fetchProfile = async () => {
  return await fetch(`${API_BASE}/user/profile`, {
    headers: getAuthHeaders(),
  });
};

export const fetchUserProfile = async (id) => {
  const response = await fetch(`${API_BASE}/user/profile/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Ошибка при получении профиля пользователя");
  }
  return response.json();
};

export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return await fetch(`${API_BASE}/user/upload-profile-picture`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
};

export const fetchUserById = async (id) => {
  return await fetch(`${API_BASE}/user/${id}`, {
    headers: getAuthHeaders(),
  });
};

// 📁 Project
export const fetchMyProjects = async () => {
  return await fetch(`${API_BASE}/project/user`, {
    headers: getAuthHeaders(),
  });
};

export const fetchProjectsByUserId = async (id) => {
  return await fetch(`${API_BASE}/project/user/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const fetchProjectById = async (id) => {
  return await fetch(`${API_BASE}/project/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const updateProject = async (id, data) => {
  return await fetch(`${API_BASE}/project/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
};

export const createProject = async (data) => {
  return await fetch(`${API_BASE}/project`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
};

export const deleteProject = async (id) => {
  return await fetch(`${API_BASE}/project/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
}

export const fetchFilteredProjects = async (filters) => {
  if (!filters.categories) delete filters.categories;
  const queryParams = new URLSearchParams(filters).toString();
  return await fetch(`${API_BASE}/project/filter?${queryParams}`);
};

export const searchProjects = async (title) => {
  return await fetch(`${API_BASE}/project/search?title=${encodeURIComponent(title)}`);
};

export const fetchSendApproval = async (projectId) => {
  return await fetch(`${API_BASE}/project/send-approval/${projectId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
}

export const fetchApproveProject = async (projectId) => {
  return await fetch(`${API_BASE}/project/approve/${projectId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
}

export const fetchCancelProject = async (projectId) => {
  return await fetch(`${API_BASE}/project/cancel/${projectId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
}

// 📂 Category
export const fetchCategoryById = async (id) => {
  return await fetch(`${API_BASE}/category/${id}`);
};

export const fetchCategories = async () => {
  return await fetch(`${API_BASE}/category`, {
    headers: getAuthHeaders(),
  });
};

// 📨 Proposal
export const fetchProposalsByProjectId = async (projectId) => {
  return await fetch(`${API_BASE}/proposal/project/${projectId}`, {
    headers: getAuthHeaders(),
  });
};

export const fetchProposalsByUserId = async () => {
  return await fetch(`${API_BASE}/proposal/freelancer`, {
    headers: getAuthHeaders(),
  });
}

export const updateProposal = async (proposalId, data) => {
  return await fetch(`${API_BASE}/proposal/${proposalId}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const deleteProposal = async (proposalId) => {
  return await fetch(`${API_BASE}/proposal/${proposalId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const acceptProposal = async (id) => {
  return await fetch(`${API_BASE}/proposal/accept/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
};

export const rejectProposal = async (id) => {
  return await fetch(`${API_BASE}/proposal/reject/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
};

export const sendProposal = async (proposalData) => {
  return await fetch(`${API_BASE}/proposal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(proposalData),
  });
};

export const fetchWallet = async () => {
  return await fetch(`${API_BASE}/wallet`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export const fetchNotifications = async () => {
  return await fetch(`${API_BASE}/notification`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export const fetchMarkNotification = async (id) => {
  return await fetch(`${API_BASE}/notification/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
}