fetch("https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jobName: "job-1772386187618"
        })
    })
    .then(r => r.json())
    .then(d => console.log(d, "job name"));