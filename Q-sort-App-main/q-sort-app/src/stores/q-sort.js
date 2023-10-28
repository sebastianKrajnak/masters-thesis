/**
 * Q-sort store which takes care of the state of sorting table and card queue.
 * @author Michal Janů
 */
import { defineStore } from 'pinia'
import { useSettingsStore } from './settings'
import { ref } from 'vue'

export const useQSortStore = defineStore("q-sort", () => {

        const sStore = useSettingsStore()

        const defaultColors = ref(["#8CB37F","#ECEBE5","#F79696"])
        const name = ref(null)
        const uid = ref(null)
        const question = ref("")
        const delimiters = ref([])
        const colors = ref([])
        const selectedCardId = ref(null)
        const queue = ref([])
        const selectedIdx = ref(0)
        const table = ref([])
        const selectedRow = ref(null)
        const selectedCol = ref(null)
        const cardList = ref({})

        const cookieTable = ref("")
        const cookieQueue = ref("")
    
        /**
         * Initializes the entire store state to default
         */
        function init(){
            name.value = null
            uid.value = null
            question.value = ""
            delimiters.value = []
            colors.value = []
            selectedCardId.value = null
            queue.value = []
            selectedIdx.value = 0
            table.value = []
            selectedRow.value = null
            selectedCol.value = null
            cardList.value = {}
        }

        /**
         * load JSON file and save values to coresponding variables and arrays in the store
         * @param {String} json JSON with the Q-sort dataset (has to have right format)
         */
        function loadDataset(json){
            //General Q-sort info
            uid.value = json.uid
            name.value = json.name
            question.value = json.question
            delimiters.value = json.delimiters
            table.value = loadJsonTable(json.table)
            colors.value = getAllRowColors(json.colors)
            cardList.value = loadCards(json.cards)

            cookieTable.value = "Q-sortApp-"+ uid.value +"-table"
            cookieQueue.value = "Q-sortApp-"+ uid.value +"-queue"

            sStore.loadSettings()

            // Table
            if(sStore.savingEnabled && $cookies.isKey(cookieTable.value)){
                //Load table from cookie
                var cTable = loadCookieToArray(true)
                table.value = loadTable(cTable)
            }else{
                //Create empty cookie 
                updateCookies(true)
            }

            // Queue
            if(sStore.savingEnabled && $cookies.isKey(cookieQueue.value)){
                //load queue from cookie
                var cQueue = loadCookieToArray(false)
                queue.value = cQueue.map(Number)
                setSelected()
            }else{
                //Add all cards to cookie and load them to queue
                queue.value = loadCardIds()
                updateCookies(false)
            }
            
            //Selected card generated based on queue
            if(table.value.length > 0){
                selectedCardId.value = queue.value[selectedIdx.value]
            }else{
                unselect()
            }

        }
        /**
         * Used for loading of the sorting table saved in cookie to array
         * @param {String} is_table csv string with the sorting table where cards are represented as UIDs
         * @returns 1D Array of card UIDs
        */
        function loadCookieToArray(isTable){
            var cookieValue = $cookies.get(isTable ? cookieTable.value : cookieQueue.value)
            if(cookieValue == null){
                return []
            }else{
                return cookieValue.split(",")
            }
        } 
        /**
         * Updates the cookie for either sorting table or card queue
         * @param {Boolean} is_table Is sorting table being updated? If false card queue is being updated
         */
        function updateCookies(isTable){
            var arr = isTable ? get2dTo1dArray(table.value) : queue.value
            var csvStr = arr.join(",")
            $cookies.set(isTable ? cookieTable.value : cookieQueue.value, csvStr)
        } 

        /**
         * Updates both sorting table and card queue cookies
         */
        function updateBothCookies(){
            if(sStore.savingEnabled){
                updateCookies(true)
                updateCookies(false)
            }
        }

        /**
         * Creates changes UID in String to Int
         * @param {Array} array
         * @returns 2D array of int card UIDs
         */
        function loadTable(array){
            var arr = table.value
            var linearIdx = 0
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr[i].length; j++) {
                    if(array[linearIdx] != ""){
                        arr[i][j] = parseInt(array[linearIdx])
                    }else{
                        arr[i][j] = null
                    }
                    linearIdx++
                }
            }
            return arr
        }

        /**
         * Creates Dictionary with Key being UID and value being the text of the card
         * @param {Object} cards Object containing UID and text
         * @returns Dictionary with all cards where Key is UID and value is text
         */
        function loadCards(cards){
            var arr = {}
            cards.forEach(card => {
                arr[card.id] = card.text
            })
            return arr
        }

        /**
         * Creates Array of all card UIDs
         * @returns Array of all card UIDs
         */
        function loadCardIds(){
            var arr = Object.keys(cardList.value)
            arr = arr.map(id => parseInt(id))
            return arr
        }
        /**
         * Coverts 2D array to the 1D array from sorting table shape
         * @param {Array} array_2D 2D Array
         * @returns 1D Array
         */
        function get2dTo1dArray(array2D){
            var array1D = []
            for (var row of array2D) for (var element of row) array1D.push(element)
            return array1D
        }

        /**
         * Gets the text of specific card UID
         * @param {Number} id 
         * @returns text
         */
        function getCardText(id){
            return cardList.value[id]
        }
        
        /**
         * Add card to the end of queue
         * @param {dict} card Adds card (with id and text) into the card queue
         */
        function addCardToQueue(cardId){
            queue.value.push(cardId)
        }

        /**
         * Change index of selected card in queue
         * @param {Number} change How much is shifted seletion in card queue
         */
        function changeSelectedIdx(change){
            if(selectedIdx.value + change >= 0 && 
                selectedIdx.value + change < queue.value.length){
                    selectedIdx.value += change
                    selectedCardId.value = queue.value[selectedIdx.value]
                }
        }
        /**
         * Get colors of all rows
         * @param {Array} delimiterColors Hex numbers of edge colors
         * @returns {Array} interpolated colors of row
         */
        function getAllRowColors(delimiterColors){
            if(delimiterColors == undefined || delimiterColors.length != 3){
                delimiterColors = defaultColors.value
            }
            var rowCount = table.value.length
            var positivePos = 0
            var neutralPos = Math.round(rowCount / 2) - 1
            var negativePos = rowCount - 1
            var array = Array(rowCount).fill("")

            array[positivePos] = delimiterColors[0]
            array[neutralPos] = delimiterColors[1]
            array[negativePos] = delimiterColors[2]

            var betweenColors1 = getColorsBetween(array[positivePos].substring(1), array[neutralPos].substring(1), neutralPos)
            var betweenColors2 = getColorsBetween(array[neutralPos].substring(1), array[negativePos].substring(1), neutralPos)

            betweenColors1.forEach((item, index) =>{
                array[positivePos + index + 1] = "#"+item.toUpperCase()
            })
            betweenColors2.forEach((item, index) =>{
                array[neutralPos + index + 1] = "#"+item.toUpperCase()
            })

            return array
        }
        /**
         * Get Colors between two colors
         * @param {String} hex_color1 First hexadecimal color
         * @param {String} hex_color2 Secon hexadecimal color
         * @param {Number} midpoints how many colors generate between
         * @returns array with all colors
         */
        function getColorsBetween(hexColor1, hexColor2, midpoints){
            var hex1Array = hexColor1.match(/.{2}/g)
            var hex2Array = hexColor2.match(/.{2}/g)

            var newColors = Array(midpoints-1).fill("")

            hex1Array.forEach((item, index) => {
                var num1 = Number("0x"+item)
                var num2 = Number("0x"+hex2Array[index])
                var step = Math.round((num1 - num2) / midpoints)
                var newColor = num1
                for (var idx = 0; idx < midpoints-1; idx++) {
                    newColor -= step
                    var partColor = newColor.toString(16)
                    newColors[idx] += partColor.length < 2 ? "0" + partColor : partColor
                }
            })  
            return newColors
        }

        /**
         * Get Card of specific row
         * @param {Number} index number of row
         * @returns style string
         */
        function getColorStyle(index){
            return {"background-color": colors.value[index]}
        }

        /**
         * Gets delimiter text based on the row number
         * @param {Number} index row number
         * @returns Delimiter text as String
         */
        function getDelimiterText(index){
            const positivePos = 0
            const neutralPos = Math.round(table.value.length / 2) - 1
            const negativePos = table.value.length - 1
            if(index == positivePos){
                return delimiters.value[0].toUpperCase()
            }else if(index == neutralPos){
                return delimiters.value[1].toUpperCase()
            }else if(index == negativePos){
                return delimiters.value[2].toUpperCase()
            }else{
                return ""
            }
        }
        /**
         * removes card from queue and choses new selected color
         */
        function removeCardFromQueue(){
            if(queue.value.length > 0){
                queue.value.splice(selectedIdx.value, 1)
                if(queue.value.length  == 0){
                    unselect()
                } else if(queue.value.length - 1 < selectedIdx.value){
                    setSelected(queue.value[--selectedIdx.value])
                }else{
                    setSelected()
                }
            }
        }
        /**
         * removes card from table and changes selected card
         */
        function removeCardFromTable(){
            var oldPos = getCardPos(selectedCardId.value)
            table.value[oldPos.row][oldPos.col] = null
            if(queue.value.length!=0){
                setSelected()
            }else{
                unselect()
            }
        }
        /**
         * Set new selected card
         * @param {Object} card Selected card
         * @param {Number} row Row of card if it has one
         * @param {Number} col Col of card if it has one
         */
        function setSelected(cardId=queue.value[selectedIdx.value], row=null, col=null){
            selectedCardId.value = cardId
            selectedRow.value = row
            selectedCol.value = col
        }
        /**
         * Checks if selected card is in queue
         * @returns returns boolean
         */
        function isSelectedInQueue(){
            return queue.value.includes(selectedCardId.value)
        }
        /**
         * Loads JSON value basd on which creates table array
         * @param {Array} table 
         * @returns Array in shape of the dataset 
         */
        function loadJsonTable(table){
            var array = Array(table.length)
            for (var idx = 0; idx < array.length; idx++) {
                array[idx] = Array(table[idx]).fill(null)                
            }
            return array
        }
        /**
         * Moves card to slot
         * @param {Number} row of slot
         * @param {Number} col of slot
         */
        function moveToSlot(row, col){
            if(!isNothingSelected() && table.value[row][col] == null){
                var tmpCardId = selectedCardId.value
                if(isSelectedInQueue()){
                    removeCardFromQueue()
                }else{
                    removeCardFromTable()
                }
                table.value[row][col] = tmpCardId
                updateBothCookies()
            }
        }
        /**
         * get card om table
         * @param {Number} row of card slot
         * @param {Number} col of card slot
         * @returns returns card iod from table
         */
        function getTableCardId(row, col){
            return table.value[row][col]
        }
        /**
         * Get pos of card on table
         * @param {String} text of card
         * @param {Number} id of card
         * @returns {dict} card pos
         */
        function getCardPos(id){
            for (var row = 0; row < table.value.length; row++) {
                for (var col = 0; col < table.value[row].length; col++) {
                    var cardId = table.value[row][col]
                    if(cardId != null && cardId == id){
                        return {'row': row, 'col': col}
                    }
                }
            }
            return {'row': null, 'col': null}
        }
        /**
         * Spaw cards in table
         * @param {Number} id of card to swap with (nonselected)
         * @param {String} text of card to swap with (nonselected)
         */
        function swapSlots(id){
            if(!isNothingSelected()){
                var card1Pos = getCardPos(id)
                var card2Pos = {col: selectedCol.value, row: selectedRow.value}
                
                
                var card1Id = getTableCardId(card1Pos.row, card1Pos.col)
                var card2Id = getTableCardId(card2Pos.row, card2Pos.col)

                table.value[card1Pos.row][card1Pos.col] = card2Id
                table.value[card2Pos.row][card2Pos.col] = card1Id
                
                
                if(queue.value.length==0){
                    unselect()
                }else{
                    setSelected()
                }
                updateBothCookies()
            }
        }
        /**
         * Check if nothing is selected
         * @returns {boolean}
         */
        function isNothingSelected(){
            return selectedCardId.value == null
        }
        /**
         * Unselects all cards
         */
        function unselect(){
            selectedCardId.value = null
        }

        /**
         * returns the value of row
         * @param {Number} idx 
         * @returns row value 
         */
        function getRowValue(idx){
            var offset = Math.round(table.value.length / 2) - 1
            return offset - idx
        }

        /**
         * returns selected card from sorting table to qeueu
         */
        function returnCardToQueue(){
            if(!isSelectedInQueue()){
                queue.value.push(selectedCardId.value)
                table.value[selectedRow.value][selectedCol.value] = null
                setSelected()
                updateBothCookies()
            }
        }


        /**
         * Clears the whole table and returns all cards to card queue
         */
        function resetTable(){
            for (var i = 0; i < table.value.length; i++) {
                for (var j = 0; j < table.value[i].length; j++) {
                    var card = table.value[i][j]
                    if(card != null){
                        queue.value.push(card)
                        table.value[i][j] = null
                    }
                }
            }
            setSelected()
            updateBothCookies()
        }

        /**
         * Returns the Sorting table in JSON format when the table is submited
         * @returns JSON String
         */
        function getResultJSON(){
            if(name.value != null){
                var sort = []
                table.value.forEach((element, index) => {
                    sort.push({
                        value: getRowValue(index),
                        cardUids: element
                    })
                })
                return JSON.stringify({
                    name: name.value,
                    uid: uid.value,
                    sort: sort
                }, null, 4) 
            }else{
                return "If this page is refreshed the data will be lost! \nYou need to submit the Q-sort again."
            }
                
        }
        return {
            name, question, delimiters, colors, selectedCardId, queue, selectedIdx, table,

            loadDataset, changeSelectedIdx, getCardText, addCardToQueue, setSelected, 
            isSelectedInQueue, moveToSlot, getTableCardId, getCardPos, swapSlots, 
            isNothingSelected, getRowValue, returnCardToQueue, resetTable, getColorStyle,
            getDelimiterText, updateBothCookies, init, getResultJSON
        }
    })
