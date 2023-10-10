<template>
  <div>
    <h2>You are connected to {{ $route.params.id }}</h2>
    <input
      v-model="text"
      @input="updateText"
      @keyup="handleKeyUp"
      @keydown="handleKeyDown"
      placeholder="Type something..."
    />
    <p>{{ text }}</p>
    <p v-if="displaySaving">Saving...</p>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import socket from "@/socket";
import { useRoute } from "vue-router";

export default {
  setup() {
    const text = ref("");
    const route = useRoute();
    const id = route.params.id;
    let saveTimeout;
    let keyDownFlag = false;
    const displaySaving = ref(false);

    const updateText = () => {
      socket.emit("send-changes", text.value);
    };

    const handleKeyUp = () => {
      keyDownFlag = false;
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveDocument();
      }, 1500);
    };

    const saveDocument = () => {
      if (!keyDownFlag) {
        displaySaving.value = true;
        setTimeout(() => {
          socket.emit("save-document", text.value);
          displaySaving.value = false;
        }, 1500);
      }
    };

    const handleKeyDown = () => {
      keyDownFlag = true;
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

    onUnmounted(() => {
      clearInterval(saveTimeout);
    });

    // Listen for changes to the shared text from other users
    socket.on("receive-changes", receiveChanges);

    return {
      text,
      displaySaving,
      updateText,
      handleKeyDown,
      handleKeyUp,
    };
  },
};
</script>
