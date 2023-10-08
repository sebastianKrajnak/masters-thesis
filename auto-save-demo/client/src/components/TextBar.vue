<template>
  <div>
    <h2>You are connected to {{ $route.params.id }}</h2>
    <input v-model="text" @input="updateText" placeholder="Type something..." />
    <p>{{ text }}</p>
  </div>
</template>

<script>
import socket from "@/socket"; // Import the Socket.io instance you created
import { useRoute } from "vue-router";

export default {
  data() {
    return {
      text: "",
      id: useRoute().params.id,
    };
  },
  methods: {
    updateText() {
      // Emit a socket.io event to update text in real-time
      socket.emit("send-changes", this.text);
    },
  },
  mounted() {
    if (this.id != null) {
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
    } else {
      console.log(`ayo why id null  ? ${this.id}`);
    }
  },
};
</script>
