//satart
let resentSong = new Audio()
let music;
let currfolder;
let resentfolder;


console.log("lets write js 1");
function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"

    }
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // If remaining seconds are less than 10, add a leading zero for proper formatting
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
}

async function getfolder() {
    let a = await fetch(`http://127.0.0.1:3000/music1/`,{ mode: 'no-cors' })
    let div = document.createElement('div')
    let response = await a.text()
    div.innerHTML = response
    let anchor = div.getElementsByTagName("a")
    let foldergen = document.querySelector(".right-below")
    let array = Array.from(anchor)
    let arrfolder = []
    resentfolder = arrfolder


    for (let index = 0; index < anchor.length; index++) {
        const element = anchor[index];
        if (element.href.includes("http://127.0.0.1:3000/music1/") && !element.href.includes(".htaccess")) {
            arrfolder.push(element.href.split("/music1/")[1].split("/")[0])
        }

    }



    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/music1/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/music1/")[1].split("/")[0]
            let detail = await fetch(`/music1/${folder}/detail.json`)
            let json = await detail.json()


            foldergen.innerHTML = foldergen.innerHTML + `<div class="card-right" data-folder="${folder}">
 
                     <div class="card-image justifi-center">
                         <img src="/music1/${folder}/cover.jpg" alt="Card Image">
                     </div>
                     <div class="card-info">
                         <h2>${json.title}</h2>
                         <p>${json.discription}</p>
                     </div>
                 </div>`;

        }

    }


}

async function getmusic(folder) {
    currfolder = folder

    let a = await fetch(`/music1/${currfolder}/`,{ mode: 'no-cors' })
    let div = document.createElement('div')
    let response = await a.text()
    div.innerHTML = response
    let anchor = div.getElementsByTagName("a")


    music = []

    for (let index = 0; index < anchor.length; index++) {
        const element = anchor[index];
        if (element.href.endsWith(".mp3")) {
            music.push(element.href.split(`/${folder}/`)[1])
        }


    }








    musicUL = document.querySelector(".left-below")
    musicUL.innerHTML = ""

    for (const musics of music) {
        musicUL.innerHTML = musicUL.innerHTML + `<div class="card justifi-center">
                                                    <img src="img/music.svg" alt="">
                                                    <p class="para">${musics.replaceAll("%20", " ")}</p>
                                                </div>`
    }

    Array.from(document.querySelector(".left-below").getElementsByTagName("div")).forEach(e => {
        e.addEventListener("click", elements => {
            playsong(e.querySelector(".para").innerHTML)
            
        })
    })

    return music


}



const playsong = async (track, pause = false) => {
    resentSong.src = `/music1/${currfolder}/${track}`;

    if (!pause) {
        resentSong.play(); // Play the track
        play.src = "img/pause.svg"
    }



    document.querySelector(".song-name").innerHTML = decodeURI(track)
    document.querySelector(".left").style.left = "-120%"
    document.querySelector(".h-img").src = "img/hamburger.svg"




};

async function main() {


    await getfolder()


    await getmusic(resentfolder[0])
    // await getmusic(sawait getfolder())




    playsong(music[0], true)





    Array.from(document.getElementsByClassName("card-right")).forEach(e => {
        e.addEventListener("click", async list => {

            currfolder = list.currentTarget.dataset.folder

            music = await getmusic(list.currentTarget.dataset.folder)
            playsong(music[0])
            document.querySelector(".left").style.left = "0%"
            document.querySelector(".h-img").src = "img/cross.svg"
            document.querySelector(".left").style.transition = "all 0.8s ease-in-out"

        })
    })
    // playing the first song


    document.getElementById("play").addEventListener("click", () => {
        if (resentSong.paused) {
            resentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            resentSong.pause()
            play.src = "img/play.svg"
        }

    })

    // time updateion

    resentSong.addEventListener("timeupdate", () => {
        document.querySelector(".song-duration").innerHTML =
            `${convertSecondsToMinutes(resentSong.currentTime)} / ${convertSecondsToMinutes(resentSong.duration)}`
        if (resentSong.currentTime == resentSong.duration) {
            let index = (music.indexOf(resentSong.src.split(`/${currfolder}/`)[1]))
            if ((index) < (music.length - 1)) {
                playsong(music[index + 1])
            }

        }
    })

    // changing the track position

    resentSong.addEventListener("timeupdate", () => {
        document.getElementById("cir").style.left = `
    ${resentSong.currentTime / resentSong.duration * 100}%`

    })

    document.querySelector(".track").addEventListener("click", e => {
        let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = persent + "%"
        resentSong.currentTime = resentSong.duration * persent / 100


    })




    // hamburger
    document.querySelector(".h-img").addEventListener("click", () => {
        if (document.querySelector(".left").style.left == "0%") {

            document.querySelector(".left").style.left = "-120%"
            document.querySelector(".left").style.transition = "all 1.8s ease-in-out"
            document.querySelector(".h-img").src = "img/hamburger.svg"

        }
        else {

            document.querySelector(".left").style.left = "0%"
            document.querySelector(".left").style.transition = "all 0.8s ease-in-out"
            document.querySelector(".h-img").src = "img/cross.svg"
        }
    })
    // next previous btn
    document.getElementById("previous").addEventListener("click", () => {

        let index = (music.indexOf(resentSong.src.split(`/${currfolder}/`)[1]))

        if (music[index] > music[0]) {
            playsong(music[index - 1])
        }
        else {
            playsong(music[index + music.length - 1])
        }
    })

    document.getElementById("next").addEventListener("click", () => {
        let index = (music.indexOf(resentSong.src.split(`/${currfolder}/`)[1]))


        if ((index) < (music.length - 1)) {
            playsong(music[index + 1])
        }

    })

}
main()
