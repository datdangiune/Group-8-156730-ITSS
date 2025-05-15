const API_URL = "https://api.datto.id.vn/api/v1/user/notifications";

export interface Notification {
    id: number;
    user_id: number;
    title: string;
    message: string;
    url: string | null;
    is_read: boolean;
    created_at: string; // ISO date string
}

export const fetchUserNotifications = async (token: string): Promise<Notification[]> => {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || "Failed to fetch notifications.");
        }

        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

export const markNotificationAsRead = async (token: string, id: number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/${id}/read`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || "Failed to mark notification as read.");
        }
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};
