import dotenv from "dotenv";
import dbConnect from "./db/dbConnect.js";
import puppeteer, { Browser } from "puppeteer";
import fs from "fs"
import {RbiData} from './models/rbiMontlyData.model.js'; // Assuming your model is exported from this path

dotenv.config({ path: "./env" });

dbConnect()
  .then(() =>
    console.log("DB connected and ready to get RBI data")
  )
  .catch((err) => console.log("MongoDB Connection Failed:  ", err));


// Task 1 --> Basic fething
// (async () => {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     // Navigate to the URL
//     await page.goto('https://harmonyhub.freewebhostmost.com/',{ waitUntil: 'networkidle2' });

//     //Page Details
//     const title = await page.title()
//     // const description = await page.$eval("meta[name=description]", (e)=>{
//     //     e.textContent
//     // })
    
//     // Scrape images
//     const images = await page.$$eval("img", (imgs) => {
//         return imgs.map((img) => ({
//             src: img.src,
//             alt: img.alt
//         }));
//     });

//     // Scrape links
//     const links = await page.$$eval("a", (lnks) => {
//         return lnks.map((link) => ({
//             href: link.href,
//             textContent: link.textContent.trim() // .trim() to clean up whitespace
//         }));
//     });

//     // Get counts
//     const imagesCount = images.length;
//     const linksCount = links.length;

//     // Log results
//     console.log(JSON.stringify({
//         title,
//         images,
       
//         imagesCount,
//         links,
//         linksCount
//     }, null, 2));

//     // Close the browser
//     await browser.close();
// })();


// Task 2 --> RBI DATA Fetching
// (async () => {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
    
    
//     await page.goto('https://www.rbi.org.in/Scripts/BS_ViewSpeeches.aspx', { waitUntil: 'networkidle0' });

//     const pdfLinksArray = await page.$$eval(`td[colspan="3"] a`, (anchorElements) => {
//         console.log(anchorElements)
//         return anchorElements.map(anchor => anchor.href); 
//     });

//     const date = await page.$eval(".tableheader", (bTag)=>{
//         return bTag.textContent
//     })
//     console.log(date)

//     const pdfLinksString = pdfLinksArray.join('\n');

//     // Save the links to a file called 'pdflinks.txt'
//     fs.writeFile('pdflinks.txt', pdfLinksString, (err) => {
//         if(err){
//             console.log(err)
//         }
//         else{
//             console.log('PDF links saved to pdflinks.txt');
//         }
        
//     });

//     // Close the browser
//     await browser.close();
// })();


//  Task 3 --> Search The data on google and get back its result in response
// (async () => {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     await page.goto('https://google.com');

//     await page.type('textarea', 'Who is GOAT of WWE');
//     await page.keyboard.press('Enter');

//     await page.waitForSelector('#search'); // Wait for search results

//     // Extract the search result titles and links
//     const searchResults = await page.$$eval('h3', h3Elements => {
//         return h3Elements.map(h3 => {
//             const linkElement = h3.closest('a');
//             return {
//                 title: h3.textContent,
//                 url: linkElement ? linkElement.href : ''
//             };
//         });
//     });


//     console.log("Search Results:", searchResults);
//     await browser.close();
// })();


// Task 4 --> Fill the login feild and get user logged in
// (async()=>{
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage()
//     await page.goto("https://quilify-blog-web-app.vercel.app/login",{waitUntil : "networkidle0"})
//     await page.type(`input[name="email"]`,"amanupadhyay1211@gmail.com")
//     await page.type(`input[name="password"]`,"aman1211")
//     await page.click(`button[type="submit"]`)
    
//     await page.waitForNetworkIdle()

