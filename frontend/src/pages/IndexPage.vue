<template>
  <q-page class="main-layout">
    <q-table
      title="약국정보"
      :rows="mapData"
      :columns="columns"
      row-key="name"
      :pagination="initialPagination"
      dense
      @update:pagination="pagingHandler"
    />
    <div ref="mapContainer" class="map-layout"></div>
    <!-- <pre>{{ mapData }}</pre> -->
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import mapData from 'src/json/mapData';

const columns = [
  {
    name: 'name',
    required: true,
    label: '약국이름',
    align: 'center',
    field: 'title'
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
    field: 'time'
  },
]

export default defineComponent({
  name: 'IndexPage',
  setup() {

    const initialPagination = ref({
      page: 1,
      rowsPerPage: 10
    })

    const mapContainer = ref()

    onMounted(() => {
      const mapOption = { 
          center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
          level: 9 // 지도의 확대 레벨
      };
  
      var map = new kakao.maps.Map(mapContainer.value, mapOption); // 지도를 생성합니다
    })

    const pagingHandler = (newPagination) => {
      console.log(newPagination)
    }

    return {
      mapData,
      columns,
      initialPagination,
      mapContainer,
      pagingHandler
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
