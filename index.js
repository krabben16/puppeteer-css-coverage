const puppeteer = require("puppeteer")
const ptoi = require("puppeteer-to-istanbul")
const fs = require("fs")

function getUrlList () {
  const jsonPath = "./url.json"

  if (!fs.existsSync(jsonPath)) {
    console.log("Doesn't exist json file.")
    process.exit(1)
  }

  return JSON.parse(fs.readFileSync(jsonPath))
}

async function main () {
  // launch browser
  const browser = await puppeteer.launch()

  const page = await browser.newPage()

  await page.coverage.startCSSCoverage({
    // keep coverage after navigation
    resetOnNavigation: false
  })

  const urlList = getUrlList()
  for (let i=0; i<urlList.length; i++) {
    await page.goto(urlList[i])
  }

  const coverage = await page.coverage.stopCSSCoverage()

  // output coverage
  ptoi.write(coverage)

  // close browser
  await browser.close()
}

main()
