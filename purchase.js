
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

const PurchaseLineView = Vue.defineComponent({
    props: {
        purchase_line: {
            type: Object,
            required: true
        }
    },
    components: {
        EditPurchaseLineForm,
        GoodsReceptionForm
    },
    template: `
        <div>
            <EditPurchaseLineForm :purchase_line="purchase_line" />
            <hr />
            <GoodsReceptionForm :purchase_line="purchase_line" />
        </div>
    `,
    setup() {

        return {  };
    }
});