/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// ?value=BV1Ym411r76C

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function getAvBvInfo(avBv) {
    const url = `https://www.bilibili.com/video/${avBv}`;
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error(`Bilibili 請求未能成功: ${response.statusText}`);
    }
  
    const text = await response.text();
    // 匹配影片標題
    const Title = text.match(/<h1.*?data-title="*?".*?title="*?".*?class="video-title special-text-indent".*?>(.*?)<\/h1>/);
    // 匹配影片作者
    const Author = text.match(/<meta.*?data-vue-meta="*?".*?itemprop="author".*?name="author".*?content="(.*?)".*?>/);
    // 匹配影片作者粉絲數
    const Fans = text.match(/"fans":"(.*?)"/);
    // 匹配影片作者關注數
    const Friend = text.match(/"friend":"(.*?)"/);
    // 匹配影片作者 uid 號
    const Mid = text.match(/"mid":"(.*?)"/);
    // 匹配影片作者簡介
    const Sing = text.match(/"sign":"(.*?)"/);
    // 匹配影片播放量信息
    const View = text.match(/<div.*?class="view-text".*?>(.*?)<\/div>/);
    // 匹配影片彈幕數量信息
    const Dm = text.match(/<div.*?class="dm-text".*?>(.*?)<\/div>/);
    // 匹配影片播放量信息
    const Pubdate = text.match(/<div.*?class="pubdate-ip-text".*?>(.*?)<\/div>/);
    // 匹配影片點贊信息
    const Like = text.match(/<span.*?class="video-like-info video-toolbar-item-text">(.*?)<\/span>/);
    // 匹配影片投幣信息
    const Coin = text.match(/<span.*?class="video-coin-info video-toolbar-item-text".*?>(.*?)<\/span>/);
    // 匹配影片收藏信息
    const Fav = text.match(/<span.*?class="video-fav-info video-toolbar-item-text".*?>(.*?)<\/span>/);
    // 匹配影片分享信息
    const Share = text.match(/<span.*?class="video-share-info video-toolbar-item-text".*?>(.*?)<\/span>/);
    // 匹配影片簡介信息
    const Synopsis = text.match(/<span.*?class="desc-info-text".*?>(.*?)<\/span>/);
    // 匹配影片關鍵字信息
    const Keywords = text.match(/<meta.*?itemprop="keywords".*?name="keywords".*?content="(.*?)">/);
    // 匹配影片 BV 號
    const Bvid = text.match(/"bvid":"(.*?)"/);
    // 匹配影片封面鏈接
    const Cover = text.match(/"pic":"(.*?)"/);
  
    if (Keywords) {
      return {
        title: Title ? Title[1] : null,
        author: Author ? Author[1] : null,
        fans: Fans ? Fans[1] : null,
        friend: Friend ? Friend[1] : null,
        mid: Mid ? Mid[1] : null,
        sing: Sing ? Sing[1] : null,
        view: View ? View[1] : null,
        dm: Dm ? Dm[1] : null,
        pubdate: Pubdate ? Pubdate[1] : null,
        like: Like ? Like[1] : null,
        coin: Coin ? Coin[1] : null,
        fav: Fav ? Fav[1] : null,
        share: Share ? Share[1] : null,
        synopsis: Synopsis ? Synopsis[1] : null,
        keywords: Keywords ? Keywords[1] : null,
        bvid: Bvid ? Bvid[1] : null,
        cover: Cover ? Cover[1] : null
      };
    } else {
      throw new Error('未能找到相應的影片資訊，請核對AV或 BV 號是否準確。');
    }  
  }
  
  async function handleRequest(request) {
    try {
      const url = new URL(request.url);
      const avBv = url.searchParams.get('value');
  
      if (!avBv) {
        throw new Error('請提供 Bilibili 影片的 AV 或 BV 號。');
      }
  
      // 獲取影片信息
      const videoInfo = await getAvBvInfo(avBv);
  
      // 影片作者
      const Author = videoInfo.author;
      // 影片作者粉絲
      const Fans = videoInfo.fans === "0" ? 0 : videoInfo.fans;
      // 影片作者關注
      const Friend = videoInfo.friend === "0" ? 0 : videoInfo.friend;
      // 影片作者 uid
      const Mid = videoInfo.mid;
      // 影片作者簡介
      const Sing = videoInfo.sing === "" ? "-" : videoInfo.sing;
      // 影片標題
      const Title = videoInfo.title;
      // 影片播放量
      const View = videoInfo.view === "0" ? 0 : videoInfo.view;
      // 影片彈幕數
      const Dm = videoInfo.dm === "0" ? 0 : videoInfo.dm;
      // 影片發佈時間
      const Pubdate = videoInfo.pubdate;
      // 影片點贊
      const Like = videoInfo.like === "点赞" ? 0 : videoInfo.like;
      // 影片投幣
      const Coin = videoInfo.coin === "投币" ? 0 : videoInfo.coin;
      // 影片收藏
      const Fav = videoInfo.fav === "收藏" ? 0 : videoInfo.fav;
      // 影片分享
      const Share = videoInfo.share === "分享" ? 0 : videoInfo.share;
      // 影片簡介
      const Synopsis = videoInfo.synopsis === null ? "-" : videoInfo.synopsis;
      // 影片關鍵字
      const Keywords = videoInfo.keywords;
      // 影片 BV 號
      const Bvid = videoInfo.bvid;
      // 影片封面鏈接
      const coverUrl = videoInfo.cover;
      let decodedCoverUrl = coverUrl.replace(/\\u002F/g, '/');
      // 如果封面鏈接是http://開頭，則替換成https://
      if (decodedCoverUrl.startsWith("http://")) {
        decodedCoverUrl = decodedCoverUrl.replace("http://", "https://");
      }
  
      // 構建 JSON 回應體
      const responseBody = {
        code: 200,
        msg: '成功獲得影片資訊',
        time: Date.now(),
        author: {
          name: Author,
          fans: Fans,
          friend: Friend,
          mid: Mid,
          sing: Sing
        },
        data: {
          title: Title,
          view: View,
          dm: Dm,
          pubdate: Pubdate,
          like: Like,
          coin: Coin,
          fav: Fav,
          share: Share,
          synopsis: Synopsis,
          keywords: Keywords,
          bvid: Bvid,
          coverUrl: decodedCoverUrl
        }
      };
  
      return new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      let code, msg, status;
  
      // 設置狀態碼和消息
      if (error instanceof TypeError) {
        code = 400;
        msg = 'Bad Request';
      } else {
        code = 404;
        msg = error.message;
      }
  
      // 構建錯誤 JSON 回應
      const responseBody = {
        code,
        msg,
        time: Date.now()
      };
  
      return new Response(JSON.stringify(responseBody), {
        status,
        headers: {
          'Content-Type': 'application/json'
        },
      });
    }
  }
  