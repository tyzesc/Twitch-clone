<template>
  <nav>
    <ul class="tw-flex nav__left-items">
      <li>
        <TwitchIcon />
      </li>
      <li>追隨中</li>
      <li>瀏覽</li>
      <li>電競</li>
      <li>音樂</li>
    </ul>
    <div class="tw-flex nav__mid-items">
      <input class="nav__search__input" placeholder="搜尋" />
    </div>
    <ul class="tw-flex nav__right-items">
      <li>
        <a>
          <PrimeIcon />
        </a>
      </li>
      <li>
        <a>
          <NotifyIcon />
        </a>
      </li>
      <li>
        <a>
          <ChatIcon />
        </a>
      </li>
    </ul>
  </nav>
</template>


<script>
import TwitchIcon from "./icons/TwitchIcon.vue";
import PrimeIcon from "./icons/PrimeIcon.vue";
import NotifyIcon from "./icons/NotifyIcon.vue";
import ChatIcon from "./icons/ChatIcon.vue";
import ProfileIcon from "./icons/ProfileIcon.vue";
export default {
  name: "NavBar",
  props: {
    notify: Array,
  },
  components: {
    TwitchIcon,
    PrimeIcon,
    NotifyIcon,
    ChatIcon,
    ProfileIcon,
  },
  data() {
    return {};
  },
};
</script>
