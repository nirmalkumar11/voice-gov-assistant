export async function detectLanguage(text) {
    try {
        const response = await fetch(
            "https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod/detect-language", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: text
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Language detection result:", data);
        return data;

    } catch (error) {
        console.error("Language detection failed:", error);
        return { error: error.message };
    }
}