//     const blogPosts = await page.$$eval(`.w-full.bg-gray-100.rounded-xl.p-4.shadow-md`, (blogDivs) => {
//         return blogDivs.map(blogDiv => {
//             const link = blogDiv.querySelector('a')?.href || null;
//             const imgSrc = blogDiv.querySelector('img')?.src || null;
//             const title = blogDiv.querySelector('h2')?.textContent || null;
//             const createdBy = blogDiv.querySelector('p:first-of-type')?.textContent.replace('Created By: ', '') || null;
//             const postedDate = blogDiv.querySelector('p:last-of-type')?.textContent.replace('Posted: ', '') || null;
//             return { link, imgSrc, title, createdBy, postedDate };
//         });
//     });
//     console.log(blogPosts);
//     await browser.close();
// })();


// Task 5 --> Hover and then click
// (async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   const rbiBaseUrl = 'https://www.rbi.org.in/';
  
//   await page.goto(rbiBaseUrl, { waitUntil: 'networkidle0' });

//   await page.hover('li a[href="#"]');

//   await page.waitForSelector('a[href="../Scripts/BS_ViewSpeeches.aspx"]', { visible: true });

//   // Click on the "Speeches" link
//   await page.click('a[href="../Scripts/BS_ViewSpeeches.aspx"]');

//   // Wait for the new page to load
//   await page.waitForNavigation({ waitUntil: 'networkidle0' });
//   // Scrap the data like you did with back then with  pdf
    
//     //     // Close the browser
//         // await browser.close();

// })();


// Task 6 --> Http interceptor : 
// When you're scraping a webpage, the page loads various resources like images, scripts, fonts, etc. Each of these is a "request" sent by the browser to the server to get those resources.
// By using an interceptor in Puppeteer, you can monitor and control these requests. If you know that some resources (like images) aren't needed for your scraping task, you can "abort" those requests. This means they won't be loaded, which can make the page load faster and reduce unnecessary data fetching.
// (async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   await page.setRequestInterception(true);
//   page.on('request', (request) => {
//       if (request.url().endsWith(".img")) {
//           request.abort();
//           console.log("Request aborted:", request.url());
//       } else {
//           const headers = {
//               ...request.headers(),
//               "forLearningPupose": "yahooIsBetterThanGoogle"
//           };
//           request.continue({ headers }); // Continue the request with modified headers
//           console.log("Request continued with headers:", request.url());
//       }
//   });

//   const url = "https://www.yahoo.com";
//   await page.goto(url); 

//   // Optionally close the browser
//   await browser.close();
// })();


// Task 7 --> Go to the url then click on year and then click on month and then get the notifaction post on that month
// (async () => {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     const Url = 'https://www.rbi.org.in/Scripts/BS_ViewSpeeches.aspx';
    
//     await page.goto(Url, { waitUntil: 'networkidle0' });

//     await page.waitForSelector('div[id="btn2023"]', { visible: true });
//     await page.click('div[id="btn2023"]');

//     await page.waitForSelector('a[id="20231"]', { visible: true });
//     await page.click('a[id="20230"]');

//     // Wait for the table rows to appear after clicking the month
//     await page.waitForSelector('tbody tr', { visible: true });
//     const resData = await page.$eval('tbody', (tbody) => {
//         const rows = Array.from(tbody.querySelectorAll('tr')); 
//         const data = [];
//         for (let i = 0; i < rows.length; i += 2) {
//             const date = rows[i]?.innerText.trim(); // Get text from the odd row (date)
//             const documentData = rows[i + 1]?.innerText.trim(); // Get text from the even row (document data)
    
//             if (date && documentData) {
//                 data.push({ date, document: documentData });
//             }
//         }   
//         return data;
//     });


//     await browser.close();
// })();


//  Task 8 --> Scrapped Rbi all speeches notification till date Data and saved it to mongod
// (async function scrapeRbiSpeeches() {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         await page.goto('https://www.rbi.org.in/', { waitUntil: "networkidle2" });

//         const menuItem = await page.waitForSelector("text=Speeches & Media Interactions", {
//             visible: true,
//         });
//         await menuItem.hover();

//         const siblingElement = await page.evaluateHandle((menuItem) => {
//             return menuItem.nextElementSibling;
//         }, menuItem);

