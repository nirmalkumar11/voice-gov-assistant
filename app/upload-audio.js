export async function uploadAudio(blob) {

    console.log("Uploading audio blob:", blob);

    try {

        const response = await fetch("https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod/upload-url");
        // https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod

        const data = await response.json();

        console.log("Received:", data);

        const uploadResponse = await fetch(data.uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "audio/webm"
            },
            body: blob
        });

        console.log("Upload status:", uploadResponse.status);

        if (uploadResponse.ok) {
            console.log("Upload successful");
            return { fileName: data.fileName, status: uploadResponse.status };
        }
    } catch (error) {
        console.error("Error uploading audio:", error);
    }
}