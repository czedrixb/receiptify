<template>
  <div
    class="bg-white px-5 pb-12 pt-10 rounded-2xl w-full h-full max-w-sm mx-auto md:max-w-md"
  >
    <div class="text-center flex flex-col gap-y-2 mb-5">
      <h2 class="circular uppercase font-bold text-3xl">Receiptify</h2>
      <h6 class="circular uppercase font-medium text-md">LAST MONTH</h6>
    </div>

    <div class="font-normal">
      <div v-if="user" class="uppercase">
        ORDER #001 FOR {{ user.display_name }}
      </div>
      <div class="mb-1 uppercase">{{ formatDate() }}</div>
      <table class="table-fixed w-full">
        <thead>
          <tr class="border-y border-black border-dashed">
            <th class="w-16 text-left">QTY</th>
            <th class="w-auto text-left">ITEM</th>
            <th class="w-auto text-right">AMT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(track, index) in tracks" :key="track">
            <td>{{ (index + 1).toString().padStart(2, "0") }}</td>
            <td class="uppercase">
              {{ track.name }} - {{ track.artists[0].name }}
            </td>
            <td class="text-right">{{ formatDuration(track.duration_ms) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="border-y border-black border-dashed py-0">
        <div class="flex justify-between items-center">
          <div>ITEM COUNT:</div>
          <div>{{ trackCount }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div>TOTAL:</div>
          <div>{{ totalDuration }}</div>
        </div>
      </div>
      <div class="mb-4">
        <div>CARD #: <span class="font-medium">**** *** ***</span> 2023</div>
        <div>AUTH CODE: 1234</div>
        <div v-if="user" class="uppercase">
          CARD HOLDER: {{ user.display_name }}
        </div>
      </div>
      <div class="text-center mb-5">
        <div>THANK YOU FOR VISING!</div>
        <div class="flex justify-center">
          <img src="/images/qr-img.png" class="w-24" alt="" />
        </div>
        <div>www.receiptify.com</div>
      </div>

      <div class="flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-10"
          viewBox="0 0 496 512"
        >
          <path
            d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const user = ref(null);
    const accessToken = ref(null);
    const tracks = ref([]);
    const trackCount = ref(0);

    const getToken = async () => {
      const { access_token } = route.query;
      if (!access_token) {
        console.error("Access token not found!");
        router.push("/login");
      } else {
        accessToken.value = access_token;

        try {
          const userResponse = await axios.get(
            "https://api.spotify.com/v1/me",
            {
              headers: {
                Authorization: `Bearer ${accessToken.value}`,
              },
            }
          );
          user.value = userResponse.data;
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    const getTopTracks = async () => {
      if (accessToken.value) {
        try {
          const tracksResponse = await axios.get(
            "https://api.spotify.com/v1/me/top/tracks",
            {
              params: { limit: 5 },
              headers: {
                Authorization: `Bearer ${accessToken.value}`,
              },
            }
          );
          tracks.value = tracksResponse.data.items;
          trackCount.value = tracks.value.length;
        } catch (error) {
          console.error("Error fetching top tracks:", error);
        }
      }
    };

    const formatDuration = (milliseconds) => {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const totalDuration = computed(() => {
      if (!tracks.value || tracks.value.length === 0) {
        return "0:00";
      }
      const totalMilliseconds = tracks.value.reduce(
        (sum, track) => sum + track.duration_ms,
        0
      );
      return formatDuration(totalMilliseconds);
    });

    onMounted(() => {
      getToken().then(() => {
        getTopTracks();
      });
    });

    return { user, tracks, formatDuration, trackCount, totalDuration };
  },
};
</script>