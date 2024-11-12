<template>
  <div id="map" ref="map" style="width: 100%; height: 500px;"></div>
  <button @click="saveShapes">Salvar Formas</button>
  <button @click="clearMap">Limpar Mapa</button>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useMapShapesStore } from '@/stores/mapShapes';

const map = ref(null);
const mapShapesStore = useMapShapesStore();
const drawnShapes = ref([]);

const makeMovableAndEditable = (overlay) => {
  overlay.setDraggable(true);
  overlay.setEditable(true);
  google.maps.event.addListener(overlay, 'click', () => overlay.setEditable(!overlay.getEditable()));
};

onMounted(() => {
  map.value = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -23.55052, lng: -46.633308 },
    zoom: 12,
  });

  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['circle', 'polygon', 'rectangle'],
    },
  });
  drawingManager.setMap(map.value);

  google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
    const shapeData = extractShapeData(event);
    makeMovableAndEditable(event.overlay);
    drawnShapes.value.push({ ...shapeData, overlay: event.overlay });
    drawingManager.setDrawingMode(null);
  });

  const extractShapeData = (event) => {
    if (event.type === 'circle') {
      return { type: 'circle', center: event.overlay.getCenter().toJSON(), radius: event.overlay.getRadius() };
    } else if (event.type === 'polygon') {
      return { type: 'polygon', path: event.overlay.getPath().getArray().map(point => point.toJSON()) };
    } else if (event.type === 'rectangle') {
      const bounds = event.overlay.getBounds();
      return {
        type: 'rectangle',
        bounds: {
          northEast: bounds.getNorthEast().toJSON(),
          southWest: bounds.getSouthWest().toJSON(),
        },
      };
    }
    return null;
  };
});

const saveShapes = () => {
  drawnShapes.value.forEach(shape => {
    mapShapesStore.addShape({ ...shape, overlay: undefined });
  });
  clearMap();
};

const clearMap = () => {
  drawnShapes.value.forEach(shape => shape.overlay.setMap(null));
  drawnShapes.value = [];
};

</script>

<style>
#map {
  width: 100%;
  height: 500px;
}
</style>
