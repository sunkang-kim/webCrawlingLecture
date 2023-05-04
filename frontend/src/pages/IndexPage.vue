<template>
  <q-page class="main-layout">
    <q-table 
      v-model:selected="selected"
      title="약국정보"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :pagination="initialPagination"
      dense
      @update:pagination="pagingHandler"
      @row-click="rowClick"
    />
    <div ref="mapContainer" class="map-layout"></div>
    <!-- <pre>{{ mapData }}</pre> -->
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useMap } from 'src/composable/map'

const columns = [
  {
    name: 'name',
    required: true,
    label: '약국이름',
    align: 'center',
    field: 'name'
  },
  {
    name: 'address',
    required: true,
    label: '주소',
    align: 'center',
    field: 'address'
  },
  {
    name: 'tel',
    required: true,
    label: '전화번호',
    align: 'center',
    field: 'tel'
  },
  {
    name: 'time',
    required: true,
    label: '운영시간',
    align: 'center',
    field: 'run_time'
  },
  {
    name: 'count',
    required: true,
    label: '조회수',
    align: 'center',
    field: 'count',
    format: val => !val ? 0 : val
  },
]



export default defineComponent({
  name: 'IndexPage',
  setup() {
    const { 
      rows,
      initialPagination,
      mapContainer,
      pagingHandler,
      rowClick,
      selected,    
    } = useMap()

    return {
      columns,
      initialPagination,
      mapContainer,
      pagingHandler,
      rowClick,
      selected,
      rows
    }
  }
})
</script>
<style lang="scss" scoped>
  .main-layout {
    padding: 16px;
  }

  .map-layout {
    width: 100%;
    height: 40vh;
  }
</style>
