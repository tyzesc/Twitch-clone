<template>
  <div class="tw-flex fullHeight">
    <div class="tw-flex tw-flex-row sideNav fullHeight">
      <div class="tw-flex tw-flex-column sideNav__suggestion">
        <p class="self-flex-start">推薦的頻道</p>
        <div class="tw-flex sideNav__suggestion__item" v-for="suggestion in suggestions">
          <!-- avatar -->
          <div class="sideNav__suggestion__item__avatar flex-1">
            <img :src="suggestion.img" />
          </div>
          <!-- name/game/ -->
          <div class="tw-flex tw-flex-column tw-flex-center tw-flex-nowrap flex-3">
            <p
              class="tw-flex sideNav__suggestion__item__text sideNav__suggestion__item__name"
            >{{ suggestion.name }}</p>
            <p
              class="tw-flex sideNav__suggestion__item__text sideNav__suggestion__item__game"
            >League of Legends</p>
          </div>
          <!-- view / online -->
          <div class="tw-flex flex-1 tw-flex-center">
            <div class="sideNav__suggestion__item__reddot self-flex-center"></div>
            <p class="sideNav__suggestion__item__viewer self-flex-center">{{ suggestion.viewer }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="tw-flex tw-flex-column main">
      <div class="tw-flex video">
        <div class="tw-flex video__video-wrapper">
          <video class="tw-flex" id="streamVid"></video>
        </div>
      </div>
      <div class="tw-flex info">
        <div class="tw-flex wrapper">
          <div class="tw-flex info__user">
            <div class="tw-flex info__user__avatar">
              <img
                src="https://avatars2.githubusercontent.com/u/36153252?s=460&u=f8b013c0dbb92e21208132c5e89d989a25e67f95&v=4"
              />
              <div class="tw-flex info__user__live-icon">LIVE</div>
            </div>
            <!-- avatar -->
          </div>

          <div class="tw-flex info__user__detail">
            <!-- name -->
            <!-- title -->
            <!-- game / tags -->
            <h4>tyzesc</h4>
            <h5>Clone Twitch with Vue.js</h5>
            <p>
              <span>IRC Talkshow</span>
              <small>中文</small>
              <small>code</small>
            </p>
          </div>
        </div>
        <div class="tw-flex tw-flex-column info__extra">
          <!-- follow / subscribe -->
          <div class="tw-flex tw-flex-row">
            <a href="#">
              <div class="tw-flex info__extra__follow info__extra__button tw-flex-center">
                <FollowIcon />
                <span>追隨</span>
              </div>
            </a>
            <a href="#">
              <div class="tw-flex info__extra__subscribe info__extra__button">
                <SubScribeIcon />
                <span>訂閱</span>
                <DownmoreIcon />
              </div>
            </a>
          </div>
          <!-- viewers / timer / share / more -->
          <div class="tw-flex tw-flex-row tw-flex-end">
            <a class="tw-flex info__extra__item info__extra__viewer">
              <ViewerIcon />
              <span>1</span>
            </a>
            <a class="tw-flex info__extra__item info__extra__timer">{{ nowtime }}</a>
            <a href="#" class="tw-flex info__extra__item info__extra__share">
              <ShareIcon />
            </a>
            <a href="#" class="tw-flex info__extra__item info__extra__threedot">
              <ThreedotIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="tw-flex tw-flex-column chat">
      <div class="tw-flex chat__header">
        <p class="tw-flex">實況聊天室</p>
      </div>
      <div class="tw-flex tw-flex-column chat__content">
        <p class="tw-flex text-left" v-for="item in items" :key="item">
          <span :style="{color: item.color}">{{item.user}}</span>
          <span>:</span>
          <span>{{item.text}}</span>
        </p>
        <p></p>
      </div>
      <div class="tw-flex chat__footer">
        <textarea
          class="chat__footer__input"
          placeholder="傳送訊息"
          rows="3"
          @keyup.enter="sendMessage"
          v-model="message"
        ></textarea>
      </div>
    </div>
  </div>
</template>
<script>
function getRandomRgb() {
  var num = Math.round(0xffffff * Math.random());
  var r = num >> 16;
  var g = (num >> 8) & 255;
  var b = num & 255;
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

import FollowIcon from "./icons/FollowIcon.vue";
import SubScribeIcon from "./icons/SubScribeIcon.vue";
import DownmoreIcon from "./icons/DownmoreIcon.vue";
import ViewerIcon from "./icons/ViewerIcon.vue";
import ShareIcon from "./icons/ShareIcon.vue";
import ThreedotIcon from "./icons/ThreedotIcon.vue";

export default {
  components: {
    FollowIcon,
    SubScribeIcon,
    DownmoreIcon,
    ViewerIcon,
    ShareIcon,
    ThreedotIcon,
  },
  data() {
    return {
      message: "",
      items: [],
      nowtime: "0:00:00",
      suggestions: [
        {
          name: "lolpacifictw",
          game: "League of Legends",
          viewer: 313,
          img:
            "https://static-cdn.jtvnw.net/jtv_user_pictures/3a0a20f0-b3b1-4c9b-bfa7-baba9dda8d7e-profile_image-70x70.png",
        },
        {
          name: "LCK_Korea",
          game: "League of Legends",
          viewer: 168403,
          img:
            "https://static-cdn.jtvnw.net/jtv_user_pictures/bd6d67a8-5571-4e91-acd1-b0bc10dbff14-profile_image-70x70.png",
        },
        {
          name: "世誠 (bbbb87)",
          game: "League of Legends",
          viewer: 681,
          img:
            "https://static-cdn.jtvnw.net/jtv_user_pictures/42cc0820-9ce9-4c59-a376-3c008c824a19-profile_image-70x70.png",
        },
      ],
    };
  },
  async mounted() {
    await this.$loadScript("https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js");

    await this.$loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"
    );
    this.$socket = io("https://alpha.tyze.me:8080");

    this.$socket.on("new-chat-message", (author, color, text) => {
      this.items.push({ user: author, color: color, text: text });
    });

    this.$socket.on("is-online", (rtcId) => {
      const peer = new Peer(undefined, {
        host: "alpha.tyze.me",
        port: 9000,
        path: "/myapp",
        secure: true,
      });

      peer.on("open", async (myid) => {
        this.$socket.emit("join-stream", myid);

        peer.on("call", (call) => {
          call.answer(undefined);
          call.on("stream", (othersStream) => {
            let video = document.querySelector("#streamVid");
            video.muted = true;
            video.srcObject = othersStream;
            video.addEventListener("loadedmetadata", () => video.play());
            setInterval(() => {
              let h = String(Math.round(video.currentTime / 3600));
              let m = String(Math.round((video.currentTime % 3600) / 60));
              let s = String(Math.round(video.currentTime % 60));
              this.nowtime =
                h + ":" + m.padStart(2, "0") + ":" + s.padStart(2, "0");
            }, 1000);
          });
        });
      });
    });
  },

  methods: {
    sendMessage: function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        if (this.message.trim() != "")
          this.$socket.emit("chat-message", this.message);
        this.message = "";
      }
    },
  },
};
</script>