//         const speechesItem = await page.evaluateHandle((ulElement) => {
//             const listItems = ulElement.querySelectorAll("li");
//             for (const item of listItems) {
//                 if (item.innerText.trim() === "Speeches") {
//                     return item;
//                 }
//             }
//             return null;
//         }, siblingElement);

//         await speechesItem.click();
//         await page.waitForNavigation({ waitUntil: "networkidle2" });

//         const currentYear = new Date().getFullYear();
//         let totalData = 0;

//         // Loop through years until there is no data left
//         for (let year = currentYear; year >= 1990; year--) {
//             console.log(`Processing year: ${year}`);

//             await page.evaluate((year) => {
//                 const element = document.getElementById(`${year}0`);
//                 if (element) {
//                     element.click();
//                 }
//             }, year);

//             await page.waitForSelector(".tablebg", { visible: true });

//             // Scrape the data
//             const scrappedData = await page.evaluate(() => {
//                 const pdfTable = document.querySelector(".tablebg");
//                 if (!pdfTable) return [];

//                 const pdfs = [];
//                 const rows = pdfTable.querySelectorAll("tr");

//                 let currentDate = "";

//                 rows.forEach((row) => {
//                     const dateHeader = row.querySelector(".tableheader");
//                     if (dateHeader) {
//                         currentDate = dateHeader.textContent.trim();
//                     }

//                     const link = row.querySelector('td[colspan="3"] a');
//                     if (link) {
//                         pdfs.push({
//                             date: currentDate,
//                             title: row.querySelector(".link2").textContent.trim(),
//                             speechLink: row.querySelector(".link2").href,
//                             pdfLink: link.href,
//                             pdfSize: row.querySelector('td[colspan="3"]').textContent.trim(),
//                         });
//                     }
//                 });

//                 return pdfs;
//             });

//             totalData += scrappedData.length;

//             if (scrappedData.length > 0) {
//                 console.log(`Data for ${year}:`, JSON.stringify(scrappedData, null, 2));
                
//                 // Save the data to the database
//                 try {
//                     await RbiData.insertMany(scrappedData);
//                     console.log(`Data for ${year} saved to the database!`);
//                 } catch (dbError) {
//                     console.error(`Failed to save data for ${year}:`, dbError);
//                 }
//             } else {
//                 console.log(`No data found for ${year}`);
//             }
//         }

//         console.log(`Scraping completed! Total data: ${totalData}`);
//     } catch (error) {
//         console.error("An error occurred:", error);
//     } finally {
//         await browser.close();
//     }
// })();


//Messho Scrapping
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.meesho.com/ethnicwear-women/pl/3tq');

  // Function to check if new content is loaded
  async function isNewContentLoaded() {
    const newProducts = await page.$$eval('div.sc-dkrFOg', (elements) => elements.length);
    return newProducts > 0;
  }

  // Function to scroll to the bottom of the page
  async function scrollToBottom() {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  let previousHeight;
  let currentHeight = await page.evaluate(() => document.body.scrollHeight);

  while (true) {
    previousHeight = currentHeight;
    await scrollToBottom();
    await page.waitForTimeout(2000); // Wait for new content to load

    currentHeight = await page.evaluate(() => document.body.scrollHeight);

    if (currentHeight === previousHeight) {
      break; // Stop scrolling if no new content is loaded
    }
  }

  // Extract data after all content is loaded
  const data = await page.$$eval('div.sc-dkrFOg', (cards) => {
    return cards.map((card) => {
      const image = card.querySelector('img')?.src;
      const title = card.querySelector('.NewProductCardstyled__StyledDesktopProductTitle-sc-6y2tys-5')?.innerText;
      const price = card.querySelector('.NewProductCardstyled__PriceRow-sc-6y2tys-7')?.innerText;
      return { image, title, price };
    });
  });

  console.log(data);

  await browser.close();
})();




