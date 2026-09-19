export async function onRequest() {
  const CHANNEL_ID = "UCOa-WaNwQaoyFHLCDk7qKIw";
  const UPLOADS = "UUOa-WaNwQaoyFHLCDk7qKIw";
  try {
    const r = await fetch("https://www.youtube.com/feeds/videos.xml?channel_id="+CHANNEL_ID, {
      headers: {"User-Agent":"Mozilla/5.0"}
    });
    if (!r.ok) throw new Error("youtube "+r.status);
    const xml = await r.text();
    const entries = xml.split("<entry>").slice(1);
    const videos = entries.map(e => {
      const id=(e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)||[])[1];
      const title=(e.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||"Vídeo";
      const published=(e.match(/<published>([^<]+)<\/published>/)||[])[1]||"";
      return id ? {id,title:title.replace(/&amp;/g,"&").replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,"<").replace(/&gt;/g,">"),published,isShort:false} : null;
    }).filter(Boolean);
    return Response.json({channel:{id:CHANNEL_ID,name:"Flamengo TV",uploadsPlaylist:UPLOADS},videos},{
      headers:{"Cache-Control":"public, max-age=300"}
    });
  } catch(e) {
    return Response.json({error:"Não foi possível carregar os vídeos.",videos:[]},{status:502});
  }
}