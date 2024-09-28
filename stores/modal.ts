import { defineStore } from "pinia";

import { extend } from "@vue/shared";

const component = extend({});
type VueComponent = InstanceType<typeof component>;
type PropsType = {
  [key: string]: number | string | boolean | undefined | {};
} 
export interface IModalProps {
  component: null | VueComponent;
  props?: PropsType;
  events?: Record<string, (event: any) => void>; // Events property
}

export interface IModalState {
  modalState: IModalProps;
}

const basicState = { component: null, props: {}, events: {} };

export default defineStore("modal-store", {
  state: (): IModalState => ({ modalState: basicState }),
  actions: {
    openModal(payload: IModalProps) {
      const { props, component, events } = payload;
      this.modalState = { component, props: props || {}, events: events || {} };
    },
    closeModal() {
      this.modalState = basicState;
    },
  },
  getters: {},
});