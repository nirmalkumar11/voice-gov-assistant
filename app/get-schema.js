export async function getSchemeDetails(pk, sk) {

    const response = await fetch(

        "https://24ek3654e9.execute-api.ap-south-1.amazonaws.com/prod/get-scheme", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                schemeName: "pradhan mantri jandhan yojana",
                jurisdiction: "centralgovernment"
            })
        }
    );
    // scheme#pradhan mantri jandhan yojana; jurisdiction#centralgovernment
    const data = await response.json();

    console.log("Scheme Data:", data);
    return data;
}

getSchemeDetails("pradhan mantri jan dhan yojana", "centralgovernment");