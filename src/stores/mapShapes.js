// src/store/mapShapes.js
import { defineStore } from 'pinia';

export const useMapShapesStore = defineStore('mapShapes', {
  state: () => ({
    shapes: [],
  }),
  actions: {
    addShape(shape) {
      this.shapes.push(shape);
    },
    updateShape(index, newShapeData) {
      this.shapes[index] = newShapeData;
    },
    clearShapes() {
      this.shapes = [];
    },
    removeAllShapes() {
      this.shapes = [];
    },
  },
});