//<div class="sc-dkrFOg ProductList__GridCol-sc-8lnc8o-0 cokuZA bGpzcx"><a href="/beautiful-banarasi-silk-red-brocade-saree-with-blouse/p/s089z"><div color="white" class="sc-ftTHYK dSpUEW NewProductCardstyled__CardStyled-sc-6y2tys-0 ccpfUL NewProductCardstyled__CardStyled-sc-6y2tys-0 ccpfUL"><div class="NewProductCardstyled__ProductImage-sc-6y2tys-19 czNIkn"><img alt="Banarasi Banarasi Silk Jacquard Saree With Blouse" loading="lazy" decoding="async" data-nimg="fill" src="https://images.meesho.com/images/products/47039975/5oyew_400.webp" style="position: absolute; height: 100%; width: 100%; inset: 0px; object-fit: contain; color: transparent;"><div class="NewProductCardstyled__Similar-sc-6y2tys-21 cuSDpV"><span font-size="12px" font-weight="demi" color="greyT1" class="sc-eDvSVe exeFcU">+22 More</span></div></div><div class="sc-ftTHYK bAACl NewProductCardstyled__StyledDetailsCard-sc-6y2tys-1 NewProductCardstyled__StyledDesktopDetailsCard-sc-6y2tys-3 jvYVXh eSUhOk NewProductCardstyled__StyledDetailsCard-sc-6y2tys-1 NewProductCardstyled__StyledDesktopDetailsCard-sc-6y2tys-3 jvYVXh eSUhOk" color="white"><span font-size="12px" font-weight="book" class="sc-eDvSVe gJIENf NewProductCardstyled__Caption3_1Wrapper-sc-6y2tys-28 kaQLdy NewProductCardstyled__Caption3_1Wrapper-sc-6y2tys-28 kaQLdy" color="pinkBase"><div class="NewProductCardstyled__ProductHeaderWrapper-sc-6y2tys-32 knWeEt"><p font-size="16px" font-weight="book" color="greyT2" class="sc-eDvSVe gQDOBc NewProductCardstyled__StyledDesktopProductTitle-sc-6y2tys-5 ejhQZU NewProductCardstyled__StyledDesktopProductTitle-sc-6y2tys-5 ejhQZU">Banarasi Banarasi Silk Jacquard Saree With Blouse</p></div><div class="sc-ftTHYK ijCOEg NewProductCardstyled__PriceRow-sc-6y2tys-7 aLtVl NewProductCardstyled__PriceRow-sc-6y2tys-7 aLtVl" color="white"><h5 font-size="24px" font-weight="bold" color="greyBase" class="sc-eDvSVe dwCrSh">₹496 </h5></div></span><div class="sc-ftTHYK bMWUIJ NewProductCardstyled__BadgeRow-sc-6y2tys-16 eznceS NewProductCardstyled__BadgeRow-sc-6y2tys-16 eznceS" color="white"><div class="sc-bqWxrE dxbjgD"><span font-size="12px" font-weight="demi" color="greyT1" class="sc-eDvSVe fkvMlU">Free Delivery</span></div></div><div class="sc-ftTHYK bMWUIJ NewProductCardstyled__RatingsRow-sc-6y2tys-8 gZhaNh NewProductCardstyled__RatingsRow-sc-6y2tys-8 gZhaNh" color="white"><div class="NewProductCardstyled__RatingSection-sc-6y2tys-9 fyvrGC"><span label="3.9" class="Rating__StyledPill-sc-12htng8-1 dxBdQp"><span font-size="16px" font-weight="demi" color="#ffffff" class="sc-eDvSVe laVOtN">3.9</span><img alt="Star" loading="lazy" width="10" height="10" decoding="async" data-nimg="1" class="Rating__StyledNextImage-sc-12htng8-0 ynoRB" src="/assets/svgicons/star.svg" style="color: transparent;"></span><span font-size="12px" font-weight="demi" color="greyT2" class="sc-eDvSVe XndEO NewProductCardstyled__RatingCount-sc-6y2tys-22 iaGtYc NewProductCardstyled__RatingCount-sc-6y2tys-22 iaGtYc">20783 Reviews</span></div></div></div></div></a></div>
