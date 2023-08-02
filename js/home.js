// API 주소(VideoList)
const VideoList = 'http://oreumi.appspot.com/video/getVideoList';
//videoinfo를 가져오는 API
const videoUrl = "http://oreumi.appspot.com/video/getVideoInfo?video_id="

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
//mainContainer에 영상들을 불러오는 함수
async function videoData(data) {
    try {
        //로딩 이미지
        const loadingImage = document.createElement("img");
        loadingImage.src = "./img/sidebar/spin.gif"; 
        loadingImage.style.background = `url("./img/sidebar/spin.gif") no-repeat center`;
        loadingImage.style.backgroundSize = "contain";
        loadingImage.style.width = "100px";
        loadingImage.style.height = "100px"; 
        loadingImage.style.margin = "20px auto"; 

        const mainContainer = document.getElementById("mainContainer"); 

        mainContainer.appendChild(loadingImage);

        const fetchPromises = data.map(async (video_src) => {
            let video_desc = video_src.video_id.toString(); 
            const response = await fetch(videoUrl + video_desc);
            const data_video = await response.json();
            return data_video;
        });
        const videoDataArray = await Promise.all(fetchPromises);
        videoDataArray.forEach((videoData) => {
            appendItemsToMain(videoData);
        });
        //로딩 이미지 제거
        loadingImage.style.display = "none";
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

//chennelvedio를 가져오는 API
const channelList = 'http://oreumi.appspot.com/channel/getChannelVideo?video_channel=';
// 정보를 가져오는 함수
async function fetchChannelData(searchValue) {
    try {
        const data = {"video_channel": searchValue}
        const response = await fetch(channelList,{method: 'POST', headers: {
            'Content-Type': 'application/json'},body: JSON.stringify(data)});
            
        if (!response.ok) {
            throw new Error('API 호출에 실패했습니다');
        }
        const channelList_data = await response.json(); 

        videoData(channelList_data);
        console.log(channelList_data);

        // 채널 정보 가져오기
        await channelData(channelList_data);

        return channelList_data;
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

// channelinfo를 가져오는 API
const channelurl = "http://oreumi.appspot.com/channel/getChannelInfo?video_channel=";

async function channelData(data) {
    try {
        for (const channelItem of data) {
            const response = await fetch(channelurl + channelItem.channel_desc, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(channelItem) 
            });
            if (!response.ok) {
                throw new Error('API 호출에 실패했습니다');
              }
            const channelInfoData = await response.json();

            channelInfo(channelInfoData);
            console.log(channelInfoData);
        }
        return data;
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

//홈 video

//숫자를 천,백만 단위에 K,M으로 변경
function formatNumber(num) {
    if (num >= 1000000) {
      // 백만 단위 이상일 경우 "M"으로 표현
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      // 천 단위 이상일 경우 "K"로 표현
      return (num / 1000).toFixed(1) + "K";
    } else {
      // 그 외의 경우는 그대로 반환
      return num.toString();
    }
}
function appendItemsToMain(data) {

    function daysPassedSinceDate(dateString) {
        const date = new Date(dateString); // 입력받은 날짜 문자열을 Date 객체로 변환
        const currentDate = new Date(); // 현재 날짜를 구함
      
        // 입력된 날짜와 현재 날짜의 타임스탬프 차이 계산
        const timeDifferenceInMilliseconds = currentDate - date;
        const daysPassed = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);

        return Math.floor(daysPassed); // 소수점 이하는 버림하여 정수값으로 반환
      } async function channelData(data) {
        try {                
            const requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },                    
            };
            const response = await fetch(data,requestOptions);  // channelUrl값으로 응답내용 호출
            const channelUrl = await response.json();       // json 형태로 변경
        } catch (error) {
            console.error('API 호출에 실패했습니다:', error);
        }
    }
    const daysPassed = daysPassedSinceDate(data.upload_date);   

    const mainContainer = document.getElementById("mainContainer");  //영상들을 나열할 태그 선택
    const span = document.createElement("span"); // 영상들을 어떤 태그에 담을지 선택

    span.innerHTML = `    
    <form id="video-Form-${data.video_id}" action="video.html" method="GET">\n
        <input type="hidden" name="id" value="${data.video_id}">\n
        <input type="hidden" name="channel" value="${data.video_channel}">\n                         
    </form>\n
    <form id="channel-Form-${data.video_id}" action="channel.html" method="GET">\n
        <input type="hidden" name="id" value="${data.video_id}">\n 
        <input type="hidden" name="channel" value="${data.video_channel}">\n                        
    </form>\n
    <img src=${data.image_link} class="video-${data.video_id}">\n
    <div class='profile-and-desc'>\n
        <img class="channel-${data.video_id}" src="" >\n
        <div>\n
            <p class="video-${data.video_id}">${data.video_title}</p>\n
            <p class="channel-${data.video_id}">${data.video_channel}</p>\n
            <p class="video-${data.video_id}">${formatNumber(data.views)} views • ${daysPassed}일전</p>        
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


//search 검색창
const mainContainer = document.getElementById("mainContainer");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector(".searchbox a:first-child");
const searchResultContainer = document.getElementById("searchResultContainer");
let currentSearchTerm = "";

// 검색 기능 구현 함수
async function searchChannel() {
  const searchValue = searchInput.value.trim();
  if (searchValue === "") {
    alert("검색어를 입력해주세요.");
    return;
  }

 // 이전 검색 결과를 지우고 새로운 검색 결과를 표시하기 위해 기존 내용 삭제
  if (currentSearchTerm !== searchValue) {
    mainContainer.innerHTML = "";
    searchResultContainer.innerHTML = "";
  }
  // 검색 결과 가져오기
  const channelListData = await fetchChannelData(searchValue);

  // 검색 결과를 화면에 표시
  displaySearchResults(searchValue, channelListData);
  currentSearchTerm = searchValue;
}

// 검색 버튼 클릭 이벤트 핸들러
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  searchChannel();
});

// Enter 키 입력 이벤트 핸들러

async function homeEnterkey(event) {
    if (event.keyCode === 13) {
        await searchChannel(event.target);
    }
}

// fetchData 함수에서 addFormSubmitListeners를 호출하는 코드를 추가
async function fetchData() {
    try {
        const response = await fetch(VideoList);
        const VideoList_data = await response.json();

        videoData(VideoList_data);
        // 기존 videoData 호출 부분 삭제
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}