import { uploadAudio } from "./upload-audio.js";
import { transcribeAudio } from "./transcript.js";
import { translateText } from "./translate.js";
import { find_intent } from "/intent.js";
import { getSchemeDetails } from "./get-schema.js";
import { callLLM } from "./invoke-llm.js";
import { targetTranslate } from "./target-translate.js";
import { speakText } from "./text-to-speech-poly.js";


/* ---------------- DOM Elements ---------------- */

let hamburger = document.getElementById("hamburger");
let sidebar = document.getElementById("side-bar");
let headingcontainer = document.getElementById("heading");
let closesidebar = document.getElementById("closesidebar");
let sendbutton = document.getElementById("send");
let micbutton = document.getElementById("mic");
let inputtext = document.getElementById("inputtext");
let voiceinputcontainer = document.getElementById("voiceinputcontainer");
let maincontainer = document.getElementById("maincontainer");
let micicon = document.getElementById("micicon");
let sendbg = document.getElementById("send")


/* ---------------- Recording Variables ---------------- */

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let blob;
let audioUrl;
let wavesurfers = [];
let translatedText;
let languagedomain;
let fromintent;

/* ---------------- Sidebar ---------------- */

hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    headingcontainer.classList.add("d-none");
});

closesidebar.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    headingcontainer.classList.remove("d-none");
});


/* ---------------- Send Text ---------------- */



if (inputtext.value !== "") {
    sendbg.style.backgroundColor = "rgb(166, 16, 176)"
    sendbg.disabled = false;
}


/* ---------------- Mic Button ---------------- */

