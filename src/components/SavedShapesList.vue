<template>
  <div>
    <h2>Formas Salvas</h2>
    <ul>
      <li v-for="(shape, index) in savedShapes">
        <div class="mini-map" :ref="el => initializeMiniMap(el, shape)"></div>
        <button @click="plotShape(shape)">Exibir no Mapa Principal</button>
        <button @click="deleteShape(index)">Excluir Forma</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMapShapesStore } from '@/stores/mapShapes';

const emit = defineEmits(['plot-shape']);
const mapShapesStore = useMapShapesStore();

const savedShapes = computed(() => mapShapesStore.shapes);

const initializeMiniMap = (element, shape) => {
  if (!element) return;

  const miniMap = new google.maps.Map(element, {
    center: { lat: -23.55052, lng: -46.633308 },
    zoom: 10,
    disableDefaultUI: true,
  });

  if (shape.type === 'circle') {
    miniMap.setCenter(shape.center);
    new google.maps.Circle({
      center: shape.center,
      radius: shape.radius,
      map: miniMap,
    });
  } else if (shape.type === 'polygon') {
    miniMap.setCenter(shape.path[0]);
    new google.maps.Polygon({
      path: shape.path,
      map: miniMap,
    });
  } else if (shape.type === 'rectangle') {
    const bounds = new google.maps.LatLngBounds(
      shape.bounds.southWest,
      shape.bounds.northEast
    );
    miniMap.fitBounds(bounds);
    new google.maps.Rectangle({
      bounds: bounds,
      map: miniMap,
    });
  }
};

const plotShape = (shape) => {
  emit('plot-shape', shape);
};

const deleteShape = (index) => {
  mapShapesStore.removeShape(index);
};
</script>

<style>
.mini-map {
  width: 200px;
  height: 150px;
  margin: 10px 0;
  border: 1px solid #ddd;
}
</style>
