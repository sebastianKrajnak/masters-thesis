<!-- 
    Author: Michal Janů
    Description: Component for the Settings modal window
 -->
<template>
    <ModalWindow @toggleModal="updateVisibility($event)" :key="reloadModal" :visible="gStore.settingsVisible">
        <template v-slot:header>
            Settings
        </template>
        <template v-slot:content>
            <div class="options-wrapper">
                <div class="option">
                    <div class="text">
                        Progress auto-saving
                    </div>
                    <div class="interactable">
                        <ToggleButton :id="'save'" v-model="sStore.savingEnabled"/>
                    </div>
                </div>
                <div class="option">
                    <div class="text">
                        Scrollbar minimap
                    </div>
                    <div class="interactable">
                        <ToggleButton :id="'minimap'" v-model="sStore.minimapEnabled"/>
                    </div>
                </div>
                <div class="option">
                    <div class="text">
                        How-To video
                    </div>
                    <div class="interactable">
                        <NormalButton :btnType="ButtonTypes.Normal" @click="showIntro()">
                            Show
                        </NormalButton>
                    </div>
                </div>
                <div class="option">
                    <div class="text">
                        Reset sorting table
                    </div>
                    <div class="interactable">
                        <NormalButton :btnType="ButtonTypes.Warning" @click="qStore.resetTable()">
                            Reset
                        </NormalButton>
                    </div>
                </div>
            </div>
        </template>
    </ModalWindow>
</template>
<script setup>
    import { ref, watch } from 'vue';
    import ModalWindow from '../components/default/ModalWindow.vue';
    import ToggleButton from './default/ToggleButton.vue';
    import NormalButton from './default/NormalButton.vue';
    import { ButtonTypes } from '../enums';
    import { useQSortStore } from '../stores/q-sort';
    import { useSettingsStore } from '../stores/settings';
    import { useGlobalStore } from '../stores/global';
    const qStore = useQSortStore()
    const sStore = useSettingsStore()
    const gStore = useGlobalStore()

    const reloadModal = ref(0)

    function updateVisibility(value){
        gStore.settingsVisible = value
    }

    /**
     * Shows the intro video in modal window
     */
    function showIntro(){
        updateVisibility(false)
        sStore.introVisible = !sStore.introVisible
    }

    watch(
        () => gStore.settingsVisible,
        () =>{
                reloadModal.value++
                sStore.updateSettings()
        }
    )

    watch(
        () => [sStore.savingEnabled, sStore.minimapEnabled],
        () => {
            qStore.updateBothCookies()
            sStore.updateSettings()
        }
    )



</script>
<style lang="scss" scoped>
@use "../scss/Colors/Colors" as *;
    .options-wrapper{
        width: 250px;
        display:flex;
        flex-direction: column;
        gap: 15px;
        padding: 10px;
        border-radius: 6px;
        background-color: rgba($color: $secondary-bg, $alpha: 0.6);
        .option{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>