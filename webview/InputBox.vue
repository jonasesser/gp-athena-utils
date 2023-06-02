<template>
    <Frame minWidth="40vw" maxWidth="40vw">
        <template v-slot:toolbar>
            <Toolbar pageName="InputBox">
                {{ title }}
            </Toolbar>
        </template>
        <template v-slot:content>
            <div class="scroll">
                <div class="overline pb-4" v-if="options && options.description">
                    {{ options.description }}
                </div>
                <div v-for="(item, index) in menu" :key="index" class="mb-4 element">
                    <Input
                        v-if="item.type !== 'choice'"
                        :label="item.desc"
                        :stack="true"
                        :onInput="(text) => inputChange(item.id, text)"
                        :validateCallback="(valid) => validateCallback(item.id, valid)"
                        :placeholder="item.placeholder.toString()"
                        :numberOnly="item.type === 'number'"
                        :rules="[
                            (text) => {
                                return new RegExp(item.regex).test(text) ? null : item.error;
                            },
                        ]"
                        autocomplete="off"
                    />

                    <Choice
                        v-if="item.type === 'choice'"
                        :label="item.desc"
                        :stack="true"
                        :onInput="(text) => inputChange(item.id, text)"
                        :validateCallback="(valid) => validateCallback(item.id, valid)"
                        :placeholder="item.placeholder.toString()"
                        :options="item.choices"
                        :rules="[
                            (text) => {
                                return new RegExp(item.regex).test(text) ? null : item.error;
                            },
                        ]"
                        autocomplete="off"
                    />
                </div>
                <div class="split split-full space-between pt-4">
                    <Button
                        color="red"
                        @click="handleExit"
                        class="red--text flex-grow-1 outline-round mr-2 fill-full-width"
                        >{{ getCancelText }}</Button
                    >

                    <template v-if="allValid || options.skipChecks">
                        <Button
                            color="green"
                            @click="submit"
                            class="green--text flex-grow-1 outline-round ml-2 fill-full-width"
                            >{{ getSubmitText }}</Button
                        >
                    </template>
                    <template v-else>
                        <Button
                            :disable="true"
                            color="green"
                            class="grey--text flex-grow-1 outline-round ml-2 fill-full-width"
                            >{{ getSubmitText }}</Button
                        >
                    </template>
                </div>
            </div>
        </template>
    </Frame>
</template>

<script lang="ts">
import WebViewEvents from '@ViewUtility/webViewEvents';
import { defineComponent, defineAsyncComponent } from 'vue';
import TestData from './utility/testData';
import { View_Events_Input_Menu } from '../shared/events';

export const ComponentName = View_Events_Input_Menu.InputBoxPageName;
export default defineComponent({
    name: ComponentName,
    components: {
        Button: defineAsyncComponent(() => import('@components/Button.vue')),
        Frame: defineAsyncComponent(() => import('@components/Frame.vue')),
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
        Toolbar: defineAsyncComponent(() => import('@components/Toolbar.vue')),
        Input: defineAsyncComponent(() => import('@components/Input.vue')),
        Choice: defineAsyncComponent(() => import('@components/Choice.vue')),
    },
    props: {
        emit: Function,
    },
    data() {
        return {
            title: 'Input Menu',
            menu: [],
            model: {},
            valid: {},
            options: {
                description: null,
                submitText: 'Submit',
                cancelText: 'Cancel',
                skipChecks: false,
            },
            allValid: false,
        };
    },
    computed: {
        getSubmitText() {
            return this.options.submitText;
        },
        getCancelText() {
            return this.options.cancelText;
        },
    },
    methods: {
        inputChange(id: string, value: string) {
            this.model[id] = value;
        },
        validateCallback(id: string, isValid: boolean) {
            this.valid[id] = isValid;

            let allValidData = true;
            Object.keys(this.valid).forEach((key) => {
                if (!this.valid[key]) {
                    allValidData = false;
                    return;
                }
            });

            this.allValid = allValidData;
        },
        setMenu(title: string, menuData: Array<{ id: string }>, menuOptions: Object) {
            this.title = title;

            for (let i = 0; i < menuData.length; i++) {
                this.model[menuData[i].id] = '';
                this.valid[menuData[i].id] = false;
            }

            const oldModel = { ...this.model };
            const oldValid = { ...this.valid };

            this.valid = oldValid;
            this.oldModel = oldModel;
            this.menu = menuData;

            if (menuOptions && typeof menuOptions === 'object') {
                Object.keys(menuOptions).forEach((key) => {
                    this.options[key] = menuOptions[key];
                });
            }
        },
        handleExit() {
            WebViewEvents.emitClose();
        },
        submit() {
            const results = [];
            if (!this.skipChecks) {
                const menuState = [...this.menu];
                for (let i = 0; i < menuState.length; i++) {
                    results.push({ id: menuState[i].id, value: this.model[menuState[i].id] });
                }
            }

            WebViewEvents.emitClient(View_Events_Input_Menu.Submit, results);
        },
    },
    mounted() {
        WebViewEvents.on(View_Events_Input_Menu.SetMenu, this.setMenu);
        WebViewEvents.emitReady(ComponentName);

        // Add Keybinds for In-Menu
        document.addEventListener('keyup', this.handlePress);

        if ('alt' in window) {
        } else {
            this.setMenu('Generic Example', TestData, { description: 'Hello, what the chicken...' });
        }
    },
    unmounted() {
        // Remove Keybinds for In-Menu
        document.removeEventListener('keyup', this.handlePress);
    },
});
</script>

<style scoped>
.scroll {
    height: auto;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
