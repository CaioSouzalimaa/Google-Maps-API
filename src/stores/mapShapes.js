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
      this.shapes[index] = { ...this.shapes[index], ...newShapeData };
    },
    removeShape(index) {
      this.shapes.splice(index, 1);
    },
    clearShapes() {
      this.shapes = [];
    },
  },
});
