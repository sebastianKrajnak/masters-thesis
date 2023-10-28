<!-- 
    Author: Michal Janů
    Description: Component of card that is used in Queue and table
 -->
<template>
    <Transition name="card"
        @before-leave="gStore.addTransition()"
        @after-enter="gStore.removeTransition()" appear>
        <div v-if="props.visible" class="wrapper" @click="onClickSelect()">
            <div class="card" :class="classIsSelected(), classClickable(), classNotSelectedInQueue()">
                {{ text }}
            </div>
        </div>
    </Transition>
</template>




<script setup>
    import { useQSortStore } from '../stores/q-sort'
    import { useGlobalStore } from '../stores/global';
    const props = defineProps({
        text: String,
        id: Number,
        idx: Number,
        inQueue: Boolean,
        visible: Boolean
    })
    const qStore = useQSortStore()
    const gStore = useGlobalStore()

    /**
     * Check if currently selected card is this card
     */
    function isSelected(){
        return props.id == qStore.selectedCardId &&
        props.text == qStore.getCardText(qStore.selectedCardId)
    }   

    /**
     * Set class of selected card if card is selected
     */
    function classIsSelected(){
        if(isSelected()){
            return "selected"
        }
        return ""
    }

    /**
     * Returns class of clickable or swapable depending on conditions of current card
     */
    function classClickable(){
        var classStr = ""
        if(!isSelected() && (!props.inQueue || props.inQueue && props.idx == qStore.selectedIdx)){
            classStr += "clickable"
            if(!qStore.isSelectedInQueue() && !props.inQueue && !qStore.isNothingSelected()){
                classStr += classStr.length == 0 ? "" : " "
                classStr += "swapable"
            }
        }
        return classStr
    }

    /**
     * Set class of "inqueue" if the card is in queue and not selected
     */
    function classNotSelectedInQueue(){
        if(!isSelected() && props.inQueue){
            return "inqueue"
        }
        return ""
    }

    /**
     * If card clicked either select/deselect it or swap with other selected card
     */
    function onClickSelect(){
        if(!gStore.inTransition()){
            if(!props.inQueue && qStore.isSelectedInQueue() || qStore.isNothingSelected() || !qStore.isSelectedInQueue() && props.inQueue && qStore.selectedIdx == props.idx){
                var cardPos = qStore.getCardPos(props.id)
                qStore.setSelected(props.id, cardPos.row, cardPos.col)
            }else if(!qStore.isSelectedInQueue() && !props.inQueue){
                if(qStore.selectedCardId == props.id){
                    qStore.setSelected()
                }else{
                    qStore.swapSlots(props.id)
                }
            }
        }
    }
</script>




<style lang="scss" scoped>
    @use "../scss/Colors/Colors" as *;

    $animation-duration: 0.175s;
    .card-enter-active {
        animation-name: card_appear;
        animation-duration: $animation-duration;
        animation-delay: $animation-duration;
        animation-fill-mode: both;
        animation-direction: normal;
        animation-timing-function: ease;
    }

    .card-leave-active {
        animation-name: card_appear;
        animation-duration: $animation-duration;
        animation-fill-mode: forwards;
        animation-direction: reverse;
        animation-timing-function: ease;
    }

    @keyframes card_appear {
        0%{
            opacity: 0%;
            visibility: hidden;
            transform: scale(1.5);
        }
        100%{
            opacity: 100%;
            visibility: visible;
            transform: scale(1);
        }
    }

    .wrapper{
        display: flow-root;
        transition: all .4s ease;
        position: absolute;
        cursor: default;

        z-index: 1;
        .card{
            
            background-color: $primary-card; 
            width: min(43vmin, 220px);
            min-width: 138px;
            aspect-ratio: 22/13;
            margin: 4px;
    
            display: flex;
            justify-content: center;
            align-items: center;
            
            border-radius: 6px;
            outline-width:max(3.5px, min(.8vmin, 4px));
            outline-style: solid;
            outline-color: #000000;
            
            font-size: max(8pt, min(3.5vmin, 12pt));
            font-family: "Maven Pro";
            text-align: center;
    
            padding: 5px;
            box-sizing: border-box;

            box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.15);
        }
        .inqueue{
            outline: none !important;
        }

        .selected{
            outline-width: max(5px, min(1vmin, 8px));
            outline-color: #BDFF00 !important;
            font-variation-settings: "wght" 600;
        }
        .clickable {
            cursor: pointer;
        }

        .swapable:hover{
            background-color: #B2EDFF;
            background-image: url(../assets/icons/swap.svg);
            background-repeat: no-repeat;
            background-position: center;
            background-size: 83px;
            opacity: 65%;
        }
    }

</style>