import WaveSurfer from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js'

const loveButton = document.getElementById("love-button");
const loveContainer = document.querySelector(".love-container");
const LOVE_CARDS_CLASS_NAME = ".love-cards-container"
const LOVE_CARD_CLASS_NAME = ".love-card"
const loveButtonNavigation = document.querySelectorAll(".love-button-navigation")
const loveCardsClose = document.getElementById("love-cards-close")
const arrowIcon = document.getElementById("arrow")

loveButton.addEventListener("click", () => {
    if(!loveContainer.classList.contains("active")){
        loveContainer.classList.add("active");
    }
});


// #region Close love cards
loveContainer.addEventListener("click", (e) => {
    if(!e.target.closest(LOVE_CARDS_CLASS_NAME)){
        if(loveContainer.classList.contains("active")){
            loveContainer.classList.remove("active");
        }
    }
})

loveCardsClose.addEventListener("click", () => {
    if(loveContainer.classList.contains("active")){
        loveContainer.classList.remove("active");
    }
})
// #endregion


for(let i = 0; loveButtonNavigation.length > i; i++){
    loveButtonNavigation[i].addEventListener("click", (e) => {
        if(e.currentTarget.value === "prev"){
            const allLoveCards = document.querySelectorAll(LOVE_CARD_CLASS_NAME)
            const firstCard = allLoveCards[0]
            const firstCardContainsActive = firstCard.classList.contains("active")
            if((firstCardContainsActive)){
                firstCard.classList.remove("active")
                allLoveCards[allLoveCards.length - 1].classList.add("active")
            }else{
                const activeCard = document.querySelector(".love-card.active")
                if(activeCard){
                    const previousActiveCardSibling = activeCard.previousElementSibling
                    if(previousActiveCardSibling){
                        activeCard.classList.remove("active")
                        previousActiveCardSibling.classList.add("active")
                    }
                }
            }
        } else if(e.currentTarget.value === "next"){
            const allLoveCards = document.querySelectorAll(LOVE_CARD_CLASS_NAME)
            const lastCard = allLoveCards[allLoveCards.length - 1]
            const lastCardContainsActive = lastCard.classList.contains("active")
            if((lastCardContainsActive)){
                lastCard.classList.remove("active")
                allLoveCards[0].classList.add("active")
            }else{
                const activeCard = document.querySelector(".love-card.active")
                if(activeCard){
                    const nextActiveCardSibling = activeCard.nextElementSibling
                    if(nextActiveCardSibling){
                        activeCard.classList.remove("active")
                        nextActiveCardSibling.classList.add("active")
                    }
                }
            }
        }else if(!isNaN(e.currentTarget.value)) {
            const allLoveCards = document.querySelectorAll(LOVE_CARD_CLASS_NAME)
            const activeCard = document.querySelector(".love-card.active")
            if(activeCard && e.currentTarget.value <= allLoveCards.length){
                activeCard.classList.remove("active")
                allLoveCards[e.currentTarget.value - 1].classList.add("active")
            }
        }else{
            console.error("Unknown navigation button value: " + e.currentTarget.value)
        }
    })
}

const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'rgb(119, 13, 129)',
    progressColor: 'rgb(228 66 243)',
    url: './i-love-u.mp3',
    mediaControls: true,
    barRadius: 10,
    barWidth: 3,
    barHeight: 2,
    barGap: 2,
    height: 200,
})

wavesurfer.on('ready', () => {
    const waveformContainer = document.querySelector('#waveform');
    const shadowHost = waveformContainer.querySelector('div');
    
    if (shadowHost && shadowHost.shadowRoot) {
        const shadowRoot = shadowHost.shadowRoot;
        
        // Crear e inyectar estilos personalizados
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: flex !important;
                flex-direction: column-reverse !important;
            }

            audio {
                margin-bottom: 40px !important;
                width: 100% !important;
                height: 50px !important;
                border-radius: 25px !important;
                background: linear-gradient(135deg, rgba(119, 13, 129, 0.1) 0%, rgba(170, 142, 196, 0.15) 100%) !important;
                padding: 5px 15px !important;
                box-shadow: 0 4px 15px rgba(119, 13, 129, 0.2) !important;
            }

            /* Personalizar el track de progreso */
            audio::-webkit-media-controls-timeline {
                background: rgba(119, 13, 129, 0.2) !important;
                border-radius: 10px !important;
                margin: 0 10px !important;
            }

            /* Personalizar los botones */
            audio::-webkit-media-controls-play-button,
            audio::-webkit-media-controls-pause-button {
                background-color: #770d81 !important;
                border-radius: 50% !important;
                filter: brightness(1.2) !important;
            }

            audio::-webkit-media-controls-play-button:hover,
            audio::-webkit-media-controls-pause-button:hover {
                filter: brightness(1.4) !important;
            }

            /* Personalizar el tiempo */
            audio::-webkit-media-controls-current-time-display,
            audio::-webkit-media-controls-time-remaining-display {
                color: #770d81 !important;
                font-weight: 600 !important;
                font-size: 13px !important;
            }

            /* Personalizar el volumen */
            audio::-webkit-media-controls-volume-slider {
                background: rgba(119, 13, 129, 0.2) !important;
                border-radius: 10px !important;
            }

            audio::-webkit-media-controls-mute-button {
                filter: brightness(1.2) !important;
            }

            /* Panel de controles */
            audio::-webkit-media-controls-panel {
                background: transparent !important;
            }

            audio::-webkit-media-controls-enclosure {
                border-radius: 25px !important;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(227, 227, 227, 0.6) 100%) !important;
            }
        `;
        
        shadowRoot.appendChild(style);
    }
});



wavesurfer.on('interaction', () => {
    wavesurfer.play()
})

arrowIcon.addEventListener("click", () => {
    const introSection = document.getElementById("next-section");
    introSection.scrollIntoView({ behavior: 'smooth' });
})
