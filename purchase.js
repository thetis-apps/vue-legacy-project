



const GoodsReceptionForm = Vue.defineComponent({
    props: {
        purchase_line: {
            type: Object,
            required: true
        }
    },
    components: {
        InvocationForm,
        TextInput,
        NumberInput,
        CheckboxInput,
        Select2,
        CustomFieldsPanel
    },
    template: `
        <InvocationForm @submit="submit">
            <CheckboxInput
                style="width: 20em;"
                label="Returner"
                v-model="parameters.negative"
            />
            <CheckboxInput
                v-if="parameters.negative === 0"
                style="width: 20em;"
                label="Modtag rest"
                v-model="receive_remainder"
            />
            <CheckboxInput
                v-if="parameters.negative === 0"
                style="width: 20em;"
                label="Endelig"
                v-model="parameters.final"
            />
            <NumberInput
                style="width: 20em;"
                :label="parameters.negative === 1 ? 'Returner nu' : 'Modtag nu'"    
                v-model="parameters.recv_f"
                :disabled="receive_remainder === 1"
            />
            <Select2
                v-if="parameters.negative === 0"
                style="width: 20em;"
                label="Lagersted"
                v-model="parameters.stockloc_id"
                :options="locations"
            />
            <TextInput
                v-if="parameters.negative === 0"
                style="width: 20em;"
                label="Batchnavn"
                v-model="parameters.batch_name"
            />    
            <CustomFieldsPanel :fields="custom_fields" />
        </InvocationForm>
    `,
    setup(props) {

        const locations = Vue.ref([ { value: 1, text: "Lagersted 1" }, { value: 2, text: "Lagersted 2" }, { value: 3, text: "Lagersted 3" } ]);

        const parameters = Vue.reactive({ final: 0, recv_f: 0, negative: 0, stockloc_id: null, batch_name: '' });

        const custom_fields = Vue.reactive([
            { label: "Custom field 1", type: "string", value: "My value" },
            { label: "Custom field 2", type: "select", value: "", options: [ { value: 1, text: "Option 1" }, { value: 2, text: "Option 2" } ] },
            { label: "Custom field 3", type: "number", value: 117 }
        ]);

        const receive_remainder = Vue.ref(0);
        Vue.watch(receive_remainder, (value) => parameters.recv_f = value === 1 ? props.purchase_line.missing_f : 0);

        const submit = () => {
            console.log("Submit goods receipt", goods_receipt);
        }

        return { parameters, receive_remainder, submit, locations, custom_fields };
    }
});


const EditPurchaseLineForm = Vue.defineComponent({
    props: {
        purchase_line: {
            type: Object,
            required: true
        }
    },
    components: {
        EditForm,
        TextInput, 
        NumberInput,
        CheckboxInput,
        Select2
    },
    template: `
        <EditForm @submit="submit">
            <text-input 
                style="width: 20em;"
                label="Supplier number" 
                v-model="purchase_line.supplier_number"
                tooltip_id="251225"
                placeholder="Samme som intern"
                :disabled="purchase_line.locked === 1"
            />
            <text-input 
                style="width: 20em;"
                label="Varenavn" 
                v-model="purchase_line.name" 
                :disabled="purchase_line.locked === 1"
            />
            <checkbox-input
                style="width: 20em;"
                label="Afsluttet"
                v-model="purchase_line.locked"
            />
            <select2
                v-if="!purchase_line.locked"
                style="width: 20em;"
                label="Valutakode"
                v-model="purchase_line.currency_id"
                :options="currencies"
            />
            
        </EditForm>
    `,
    setup(props) {

        const currencies = Vue.ref([ { value: "DKK", text: "DKK" }, { value: "USD", text: "USD" }, { value: "EUR", text: "EUR" } ]);

        const submit = () => {
            console.log("Submit purchase line", props.purchase_line);
        }

        return { currencies, submit };
    }
});

const NumberInputCell = Vue.defineComponent({
    props: {
        modelValue: {
            type: Number,
            required: true
        }
    },
    template: `
        <input 
            type="number" 
            :value="modelValue" 
            @input="$emit('update:modelValue', Number($event.target.value))" 
            style="width: 5em; text-align: right;"
        />
    `,
    setup() {
        
        return {  };
    }
});


