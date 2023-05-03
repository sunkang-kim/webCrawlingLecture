import puppeteer from "puppeteer-core";
import os from "os";
import fs from "fs";
import { addressParser } from "./parser.js";

// chrome 실행 경로
const winUrl =
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
const macUrl = "/Applications/Google Crome.app/Content/MacOS/Google Chrome";

const currentOs = os.type();

const launchConfig = {
  headless: false,
  defaultViewport: null,
  ignoreDefaultArgs: ["--disable-extensions"],
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-notifications",
    "--disable-extensions",
  ],
  executablePath: currentOs == "Darwin" ? macUrl : winUrl,
};

// 전역 변수 설정
let browser;
let page;
let pageNum;
let sido;
let sigungu;
let finalData = [];
const pagingSelector =
  "body > table:nth-child(2) > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(5) > td > table:nth-child(5) > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(3)";

const launch = async () => {
  browser = await puppeteer.launch(launchConfig);
  const pages = await browser.pages();
  //console.log(pages.length)
  page = pages[0];
};

// 페이지 이동
const goto = async () => {
  await page.goto("https://www.pharm114.or.kr/main.asp");
};

// 팝업창 닫기
const checkPopup = async function () {
  const pages = await browser.pages();
  //console.log(pages.length, '닫기 전')
  await pages.at(-1).close();
  //console.log(pages.length, '닫은 후')
};

// 지도에서 원하는 지역(시/도)으로 이동
const evalCode = async (sidoCode) => {
  sido = sidoCode;
  await page.evaluate((sido) => {
    const selector = `#continents > li.${sido} > a`;
    document.querySelector(selector).click();
  }, sido);
};

// 지도에서 원하는 지역(시/군/구)으로 이동
const evalSigungu = async (sigunguCode) => {
  sigungu = sigunguCode;
  const selector = `#continents > li.${sigungu} > a`;
  // 해당 페이지에서 해당 document가 로드 될 때까지 기다리는 함수
  await page.waitForSelector(selector);

  await page.evaluate((selector) => {
    document.querySelector(selector).click();
  }, selector);
};

// 경고창 닫기
const closeAlert = async () => {
  await page.on("dialog", async function (dialog) {
    await dialog.accept();
  });
};

// 페이지의 길이 가져오기
const getPageLength = async () => {
  // 해당 페이지에서 해당 document가 로드 될 때까지 기다리는 함수
  await page.waitForSelector(pagingSelector);

  pageNum = await page.evaluate((pagingSelector) => {
    const pageLength = document.querySelector(pagingSelector).children.length;
    return pageLength;
  }, pagingSelector);

  console.log("pageNum:", pageNum);
};

// 페이지의 데이터 가져오기
const getData = async () => {
  for (let i = 0; i < pageNum; i++) {
    await page.waitForSelector(pagingSelector);
    const info = await page.evaluate(() => {
      var trArr = Array.from(
        document.querySelectorAll("#printZone > table:nth-child(2) > tbody tr")
      );
      var data = trArr
        .map((el) => {
          //debugger
          return {
            title: el.querySelectorAll("td")[0]?.innerText,
            address: el
              .querySelector(".class_addr")
              ?.innerText.replaceAll("\t", "")
              .replaceAll("\n", ""),
            tel: el.querySelectorAll("td")[3]?.innerText,
            time: el.querySelectorAll("td")[4]?.innerText,
          };
        })
        .filter((val) => val.address != undefined);

      return data;
    });

    finalData = finalData.concat(info);

    console.log("finalData:", finalData.length);

    if (pageNum != i) {
      await page.evaluate(
        (pagingSelector, i) => {
          document.querySelector(pagingSelector).children[i].click();
        },
        pagingSelector,
        i
      );

      await page.waitForSelector("#printZone");
    }
  }
  browser.close();
};

// json 파일로 만들기
const writeFile = async () => {
  // for (let i = 0; i < finalData.length; i++) {
  //   // 좌표 변환 하나당 1초
  //   finalData[i] = await addressParser(finalData[i]);
  // }

  const promiseArr = finalData.map((data) => addressParser(data));

  try {
    finalData = await Promise.all(promiseArr)
  
    const dirPath = `./json/${sido}`;
    const filePath = `${dirPath}/${sigungu}.json`;
    const exist = fs.existsSync(dirPath);
  
    if (!exist) {
      fs.mkdir(dirPath, { recursive: true }, (err) => {
        console.log(err);
      });
    }
    fs.writeFileSync(filePath, JSON.stringify(finalData));
    
  } catch(e) {

  }
};

export {
  launch,
  goto,
  checkPopup,
  evalCode,
  evalSigungu,
  closeAlert,
  getPageLength,
  getData,
  writeFile,
};
