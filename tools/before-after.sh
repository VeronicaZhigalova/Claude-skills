#!/bin/sh
# Использование: tools/before-after.sh <url> <label>   (label: before | after)
# Снимает десктоп 1440 и мобайл 390 полной страницей в shots/<label>-*.png для сравнения пар.
URL=$1; L=${2:-before}; mkdir -p shots
node -e '
const {chromium}=require("playwright-core");(async()=>{const b=await chromium.launch({headless:false,executablePath:process.env.CHROME||"/opt/pw-browsers/chromium",args:["--headless=new","--use-gl=swiftshader","--enable-unsafe-swiftshader"]});
for(const [w,h,t] of [[1440,900,"d"],[390,844,"m"]]){const p=await b.newPage({viewport:{width:w,height:h}});await p.goto(process.argv[1]);await p.waitForTimeout(5000);
await p.screenshot({path:`shots/${process.argv[2]}-${t}.png`,fullPage:true,timeout:180000});await p.close();}await b.close();})();' "$URL" "$L"
