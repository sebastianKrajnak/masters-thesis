<!-- <template>
  <div>
    <h2>You are connected to {{ $route.params.id }}</h2>
    <input v-model="text" @input="updateText" placeholder="Type something..." />
    <p>{{ text }}</p>
  </div>
</template>

<script>
import socket from "@/socket";

export default {
  data() {
    return {
      text: "",
      id: this.$route.params.id,
    };
  },
  methods: {
    updateText() {
      // Emit a socket.io event to update text in real-time
      socket.emit("send-changes", this.text);
    },
  },
  mounted() {
    // const id = useRoute().params.id;
    socket.once("load-document", (data) => {
      console.log("load document was called");
      this.text = data;
    });

    socket.emit("get-document", this.id);
    // Listen for changes to the shared text from other users
    socket.on("receive-changes", (newText) => {
      console.log("received changes");
      this.text = newText;
    });
  },
};
</script> -->

<template>
  <div>
    <h2>You are connected to {{ $route.params.id }}</h2>
    <input v-model="text" @input="updateText" placeholder="Type something..." />
    <p>{{ text }}</p>
  </div>
</template>

<script>
import { ref, watchEffect, onMounted } from "vue";
import socket from "@/socket"; // Import the Socket.io instance you created
import { useRoute } from "vue-router";

export default {
  setup() {
    const text = ref("");
    const route = useRoute();
    const id = route.params.id;
    console.log(id);

    const updateText = () => {
      // Emit a socket.io event to update text in real-time
      socket.emit("send-changes", text.value);
    };

    const receiveChanges = (newText) => {
      console.log("received changes");
      text.value = newText;
    };

    onMounted(() => {
      socket.once("load-document", (data) => {
        console.log("load document was called", data);
        text.value = data;
      });

      socket.emit("get-document", id);
    });

    watchEffect(() => {
      const interval = setInterval(() => {
        socket.emit("save-document", text.value);
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    });

    // Listen for changes to the shared text from other users
    socket.on("receive-changes", receiveChanges);

    return {
      text,
      updateText,
    };
  },
};
</script>
