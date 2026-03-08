//give code for split queary to list of String


let certificate = [
    "income certificate",
    "caste certificate",
    "birth certificate",
    "death certificate",
    "residence certificate"
]

console.log(certificate);

let allcheck = {
    'aggricultureministry-scheme': [

        "pradhan mantri kisan samman nidhi", "pm kisan",
        "pradhan mantri fasal bima yojana", "pmfby",
        "pradhan mantri krishi sinchayee yojana", "pmksy",
        "agriculture infrastructure fund", "aif",
        "paramparagat krishi vikas yojana", "pkvy",
    ],

    'delhigovernment-scheme': [
        "delhi arogya kosh", "dak",
        "rajiv gandhi swavlamban rozgar yojna", "rgsry",
        "pension benefit for construction workers", "construction workers pension",
        "financial assistance for persons with disabilities", "disability financial aid",
        "mahila samriddhi yojana", "mahila samriddhi",
    ],

    'tamilnadugovernment-scheme': [
        "kalaignarin kanavu illam", "chief minister's dream house scheme",
        "pudhumai penn scheme", "new girl student scheme",
        "tamil nadu agricultural labourers & farmers social security scheme", "chief minister's farmers security scheme",
        "destitute widow pension scheme", "indira gandhi destitute widow pension scheme",
        "destitute/physically handicapped pension scheme", "indira gandhi physically handicapped pension scheme",
    ],

    'centralgovernment-scheme': [

        "pradhan mantri jan dhan yojana", "pmjdy",
        "atal pension yojana", "apy",
        "pradhan mantri ujjwala yojana", "pmuy",
        "pradhan mantri mudra yojana", "pmmuy",
        "sukanya samriddhi yojana", "ssy"
    ],

    'certificates-certificate': [
        "income certificate",
        "caste certificate",
        "birth certificate",
        "death certificate",
        "residence certificate"

    ]
}

let schemesandcertificates = {
    "centralgovernment-scheme": {
        "pradhan mantri jan dhan yojana": ['pmjdy'],
        "atal pension yojana": ['apy'],
        "pradhan mantri ujjwala yojana": ['pmuy'],
        "pradhan mantri mudra yojana": ['pmmuy'],
        "sukanya samriddhi yojana": ['ssy']
    },
    "tamilnadugovernment-scheme": {
        "kalaignarin kanavu illam": ["chief minister's dream house scheme"],
        "pudhumai penn scheme": ["new girl student scheme"],
        "tamil nadu agricultural labourers & farmers social security scheme": ["chief minister's farmers security scheme"],
        "destitute widow pension scheme": ["indira gandhi destitute widow pension scheme"],
        "destitute/physically handicapped pension scheme": ["indira gandhi physically handicapped pension scheme"]
    },
    "delhigovernment-scheme": {
        "delhi arogya kosh": ["dak"],
        "rajiv gandhi swavlamban rozgar yojna": ["rgsry"],
        "pension benefit for construction workers": ["construction workers pension"],
        "financial assistance for persons with disabilities": ["disability financial aid"],
        "mahila samriddhi yojana": ["mahila samriddhi"]
    },
    "aggricultureministry-scheme": {
        "pradhan mantri kisan samman nidhi": ["pm kisan"],
        "pradhan mantri fasal bima yojana": ["pmfby"],
        "pradhan mantri krishi sinchayee yojana": ["pmksy"],
        "agriculture infrastructure fund": ["aif"],
        "paramparagat krishi vikas yojana": ["pkvy"]
    },
    "certificates-certificate": {
        "income certificate": [],
        "caste certificate": [],
        "birth certificate": [],
        "death certificate": [],
        "residence certificate": []
    }
}


console.log(schemesandcertificates["centralgovernment-scheme"]["pradhan mantri jan dhan yojana"], "Pradhan Mantri Jan Dhan Yojana")

export async function find_intent(query) {

    let typename = null;

    let found = false;
    for (let key in allcheck) {
        let name = allcheck[key]

        for (let alias of name) {
            if (query.includes(alias)) {
                console.log(alias)
                console.log("Found");
                found = true;
                typename = key;
                break;
            }
        }

    }

    if (found) {

        console.log("Found typename:", typename);

        let pka = typename.split("-")[1];
        let pkb = null;
        let skb = typename.split("-")[0];
        let schemes = schemesandcertificates[typename];

        for (let scheme in schemes) {

            if (query.includes(scheme)) {
                console.log("Found scheme:", scheme);
                pkb = scheme;
                break
            } else {

                let aliases = schemes[scheme];

                for (let alias of aliases) {
                    if (query.includes(alias)) {
                        pkb = scheme;
                        console.log("Found scheme:", scheme);
                        break;
                    }
                }

            }

        }
        let obj = {
            "PK": pkb,
            "SK": skb,
            "entityType": pka
        }
        console.log(obj, "obj");
        return { "obj": obj }



    } else {
        console.log("i not aware on this area")
        return "Error:i not aware on this area";
    }
}


// let sentence = "pmjdy";

// find_intent(sentence);







// async function getSchemeDetails() {

//     const response = await fetch(
//         "https://your-api-id.execute-api.ap-south-1.amazonaws.com/prod/get-scheme", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 schemeName: "pradhan mantri jandhan yojana",
//                 jurisdiction: "centralgovernment"
//             })
//         }
//     );
//     // scheme#pradhan mantri jandhan yojana; jurisdiction#centralgovernment
//     const data = await response.json();

//     console.log("Scheme Data:", data);
// }

// getSchemeDetails();