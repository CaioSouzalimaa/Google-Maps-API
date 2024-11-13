<template>
 <div class="container">
    <Tools @start-drawing="startDrawing" @save-shapes="saveShapes" @clear-map="clearMap"/>
    <div class="map" id="map" ref="map"></div>
    <SavedShapesList @plot-shape="plotShapeOnMap" @delete-shape="deleteShapeFromStore" />
 </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useMapShapesStore } from '@/stores/mapShapes';
import SavedShapesList from './SavedShapesList.vue';
import Tools from './Tools.vue';

const map = ref(null);
const mapShapesStore = useMapShapesStore();
const drawnShapes = ref([]);
const drawingManager = ref(null);

const makeMovableAndEditable = (overlay) => {
  overlay.setDraggable(true);
  overlay.setEditable(true);
  google.maps.event.addListener(overlay, 'click', () => overlay.setEditable(!overlay.getEditable()));
};

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

onMounted(() => {
  map.value = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -23.55052, lng: -46.633308 },
    zoom: 12,
  });

  drawingManager.value = new google.maps.drawing.DrawingManager({
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['circle', 'polygon', 'rectangle'],
    },
  });

  drawingManager.value.setMap(map.value);

  google.maps.event.addListener(drawingManager.value, 'overlaycomplete', (event) => {
    const shapeData = extractShapeData(event);
    const overlay = event.overlay;
    makeMovableAndEditable(overlay);
    drawnShapes.value.push({ ...shapeData, overlay: overlay });
    drawingManager.value.setDrawingMode(null);
  });
});

const startDrawing = (shapeType) => {
  clearMap();
  drawingManager.value.setDrawingMode(google.maps.drawing.OverlayType[shapeType.toUpperCase()]);
};

const saveShapes = () => {
  drawnShapes.value.forEach(shape => {
    mapShapesStore.addShape({ ...shape, overlay: undefined });
  });
  clearMap();
};

const clearMap = () => {
  drawnShapes.value.forEach(shape => {
    google.maps.event.clearInstanceListeners(shape.overlay);
    shape.overlay.setMap(null);
  });
  drawnShapes.value = [];
};

const plotShapeOnMap = (shape) => {
  clearMap();  // Limpar antes de adicionar a nova forma
  let overlay;
  if (shape.type === 'circle') {
    overlay = new google.maps.Circle({
      center: shape.center,
      radius: shape.radius,
      map: map.value,
    });
  } else if (shape.type === 'polygon') {
    overlay = new google.maps.Polygon({
      path: shape.path,
      map: map.value,
    });
  } else if (shape.type === 'rectangle') {
    const bounds = new google.maps.LatLngBounds(
      shape.bounds.southWest,
      shape.bounds.northEast
    );
    overlay = new google.maps.Rectangle({
      bounds: bounds,
      map: map.value,
    });
  }
  makeMovableAndEditable(overlay);
  drawnShapes.value.push({ overlay });
};

const deleteShapeFromStore = (index) => {
  const shape = mapShapesStore.shapes[index];
  const overlay = shape.overlay;
  if (overlay) {
    overlay.setMap(null);
  }
  mapShapesStore.removeShape(index);
};
</script>

<style>
.container{
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.map-tools{
  display: flex;
  justify-content: space-between;
}

.map {
  width: 100%;
  height: 500px;
}
</style>
