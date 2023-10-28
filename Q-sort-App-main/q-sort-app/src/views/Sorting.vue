<!-- 
    Author: Michal Janů
    Description: View (component) that represent the sorting part of the application
 -->
<template>
    <ModalWindow @toggle-modal="updateIntro($event)" :visible="sStore.introVisible" :key="reloadIntroModal">
        <template v-slot:header>
            Short How-To
        </template>
        <template v-slot:content>
            <iframe class="intro" src="https://www.youtube.com/embed/9EpRY_661Ao" title="YouTube video player" frameborder="0" allow="accelerometer; encrypted-media;" allowfullscreen></iframe>
        </template>
    </ModalWindow>
    <Settings />
    <div class="mm-s-wrapper">
        <div id="container" class="sorting-wrapper"  
            :style="getTopBgColor()" 
            v-dragscroll="true"
            @dragscrollstart="start"
            @dragscrollend="end"
            @click.capture="click">
            <div id="panel-h" class="top-panel-wrapper">
                <TopPanel />
            </div>
            <div id="table-h" class="sorting-table" :style="getBottomBgColor()">
                <SortingTable />
            </div>
        </div>
        <Minimap ref="minimap" v-if="sStore.minimapEnabled" />
    </div>
</template>

<script setup>
    import TopPanel from "../components/panel/TopPanel.vue"
    import SortingTable from "../components/table/SortingTable.vue"
    import Settings from "../components/Settings.vue"
    import Minimap from "../components/scrollbar/Minimap.vue"
    import { useQSortStore } from "../stores/q-sort"
    import { useSettingsStore } from "../stores/settings"
    import { useGlobalStore } from "../stores/global"
    import { ref, onMounted, onBeforeMount, watch } from "vue"
    import { useRoute } from "vue-router"
    import ModalWindow from "../components/default/ModalWindow.vue"
    
    const qStore = useQSortStore()
    const sStore = useSettingsStore()
    const gStore = useGlobalStore()
    const route = useRoute()

    const reloadIntroModal = ref(0)

    var dragging = false;
    var timer = null;

    /**
     * if intro was once seen it will not show on page load
     * update value to only see intor once
     * @param {Boolean} value false if video was not seen and true if intro was seen at least once
     */
    function updateIntro(value){
        sStore.introVisible = value
        if(value == false){
            sStore.showIntro = value
            sStore.updateSettings()
        }
    }

    watch(
        () => sStore.introVisible,
        () => {
            reloadIntroModal.value++
        }
    )

    /**
     * checks if user is draging and if so sets dragging to true
     * Author of the function: https://github.com/donmbelembe/vue-dragscroll/issues/61#issuecomment-1058266843
     */
    function start() {
        timer = setTimeout(() => (dragging = true), 100);
    }

     /**
     * ends dragging (sets it to false)
     * Author of the function: https://github.com/donmbelembe/vue-dragscroll/issues/61#issuecomment-1058266843
     */
    function end() {
        clearTimeout(timer);
        setTimeout(() => (dragging = false));
    }

    /**
     * If clicked while dragging the click is ignored 
     * (when drag ends on clickable element the event needs to be ignored)
     * @param {Event} event 
     * Author of the function: https://github.com/donmbelembe/vue-dragscroll/issues/61#issuecomment-1058266843
     */
    function click(event) {
        if (dragging) {
            event.stopPropagation();
        }   
    }


    const minimap = ref(null)
    

    // this function could fetch the dataset from server
    /**
     * Load dataset by the ID from the general store
     * NOTE: This function could fetch the dataset from server
     * @param {Number} uid 
     */
    function getDataset(uid){
        return gStore.datasets.find(element => element.uid == uid)
    }

    /**
     * Gets color of the last row
     */
    function getBottomBgColor(){
        return {"background-color": qStore.colors[qStore.colors.length-1]}
    }

    /**
     * Gets color of the first row
     */
    function getTopBgColor(){
        return {"background-color": qStore.colors[0]}
    }

    onMounted(() => {
        if(sStore.minimapEnabled){
            var tiles = document.getElementsByClassName("tiles")[0]
            if(tiles.clientHeight < tiles.scrollHeight){ 
                sStore.minimapEnabled = false
            }
        }
    })
    
    onBeforeMount(() => {
        qStore.init()
        gStore.init()
        //Load dataset
        qStore.loadDataset(getDataset(route.params.uid))
    })


</script>

<style lang="scss" scoped>
    .intro{
        aspect-ratio: 1920 / 1002;
        width: 85vw;
        max-width: 1920px;
        box-sizing: border-box;
        border-radius: 6px;
    }
    .mm-s-wrapper{
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
        position: relative;

        .sorting-wrapper{
            overflow: auto;
            height: 100%;
            width: 100%;
            display: flex;
            flex-flow: column;
            user-select: none;
            cursor: grab;
            position: relative;

            &:active{
                cursor: grabbing;
            }
    
            // hide scrollbar
            -ms-overflow-style: none;
            scrollbar-width: none;
            &::-webkit-scrollbar{
                display: none;
            }
            
    
            .top-panel-wrapper{
                pointer-events: none;
                position: sticky;
                top: 0;
                left: 0;
                z-index: 1000;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                box-sizing: border-box;
            }
            .sorting-table{
                min-width: max-content;
                flex-grow: 1;
            }
        }
    }


</style> 