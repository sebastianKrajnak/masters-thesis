<!-- 
    Author: Michal Janů
    Description: Component of Row of the sorting table
 -->
<template>
    <div class="row">
        <div class="row-value">{{ props.rowValue }}</div>
        <CardSlot v-for="index in props.slotCount" :key="index-1" :row="props.idx" :col="index-1" />
        <div class="delimiter-text">{{ props.delimiterText }}</div>
    </div>
</template>



<script setup>
    import CardSlot from './CardSlot.vue'
    
    const props = defineProps({
        idx: Number,
        slotCount: Number,
        delimiterText: String,
        rowValue: Number
    })

</script>



<style lang="scss" scoped>
    
    .row{
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        gap: min(.8vmin, 10px);
        align-items: center;

        .row-value{
            color: #FFFFFF;
            text-shadow: -1px 0 #000000, 1px 0 #000000, 0 1px #000000, 0 -1px #000000;
            width: min(8vmin, 45px);
            min-width: 26px;
            font-variation-settings: 'wght' 700;
            font-size: max(10pt ,min(4vmin, 15pt));
            align-self: stretch;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: brightness(.9) saturate(140%);
        }

        .delimiter-text{
            font-family: "Maven Pro";
            font-variation-settings: 'wght' 800;
            font-size: max(80px, min(25vmin, 100px));
            opacity: 30%;
            margin-left: min(3vmin, 30px);
            margin-right: min(3vmin, 30px);
            z-index: 0;
            white-space: nowrap;
        }
    }
</style>