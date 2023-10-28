<!-- 
    Author: Michal Janů
    Description: Component of the whole sorting table
 -->
<template>
    <div class="table-wrapper">
        <Row v-for="(arr, index) in qStore.table" 
            :key="index"
            :slotCount="arr.length" 
            :delimiterText="qStore.getDelimiterText(index)" 
            :rowValue="qStore.getRowValue(index)" 
            :idx="index" 
            :style="qStore.getColorStyle(index)" />
    </div>
</template>



<script setup>
    import Row from "./Row.vue";
    import { useQSortStore } from '../../stores/q-sort'

    const qStore = useQSortStore()
</script>



<style lang="scss" scoped>
    .table-wrapper{
        position: relative;
        min-width: max-content;
    }
</style>