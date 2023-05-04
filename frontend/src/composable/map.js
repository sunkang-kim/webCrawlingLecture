import { ref, onMounted } from "vue"
import { db } from "src/boot/firebase"
import { ref as dbRef, onValue, update } from "firebase/database"
import { Loading } from "quasar";

// 마커 이미지의 이미지 주소입니다
const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 


export function useMap() {
  const rows = ref([ ])
  const initialPagination = ref({
    page: 1,
    rowsPerPage: 10
  })
  
  const mapContainer = ref()
  const selected = ref([])
  
  let map
  let markers = []
  let mapInit = false

  Loading.show()

  onMounted(() => {
    const mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 9 // 지도의 확대 레벨
    };
    map = new kakao.maps.Map(mapContainer.value, mapOption); // 지도를 생성합니다
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
    // console.log(positions)
    createMarker(start, end)
  }

  const createMarker = (start, end) => {
    const currentData = rows.value.slice(start, end)
    const positions = currentData.map(data => {
      return {
        title: data.title,
        latlng: new kakao.maps.LatLng(Number(data.lat), Number(data.lng))
      }
    })

    // 마커 초기화
    markers.forEach(marker => marker.setMap(null))

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
  }

  const rowClick = (evt, row, index) => {
    console.log(row.id)
    selected.value = [row]
    const { lat, lng } = row
    
    // 이동할 위도 경도 위치를 생성합니다 
    const moveLatLon = new kakao.maps.LatLng(Number(lat), Number(lng));
    // 지도 레벨 변경
    map.setLevel(3);
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);

    const { id, count } = row
    const refPath = `map/${id}`
    const updateValue = count ? count +1 : 1
    console.log(updateValue)
    update(dbRef(db, refPath), {
      count: updateValue
    })
  }

  // 지도 데이터
  const mapRef = dbRef(db, 'map')
  onValue(mapRef, (snapshot) => {
    const data = snapshot.val()
    rows.value = Object.entries(data).map(data => data[1])
    // console.log(data)
    if(!mapInit) {
      const { page, rowsPerPage } = initialPagination.value
      const start = (page - 1) * rowsPerPage
      const end = page * rowsPerPage
      createMarker(start,end)
      mapInit = true
      Loading.hide()
    }
  })

  return {
    rows,
    initialPagination,
    mapContainer,
    pagingHandler,
    rowClick,
    selected,
  }
};