const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const PlAYER_STORAGE_KEY = "F8_PLAYER";
const cd = $(".cd");
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "./assets/mp3/y2mate.com - KEYO  TÒNG PHU  Official Music Video  Quá khó để chăm lo một người con gái.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
    },
    {
      name: "Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "./assets/mp3/y2mate.com - Mày Đang Giấu Cái Gì Đó  TDT MIX.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path: "./assets/mp3/y2mate.com - Mày Đang Giấu Cái Gì Đó  TDT MIX.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "https://mp3.vlcmusic.com/download.php?track_id=14448&format=320",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
    },
    {
      name: "Damn",
      singer: "Raftaar x kr$na",
      path:
        "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
      image:
        "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
    }
    ],

    render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                        <div class="song ${
                          index === this.currentIndex ? "active" : ""
                        }" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;
    });
    playlist.innerHTML = htmls.join("");
    },
    //lấy ra bài hát đầu tiên
    defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
        get: function () {
            return this.songs[this.currentIndex]
        }
    })
    },

  //Hàm chuyên sử lý sự kiện Dom
    handleEvent: function() {
        const _this = this;
        //Lấy ra kích thước tối đa của cd
        const cdWidth = cd.offsetWidth;
        //Cả trang lắng nghe sự kiện scroll
        //Xử lý CD quay dừng
        const cdThumdAnimate = cdThumb.animate([
          {transform: 'rotate(360deg)'}
        ], {
          duration: 10000,
          iterations: Infinity
        })
        cdThumdAnimate.pause()

        //Xử lý phóng to thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            const newcdWidth = cdWidth - scrollTop;

            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0 ;
            cd.style.opacity = newcdWidth / cdWidth;
        };
      //xử lý khi click play
      playBtn.onclick = function () {
        if(_this.isPlaying) {
          audio.pause();
        }
        else {
          audio.play();
        }       
      }
      //Khi song được play
      audio.onplay = function () {
         _this.isPlaying = true
         player.classList.add('playing')
         cdThumdAnimate.play()
      }
      //khi song bị pause
      audio.onpause = function () {
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumdAnimate.pause()
     }
      //Khi tiến độ bài hát thay đổi
      audio.ontimeupdate = function () {
        if(audio.duration) {
          const progressPesent = Math.floor(audio.currentTime / audio.duration * 100)
          progress.value = progressPesent;
        }
      }
      //xử lý khi tua song
      progress.onchange = function (e) {
        const seekTime = audio.duration / 100 * e.target.value;
        audio.currentTime = seekTime;
      }

      //Khi next bài hát
      nextBtn.onclick = function() {
        if(_this.isRandom) {
          _this.playRandomSong()
        }
        else {
          _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }

      //Khi prev bài hát
      prevBtn.onclick = function() {
        if(_this.isRandom) {
          _this.playRandomSong()
        }
        else {
          _this.prevSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }
      //Xử lý bật tắt random song
      randomBtn.onclick = function(e) {
        _this.isRandom = !_this.isRandom
        randomBtn.classList.toggle('active', _this.isRandom)

      }

      //Xử lý lặp lại một bài hát
      repeatBtn.onclick = function() {
        _this.isRepeat = !_this.isRepeat
        repeatBtn.classList.toggle('active', _this.isRepeat)
      }

      //Xử lý next song khi ended
      audio.onended = function() {
        if(_this.isRepeat) {
          audio.play()
        }
        else {
          nextBtn.click()
        }
      }
      // Lắng nghe hành vi click vào playlist
      playlist.onclick = function(e) {
        const songNode = e.target.closest('.song:not(.active)')
      
        if(songNode || e.target.closest('.option')) {
        //xử lý khi click vào song
          if(songNode) {
            _this.currentIndex = Number(songNode.dataset.index)
            _this.loadCurrentSong()
            _this.render()
            audio.play()
          }

        //Xử lý khi click vào song option
          if(e.target.closest('.option')) {
          
          }
        }
      }
    },

    scrollToActiveSong: function() {
      setTimeout(() => {
        $('.song.active').scrollInterview({
          behavior: 'smooth',
          block: 'nearest'
        })
      },500)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
      this.currentIndex++
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
      }
      this.loadCurrentSong()
    },

    prevSong: function() {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1
      }
      this.loadCurrentSong()
    },

    playRandomSong: function() {
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * this.songs.length)
      }
      while(newIndex === this.currentIndex) {
        this.currentIndex = newIndex
      }
      this.loadCurrentSong()
    },

    //Chạy hàm render.
    start: function () {
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();
        //Lắng nghe xử lý các sự kiện 
        this.handleEvent();
        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render playlist
        this.render();
    }
}

app.start();