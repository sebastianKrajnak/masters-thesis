<!-- 
    Author: Michal Janů
    Description: View (component) where the user can preview their Q-sort
 -->
<template>
    <div class="wrapper">
        <div class="content-wrapper">
            <div class="title">
                Thank you for submission
            </div>
            <div class="table-wrapper">
                <div class="header">
                    <div class="overview">Overview</div>
                    <div class="json">JSON</div>
                </div>
                <div class="content">
                    <pre>{{ qStore.getResultJSON() }}</pre>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useQSortStore } from '../stores/q-sort';
    const qStore = useQSortStore()

</script>

<style lang="scss" scoped>
    @use "../scss/Colors/Colors" as *;
    .wrapper{
        background-color: $primary-bg;
        width: 100%;
        height: 100%;
        display: flex;
        overflow-y: auto;
        .content-wrapper{
            margin: auto;
            height: fit-content;
            min-width: 280px;
            width: min(85vmin, 900px);
            padding-top: 20px;
            padding-bottom: 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 30px;
            box-sizing: border-box;
            align-items: center;
            .title{
                color: #FFFFFF;
                font-size: max(20pt, min(7vmin, 30pt));
                font-variation-settings: 'wght' 600;
                background: url("../assets/images/gradient.png") 20% 50%;
                background-size: cover;
                background-repeat: no-repeat;
                color: transparent;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                -webkit-background-clip: text;
            }
            .table-wrapper{
                width: 100%;
                display: flex;
                flex-direction: column;
                box-sizing: border-box;

                &>*{
                    padding: 10px;
                    width: 100%;
                    box-sizing: border-box;
                }
                .header{
                    color: rgba($color: #FFFFFF, $alpha: .7);
                    background-color: $secondary-bg;
                    border-radius: 6px 6px 0 0;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    .overview{
                        font-variation-settings: 'wght' 450;
                    }
                    .json{
                        font-size: 14px;
                        
                    }
                }
                .content{
                    background-color: $ternary-bg;
                    color: #FFFFFF;
                    border-radius:0 0 6px 6px ;
                    overflow-y: auto;
                    pre{
                        display: inline;
                    }
                }
            }
        }
    }
</style>