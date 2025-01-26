



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
            @input="$emit('update:modelValue', $event.target.value)" 
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
        NumberInputCell
    },
    template: `
        <form @submit.prevent="submit">
            <div>
                <SearchInput 
                    v-model="search_expression"  
                    label="Søg" 
                    id="search"
                    style="width: 20em;"
                />
            </div>
            <div style="overflow-y: scroll; height: 100px;">
                <table>
                    <thead>
                        <tr>
                            <th>Leverandørnummer</th>
                            <th>Varenavn</th>
                            <th>Antal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="line in filtered_lines">
                            <td>{{ line.supplier_number }}</td>
                            <td>{{ line.item_name }}</td>
                            <td>
                                <NumberInputCell v-model="line.quantity" min="0.00" step="0.01" />
                            </td>
                        </tr>
                    </tbody>
                </table>
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

        const lines = [];
        for (const purchase_line of props.purchase_lines) {
            lines.push({ ...purchase_line, quantity: 0 });
        }

        const filtered_lines = Vue.computed(() => {
            return lines.filter((line) => {
                return (
                    line.supplier_number.includes(search_expression.value) ||
                    line.item_name.includes(search_expression.value)
                );
            });
        }); 

        const submit = () => {
            for (const line of filtered_lines.value) {
                console.log("Submit goods receipt", line.quantity);
            }
        }

        return { search_expression, submit, filtered_lines };
    }
});

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
                { purchase_line_id: 867876, supplier_number: '4711', item_name: 'Pulimut' },
                { purchase_line_id: 867877, supplier_number: '4712', item_name: 'Hytlihy'},
                { purchase_line_id: 867878, supplier_number: '4713', item_name: 'Kulimut'},
                { purchase_line_id: 867879, supplier_number: '4711', item_name: 'Mutlykru' },
            ]" />
    `,
    setup() {

        return {  };
    }
});

