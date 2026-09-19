export async function onRequest() {
  const CHANNEL_ID="UCOa-WaNwQaoyFHLCDk7qKIw";
  try {
    const r=await fetch("https://www.youtube.com/channel/"+CHANNEL_ID+"/live",{redirect:"follow",headers:{"User-Agent":"Mozilla/5.0"}});
    const html=await r.text();
    const canonical=(html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})"/)||[])[1];
    const vid=canonical||(html.match(/"videoId":"([A-Za-z0-9_-]{11})"/)||[])[1];
    if(!vid) return Response.json({status:"none",videoId:null});
    const title=((html.match(/<meta property="og:title" content="([^"]+)"/)||[])[1]||"Flamengo TV — LIVE").replace(/&amp;/g,"&").replace(/&#39;/g,"'");
    const isLive=html.indexOf('"isLiveNow":true')>=0||html.indexOf('"isLive":true')>=0;
    const start=(html.match(/"startTimestamp":"([^"]+)"/)||[])[1]||null;
    return Response.json({status:isLive?"live":"upcoming",videoId:vid,title,scheduledStart:start},{headers:{"Cache-Control":"public, max-age=60"}});
  } catch(e) {
    return Response.json({status:"unavailable",videoId:null},{status:502});
  }
}