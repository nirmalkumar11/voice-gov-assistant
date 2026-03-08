export async function translateText(text) {
    console.log("Function started");

    const response = await fetch("https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: text
        })
    });

    const data = await response.json();

    console.log("Translated:", data);
    return data;

}


// translateText('')