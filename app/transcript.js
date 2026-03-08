export async function transcribeAudio(data) {


    let startResponse;

    if (data.status === 200) {
        console.log("Upload successful");

        // Start transcription job
        const startResponse = await fetch(
            "https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod/start-transcription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: data.fileName
                })
            }
        );


        const startData = await startResponse.json();
        console.log("Job started:", startData);
        const jobName = startData.jobName;
        console.log("jobName:", jobName);


        return new Promise((resolve, reject) => {

            setTimeout(() => {

                fetch("https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod/check-status", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ jobName })
                    })
                    .then(r => r.json())
                    .then(d => {
                        console.log(d, "job name");
                        resolve(d); // return result
                    })
                    .catch(err => console.log("translate error", err));

            }, 30000);

        });



        console.log("REAL JOB NAME:", jobName);
        return startResponse;


    } else {
        console.log("Upload failed");
    }
}



// setTimeout(() => {
//         fetch("https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod/check-status", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 jobName: jobName
//             })
//         }), 5000
//     })
//     .then(r => r.json())
//     .then(d => console.log(d, "job name"));