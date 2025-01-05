
const CheckboxInput = Vue.defineComponent({

    template: `
        <div class="newcheckbox" style="display: flex">
            <input type="checkbox" :checked="modelValue == 1" @click="$emit('update:modelValue', $event.target.checked ? 1 : 0)" />             
            <div>
                <label>{{ label }}</label>
                <img v-if="tooltip_id" class="tooltip" src="./imgs/question.png" style="width: 14px; font-size: 10px;" :id="tooltip_id" alt="Tooltip">
            </div>                
        </div>
    `,
    props: {
        label: {
            type: String,
            required: true
        },
        modelValue: {
            type: Number,
            required: true
        },
        tooltip_id: {
            type: String,
            required: false,
            default: ''
        }
    },
    setup(props) {

        return {  };
    }

});

const TextInput = Vue.defineComponent({
    template: `
        <div style="display: flex; flex-direction: column;">
            <div>
                <label>{{ label }}</label>
                <img v-if="tooltip_id" class="tooltip" src="./imgs/question.png" style="width: 14px; font-size: 10px;" :id="tooltip_id" alt="Tooltip">
            </div>                
            <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                :placeholder="placeholder" :disabled="disabled" />             
        </div>
    `,
    props: {
        label: {
            type: String,
            required: true
        },
        modelValue: {
            type: String,
            required: true
        },
        tooltip_id: {
            type: String,
            required: false,
            default: ''
        },
        placeholder: {
            type: String,
            required: false,
            default: ''
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    setup(props) {

        return {  };
    }
});

const NumberInput = Vue.defineComponent({
    template: `
        <div style="display: flex; flex-direction: column;">
            <div>
                <label>{{ label }}</label>
                <img v-if="tooltip_id" class="tooltip" src="./imgs/question.png" style="width: 14px; font-size: 10px;" :id="tooltip_id" alt="Tooltip">
            </div>                
            <input type="number" :value="modelValue" @input="$emit('update:modelValue', Number($event.target.value))"
                :placeholder="placeholder" :disabled="disabled" />             
        </div>
    `,
    props: {
        label: {
            type: String,
            required: true
        },
        modelValue: {
            type: Number,
            required: true
        },
        tooltip_id: {
            type: String,
            required: false,
            default: ''
        },
        placeholder: {
            type: String,
            required: false,
            default: ''
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    setup(props) {

        return {  };
    }
});

const SubmitButton = Vue.defineComponent({
    emits: ['click'],
    template: `
        <input type="submit" @click="$emit('click')" :value="label" />
    `,
    props: {
        label: {
            type: String,
            required: true
        }
    },
    setup(props) {

        return {  };
    }
});

const Select2 = Vue.defineComponent({
    template: `
        <div style="display: flex; flex-direction: column;">
            <div>
                <label>{{ label }}</label>
                <img v-if="tooltip_id" class="tooltip" src="./imgs/question.png" style="width: 14px; font-size: 10px;" :id="tooltip_id" alt="Tooltip">
            </div>                
            <select :id="id" @click="$emit('update:modelValue', $event.target.value)">
                <option v-for="option in options" :selected="option.value == modelValue">{{ option.text }}</option>
            </select>
        </div>    
    `,
    props: {
        options: {
            type: Array,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        modelValue: {
            type: String,
            required: false
        },
        tooltip_id: {
            type: String,
            required: false,
            default: ''
        },
        configuration: {
            type: Object,
            required: false,
            default: () => ({})
        },
    },
    setup(props) {
        const id = 'select2-' + Math.random().toString(36);
        onMounted = () => $('#' + id).select2(props.configuration);
        return { id };
    }
});

const EditForm = Vue.defineComponent({
    components: {
        SubmitButton
    },
    emits: ['submit'],
    template: `
        <form @submit.prevent="$emit('submit')">
            <div style="display: flex; flex-wrap: wrap;">
                <slot></slot>
            </div>
            <submit-button label="Gem" />
        </form>
    `,
});

const InvocationForm = Vue.defineComponent({
    components: {
        SubmitButton
    },
    emits: ['submit'],
    template: `
        <form @submit.prevent="$emit('submit')">
            <div style="display: flex; flex-wrap: wrap;">
                <slot></slot>
            </div>
            <submit-button label="Udfør" />
        </form>
    `,
});

