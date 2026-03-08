export async function callLLM(userInput) {

    const response = await fetch(
        "https://cepkly3199.execute-api.us-east-2.amazonaws.com/prod/invoke-llm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userInput: userInput
            })
        }
    );

    const data = await response.json();

    console.log("LLM Response:", data);

    return data;
}


// callLLM('userInput')


// fetch("https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod/target-translate", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             text: "How can I apply for income certificate?",
//             targetLanguage: "ta"
//         })
//     })
//     .then(res => res.json())
//     .then(data => console.log(data.translatedText));