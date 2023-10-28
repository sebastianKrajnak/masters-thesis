<!-- 
    Author: Michal Janů
    Description: Component of top panel containing the buttons, question and card queue
 -->
<template>
    <Transition name="question-queue" 
        @after-leave="showButton()"
        @before-leave="gStore.addTransition()" 
        @after-enter="gStore.removeTransition()">
        <div class="question-queue" v-if="sStore.panelOpened">
            <Transition name="question" 
                @before-leave="gStore.addTransition()" 
                @after-leave="gStore.removeTransition()"
                @before-enter="gStore.addTransition()" 
                @after-enter="gStore.removeTransition()">
                <div class="question-wrapper" v-if="sStore.questionOpened">
                    <div class="question-animation-wrapper">
                        <div class="question-info-icon">
                            <img src="../../assets/icons/question.svg" />
                        </div>
                        <div class="question">
                            {{ qStore.question }}
                        </div>
                        <RoundButton @click="onClickToggleQuestion()" class="interactable"/>
                    </div>
                </div>
            </Transition>
            <div class="queue-buttons-wrapper">
                <div class="overlayed-buttons-wrapper">
                    <div>
                        <Transition name="question-toggle">
                            <RoundButton @click="onClickToggleQuestion()" v-if="!sStore.questionOpened" class="interactable">
                                <img src="../../assets/icons/question.svg"/>
                            </RoundButton>
                        </Transition>
                    </div>
                    <div>
                        <RoundButton @click="onClickOpenSettings()" class="interactable">
                            <img src="../../assets/icons/settings.svg"/>
                        </RoundButton>
                    </div>
                </div>
                <div class="card-queue-wrapper" >
                    <Transition name="queue-toggle"
                        @after-leave="showSubmit(), gStore.removeTransition()"
                        @before-leave="gStore.addTransition()" 
                        @before-enter="gStore.addTransition()" 
                        @after-enter="gStore.removeTransition()" appear>
                        <CardQueue v-if="sStore.queueVisible"/>
                    </Transition>
                    <Transition name="submit-btn"
                        @after-leave="showQueue(), gStore.removeTransition()"
                        @before-leave="gStore.addTransition()" 
                        @before-enter="gStore.addTransition()" 
                        @after-enter="gStore.removeTransition()" appear>
                        <div class="submit-wrapper" v-if="submitVisible">
                            <NormalButton class="submit-btn" :btnType="ButtonTypes.Submit" @click="onSubmitSort()">
                                <div class="submit-btn-inner-wrapper">
                                    Submit
                                    <img src="../../assets/icons/submit.svg" />
                                </div>
                            </NormalButton>
                        </div>
                    </Transition>
                </div>
                <div class="hide-btn" >
                    <RoundButton @click="toggleTopPanel()" class="interactable">
                        <img class="drop-down" src="../../assets/icons/drop_down.svg"/>
                    </RoundButton>
                </div>
            </div>
        </div>
    </Transition>
    <Transition name="show-btn" @after-leave="toggleTopPanel()" 
            @before-leave="gStore.addTransition()" 
            @after-enter="gStore.removeTransition()">
        <div class="show-button" v-if="showBtnVisible">
            <RoundButton @click="toggleTopPanel()" class="interactable" :style="styleSelectedQueue()">
                <img class="drop-down" style="transform: rotate(0deg);" src="../../assets/icons/drop_down.svg"/>
            </RoundButton>
        </div>
    </Transition>
</template>

