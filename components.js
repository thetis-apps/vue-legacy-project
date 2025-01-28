const VirtualScroller = Vue.defineComponent({
    props: {
        items: {
            type: Array,
            required: true
        },
        itemHeight: {
            type: Number,
            required: true
        },
        buffer: {
            type: Number,
            default: 5
        }
    },
    data() {
        return {
            startIndex: 0,
            endIndex: 0,
            scrollTop: 0
        };
    },
    computed: {
        visibleItems() {
            return this.items.slice(this.startIndex, this.endIndex);
        },
        totalHeight() {
            return this.items.length * this.itemHeight;
        }
    },
    watch: {
        scrollTop() {
            this.updateVisibleItems();
        }
    },
    mounted() {
        this.updateVisibleItems();
    },
    methods: {
        updateVisibleItems() {
            const visibleCount = Math.ceil(this.$refs.scroller.clientHeight / this.itemHeight);
            this.startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.buffer);
            this.endIndex = Math.min(this.items.length, this.startIndex + visibleCount + this.buffer * 2);
        },
        handleScroll(event) {
            this.scrollTop = event.target.scrollTop;
        }
    },
    template: `
        <div ref="scroller" @scroll="handleScroll" style="overflow-y: auto; height: 400px;">
            <div :style="{ height: totalHeight + 'px', position: 'relative' }">
                <div
                    v-for="(item, index) in visibleItems"
                    :key="index"
                    :style="{ position: 'absolute', top: (startIndex + index) * itemHeight + 'px', height: itemHeight + 'px', width: '100%' }"
                >
                    <slot :item="item"></slot>
                </div>
            </div>
        </div>
    `
});


const CheckboxInput = Vue.defineComponent({
    template: `
        <div style="display: flex">
            <button 
                style="width: 28px; height: 28px; border-radius: 0px; border: 1px solid gray; background: light-gray;"
                @click="toggle"
            >
                <span v-html="isActive ? '&#x2713;' : ''" style="font-size: 20px;"></span>
            </button>
            <!--
        <input type="custom-checkbox" :checked="modelValue == 1" @click="$emit('update:modelValue', $event.target.checked ? 1 : 0)" />             
            -->    
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

        const isActive = Vue.ref(props.modelValue === 1);

        const toggle = () => {
            isActive.value = !isActive.value;
            emit('update:modelValue', isActive.value ? 1 : 0);
        };

        return {
            isActive,
            toggle
        };
    }

});

const SearchInput = Vue.defineComponent({

    template: `
        <div style="display: flex; flex-direction: column;">
            <input 
                :id="id"
                type="text" 
                :value="modelValue" 
                @input="$emit('update:modelValue', $event.target.value)"
                placeholder="Søg..." 
            />             
        </div>
    `,
    props: {
        id: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        modelValue: {
            type: String,
            required: true
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
        <div ref="container" style="display: flex; flex-direction: column;">
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
            <select :id="id" @click="$emit('update:modelValue', $event.target.value)" ref="select">
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
        const select = Vue.ref(null);

        Vue.onMounted(() => {
            const result = $(select.value);
            result.select2({ dropdownParent: result.parent() });
        });

        return { id, select };
    }
});

const CustomFieldsPanel = Vue.defineComponent({
    components: {
        TextInput,
        Select2,
        NumberInput
    },
    template: `
        <div v-for="field in fields" style="display: flex; flex-direction: column; margin: 10px;">
            <TextInput v-if="field.type == 'string'" :label="field.label" v-model="field.value" />
            <Select2 v-if="field.type == 'select'" :label="field.label" v-model="field.value" :options="field.options" />
            <NumberInput v-if="field.type == 'number'" :label="field.label" v-model="field.value" />
        </div>
    `,
    props: {
        fields: {
            type: Array,
            required: true
        }
    },
    setup(props) {

        return {  };
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


