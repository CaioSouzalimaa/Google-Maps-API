<template>
  <div class="button-container">
    <button @click="handleClick">
    <slot></slot>
  </button>
  <p>{{ label }}</p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['click']);

const handleClick = (event) => {
  emit('click', event);
};
</script>

<style scoped>

.button-container button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 45px;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  background-color: #F4F4F5;
  cursor: pointer;
}

.button-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.button-container p{
  margin: 0;
  font-size: 12px;
  color: #71717A;
  }
</style>
