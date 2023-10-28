<!-- 
    Author: Michal Janů
    Description: Component of the whole minimap
 -->
<template>
    <div ref="track" class="mm-track" 
        @mousedown.left="onMouseDownTrack($event)" 
        @mousemove="onMoveThumb($event)" 
        @touchmove="onMoveThumb($event)"
        @touchstart="onMouseDownTrack($event)"
        @touchend="onMouseUpThumb()"
        @touchcancel="onMouseUpThumb()"
        @mouseleave.left="onMouseUpThumb()">
        
        <div ref="thumb" class="mm-thumb" 
        @mousedown.left="onMouseDownThumb($event)" 
            @touchstart.prevent="onMouseDownThumb($event)"
            @mouseup.left="onMouseUpThumb()" 
            @touchend="onMouseUpThumb()"
            @touchcancel="onMouseUpThumb()"
            @mousemove="onMoveThumb($event)" 
            @touchmove="onMoveThumb($event)"
            @mouseleave.left="onMouseUpThumb()">
            

        </div>
        <div class="wrapper">
            <div ref="tiles" class="tiles">
                <Tile v-for="(arr, index) in qStore.table" 
                    :key="index" 
                    :indicatorCount="arr.length" 
                    :idx="index" 
                    :style="qStore.getColorStyle(index)"/>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted, watch } from 'vue';
    import { useGlobalStore } from '../../stores/global';
    import { useQSortStore } from '../../stores/q-sort';
    import { useSettingsStore } from '../../stores/settings';
    import Tile from "./Tile.vue"

    const container = ref(null)

    const tiles = ref(null)

    const gStore = useGlobalStore()
    const qStore = useQSortStore()
    const sStore = useSettingsStore()

    const thumb = ref()
    const track = ref()
    
    const pageHeight = ref()
    const displayHeight = ref()
    const rowHeight = ref()
    const trackHeight = ref()
    const thumbHeight = ref()
    const fillHeight = ref()
    const tileHeight = ref()
    const tileCount = ref()
    const thumbTop = ref()
    
    
    
    const thumbOffset = ref(0)
    const prevThumbPos = ref(0)
    const thumbPos = ref(0)
    const trackClick = ref(false)
    const pressed = ref(false)

    defineExpose({init})

    /**
     * Triggers on mouse down on the track of the scrollbar/minimap
     * @param {Event} event the event triggered
     */
    function onMouseDownTrack(event){
        event.stopPropagation();
        trackClick.value = true
        pressed.value = true
        thumbOffset.value = tileCount.value*tileHeight.value/2
        moveThumb(event)
    }

    /**
     * Get position of where the event happend
     * @param {Event} event the event triggered
     * @returns position
     */
    function getPosFromEvent(event){
        var pos
        if(event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend'){
            var evt = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            pos = touch.pageY
        }else{
            pos = event.clientY
        }
        return pos
    }

    /**
     * Triggers on mouse down on the thumb of the scrollbar/minimap
     * @param {Event} event the event triggered
     */
    function onMouseDownThumb(event){
        event.stopPropagation();
        trackClick.value = false
        pressed.value = true
        thumbOffset.value = getPosFromEvent(event)
        moveThumb(event)
    }

    /**
     * Triggered if mouse is released to stop the thumb movement
     */
    function onMouseUpThumb(){
        if(pressed.value){
            prevThumbPos.value = thumbPos.value
            pressed.value = false
            trackClick.value = false
        }
    }

    /**
     * Move thumb if pressed/touched and moved
     * @param {Event} event the event triggered
     */
    function onMoveThumb(event){
        if(pressed.value){
            moveThumb(event)
        }
    }

    /**
     * Th clamp function to limit value in range
     * @param {Number} min 
     * @param {Number} max 
     * @returns clamped value
     */
    Number.prototype.clamp = function(min, max){
        return Math.min(Math.max(this, min), max)
    }

    /**
     * Sets the thumb position and the poistion of the view on the page
     * @param {Event} event triggered event
     */
    function moveThumb(event){
        var eventPosition = getPosFromEvent(event)
        if(trackClick.value){
            thumbPos.value =  eventPosition - thumbOffset.value + fillHeight.value
        }else{
            thumbPos.value =  eventPosition - thumbOffset.value + prevThumbPos.value
        }
        thumbPos.value = thumbPos.value.clamp(0, Math.max(0, trackHeight.value - tileCount.value*tileHeight.value + fillHeight.value))
        container.value.scrollTo(0, convertSctoll2pageHeight(thumbPos.value))
    }

    /**
     * Moves thumb if used normal scroll used
     */
    function getScroll(){
        if(!pressed.value){
            prevThumbPos.value = convertPage2ScrollHeight(container.value.scrollTop)
        }
        thumb.value.style.top = Math.max(convertPage2ScrollHeight(container.value.scrollTop) - fillHeight.value,0).toString() + "px"
        updateThumbHeight()
    }

    /**
     * Scroll based on the wheel value in event when mouse over minimap
     * @param {Event} event triggered event
     */
    function getMinimapScroll(event){
        container.value.scrollBy(0, event.deltaY)
    }

    /**
     * Initial setup of the minimap
     */
    function minimapSetup(){
        if(sStore.minimapEnabled){
            displayHeight.value = window.innerHeight
            pageHeight.value = document.getElementById("table-h").offsetHeight
            trackHeight.value = track.value.offsetHeight
            rowHeight.value = document.getElementsByClassName("row")[0].offsetHeight
            fillHeight.value = convertPage2ScrollHeight(document.getElementById("panel-h").offsetHeight)
            tileHeight.value = displayHeight.value / qStore.table.length
            tileCount.value = displayHeight.value / rowHeight.value
            thumbTop.value = getThumbTop()
            updateThumbHeight()
        }
    }

    /**
     * Gets top position of the thumb element
     * @returns position
     */
    function getThumbTop(){
        return Math.max(convertPage2ScrollHeight(container.value.scrollTop) - fillHeight.value, 0)
    }

    /**
     * Gets the height of space dedicated to the top part (panel)
     * @return height
     */
    function getFillDecreaseTop(){
        return Math.max(fillHeight.value - convertPage2ScrollHeight(container.value.scrollTop) , 0)
    }

    /**
     * Updates value of thumb based on the variables
     */
    function updateThumbHeight(){
        thumbTop.value = getThumbTop()
        thumbHeight.value = tileCount.value*tileHeight.value - getFillDecreaseTop()
        thumbHeight.value = Math.min(displayHeight.value < thumbTop.value + thumbHeight.value ? displayHeight.value - thumbTop.value : thumbHeight.value, displayHeight.value)
        thumb.value.style.height = thumbHeight.value.toString() + "px"
    }

    /**
     * Converts value from Page to minimap height
     * @param {Number} height page height
     * @returns minimap height
     */
    function convertPage2ScrollHeight(height){
        return (height / pageHeight.value) * trackHeight.value
    }

    /**
     * Converts value from minimap to page height
     * @param {Number} height minimap height
     * @returns page height
     */
    function convertSctoll2pageHeight(height){
        return (height / trackHeight.value ) * pageHeight.value
    }

    /**
     * Disables minimap if the minimap element overflows outside viewport
     */
    function disableIfOverflows(){
        if(tiles.value.scrollHeight > displayHeight.value){
            sStore.minimapEnabled = false
        }
    }

    /**
     * Initialize minimap values
     */
    function init(){
        gStore.waitForTransitions().then(() => {
            minimapSetup()
        })
    }

    watch(
        () => [sStore.minimapEnabled, sStore.questionOpened, sStore.panelOpened, sStore.queueVisible],
        () => {
            init()
    })

    onMounted(() => {
        container.value = document.getElementById("container")
        init()
        disableIfOverflows() 
        container.value.addEventListener("scroll", getScroll)
        track.value.addEventListener("wheel", getMinimapScroll)
    })
    onUnmounted(() => {
        if(container.value != null && track.value != null){
            container.value.removeEventListener("scroll", getScroll)
            track.value.removeEventListener("wheel", getMinimapScroll)
        }
    })
</script>

<style lang="scss" scoped>
    @use "../../scss/Colors/Colors" as *;
    .mm-track{
        position: sticky;
        height: 100%;
        width: min(11vmin, 85px);
        min-width: 35px;
        background-color: red;
        right: 0px;
        cursor: pointer;
        border-left: solid rgba($color: #3a3a3a, $alpha: .5) 1px;
        .mm-thumb{
            width: 100%;
            background-color: transparent;
            border: solid 3px rgba($color: #000000, $alpha: .8);
            border-radius: 6px 0px 0px 6px;
            position: absolute;
            cursor: default;
            box-sizing: border-box;
            
        }
        .wrapper{
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            box-sizing: border-box;

            .panel-fill{
                width: 100%;
                height: 30px;
                background-color: $primary-bg;
                box-sizing: border-box;
            }
            .tiles{
                display: grid;
                grid-auto-rows: 1fr;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
            }
        }
    }
</style>