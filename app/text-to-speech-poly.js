// fetch("https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod/text-to-speech-polly", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             text: "How can I apply for income certificate?"
//         })
//     })
//     .then(res => res.json())
//     .then(data => {

//         const audio = new Audio("data:audio/mp3;base64," + data.audio);
//         audio.play();

//     });



// fetch("https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod/text-to-speech-polly", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             text: "Hello, how can I help you?"
//         })
//     })
//     .then(res => res.json())
//     .then(data => {

//         const audio = new window.Audio(
//             "data:audio/mp3;base64," + data.audio
//         );

//         audio.play();

//     });





export async function speakText(text) {

    const res = await fetch("https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod/text-to-speech-polly", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: text
        })
    });

    const data = await res.json();

    let url = data.audioUrl;
    console.log("polly Audio URL:", url);
    return url;

}

// speakText("How can I apply for Pradhan Mantri Jan Dhan Yojana?");