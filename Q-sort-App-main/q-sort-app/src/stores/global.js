/**
 * Q-sort store which takes care of transitions and storing all of the datasets.
 * @author Michal Janů
 */

import { defineStore} from "pinia"
import { ref, nextTick } from "vue"


import food_json from "../assets/datasets/food-sort.json" // Small dataset (tmp because there is no server)
import affects_json from "../assets/datasets/affects_sort.json" // Medium dataset (tmp because there is no server)
import BFI2_json from "../assets/datasets/BFI2_data.json" // Medium dataset (tmp because there is no server)
import students_json from "../assets/datasets/student_data.json" // Large dataset (tmp because there is no server)

export const useGlobalStore = defineStore("global", () => {
    
    const settingsVisible = ref(false)
    const transitionCount = ref(0)
    const datasets = ref([food_json, affects_json, BFI2_json, students_json]) // (tmp because there is no server)

    /**
     * Initializes the entire store state to default
     */
    function init(){
        settingsVisible.value = false
        transitionCount.value = 0
    }

    /**
     * Checks if application has ongoing transition
     * @returns boolean
     */
    function inTransition(){
        return transitionCount.value > 0
    }

    /**
     * Increment counter of ongoing transitions
     */
    function addTransition(){
        transitionCount.value++
    }

    /**
     * Dncrement counter of ongoing transitions
     */
    function removeTransition(){
        if(transitionCount.value > 0){
            transitionCount.value--
        }
    }

    /**
     * Wait till there is no ongoing transition
     * @returns Promise
     */
    function waitForTransitions(){
        return new Promise((resolve) => {
            nextTick(() => {
                function checkCondition(){
                    if(inTransition()){
                        setTimeout(checkCondition, 100)
                    }else{
                        resolve();
                    }
                }
                checkCondition()
            })
        })
    }

    return {
        settingsVisible, transitionCount, datasets,

        inTransition, addTransition, removeTransition, waitForTransitions, init
    }
})