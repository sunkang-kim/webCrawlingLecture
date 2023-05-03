import axios from "axios";

async function addressParser(data) {
  const res = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
    params: {
      query: data.address
    },
    headers: {
      Authorization: 'KakaoAK 679935ae8e67d5c7fbcf185e7df59b35'
    }
  })

  let lng, lat = 0

  if(res.data.documents.length > 0) {
    lng = res.data.documents[0].address.x
    lat = res.data.documents[0].address.y
  }

  data.lng = lng
  data.lat = lat
  
  return data

}

export { addressParser }