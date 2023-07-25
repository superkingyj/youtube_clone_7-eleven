const videoListUrl = "http://oreumi.appspot.com/video/getVideoList";
const videoInfoUrl = "http://oreumi.appspot.com/video/getVideoInfo?video_id=";

function appendItemsToMain(data){
    // 썸네일
    const poster = data.image_link;
    const infoText = data.views + " views " + " • " + data.upload_date;
    const videoTitle = data.video_title;
    const src = data.video_link;
    const desc = data.video_detail;
    const tag = data.video_tag; 

    const docVideo = document.getElementsByClassName("video")[0]
    docVideo.setAttribute("src", src);
    docVideo.setAttribute("poster", poster);

    const docDesc = document.getElementsByClassName("desc")[0];
    docDesc.textContent = desc;

    const docInfoText = document.getElementsByClassName("info-text")[0];
    docInfoText.textContent = infoText;

    const docVideoTitle = document.getElementsByClassName("video-title")[0];
    docVideoTitle.textContent = videoTitle;
}

async function getVideoInfo(id) {
    try {
        const url = videoInfoUrl + id.toString();
        const response = await fetch(url);
        const data = await response.json();
        console.log('API 호출 결과:', data);
        
        // object -> string -> javascript object로 파싱
        const json = JSON.stringify(data);
        const obj = JSON.parse(json);
        
        appendItemsToMain(obj);       
    } catch (error) {
        console.error('API 호출에 실패했습니다: ', error);
        return null;
    }
}

async function getOtherVideos(){
    const data = fetchData(videoData);
    
    if(data == null) {
        console.error('API 호출에 실패했습니다: ', error);
        return;
    }
}

getVideoInfo(1);