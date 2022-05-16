//declare element
const apiData = 'https://duogminhtien.github.io/GludMusic/db.json';

const $$ = document.querySelectorAll.bind(document);
const audio = document.querySelector("#audio");
var nowIndexMusic;

const titleHTML = $('title');
const titleInitial = titleHTML.text();

//HEADER
//----HEADER-SEARCH-----
const searchInput = $(".search-input");
const searchClose = $(".search-close");
const searchBtn = $(".search-btn");
//----------------------
var musicList = undefined;

//--------

const ignoreFunction = $("#ignore-function");

//----FOOTER------------
const audioImg = document.querySelector("#audio-img");
const playAudio = $('#play-audio');
const nextAudio = $("#next-audio");
const previousAudio = $("#previous-audio");
const nameAudio = $('.audio-control-info__detail-name');
const singerAudio = $('.audio-control-info__detail-singer');
const audioDuration = $('#audio-time-duration');
const audioCurrent = $('#audio-time-current');
const audioRange = document.querySelector("#audio-range");
const audioVolume = $("#audio-volume");
const audioVolumeRange = document.querySelector('#audio-volume-range');

const shuffleAudio = $("#shuffle-audio");
const repeatAudio = $("#repeat-audio");

var musicBackgrounds;
var musicDownloadPrivate;

var audioImgAnimate;
var canPlayAudio = false;
//FUNCTION
function handleInit() {
    audioImgAnimate = audioImg.animate([
        { transform: 'rotate(360deg)' }
    ], {
        duration: 7500,
        iterations: Infinity,
    })
    audioImgAnimate.pause();
    audio.volume = 1;
}

function convertSecondToTime(string) {
    let moduleLengthAudio = String(Math.floor(string % 60));
    return Math.floor(string / 60) + ':' + (moduleLengthAudio.length > 1 ? moduleLengthAudio : ('0' + moduleLengthAudio))
}

function pauseMusic(item) {
    item.querySelector('.music-icon-private').innerText = 'play_arrow';
    playAudio.removeClass('fade-loading');
    if (!audio.paused) {
        audio.pause();
    }
    item.classList.remove('active');
    audioImgAnimate.pause();
    titleHTML.text(titleInitial);
    playAudio.text('play_circle');

}

