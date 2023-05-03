<template>
  <q-page class="main-layout">
    <q-table 
      v-model:selected="selected"
      title="약국정보"
      :rows="mapData"
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

// 마커 이미지의 이미지 주소입니다
var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 

export default defineComponent({
  name: 'IndexPage',
  setup() {

    const initialPagination = ref({
      page: 1,
      rowsPerPage: 10
    })

    const mapContainer = ref()
    const selected = ref([])
    let map
    let markers = []
    let mapInit = false

    onMounted(() => {
      const mapOption = { 
          center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
          level: 9 // 지도의 확대 레벨
      };
      map = new kakao.maps.Map(mapContainer.value, mapOption); // 지도를 생성합니다
      mapInit = true
    })

    const pagingHandler = (newPagination) => {
      // console.log(newPagination)
      initialPagination.value = newPagination
      const { page, rowsPerPage } = newPagination
      // const page = newPagination.page
      // const rowsPerPage = newPagination.rowsPerPage 와 같다

      const start = (page - 1) * rowsPerPage
      const end = page * rowsPerPage
      // console.log(mapData)

      const currentData = mapData.slice(start, end)

      const positions = currentData.map(data => {
        return {
          title: data.title,
          latlng: new kakao.maps.LatLng(Number(data.lat), Number(data.lng))
        }
      })

      // 마커 초기화
      markers.forEach(marker => marker.setMap(null))

      const timeoutTime = !mapInit ? 500 : 0

      setTimeout(() => {
        markers = positions.map(position => {
          // 마커 이미지의 이미지 크기 입니다
          const imageSize = new kakao.maps.Size(24, 35); 
          
          // 마커 이미지를 생성합니다    
          const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 
          
          // 마커를 생성합니다
          const marker = new kakao.maps.Marker({
              map: map, // 마커를 표시할 지도
              position: position.latlng, // 마커를 표시할 위치
              title : position.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
              image : markerImage // 마커 이미지 
          })
          return marker
        })
      }, timeoutTime)
      console.log(positions)
    }

    const rowClick = (evt, row, index) => {
      selected.value = [row]
      const { lat, lng } = row
      
      // 이동할 위도 경도 위치를 생성합니다 
      const moveLatLon = new kakao.maps.LatLng(Number(lat), Number(lng));
      // 지도 레벨 변경
      map.setLevel(3);
      // 지도 중심을 부드럽게 이동시킵니다
      // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
      map.panTo(moveLatLon);
    }

    return {
      mapData,
      columns,
      initialPagination,
      mapContainer,
      pagingHandler,
      rowClick,
      selected
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
