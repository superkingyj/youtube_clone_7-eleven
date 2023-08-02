// 현재 페이지의 채널 명을 저장하기 위한 공유 변수
let currChannel = "";

// URL에서 쿼리값을 추출하는 함수
function getQueryParams() {
    var params = {};
    var search = window.location.search.substring(1);
    if (search) {
      var keyValuePairs = search.split('&');
      for (var i = 0; i < keyValuePairs.length; i++) {
        var keyValuePair = keyValuePairs[i].split('=');
        var key = decodeURIComponent(keyValuePair[0]);
        var value = decodeURIComponent(keyValuePair[1]);
        params[key] = value;
      }
    }
    return params;
}

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

function daysPassedSinceDate(dateString) {
    const date = new Date(dateString); // 입력받은 날짜 문자열을 Date 객체로 변환
    const currentDate = new Date(); // 현재 날짜를 구함
  
    // 입력된 날짜와 현재 날짜의 타임스탬프 차이 계산
    const timeDifferenceInMilliseconds = currentDate - date;
    const daysPassed = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
  
    return Math.floor(daysPassed); // 소수점 이하는 버림하여 정수값으로 반환
}    

//URL들
videoUrl = "http://oreumi.appspot.com/video/getVideoInfo?video_id="
channelUrl = "http://oreumi.appspot.com/channel/getChannelInfo?video_channel="
videoListUrl = "http://oreumi.appspot.com/video/getVideoList"

// 기본 HTML틀 생성이 완료 된후 영상 불러오기
document.addEventListener("DOMContentLoaded", function () {
    var queryParams = getQueryParams();
    if (Object.keys(queryParams).length > 0) {
        
        //video 정보가 필요한 부분
        async function videoData(data) {
            try {                
                const response = await fetch(data);  // videoUrl 값으로 응답내용 호출
                const data_video = await response.json();       // json 형태로 변경              
                const daysPassed = daysPassedSinceDate(data_video.upload_date); 

                // section 부분 자바스크립트
                document.getElementById("main-video").innerHTML = `
                <video class="video" src="${data_video.video_link}" controls></video>
                <section class="video-info">                    
                    <div class="video-title">${data_video.video_title}</div>
                    <div class="video-info-desc">
                        <div class="info-text">${formatNumber(data_video.views)} • ${daysPassed}일전</div>
                        <div class="info-buttons">
                            <button class="likeBtn" onclick="likeAndDislikeBtnClick(event)">
                                <img src="./img/video/like.svg" alt=""><span>0</span>
                            </button>
                            <button class="dilikeBtn" onclick="likeAndDislikeBtnClick(event)">
                                <img src="./img/video/DisLiked.svg" alt=""><span>0</span>
                            </button>  
                            <button>
                                <img src="./img/video/share.svg" alt=""><span>SHARE</span>
                            </button>
                            <button><img src="./img/video/more.svg" alt=""></button>    
                        </div>
                    </div>
                </section>
                `;
                document.querySelector(".user_name").textContent = data_video.video_channel;
                document.querySelector(".desc").textContent = data_video.video_detail;
                currChannel = data_video.video_channel;
                return data_video;
            } catch (error) {
                console.error('API 호출에 실패했습니다:', error);
            }
        }                
        const videoPromise = videoData(videoUrl+queryParams.id)

        // 채널 정보가 필요한 부분
        async function channelData(data) {
            try {                
                const requestOptions = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },                    
                };
                const response = await fetch(data,requestOptions);  // channelUrl값으로 응답내용 호출
                const channelUrl = await response.json();       // json 형태로 변경
                document.querySelector(".user-avatar img").src = channelUrl.channel_profile;
                document.querySelector(".user_sub").textContent = formatNumber(channelUrl.subscribers) + " subscibers";
            } catch (error) {
                console.error('API 호출에 실패했습니다:', error);
            }
        }
        channelData(channelUrl+queryParams.channel)


        //비디오 목록이 필요한 부분
        async function otherListData(url, data_video) {
            const videoTag = data_video.video_tag;
            let targetThumbnailList = [];
            let targetTitleList = [];
            let targetVideoIdList = [];
            let targetChannelList = [];
            let targetViewAndDateList = [];
            let targetVideoLinkList = [];
            let response;
            let otherListJson;
            let cnt = 0;

            async function requestOtherListApi() {
                response = await fetch(url);
                otherListJson = await response.json();
            }

            async function getOtherListInfo() {
                for (const item of otherListJson) {
                    if (item.video_tag.includes(videoTag[0]) || item.video_tag.includes(videoTag[0])) {
                        cnt++;
                        targetTitleList.push(item.video_title);
                        targetVideoIdList.push(item.video_id);
                        targetChannelList.push(item.video_channel);
                        targetViewAndDateList.push(item.views + " Views . " + daysPassedSinceDate(item.upload_date) + "days ago");

                        // 썸네일 & 비디오 링크 가져오기
                        const response = await fetch(videoUrl + item.video_id);
                        const videoInfoData = await response.json();
                        targetThumbnailList.push(videoInfoData.image_link);
                        targetVideoLinkList.push(videoInfoData.video_link);
                    }
                }
            }

            function rendering() {
                const otherList = document.getElementsByClassName('other-video')[0];
                for (let i = 0; i < cnt; i++) {
                otherList.innerHTML += `
                    <a href="${targetVideoLinkList[i]}">
                        <div class="other-video-thumbnail">
                            <span class="thumbnail-img">
                                <img src="${targetThumbnailList[i]}" />
                            </span>
                        </div>
                        <div class="other-video-text">
                            <span class="thumnail-text">
                                <span id="thumnail-title">${targetTitleList[i]}</span>
                                <span id="thumnail-channel">${targetChannelList[i]}</span>
                                <span id="thumnail-views">${targetViewAndDateList[i]}</span>
                            </span>
                        </div>
                    </a>
                `;
                }
            }

            try {
                await requestOtherListApi();
                await getOtherListInfo();
                rendering();
            } catch (error) {
                console.error('video List API 호출에 실패했습니다.');
            }
        }

        Promise.all([videoPromise])
        .then((results) => {
            const data_video = results[0];
            otherListData(videoListUrl, data_video);
        })
        .catch((error) => {
            console.error("Error occurred:", error);
        });
        
    } else {
        console.log("No query parameters found.");
    }
});