function renderAudio(item) {
    let img = item.querySelector('.music-background');
    let style = img.currentStyle || window.getComputedStyle(img, false);
    let url = style.backgroundImage.slice(4, -1).replace(/"/g, "");
    audioImg.style.backgroundImage = `url(${url})`;
    let music_name = item.querySelector('.music-info__text__music-name').innerText.split(' | ');
    nameAudio.text(music_name[0]);
    singerAudio.text(music_name[1]);
    audioDuration.text('...');
    setTimeout(function renderTime() {
        let text = item.querySelector('.music-time-private').innerText;
        let splitText = text.split(':');
        if (text == '...')
            setTimeout(renderTime, 10)
        else {
            audioDuration.text(text);
            audioRange.max = Number(splitText[0]) * 60 + Number(splitText[1]);
        }
    }, 100);

}


function setupSrcAudio(item) {
    const audioLink = item.querySelector('.music-download-private').href;
    audio.src = audioLink;
}

function playMusic(item) {
    if (item != musicList[nowIndexMusic]) {
        musicList[nowIndexMusic].classList.remove('active');
        musicList[nowIndexMusic].querySelector('.music-icon-private').innerText = 'play_arrow';
        setupSrcAudio(item);
        canPlayAudio = true;
        playAudio.text('');
        playAudio.addClass('fade-loading');
        nowIndexMusic = Array.from(musicList).findIndex(x => x === item);
        item.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        renderAudio(item);
    } else {
        playAudio.text('pause_circle');
    }
    audio.play();
    item.classList.add('active');
    titleHTML.text(item.querySelector('.music-info__text__music-name').innerText);
    item.querySelector('.music-icon-private').innerText = 'pause';
    audioImgAnimate.play();
}

function clickPlayMusic(item) {
    const musicFrame = item.closest('.music__frame');
    if (musicFrame.classList.contains ('ignore-this-music')) {
        alert ("Bài này đang bị bỏ qua, không thể phát được")
    }
    else {
        if (item.innerText == 'play_arrow') {
            playMusic(musicFrame);
        } else {
            pauseMusic(musicFrame);
        }
    }
};

function changeVolume(value) {
    if (value >= 50)
        audioVolume.text('volume_up');
    else if (value == 0)
        audioVolume.text('volume_off');
    else
        audioVolume.text('volume_down_alt');
    audioVolumeRange.changeValue(value);
    audio.volume = value / 100;
}

function checkMusicIgnore (item) {
    if (item.classList.contains ('ignore-this-music')) {
        return false;
    }
    return true;
}

//CALL FUNCTION
handleInit();

//HANDLE EVENT 

audio.addEventListener('loadeddata', () => {
    if (canPlayAudio) {
        playAudio.removeClass('fade-loading');
        playAudio.text('pause_circle');
        canPlayAudio = false;
    }
})
searchInput.on('input', () => {
    if (searchInput.val() != '')
        searchClose.css('display', 'block');
    else
        searchClose.css('display', 'none');
})
searchClose.on('click', () => {
    searchInput.val('');
    searchClose.css('display', 'none');
})
repeatAudio.on('click', () => {
    repeatAudio.toggleClass ('active');
})
shuffleAudio.on('click', () => {
    shuffleAudio.toggleClass ('active');
})
ignoreFunction.on('click', () => {
    ignoreFunction.toggleClass ('active');
    musicList.forEach (item => {
        item.classList.toggle ('ignore-music--show');
    })
})


//fetch API


//render music
fetch(apiData)
    .then(response => response.json())
    .then((data) => {
        htmls = data.songs.map((song, index) => {
            let channel = data.channels[song.channel_id];
            return `
                <div class="music__frame" data-index="${index}">
                    <input type="checkbox" name="ignore-music" class="ignore-music"/>
                    <div class="music-background" style="background-image: url(${song.img})">
                        <div class="music-control-private">
                            <a href="${song.music}" target="_blank" class="material-symbols-sharp music-download-private">download</a>
                            <span class="material-symbols-sharp music-icon-private">play_arrow</span>
                        </div>
                        <span class="music-time-private">...</span>
                    </div>
                    <div class="music-info">
                        <img class="music-info__avatar" src="${channel.avatar}" />
                        <div class="music-info__text">
                            <span class="music-info__text__music-name">${song.name}</span>
                            <span class="music-info__text__channel-name">${channel.name}</span>
                        </div>
                    </div>
                </div>`
        })
        html = htmls.join('');
        $('.body__main__music').append(html);
        $$('.ignore-music').forEach ( (item, index) => {
            item.addEventListener ('change', e => {
                if (item.checked) {
                    musicList[index].classList.add ('ignore-this-music');
                    pauseMusic(musicList[index]);
                }
                else {
                    musicList[index].classList.remove ('ignore-this-music');
                }
            })
        })
        musicList = $$('.music__frame');
        nowIndexMusic = 0;
        setupSrcAudio(musicList[nowIndexMusic]);
        renderAudio(musicList[nowIndexMusic]);
        (function() {
            $$('.music-time-private').forEach((item) => {
                const musicFrame = item.closest('.music__frame');
                let audio = new Audio(musicFrame.querySelector('.music-download-private').href);
                audio.addEventListener("loadeddata", () => {
                    item.innerText = convertSecondToTime(audio.duration);
                })
            })
        }())
        renderAudio(musicList[nowIndexMusic]);

        musicBackgrounds = $$('.music-background');
        musicBackgrounds.forEach(item => {
            item.onclick = () => {
                clickPlayMusic(item.querySelector('.music-icon-private'));
            }
        })
        musicDownloadPrivate = $$('.music-download-private');
        musicDownloadPrivate.forEach(item => {
            item.onclick = (e) => {
                e.stopPropagation();
            }
        })
        audio.addEventListener('pause', () => {
            pauseMusic(musicList[nowIndexMusic]);
        });
        audio.addEventListener('play', () => {
            playMusic(musicList[nowIndexMusic]);
        })
        playAudio.on('click', () => {
            if (playAudio.text() == 'pause_circle')
                pauseMusic(musicList[nowIndexMusic]);
            else
                playMusic(musicList[nowIndexMusic]);
        })
        audioRange.addEventListener('input', (e) => {
            audioCurrent.text(convertSecondToTime(Math.floor(audioRange.value)));
            audio.currentTime = audioRange.value;
        })
        audio.addEventListener('timeupdate', (e) => {
            audioCurrent.text(convertSecondToTime(Math.floor(audio.currentTime)));
            audioRange.changeValue(Math.floor(audio.currentTime));
        })
        audio.addEventListener('ended', () => {
            let indexMusic = nowIndexMusic;
            if (repeatAudio.hasClass ('active')) {
                //ờ, có xử lý gì đâu :>>
            }
            else {    
                do {
                    indexMusic = (indexMusic) < musicList.length - 1 ? indexMusic + 1 : 0;
                }
                while (!checkMusicIgnore(musicList[indexMusic]));
                
            }
            playMusic (musicList[indexMusic]);
        })
        previousAudio.on('click', () => {
            pauseMusic(musicList[nowIndexMusic]);
            let indexMusic = nowIndexMusic;
            do {
                indexMusic = (indexMusic) > 0 ? indexMusic - 1 : musicList.length - 1;
            }
            while (!checkMusicIgnore(musicList[indexMusic]));
            playMusic (musicList[indexMusic]);
        })
        nextAudio.on('click', () => {
            pauseMusic(musicList[nowIndexMusic]);
            let indexMusic = nowIndexMusic;
            do {
                indexMusic = (indexMusic) < musicList.length - 1 ? indexMusic + 1 : 0;
            }
            while (!checkMusicIgnore(musicList[indexMusic]));
            playMusic (musicList[indexMusic]);
        })
        audioVolumeRange.addEventListener('input', () => {
            changeVolume(audioVolumeRange.value);
        })
        audioVolume.on('click', () => {
            if (audioVolumeRange.value == 0)
                changeVolume(50);
            else
                changeVolume(0);
        })
    })