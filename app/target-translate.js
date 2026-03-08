export async function targetTranslate(text, targetLanguage) {


    const response = await fetch("https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod/target-translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: text,
            targetLanguage: targetLanguage
        })
    });


    const data = await response.json();

    console.log("target translated:", data);

    return data;
}