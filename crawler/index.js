import {
  launch,
  goto,
  checkPopup,
  evalCode,
  evalSigungu,
  closeAlert,
  getPageLength,
  getData,
  writeFile
} from './module/crawler.js'


async function main() {
  console.log('start')

  // 실행
  await launch()

  // 페이지 이동
  await goto()

  // 팝업창 닫기
  await checkPopup()

  // 지도에서 원하는 지역(시/도)으로 이동
  await evalCode('jeju')

  // 지도에서 원하는 지역(시/군/구)으로 이동
  await evalSigungu('jeju')  

  // 경고창 닫기
  await closeAlert()
  
  // 페이지의 길이 가져오기
  await getPageLength()

  // 페이지의 데이터 가져오기
  await getData()
  
  // json 파일로 만들기
  await writeFile()

  console.log('end')
}

main()