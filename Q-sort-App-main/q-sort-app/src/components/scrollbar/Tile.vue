<!-- 
    Author: Michal Janů
    Description: Component of tile containing the indicator, the whole component used in the minimap
 -->
<template>
    <div class="tile">
        <Indicator v-for="index in props.indicatorCount"
        :key="index-1"
        :row="props.idx"
        :col="index-1" />
    </div>
</template>

<script setup>
    import Indicator from './Indicator.vue';

    const props = defineProps({
        idx: Number,
        indicatorCount: Number
    })
</script>

<style lang="scss" scoped>
    .tile{
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        gap: 4px;
        flex-wrap: wrap;
        padding: 4px;
        border-top: 1px solid rgba($color: #000000, $alpha: .3);
        border-bottom: 1px solid rgba($color: #000000, $alpha: .3);
    }
</style>