const subscribeButton = document.getElementsByClassName('subscribers')[0];

// SUBSCRIBES 버튼 클릭시 사이드바에 뜨게 하는 기능
function addSubscribe() {
    // 이미 구독한 상태라면 구독 취소
    if (subscribeButton.getAttribute('data-is-subscribed') === 'true') {
            // 버튼 다시 빨갛게 변경
            subscribeButton.removeAttribute('data-is-subscribed');
            const buttonImgSrc = subscribeButton.querySelector('img').getAttribute('src');
            subscribeButton.querySelector('img').remove();
            subscribeButton.innerHTML = `
            <img
                src="${buttonImgSrc}"
                alt="Subscribe"
            />
            `;
            
            // 사이드바에서 삭제
            const subscribers = document.querySelectorAll('#show-more-sub a');
            const idx = subscribers.length-1;
            const target = (subscribers[idx]);

            console.log(target);
            target.remove();
    } else {
        // 현재 채널 정보
        const userImageSrc = document.querySelector('.user-avatar img').getAttribute('src');
        const userName = document.getElementsByClassName('user_name')[0].innerText;
    
        // 사이드바에 추가
        const subscibers = document.getElementById('show-more-sub');

        subscibers.insertAdjacentHTML(
        'beforeend',
        `
        <a href="./channel.html?channel=${userName}">
            <span class="sidebar-text">
                <img src="${userImageSrc}" alt="" />${userName}
            </span>
        </a>`
        );
        
        // SUBSCRIBES 회색으로 변경하고 사용자 정의 속성 (구독했음을 표시하는 속성) 추가
        subscribeButton.setAttribute('data-is-subscribed', 'true');
        subscribeButton.querySelector('img').style.filter = "grayscale(100%)";
    }
}

subscribeButton.addEventListener("click", function (event) {
    addSubscribe();
});


const commentInput = document.getElementsByClassName('comment-area')[0];

// 댓글다는 기능
function addReply() {
    // 댓글 단 내용 가져오기
    const replyText = document.getElementsByClassName("comment-area")[0].value;
    
    document.getElementsByClassName("comment-area")[0].value = '';

    // 댓글창에 추가
    const comments = document.getElementsByClassName("comments")[0];
    comments.insertAdjacentHTML(
    'beforeend',
    `
    <div class="comment">
        <div class="comments-pic">
        <img src="./img/avatar/User-Avatar.svg" alt="User Avatar" />
        </div>
        <div class="comments-info">
        <div class="comments-id">
            7-eleven-team <span> just before </span>
        </div>
        <div class="comments-text">
            ${replyText}
        </div>
        <div class="comments-btn">
            <button class="likeBtn" onclick="likeAndDislikeBtnClick(event)" >
            <img src="./img/video/like.svg" alt="" /><span>0</span>
            </button>
            <button class="dislikeBtn" onclick="likeAndDislikeBtnClick(event)">
            <img src="./img/video/DisLiked.svg" alt="" /><span>0</span>
            </button>
            <button><img src="./img/video/reply.svg" alt="" /></button>
        </div>
        </div>
    </div>
    `);
}

commentInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addReply();
    }
});

const commentBtns = document.getElementsByClassName('comments-btn')[0]; 
function likeAndDislikeBtnClick(event) {
    let buttonElem = 0;
    let imgElem = 0;
    let spanElem = 0;

    if (event.target.nodeName.toLowerCase() === "span") {
        buttonElem = event.target.parentElement;
        imgElem = buttonElem.querySelector('img');
        spanElem = event.target;
    } else if (event.target.nodeName.toLowerCase() === "img") {
        buttonElem = event.target.parentElement;
        imgElem = event.target;
        spanElem = buttonElem.querySelector('span');
    }
    else {
        buttonElem = event.target;
        imgElem = event.target.querySelector('img');
        spanElem = event.target.querySelector('span');
    } 

    let cnt = parseInt(spanElem.innerText);

    // 이미 좋아요를 한 상태라면
    if(buttonElem.getAttribute('data-is-activated') === 'true') {
        spanElem.innerHTML = cnt-1;
        buttonElem.removeAttribute('data-is-activated');
        imgElem.removeAttribute('style');
        if(buttonElem.className === 'likeBtn'){
            imgElem.setAttribute("src", "./img/video/like.svg");
        } else {
            imgElem.setAttribute("src", "./img/video/Disliked.svg");
        }
    }
    else {
        spanElem.innerText = cnt+1;
        buttonElem.setAttribute('data-is-activated', 'true')
        if(buttonElem.className === 'likeBtn'){
            imgElem.setAttribute("src", "./img/video/like-activated.svg");
        } else {
            imgElem.setAttribute("src", "./img/video/Disliked-activated.svg");
        }
    }
};

function moveToChannel(event){
    console.log("이벤트 발생");
    window.location.href = `../html_and_css/Channel.html?channel=${currChannel}`;
}