<script setup>
    import CardQueue from "../panel/CardQueue.vue"
    import RoundButton from "../default/RoundButton.vue";
    import { useQSortStore } from "../../stores/q-sort"
    import { useSettingsStore } from "../../stores/settings";
    import { useGlobalStore } from "../../stores/global";
    import { ref, watch, onBeforeMount } from 'vue'
    import NormalButton from "../default/NormalButton.vue";
    import { ButtonTypes } from "../../enums";
    import { useRouter } from "vue-router";

    const router = useRouter()

    const showBtnVisible = ref(false)
    const submitVisible = ref(false)

    const qStore = useQSortStore()
    const sStore = useSettingsStore()
    const gStore = useGlobalStore()

    /**
     * Toggles visivility of queue
     */
    function showQueue(){
        sStore.queueVisible = !sStore.queueVisible
    }

    /**
     * Toggles visivility of submit button
     */
    function showSubmit(){
        submitVisible.value = !submitVisible.value

    }

    /**
     * routes to the last screen with sort overview
     * NOTE: Here would be Fetch function with the data that would be sent to the server
     */
    function onSubmitSort(){
        router.replace({name: "Ferewell"})
    }

    /**
     * Toggles visivility of question
     */
    function onClickToggleQuestion(){
        sStore.questionOpened = !sStore.questionOpened
    }

    /**
     * Toggles visivility of settings menu
     */
    function onClickOpenSettings(){
        gStore.settingsVisible = !gStore.settingsVisible
    }

    /**
     * Toggles visivility of whole top panel
     */
    function toggleTopPanel(){
        if(showBtnVisible.value){
            showBtnVisible.value = !showBtnVisible.value
            sStore.queueVisible = !(qStore.queue.length <= 0)
            submitVisible.value = (qStore.queue.length <= 0)
        }else{
            sStore.panelOpened = !sStore.panelOpened
        }
    }

    /**
     * Sets style of button dependion on if the card in queue is selected
     */
    function styleSelectedQueue(){
        if(qStore.isSelectedInQueue() && !sStore.panelOpened){
            return {"border": "2px solid yellow"}
        }
        return {"border": "2px solid transparent"}
    }

    /**
     * Toggle of button used to show the top panel (if not visible)
     */
    function showButton(){
        showBtnVisible.value = !showBtnVisible.value
    }

    watch(
        qStore.queue,
        () =>{
            if(qStore.queue.length <= 0){
                gStore.waitForTransitions().then(() => {
                    sStore.queueVisible = false
                })
            }else{
                submitVisible.value = false
            }
        }
    )


    onBeforeMount(() => {
        if(qStore.queue.length <= 0){
            submitVisible.value = true
            sStore.queueVisible = false
        }else{
            submitVisible.value = false
            sStore.queueVisible = true
        }
        showBtnVisible.value = !sStore.panelOpened
    })

</script>

