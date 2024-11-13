<template>
  <h2>Formas Salvas</h2>
  <div class="saved-shapes">
      <div class="shape" v-for="(shape, index) in savedShapes">
        <div class="mini-map" :ref="el => initializeMiniMap(el, shape)"></div>
        <div class="shape-options">
          <ButtonTools label="Exibir no mapa" @click="plotShape(shape)">
            <ShowInMap/>
          </ButtonTools>
          <ButtonTools label="Excluir" @click="deleteShape(index)">
            <DeleteShape/>
          </ButtonTools>
        </div>
      </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMapShapesStore } from '@/stores/mapShapes';
import ButtonTools from './ButtonTools.vue';
import ShowInMap from './icons/ShowInMapIcon.vue';
import DeleteShape from './icons/DeleteIcon.vue';

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

<style scoped>
.saved-shapes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.mini-map {
  width: 300px;
  height: 100%;
  border-radius: 5px 0 0 5px;
}

.shape{
  display: flex;
  border-radius: 5px;
  border: 1px solid #c4c4c4;
  background-color: #F4F4F5;
  height: 200px;
}

.shape-options{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  gap: 10px
}
</style>
