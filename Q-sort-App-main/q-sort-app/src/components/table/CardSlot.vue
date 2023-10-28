<!-- 
    Author: Michal Janů
    Description: Component of empty card slot used in sorting table
 -->
<template>
    <div class="slot-wrapper">
        <div class="card-slot">
            <Card :visible="cVisible" :text="card.text" :id="card.id" :inQueue="false" />
            <div class="slot" >
                <div class="slot-empty" :class="classMovable()" @click="onClickMove()">
                </div>
            </div>
        </div>
        <Transition name="return-btn">
                <div class="return-card-wrapper" v-if="cVisible && !qStore.isSelectedInQueue() && qStore.selectedCardId == card.id">
                    <NormalButton class="return-card" @click="qStore.returnCardToQueue()" 
                        :btnType="ButtonTypes.NormalNoOpacity">
                        <div class="return-card-text">
                            Return
                        </div>
                        <div class="return-card-icon">
                            <img src="../../assets/icons/return_card.svg" />
                        </div>
                    </NormalButton>
                </div>
            </Transition>
    </div>
</template>



<script setup>
    import Card from '../Card.vue'
    import { ref, watch, onMounted } from "vue"
    import { useQSortStore } from '../../stores/q-sort';
    import NormalButton from '../default/NormalButton.vue';
    import { ButtonTypes } from '../../enums';


    const props = defineProps({
        row: Number,
        col: Number
    })

    const qStore = useQSortStore()
    const cVisible = ref(false)

    const card = ref({
        id: null,
        text: ""
    })

    watch(
        () => qStore.table[props.row][props.col],
        () =>{
            var cardId = qStore.getTableCardId(props.row, props.col)
            if(cardId!= null){
                if(cVisible.value && card.value.id != cardId){
                    cVisible.value = false
                    setTimeout(() => {
                        card.value.id = cardId
                        card.value.text = qStore.getCardText(cardId)
                        cVisible.value = true
                    }, 175)                    
                }else{
                    card.value.id = cardId
                    card.value.text = qStore.getCardText(cardId)
                    cVisible.value = true
                }
            }else{
                cVisible.value = false
                card.id = null
                card.text = ""
            }
        }
    )
    
    /**
     * Moves selected card to this slot
     */
    function onClickMove(){
        qStore.moveToSlot(props.row, props.col)
    }

    /**
     * sets class "movable" if any card is selected and slot is empty
     */
    function classMovable(){
        if(!qStore.isNothingSelected() && !cVisible.value){
            return "movable"
        }else{
            return ""
        }
    }

    onMounted(() => {
        var cardId = qStore.getTableCardId(props.row, props.col)
        if(cardId!= null){
            if(cVisible.value && card.value.id != cardId){
                cVisible.value = false
                setTimeout(() => {
                    card.value.id = cardId
                    card.value.text = qStore.getCardText(cardId)
                    cVisible.value = true
                }, 300)                    
            }else{
                card.value.id = cardId
                card.value.text = qStore.getCardText(cardId)
                cVisible.value = true
            }
        }else{
            cVisible.value = false
            card.id = null
            card.text = ""
        }
    })

</script>



<style lang="scss" scoped>

    .slot-wrapper{
        margin-top: max(10px, min(3vmin, 20px));
        margin-bottom: max(10px, min(3vmin, 20px));
        margin-inline-start:max(8px, min(3vmin, 15px));
        display: grid;
        grid-template-columns: 1fr;
    }

    .card-slot{
        grid-row-start: 1;
        grid-column-start: 1;

        .slot {
            display: flex; 
            align-items: stretch;
            width: min(43vmin, 220px);
            aspect-ratio: 22/13;
            min-width: 138px;
            margin: 4px;

            border-radius: 6px;
            outline: max(3.5px, min(.8vmin, 4px));
            outline-style: dotted;
            outline-color: #000000;

            grid-row-start: 1;
            grid-column-start: 1;

            .slot-empty{
                min-height: 100%;
                min-width: 100%;
                border-radius: 6px;
            }
            .movable:hover{
                background-color: #B2EDFF;
                background-image: url(../../assets/icons/move.svg);
                background-repeat: no-repeat;
                background-position: center;
                background-size: 62px;
                opacity: 65%;
                cursor: pointer;
            }
        }
    }

    .return-card-wrapper{
        grid-row-start: 1;
        grid-column-start: 1;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        z-index: 99;
        pointer-events: none;
        .return-card{
            padding: 6px 11px 6px 11px;
            border-radius: 6px;
            display: flex;
            align-content: center;
            justify-content: center;
            gap: 5px;
            height: fit-content;
            transform: translateY(-30%);
            pointer-events: all;


            .return-card-text{
                display: flex;
                align-items: center;
                text-align: center;
                justify-content: center;
                height: initial;
                color: #ffffff;
                font-variation-settings: "wght" 500;
                font-size: max(13px, min(3vmin, 15px));
                white-space: nowrap;
            }
            .return-card-icon{
                display: flex;
                align-content: center;
                height: 100%;
                aspect-ratio: 1/1;
                width: max(15px, min(3vmin, 20px));


            }
        }
    }

    $animation-duration: 0.3s;
    
    .return-btn-enter-active{
        animation-name: show-btn;
        animation-duration: $animation-duration;
        animation-fill-mode: forwards;
        animation-direction: normal;
        animation-timing-function: ease;
    }

    .return-btn-leave-active{
        animation-name: show-btn;
        animation-duration: $animation-duration;
        animation-fill-mode: forwards;
        animation-direction: reverse;
        animation-timing-function: ease;
    }

    @keyframes show-btn {
        0%{
            opacity: 0%;

        }
        100%{
            opacity: 100%;
        }
    }


</style>