<style lang="scss" scoped>
    @use "../../scss/Colors/Colors" as *;

    $minWidth-panel: 320px;
    $maxWidth-panel: 550px;

    .show-button{
        min-width: $minWidth-panel;
        max-width: $maxWidth-panel;
        width: 100%;
        padding: min(2vmin, 10px);
        display: flex;
        justify-content: flex-end;
        box-sizing: border-box;
    }

    .question-queue{
        pointer-events: all;
        width: 100%;
        min-width: $minWidth-panel;
        max-width: $maxWidth-panel;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        cursor: default;

        .question-wrapper{
            width: 100%;
            color: #FFFFFF;
            background-color: $secondary-bg;
            box-sizing: border-box;
            overflow: hidden;

            .question-animation-wrapper{
                display: flex;
                align-items: center;
                gap: 10px;
                padding: min(2vmin, 10px);
                width: 100%;
                box-sizing: border-box;
                .question{
                    font-size: max(13px, min(3.5vmin, 18px));
                    font-variation-settings: 'wght' 500;

                }
                .question-info-icon{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    margin: 0px;
                    img{
                        width: 30px;
                    }
                }
            }

        }

        .queue-buttons-wrapper{
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;

            .card-queue-wrapper, .overlayed-buttons-wrapper{
                grid-row-start: 1;
                grid-column-start: 1;
            }
            .overlayed-buttons-wrapper{
                z-index: 9999;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                padding: min(2vmin, 10px);
                pointer-events: none;
                box-sizing: border-box;
            }
            .card-queue-wrapper{
                height: fit-content;
                .submit-wrapper{
                    width: 100%;
                    height: 90px;
                    background-color: $primary-bg;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 0 0 6px 6px;
                    overflow: hidden;
                    box-sizing: border-box;

                    .submit-btn{
                        font-size: 20px;
                        font-variation-settings: 'wght' 500;
                        padding: 10px 20px 10px 20px;
                        color: #000000;
                        .submit-btn-inner-wrapper{
                            justify-content: center;
                            align-items: center;
                            display: flex;
                            flex-direction: row;
                            gap: 10px;
                            img{
                                width: 25px;
                            }
                        }
                    }
                }
            }
            .hide-btn{
                grid-row-start: 1;
                grid-column-start: 1;
                height: 100%;
                width: 100%;
                min-width: 320px;
                box-sizing: border-box;
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                padding: 10px;
                margin: 0;
                pointer-events: none;
                align-self: center;
                & *{
                    pointer-events: all;
                }
                img{
                    transform: rotate(180deg);
                }
            }
        }
    }
    .interactable{
        pointer-events: all;
    }

    .show-btn-enter-active{
        animation-name: hide-panel;
        animation-direction: reverse;
        animation-fill-mode: forwards;
        animation-duration: .5s;
        animation-timing-function: ease;
    }
    .show-btn-leave-active{
        animation-name: hide-panel;
        animation-direction: normal;
        animation-fill-mode: forwards;
        animation-duration: .5s;
        animation-timing-function: ease;
    }

    .question-queue-enter-active{
        animation-name: hide-panel;
        animation-direction: reverse;
        animation-fill-mode: forwards;
        animation-duration: .5s;
        animation-timing-function: ease;
    }

    .question-queue-leave-active{
        animation-name: hide-panel;
        animation-direction: normal;
        animation-fill-mode: forwards;
        animation-duration: .5s;
        animation-timing-function: ease;
    }

    .question-enter-active{
        animation-name: hide-question;
        animation-direction: reverse;
        animation-fill-mode: forwards;
        animation-duration: .5s;
        animation-timing-function: ease-out;
    }

    .question-leave-active{
        animation-name: hide-question;
        animation-direction: normal;
        animation-fill-mode: forwards;
        animation-duration: .5s;
        animation-timing-function: ease-out;
    }

    .question-toggle-enter-active{
        animation-name: hide-question-toggle;
        animation-direction: reverse;
        animation-fill-mode: forwards;
        animation-duration: .5s;
        animation-timing-function: ease;
    }

    .question-toggle-leave-active{
        animation-name: hide-question-toggle;
        animation-direction: normal;
        animation-fill-mode: forwards;
        animation-duration: .5s;
        animation-timing-function: ease;
    }

    .submit-btn-enter-active{
        animation-name: hide-submit-btn;
        animation-direction: reverse;
        animation-fill-mode: forwards;
        animation-duration: .3s;
        animation-timing-function: ease-out;
    }

    .submit-btn-leave-active{
        animation-name: hide-submit-btn;
        animation-direction: normal;
        animation-fill-mode: forwards;
        animation-duration: .3s;
        animation-timing-function: ease-out;
    }

    .queue-toggle-enter-active{
        animation-name: hide-submit-btn;
        animation-direction: reverse;
        animation-fill-mode: forwards;
        animation-duration: .25s;
        animation-timing-function: ease-out;
    }

    .queue-toggle-leave-active{
        animation-name: hide-submit-btn;
        animation-direction: normal;
        animation-fill-mode: forwards;
        animation-duration: .2s;
        animation-timing-function: ease-out;
    }

    @keyframes hide-submit-btn {
        0%{
            height: 90px;
        }
        100%{
            height: 0px;
        }
    }

    @keyframes hide-panel {
        0%{
            transform: translateY(0%);
        }
        100%{
            transform: translateY(-100%);
        }
    }


    @keyframes hide-question {
        0%{
            max-height: 100%;
        }
        100%{
            max-height: 0%;
        }
    }

    @keyframes hide-question-toggle {
        0%{
            opacity: 1;
        }
        100%{
            transform: scale(1.1);
            opacity: 0;
        }
    }
</style>