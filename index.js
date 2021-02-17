var temp = "";
let volumecontrole;
let likedPlaylist = JSON.parse(localStorage.getItem("playlists")) || [];
let musicToPlay;

async function getApiRoute(link, cb) {
  fetch(link, {
    method: "GET",
    headers: {
      "x-rapidapi-key": "2d797981ddmshb784eed86ac9944p144d54jsn8e64c9cd00ba",
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      cb(data);
    })
    .catch((err) => {
      console.error(err);
    });
}

function cntrl(event) {
  if (musicToPlay) {
    var volvl = event.target.value;
    musicToPlay.volume = volvl;
  }
}
function played(event) {
  if (musicToPlay) {
    musicToPlay.pause();
  }

  musicToPlay = new Audio(event.target.getAttribute("data-url"));
  musicToPlay.volume = 0.2;

  if (temp != "" && temp != event.target) {
    temp.setAttribute("class", "fas fa-play pbt");
    musicToPlay.pause();
    volumecontrole.remove();
  }

  if (event.target.getAttribute("class") == "fas fa-pause pbt") {
    event.target.setAttribute("class", "fas fa-play pbt");
    musicToPlay.pause();
    volumecontrole.remove();

    //scrollvolume.style.visibility='hidden'
  } else {
    event.target.setAttribute("class", "fas fa-pause pbt");
    temp = event.target;
    musicToPlay.play();
    volumecontrole = document.createElement("input");
    volumecontrole.setAttribute("type", "range");
    volumecontrole.setAttribute("min", "0");
    volumecontrole.setAttribute("max", "1");
    volumecontrole.setAttribute("step", "0.001");
    volumecontrole.setAttribute("class", "volume-lvl");
    volumecontrole.setAttribute("value", musicToPlay.volume);

    document.getElementsByClassName("controlHolder")[Number(temp.getAttribute("data-ind"))].appendChild(volumecontrole);
    volumecontrole.addEventListener("change", cntrl);
  }
}
var url = new URLSearchParams(window.location.search);

var categs = {
  jazz: "1767932902",
  workout: "1358731495",
  pop: "1274663331",
  chill: "1911222042",
  rock: "1306931615",
  yoga: "1379281715",
};

const menu = document.getElementsByClassName("div-links")[0];

Object.keys(categs).forEach((route) => {
  const linkRef = document.createElement("a");
  linkRef.setAttribute("href", "?type=" + route);
  linkRef.innerHTML = route;
  menu.appendChild(linkRef);
});
const songsContainer = document.getElementsByClassName("songs")[0];
if (url.get("type")) {
  const t_url = "https://deezerdevs-deezer.p.rapidapi.com/playlist/" + categs[url.get("type")];
  getApiRoute(t_url, (data) => {
    document.getElementById("type").innerText = data.title;
    document.getElementById("descr").innerText = data.description;
    getApiRoute(t_url + "/tracks", (songs) => {
      console.log(songs);

      songs.data.forEach((song, index) => {
        const newSongChild = document.createElement("div");
        newSongChild.setAttribute("class", "song");

        newSongChild.innerHTML = `
   
    <div>
        <img style="width:40px ;height: 40px;border-radius: 5px;" src="${song.album.cover}" alt="">
    </div>
  <div style="width:200px;">
    <h1 style="font-size:16px;font-weight:300;margin-left: 20px;max-width:200px;text-overflow: ellipsis;white-space: nowrap;
    overflow: hidden;">${song.title} <br> <span style="color: rgba(1,1,1,0.4);font-size: 14px;">${song.artist.name}</span> </h1>
  </div>
  </div>
  <div style="margin-left:auto;margin-right:auto"><i data-url="${
    song.preview
  }" data-ind="${index}" class="fas fa-play pbt" style='text-align: center;' id="pbtn"></i></div>
  <div class="controlHolder" style="font-size: 14px;width:100px"> <span style="color:rgba(1,1,1,0.4) ;">${Math.floor(
    song.duration / 60
  )} min</span> <i style="margin-left: 10px;" class="fas fa-share"></i></div>

    
    `;

        songsContainer.appendChild(newSongChild);
      });
      var playbt = document.getElementsByClassName("pbt");
      for (i = 0; i < playbt.length; i++) {
        playbt[i].addEventListener("click", played);
      }
    });
  });
}

if (likedPlaylist.length > 0) {
  const exist = likedPlaylist.findIndex((i) => i.route === url.get("type"));
  if (exist !== -1) {
    document.getElementById("likePlaylist").setAttribute("class", likedPlaylist[exist].liked ? "fa fa-heart" : "far fa-heart");
  }
}

document.getElementById("likePlaylist").addEventListener("click", (e) => {
  const currentLikeStatus = e.target.getAttribute("class");
  e.target.setAttribute("class", currentLikeStatus === "far fa-heart" ? "fa fa-heart" : "far fa-heart");
  const exist = likedPlaylist.findIndex((i) => i.route === url.get("type"));
  if (exist === -1) {
    const newPlaylistInteraction = { route: url.get("type"), liked: currentLikeStatus === "far fa-heart" };
    likedPlaylist.push(newPlaylistInteraction);
    localStorage.setItem("playlists", JSON.stringify(likedPlaylist));
  } else {
    likedPlaylist[exist].liked = !likedPlaylist[exist].liked;
    localStorage.setItem("playlists", JSON.stringify(likedPlaylist));
  }
});
