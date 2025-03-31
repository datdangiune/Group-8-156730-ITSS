export const uploadFile = async (file: File, token: string): Promise<string | null> => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file); 

  try {
    const response = await fetch("http://localhost:3000/api/v1/user/image", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      throw new Error("Upload thất bại!");
    }
    if (response.status === 401) {
      console.warn("Token expired. Removing token and redirecting to login...");
      localStorage.removeItem("token"); 
      localStorage.removeItem("user");
      window.location.href = "/login";
      return null;
    }
    const data = await response.json();
    return data.url || null;
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    return null;
  }
};