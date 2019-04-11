const axios = require('axios');
const url = 'https://dom.ria.com/novostroyki/';

async function test() {

  const urls = Array(1000).fill(url, 0);
  console.log(urls);
  console.time('qwe');
  const requests = urls.map(async (url, i) => {
    console.time('parallel' + i);
   const r = await axios(url);
    console.timeEnd('parallel' + i);
    return r;
  });
  console.timeEnd('qwe');
  console.time('all');
  const res = await Promise.all(requests);
  console.timeEnd('all')
}

async function testSync() {
  const urls = Array(1).fill(url, 0);
  console.log(urls);
  console.time('all');
  do {
    const [url] = urls.splice(0,1);
    console.time('sync' + urls.length);
    const r = await axios(url);
    console.timeEnd('sync' + urls.length);
  } while (urls.length);
  console.log(urls.length)
  console.timeEnd('all')
}

test();
// testSync();