micbutton.addEventListener("click", async() => {

    /* ---------- STOP RECORDING ---------- */

    if (isRecording) {

        mediaRecorder.stop();

        micicon.classList.add("fa-microphone");
        micicon.classList.remove("fa-paper-plane");

        voiceinputcontainer.classList.toggle("spechindication");

        isRecording = false;

        return;
    }


    /* ---------- START RECORDING ---------- */

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);

    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.start();

    console.log("Recording started");

    micicon.classList.remove("fa-microphone");
    micicon.classList.add("fa-paper-plane");

    voiceinputcontainer.classList.toggle("spechindication");

    isRecording = true;


    /* ---------- RECORDING FINISHED ---------- */

    mediaRecorder.onstop = async() => {

        console.log("Recording stopped");

        blob = new Blob(audioChunks, { type: "audio/webm" });


        /* ---------- Waveform UI ---------- */

        audioUrl = URL.createObjectURL(blob);

        function waveformappenderuop(urlaudio) {

            let inputcon = document.createElement("div");
            inputcon.classList.add("usertoagentinput", "d-flex", "flex-row");
            maincontainer.appendChild(inputcon);

            let wavecon = document.createElement("div");
            wavecon.classList.add("wavecon");
            wavecon.style.width = "150px";
            inputcon.appendChild(wavecon);

            let playcon = document.createElement("div");
            playcon.classList.add("playcon");

            let playicon = document.createElement("i");
            playicon.classList.add("fa-solid", "fa-play");
            playicon.style.color = "white";

            playcon.appendChild(playicon);
            inputcon.appendChild(playcon);


            let ws = WaveSurfer.create({
                container: wavecon,
                height: 40,
                waveColor: "white",
                progressColor: "gray",
                barWidth: 3,
                barGap: 2,
                barRadius: 3,
                cursorWidth: 0
            });

            ws.loadBlob(blob);

            wavesurfers.push(ws);


            playcon.addEventListener("click", () => {

                wavesurfers.forEach(w => {
                    if (w !== ws) w.pause();
                });

                ws.playPause();

                if (ws.isPlaying()) {
                    playicon.classList.remove("fa-play");
                    playicon.classList.add("fa-pause");
                } else {
                    playicon.classList.add("fa-play");
                    playicon.classList.remove("fa-pause");
                }
            });


            ws.on("finish", () => {
                playicon.classList.add("fa-play");
                playicon.classList.remove("fa-pause");
            });

            audioChunks = [];



            console.log("Audio Blob:", blob);

        }
        waveformappenderuop(audioUrl);

        function usertranscript(test) {
            let inputcon = document.createElement("div");
            inputcon.classList.add("usertoagentinput", "d-flex", "flex-row");
            let p = document.createElement("p");
            p.textContent = test;
            inputcon.appendChild(p);
            maincontainer.appendChild(inputcon);
        }

        async function waveformappenderaop(urlaudio) {

            let inputcon = document.createElement("div");
            inputcon.classList.add("agenttouseroutput", "d-flex", "flex-row");
            maincontainer.appendChild(inputcon);

            let wavecon = document.createElement("div");
            wavecon.classList.add("wavecon");
            wavecon.style.width = "150px";
            wavecon.style.height = "40px";
            inputcon.appendChild(wavecon);

            let playcon = document.createElement("div");
            playcon.classList.add("playcon");

            let playicon = document.createElement("i");
            playicon.classList.add("fa-solid", "fa-play");
            playicon.style.color = "white";

            playcon.appendChild(playicon);
            inputcon.appendChild(playcon);

            let ws = WaveSurfer.create({
                container: wavecon,
                height: 40,
                waveColor: "white",
                progressColor: "gray",
                barWidth: 3,
                barGap: 2,
                barRadius: 3,
                cursorWidth: 0,
                fetchParams: { mode: "cors" }
            });

            ws.load(urlaudio);

            wavesurfers.push(ws);

            ws.on("ready", () => {
                console.log("Waveform loaded");
            });

            ws.on("error", e => {
                console.error("WaveSurfer error:", e);
            });

            playcon.addEventListener("click", () => {

                wavesurfers.forEach(w => {
                    if (w !== ws) w.pause();
                });

                ws.playPause();

                if (ws.isPlaying()) {
                    playicon.classList.replace("fa-play", "fa-pause");
                } else {
                    playicon.classList.replace("fa-pause", "fa-play");
                }
            });

            ws.on("finish", () => {
                playicon.classList.replace("fa-pause", "fa-play");
            });
        }

        try {

            /* ---------- Upload to S3 ---------- */

            let uploadresult = await uploadAudio(blob);
            console.log("Upload result:", uploadresult);


            /* ---------- Transcription ---------- */

            let transresult = await transcribeAudio(uploadresult);
            console.log("Transcription result:", transresult);


            /* ---------- Translate ---------- */

            let translatedTextobj = await translateText(transresult.transcript);

            translatedText = translatedTextobj.translated;
            languagedomain = translatedTextobj.sourceLanguage;
            usertranscript(translatedText);
            Text = translatedText.toLowerCase().replaceAll(" ", "")
            console.log("Translated text:", Text);
            console.log("language domain: ", languagedomain)


            /* ---------- Intent ---------- */
            fromintent = async function(Text) {
                let user_intent = await find_intent(Text);
                console.log("User intent:", user_intent.obj);

                /* ---------- Get Scheme ---------- */
                let schemeDetails
                if (user_intent.obj) {
                    let pk = user_intent.obj.PK;
                    let sk = user_intent.obj.SK;
                    schemeDetails = await getSchemeDetails(
                        pk, sk
                    );
                } else {
                    console.log("No intent found for the given input.")
                    return;
                }



                console.log("Scheme Details:", schemeDetails);


                /* ---------- LLM ---------- */

                function uploadtocon(text) {
                    let inputcon = document.createElement("div");
                    inputcon.classList.add("agenttouseoutput", "d-flex", "flex-row");
                    let p = document.createElement("p");
                    p.textContent = text;
                    inputcon.appendChild(p);
                    maincontainer.appendChild(inputcon);
                }

                if (schemeDetails.length >= 1) {

                    let llm_input = {
                        schemeDetails: schemeDetails,
                        userQuery: "how can i apply for pradhan mantri jandhan yojana"
                    };

                    let llm_response = await callLLM(JSON.stringify(llm_input));

                    console.log("LLM Response:", llm_response.answer);


                    if (languagedomain != "en") {

                        if (llm_response.answer) {

                            let targettranslateresult = await targetTranslate(
                                llm_response.answer,
                                languagedomain
                            );

                            console.log(
                                "Target Translate Result:",
                                targettranslateresult.translatedText
                            );
                            let agentaudiourl = await speakText(targettranslateresult.translatedText);
                            console.log("Agent Audio URL in nen:", agentaudiourl);
                            waveformappenderaop(agentaudiourl);
                            uploadtocon(targettranslateresult.translatedText);

                        }
                    } else {
                        let agentaudiourl = await speakText(llm_response.answer);
                        console.log("Agent Audio URL in en:", agentaudiourl);
                        waveformappenderaop(agentaudiourl);
                        uploadtocon(llm_response.answer);
                        console.log("LLM response is in English, no need to translate to target language.")
                    }
                }

            }
            fromintent(Text);
        } catch (error) {
            console.error("Processing error:", error);
        }


    };

});


/* ---------------- Enter Send ---------------- */

/* ---------------- Initial State ---------------- */

sendbutton.disabled = true;
sendbutton.style.opacity = "0.4";


/* ---------------- Enable / Disable Send Button ---------------- */

inputtext.addEventListener("input", function() {

    if (inputtext.value.trim().length > 0) {
        sendbutton.disabled = false;
        sendbutton.style.opacity = "1";
    } else {
        sendbutton.disabled = true;
        sendbutton.style.opacity = "0.4";
    }

});


/* ---------------- Send Text ---------------- */

sendbutton.addEventListener('click', () => {

    // 🚫 Prevent trigger if textbox empty
    if (inputtext.value.trim().length === 0) {
        return;
    }

    console.log(inputtext.value);
    fromintent(inputtext.value);

    inputtext.value = "";

    sendbutton.disabled = true;
    sendbutton.style.opacity = "0.4";

});


/* ---------------- Enter Key Send ---------------- */

inputtext.addEventListener('keydown', function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        // 🚫 Prevent trigger if textbox empty
        if (inputtext.value.trim().length === 0) {
            return;
        }

        console.log(event.target.value);

        inputtext.value = "";

        sendbutton.disabled = true;
        sendbutton.style.opacity = "0.4";
    }

});