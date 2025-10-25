import fetch from "node-fetch";

export const sendToN8N = async (userData) => {
  try {
    const response = await fetch("https://talentforge.app.n8n.cloud/webhook-test/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "TalentForge-Server/1.0"
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        userType: userData.userType,
      }),
    });

    console.log("📡 n8n webhook response:", response.status);
    return response.ok;
  } catch (err) {
    console.error("❌ n8n webhook failed:", err);
    return false;
  }
};
