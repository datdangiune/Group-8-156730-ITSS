interface MedicalHistory {
  id: number;
  appointment_id: number;
  created_at: string; // ISO string
  diagnosis: string;
  prescription: string;
  follow_up_date: string; // ISO string
}
export interface FetchMedicalHistoryResponse {
  success: boolean;
  message: string;
  data: MedicalHistory[];
}

export const fetchMedicalHistory = async (petId: number, token: string): Promise<FetchMedicalHistoryResponse | null> => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/user/${petId}/medical-history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch medical history');
    }

    const data: FetchMedicalHistoryResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching medical history:', error);
    return null;
  }
};
