// API 주소(VideoList)
const VideoList = 'http://oreumi.appspot.com/video/getVideoList';

// 정보를 가져오는 함수
async function fetchData() {
    try {
        const response = await fetch(VideoList); //fetch함수로 API URL에 응답내용을 response 변수에 담는다
        const VideoList_data = await response.json(); //response 에 담긴 내용을 json형태로 VideoList_data에 담는다
        videoData(VideoList_data);
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

//videoinfo를 가져오는 API
videoUrl = "http://oreumi.appspot.com/video/getVideoInfo?video_id="

async function videoData(data) {
    try {
        for (const video_src of data){  //fetchData에서 넘겨받은 VideoList_data의 인자들로 반복문 실행
            let video_desc = video_src.video_id.toString();  //영상의 id값이 숫자여서 str으로 변경
            const response = await fetch(videoUrl+video_desc);  // videoinfo의 url과 str로 변경된 id값으로 응답내용 호출
            const data_video = await response.json();       // json 형태로 변경
            appendItemsToMain(data_video);
        }
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

function appendItemsToMain(data) { //해당 코드가 작동하기 위해선 Home.html의 main 태그에 id="mainContainer" 작업이 필요하고 하위 태그들은 삭제


    function daysPassedSinceDate(dateString) {
        const date = new Date(dateString); // 입력받은 날짜 문자열을 Date 객체로 변환
        const currentDate = new Date(); // 현재 날짜를 구함
      
        // 입력된 날짜와 현재 날짜의 타임스탬프 차이 계산
        const timeDifferenceInMilliseconds = currentDate - date;
        const daysPassed = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
      
        return Math.floor(daysPassed); // 소수점 이하는 버림하여 정수값으로 반환
      }

    const daysPassed = daysPassedSinceDate(data.upload_date);   


    const mainContainer = document.getElementById("mainContainer");  //영상들을 나열할 태그 선택
    const span = document.createElement("span"); // 영상들을 어떤 태그에 담을지 선택
    span.innerHTML = `    
    <form id="video-Form-${data.video_id}" action="video.html" method="GET">\n
        <input type="hidden" name="value" value="${data.video_id}">\n                        
    </form>\n
    <form id="channel-Form-${data.video_id}" action="channel.html" method="GET">\n
        <input type="hidden" name="value" value="${data.video_channel}">\n                        
    </form>\n
    <img src=${data.image_link} width=640px height=360px class="video-${data.video_id}">\n
    <div class='profile-and-desc'>\n
        <img class="channel-${data.video_id}" src='https://yt3.ggpht.com/G4UK0v62TMm55F2s4H_12Z8WdZwwGHjGybN3Ix1gwAdUIn8iBO5vgzvz7DZ9_mAv3_HBGHSJRVQ=s88-c-k-c0x00ffffff-no-rj'/>\n
        <div>\n
            <p class="video-${data.video_id}">${data.video_title}</p>\n
            <p class="channel-${data.video_id}">${data.video_channel}</p>\n
            <p class="video-${data.video_id}">${data.views}views ● ${daysPassed}일전</p>        
        </div>\n
    </div>`;// videoData
    mainContainer.appendChild(span);    

    // 이미지를 클릭하면 submit ------- class와 id 또는 태그 부분 CSS와 회의 필요    
    
    document.querySelectorAll(".video-"+data.video_id).forEach((element) => {
        element.addEventListener("click", function() {
            document.getElementById("video-Form-"+data.video_id).submit()
        });
    });
    document.querySelectorAll(".channel-"+data.video_id).forEach((element) => {
        element.addEventListener("click", function() {
            document.getElementById("channel-Form-"+data.video_id).submit()
        });
    });
}

fetchData();

