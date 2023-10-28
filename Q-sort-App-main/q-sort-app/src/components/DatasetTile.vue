<!-- 
    Author: Michal Janů
    Description: Page with all the datasets that are preloaded in the General store
 -->
<template>
    <div>
        <div class="wrapper" @click="goToRoute('Sorting', {uid: uid})">
            <div class="details">
                <div class="qn-wrapper">
                    <div class="name">
                        {{ name }}
                    </div>
                    <div class="question">
                        {{ question }}
                    </div>
                </div>
                <div class="sc-wrapper">
                    <div class="count">
                        <img src="../assets/icons/statements.svg"/>
                        {{ statementCount }}
                    </div>
                    <div class="size">
                        {{ size }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { useRouter } from 'vue-router';
    const props = defineProps({
        name: String,
        size: String,
        statementCount: Number,
        question: String,
        uid: String
    })
    const router = useRouter()

    /**
     * Goes to the Sorting page and loads the selected dataset
     * @param {String} routeName What route to use
     * @param {Object} params the UID of the dataset that was chosen
     */
    function goToRoute(routeName, params=null ){
        router.push({name: routeName, params: params==null? {} : params})
    }
</script>
<style lang="scss" scoped>
    @use "../scss/Colors/Colors" as *;
    .wrapper{
        width: 100%;
        height: fit-content;
        background-color: $secondary-bg;
        border-radius: 6px;
        color: #FFFFFF;
        display: flex;
        flex-direction: column;
        padding: 10px;
        padding-left: min(4vmin,20px);
        padding-right: min(4vmin,20px);
        box-sizing: border-box;
        cursor: pointer;

        transition: background-color .2s ease-out;

        &:hover{
            background-color: $secondary-bg-hover;
        }
        
        .details{
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            gap: min(4vmin,20px);
            .qn-wrapper{
                box-sizing: border-box;
                width: 100%;
                overflow: hidden;

                .question{
                    opacity: .6;
                    width: 100%;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    box-sizing: border-box;
                    font-size: max(15px, min(4vmin, 16px));
                }
                .name{
                    font-size: max(17px, min(4.8vmin, 23px));
                    font-variation-settings: 'wght' 500;
                    width: 100%;
                    justify-self: center;
                }
            }
            .sc-wrapper{
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 100%;
                width: 50px;
                gap: 2px;
                .count{
                    display: flex;
                    flex-direction: row-reverse;
                    align-items: center;
                    gap: 5px;
                    color: #ffd500;
                    img{
                        width: 25px;
                    }
                }
                .size{
                    opacity: .4;
                }
            }
        }
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


    @keyframes hide-question {
        0%{
            max-height: 100px;
        }
        100%{
            max-height: 0px;
        }
    }
</style>