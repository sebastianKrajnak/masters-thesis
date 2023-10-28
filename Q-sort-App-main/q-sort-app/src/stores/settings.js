/**
 * Settings store which takes care of the state of setting menu and visibility of question and top panels.
 * @author Michal Janů
 */

import { defineStore } from "pinia"
import { ref } from "vue"

export const useSettingsStore = defineStore("settings", () => {
    const savingEnabled = ref(true)
    const queueVisible = ref(true)
    const minimapEnabled = ref(true)
    const questionOpened = ref(true)
    const panelOpened = ref(true)
    const introVisible = ref(true)
    const showIntro = ref(true)
    const cookieName = "Q-sortApp-settings"
    

    /**
     * Updates/Creates cookies containing persistent data for settings
     */
    function updateSettings(){
        $cookies.set(cookieName, {saving: savingEnabled.value, minimap: minimapEnabled.value, intro: showIntro.value})
    }

    /**
     * Loads setting states from cookie
     */
    function loadSettings(){
        if($cookies.isKey(cookieName)){
            var settings = $cookies.get(cookieName)
            savingEnabled.value = settings.saving
            minimapEnabled.value = settings.minimap
            showIntro.value = settings.intro
            introVisible.value = showIntro.value
        }else{
            updateSettings()
        }
    }

    return {
        savingEnabled, questionOpened, panelOpened, minimapEnabled, queueVisible, showIntro, introVisible,

        updateSettings, loadSettings
    }
})