const GoodsReceptionTableForm = Vue.defineComponent({
    components: {
        SearchInput,
        NumberInputCell,
        VirtualScroller
    },
    template: `
        <div v-if="in_progress" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.5); z-index: 100;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Modtager varer - vent venligst...</div>
        </div>
        <form @submit.prevent="submit">
            <div>
                <SearchInput 
                    v-model="search_expression"  
                    label="Søg" 
                    id="search"
                    style="width: 20em;"
                />
            </div>
            <div style="overflow-y: scroll; height: 60px;">
                <VirtualScroller
                    :items="filtered_lines"
                    :itemHeight="30"
                >
                    <template #default="{ item }">
                        <div style="display: flex; flex-direction: row;">
                            <div style="width: 10em;">{{ item.item_number }}</div>
                            <div style="width: 20em;">{{ item.item_name }}</div>
                            <div style="width: 10em; text-align: right;">{{ item.quantity_received }}</div>
                            <div style="width: 12em; text-align: right;"> 
                                <NumberInputCell v-model="item.quantity" min="0.00" step="0.01" />
                            </div>
                        </tr>
                    </template>

                </VirtualScroller>
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    `,
    props: {
        purchase_lines: {
            type: Array,
            required: true
        }
    },
    setup(props) {

        const search_expression = Vue.ref('');

        const in_progress = Vue.ref(false);

        const lines = Vue.reactive([]);
        for (const purchase_line of props.purchase_lines) {
            lines.push({ ...purchase_line, quantity: 0 });
        }

        /**
         * Filtered lines computed property. Uses search expression to filter lines. 
         * Simple scoring system is used to sort the lines.
         */
        const filtered_lines = Vue.computed(() => {
            return lines
                .map((line) => {
                    let score = line.item_number.includes(search_expression.value) ? 2 : 0;
                    score = line.item_name.includes(search_expression.value) ? score + 1 : score;
                    return ({ ...line, score })
                })
                .filter((line) => line.score > 0)
                .sort((a, b) => b.score - a.score);
        }); 

        const submit = async () => {
            in_progress.value = true;
            const lines_to_receive = filtered_lines.value.filter((line) => line.quantity > 0);
            for (const line of lines_to_receive) {
                const { quantity, purchase_line_id } = line;
                const goods_receipt_parameters = { quantity, purchase_line_id };
                console.log("Submit goods receipt", goods_receipt_parameters);

                await new Promise((resolve) => setTimeout(resolve, 1000));

                lines.filter((line) => line.purchase_line_id === purchase_line_id)[0].quantity_received += quantity;
            }
            in_progress.value = false;
        }

        return { search_expression, submit, filtered_lines, in_progress };
    }
});

const sanitizeData = (data) => {    
    for (const datum of data) {
        for (const key in datum) {
            if (key.endsWith('_f') || key.endsWith('_cy')) {
                datum[key] = Number(datum[key]);
            }
            if (key.endsWith('_id') && datum[key] === '0') {
                datum[key] = null;
            }
        }
    }
}

const PurchaseLineView = Vue.defineComponent({
    props: {
        purchase_line: {
            type: Object,
            required: true
        }
    },
    components: {
        EditPurchaseLineForm,
        GoodsReceptionForm,
        GoodsReceptionTableForm
    },
    template: `
        <div>
            <EditPurchaseLineForm :purchase_line="purchase_line" />
            <hr />
            <GoodsReceptionForm :purchase_line="purchase_line" />
        </div>
        <GoodsReceptionTableForm 
            :purchase_lines="[ 
                { purchase_line_id: 867876, item_number: '4711', item_name: '4712 Pulimut', quantity_received: 0 },
                { purchase_line_id: 867877, item_number: '4712', item_name: '4713 Hytlihy', quantity_received: 0 },
                { purchase_line_id: 867878, item_number: '4713', item_name: 'Kulimut', quantity_received: 0 },
                { purchase_line_id: 867879, item_number: '4714', item_name: 'Mutlykru', quantity_received: 0 },
            ]" 
        />
    `,
    setup() {

        return {  };
    }
});

