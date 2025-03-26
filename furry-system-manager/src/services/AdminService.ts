import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000/api/admin'; // Ensure this matches your backend URL

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${Cookies.get('adminToken')}` }, // Use token from cookies
        });
        return response.data.data; // Return the user data
    } catch (err) {
        console.error('Error fetching users:', err.response?.data || err.message); // Log the error
        throw new Error(err.response?.data?.message || 'Failed to fetch users');
    }
};

// Cập nhật vai trò người dùng
export const updateUserRole = async (userId: string, role: string) => {
    try {
        const response = await axios.patch(
            `${API_URL}/users/${userId}/role`,
            { role },
            {
                headers: { Authorization: `Bearer ${Cookies.get('adminToken')}` }, // Use token from cookies
            }
        );
        return response.data;
    } catch (err) {
        console.error('Error updating user role:', err.response?.data || err.message); // Log the error
        throw new Error(err.response?.data?.message || 'Failed to update user role');
    }
};

// Lấy danh sách dịch vụ
export const getAllServices = async () => {
    try {
        const response = await axios.get(`${API_URL}/services`, {
            headers: { Authorization: `Bearer ${Cookies.get('adminToken')}` }, // Use token from cookies
        });
        return response.data.data; // Return the service data
    } catch (err) {
        console.error('Error fetching services:', err.response?.data || err.message); // Log the error
        throw new Error(err.response?.data?.message || 'Failed to fetch services');
    }
};

// Tạo dịch vụ mới
export const createService = async (serviceData: any) => {
    try {
        const response = await axios.post(`${API_URL}/services`, serviceData, {
            headers: { Authorization: `Bearer ${Cookies.get('adminToken')}` },
        });
        return response.data.data;
    } catch (err) {
        console.error('Error creating service:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to create service');
    }
};

// Cập nhật dịch vụ
export const updateService = async (serviceId: string, serviceData: any) => {
    try {
        const response = await axios.put(`${API_URL}/services/${serviceId}`, serviceData, {
            headers: { Authorization: `Bearer ${Cookies.get('adminToken')}` },
        });
        return response.data.data;
    } catch (err) {
        console.error('Error updating service:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to update service');
    }
};

// Xóa dịch vụ
export const deleteService = async (serviceId: string) => {
    try {
        const response = await axios.delete(`${API_URL}/services/${serviceId}`, {
            headers: { Authorization: `Bearer ${Cookies.get('adminToken')}` },
        });
        return response.data;
    } catch (err) {
        console.error('Error deleting service:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to delete service');
    }
};

// Lấy báo cáo doanh thu
export const getRevenueReport = async () => {
  const response = await axios.get(`${API_URL}/reports/revenue`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export async function getDashboardMetrics(): Promise<any> {
    try {
        const response = await fetch('http://localhost:3000/api/admin/dashboard', {
            headers: {
                Authorization: `Bearer ${Cookies.get('adminToken')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard metrics');
        }

        const data = await response.json();
        console.log('Fetched Dashboard Metrics:', data); // Debugging log
        return data;
    } catch (err) {
        console.error('Error fetching dashboard metrics:', err.message);
        throw err;
    }
}

export async function getBoardingData(): Promise<any> {
    const response = await fetch('http://localhost:3000/api/admin/boarding', {
        headers: {
            Authorization: `Bearer ${Cookies.get('adminToken')}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch boarding data');
    }

    return response.json();
}

export async function getReports(reportType: string): Promise<any> {
  const response = await fetch(`http://localhost:3000/api/admin/reports/${reportType}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('adminToken')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch report data');
  }

  return response.json();
}

export const getAllAppointments = async () => {
    try {
        const response = await axios.get(`${API_URL}/appointments`, {
            headers: { Authorization: `Bearer ${Cookies.get('adminToken')}` },
        });
        return response.data.data;
    } catch (err) {
        console.error('Error fetching appointments:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch appointments');
    }
};

export const deleteAppointment = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/appointments/${id}`, {
            headers: { Authorization: `Bearer ${Cookies.get('adminToken')}` },
        });
        return response.data;
    } catch (err) {
        console.error('Error deleting appointment:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to delete appointment');
    }
};

export const getAllMedicalRecords = async () => {
    try {
        const response = await axios.get(`${API_URL}/medical-records`, {
            headers: { Authorization: `Bearer ${Cookies.get('adminToken')}` },
        });
        return response.data.data;
    } catch (err) {
        console.error('Error fetching medical records:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch medical records');
    }
};

export const deleteMedicalRecord = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/medical-records/${id}`, {
            headers: { Authorization: `Bearer ${Cookies.get('adminToken')}` },
        });
        return response.data;
    } catch (err) {
        console.error('Error deleting medical record:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to delete medical record');
    }
};

export const getAnalyticsData = async () => {
    try {
        const response = await axios.get(`${API_URL}/analytics`, {
            headers: { Authorization: `Bearer ${Cookies.get('adminToken')}` },
        });
        return response.data.data;
    } catch (err) {
        console.error('Error fetching analytics data:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to fetch analytics data');
    }
};