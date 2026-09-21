const FASTAPI_URL = "http://127.0.0.1:8000";

const testFastAPI = async () => {
  try {
    const response = await fetch(`${FASTAPI_URL}/health`);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("FastAPI connection error:", error.message);
    throw error;
  }
};

const getRecommendations = async (requestData) => {
  try {
    const response = await fetch(`${FASTAPI_URL}/api/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        typeof data.detail === "string"
          ? data.detail
          : JSON.stringify(data.detail, null, 2),
      );
    }

    return data;
  } catch (error) {
    console.error("FastAPI recommendation error:", error.message);
    throw error;
  }
};

module.exports = {
  testFastAPI,
  getRecommendations,
};
