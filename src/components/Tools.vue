<template>
  <div class="tools">
    <div class="tools-header">
      <p>Ferramentas de Demarcação do Contorno</p>
    </div>
    <div class="tools-options">
      <ButtonTools label="Círculo" @click="startDrawing('circle')" >
        <CircleIcon/>
      </ButtonTools>
      <ButtonTools label="Retângulo" @click="startDrawing('rectangle')" >
        <RectangleIcon/>
      </ButtonTools>
      <ButtonTools label="Livre" @click="startDrawing('polygon')" >
        <FreeIcon/>
      </ButtonTools>
      <ButtonTools label="Salvar" @click="saveShapes">
        <SaveIcon/>
      </ButtonTools>
      <ButtonTools label="Limpar" @click="clearMap">
        <ClearIcon/>
      </ButtonTools>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import ButtonTools from './ButtonTools.vue'
import FreeIcon from './icons/FreeIcon.vue'
import CircleIcon from './icons/CircleIcon.vue'
import RectangleIcon from './icons/RectangleIcon.vue'
import SaveIcon from './icons/SaveIcon.vue'
import ClearIcon from './icons/ClearIcon.vue'

const emit = defineEmits(['start-drawing', 'save-shapes', 'clear-map']);

const startDrawing = (shapeType) => {
  emit('start-drawing', shapeType);
};

const saveShapes = () => {
  emit('save-shapes');
};

const clearMap = () => {
  emit('clear-map');
};
</script>

<style scoped>
.tools{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
}

.tools-header {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #F4F4F5;
  border: 1px solid #c4c4c4;
  border-radius: 5px 5px 0 0;
}

.tools-options {
  display: flex;
  padding: 10px 0;
  flex-direction: row;
  gap: 10px;
}
</style>
