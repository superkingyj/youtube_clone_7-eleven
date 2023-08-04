//URL들
getVideoInfo = "https://oreumi.appspot.com/video/getVideoInfo?video_id="
getVideoList = "https://oreumi.appspot.com/video/getVideoList"
getChannelInfo = "https://oreumi.appspot.com/channel/getChannelInfo?video_channel="
getChannelVideo = "https://oreumi.appspot.com/channel/getChannelVideo?video_channel="

//몇일 전인지 구현하는 함수
function daysPassedSinceDate(dateString) {
    const date = new Date(dateString); // 입력받은 날짜 문자열을 Date 객체로 변환
    const currentDate = new Date(); // 현재 날짜를 구함

    // 입력된 날짜와 현재 날짜의 타임스탬프 차이 계산
    const timeDifferenceInMilliseconds = currentDate - date;
    const daysPassed = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);

    return Math.floor(daysPassed); // 소수점 이하는 버림하여 정수값으로 반환
}

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

// 숫자를 천,백만 단위에 K,M으로 변경
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

// get API를 가져오는 함수(getVideoInfo, getVideoList)
async function getData(videoUrl) {
    try {
        const response = await fetch(videoUrl);
        const data_video = await response.json();

        return data_video;
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

// POST API를 가져오는 함수(getChannelInfo,getChannelVideo)
async function postData(channelUrl) {
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        };
        const response = await fetch(channelUrl, requestOptions);
        const channelUrlData = await response.json();

        return channelUrlData;
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

//쿼리 가져오는 함수 호출하여 변수에 넣음
querys = getQueryParams()

// class="small-video" 내용들(영상,DESC)
if (querys.id) {
    getData(getVideoInfo + querys.id).then((data) => {

        document.querySelector(".youtube-player").innerHTML = `
        <video width="640" height"320" src="${data.video_link}" controls></video>
        `;
        document.querySelector(".video-desc .title").textContent = data.video_title;
        document.querySelector(".video-desc .time").textContent = formatNumber(data.views) + " . " + daysPassedSinceDate(data.upload_date) + "일전";
        document.querySelector(".video-desc .description").textContent = data.video_detail;
    });
}
else {
    getData(getVideoInfo + "0").then((data) => {

        document.querySelector(".youtube-player").innerHTML = `
        <video width="640" height"320" src="${data.video_link}" controls></video>
        `;
        document.querySelector(".video-desc .title").textContent = data.video_title;
        document.querySelector(".video-desc .time").textContent = formatNumber(data.views) + " . " + daysPassedSinceDate(data.upload_date) + "일전";
        document.querySelector(".video-desc .description").textContent = data.video_detail;
    });
}

// <article class="channel-main"> 태그 내용들
postData(getChannelInfo + querys.channel).then((data) => {
    document.querySelector(".channel-cover img").src = data.channel_banner;
    document.querySelector(".profileInfo img").src = data.channel_profile;
    document.querySelector(".profileInfo div").innerHTML = `
        <p>${data.channel_name}</p>
        <p id="userview">${formatNumber(data.subscribers)} subscribers</p>
    `;

    function sub_list_load() {
        const list_userName = data.channel_name;
        const list_userImageSrc = data.channel_profile;

        // 사이드바에 추가할 HTML 변수 지정
        var subHtml = `<a href="./channel.html?channel=${list_userName}">
        <span class="sidebar-text">
            <img src="${list_userImageSrc}" alt="" />${list_userName}
        </span>
        </a>`  ;

        // 문자열 정규화 (공백 제거)
        const normalize = (str) => str.replace(/\s+/g, '');
        // local스토리지 내용 받아오기
        var sub_list = JSON.parse(localStorage.getItem('sub'));
        const normalizedArray = sub_list.map(normalize);

        if (normalizedArray.includes(normalize(subHtml))) {
            console.log(subHtml);
            // SUBSCRIBES 회색으로 변경하고 사용자 정의 속성 (구독했음을 표시하는 속성) 추가
            subscribeButton.setAttribute('data-is-subscribed', 'true');
            subscribeButton.querySelector('img').style.filter = "grayscale(100%)";
        }
    }

    sub_list_load();
});

// class="video-card" 부분 영상과 desc
postData(getChannelVideo + querys.channel).then((data) => {
    let play_cnt = 0;
    const promises = data.map((item) => {
        return getData(getVideoInfo + item.video_id).then((data) => {
            daysPassed = daysPassedSinceDate(data.upload_date);
            const div_video = document.createElement("div");
            div_video.className = "xsmall-video";
            div_video.innerHTML = `
            <form id="video-Form-${data.video_id}" action="video.html" method="GET">
                <input type="hidden" name="id" value="${data.video_id}">
                <input type="hidden" name="channel" value="${data.video_channel}">
            </form>
            <form id="channel-Form-${data.video_id}" action="channel.html" method="GET">
                <input type="hidden" name="id" value="${data.video_id}">
                <input type="hidden" name="channel" value="${data.video_channel}">
            </form>
            <div class="xsmall-thumbnail"><img id="${data.video_id}" src="${data.image_link}"></div>
            <div class="xsmall-desc">
                <div id="title">${data.video_title}</div>                    
                <div id="userview">${formatNumber(data.views)} . ${daysPassed}일전</div>
            </div>
            `;
            if (play_cnt < 5) {
                document.querySelector(".video-card").appendChild(div_video);
            }
            play_cnt = play_cnt + 1;
        });
    });

    return Promise.all(promises);
}).then((data) => {
    document.querySelectorAll(".xsmall-video").forEach((element) => {
        element.addEventListener("click", function (event) {
            console.log(event.target)
            document.getElementById("video-Form-" + event.target.id).submit();
        });
    });
})

//돋보기 아이콘 클릭 시 seachbar 노출
function toggleSearchBar() {
    var searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('hidden');
}

//구독 버튼 클릭 기능
const subscribeButton = document.getElementsByClassName('subscribers')[0];

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
                id = "subscribesIcon"
            />
            `;

        // 현재 채널 정보
        const userImageSrc = document.querySelector('.profileInfo img').getAttribute('src');
        const userName = document.querySelector('.profileInfo div p').textContent;


        //로컬스토리지에서 삭제하려는 변수 지정
        var subHtml = `<a href="./channel.html?channel=${userName}">
            <span class="sidebar-text">
                <img src="${userImageSrc}" alt="" />${userName}
            </span>
            </a>`



        //로컬스토리지에 변수 삭제

        var sub_list = JSON.parse(localStorage.getItem('sub'));
        // 문자열 정규화 (공백 제거)
        const normalize = (str) => str.replace(/\s+/g, '');
        const filteredSub_list = sub_list.filter((list) => normalize(list) !== normalize(subHtml));
        localStorage.setItem('sub', JSON.stringify(filteredSub_list));




        // 사이드바에서 삭제
        // 구독된 목록의 a 의 span 태그들
        const subscribers = document.querySelectorAll('#show-more-sub a span');

        // 그중에서 textContent(채널이름)들을 배열로 변환
        var subscibers_list = [];
        for (const usr_name of subscribers) {
            subscibers_list.push(usr_name.textContent);
        }

        // 몇번째 목록인지 확인후 인덱스값 저장
        const subscibers_nom = subscibers_list.map(normalize);
        if (subscibers_nom.includes(normalize(userName))) {
            const idx = subscibers_nom.indexOf(normalize(userName));
            const target = (document.querySelectorAll('#show-more-sub a')[idx]);
            target.remove();
        }
        else {
            console.log("이상한데");
        }

    } else {
        // 현재 채널 정보
        const userImageSrc = document.querySelector('.profileInfo img').getAttribute('src');
        const userName = document.querySelector('.profileInfo div p').textContent;

        // 사이드바에 추가
        const subscibers = document.getElementById('show-more-sub');





        // 사이드바에 추가할 HTML 변수 지정
        var subHtml = `<a href="./channel.html?channel=${userName}">
        <span class="sidebar-text">
            <img src="${userImageSrc}" alt="" />${userName}
        </span>
        </a>`



        // 로컬 스토리지에 변수 저장        
        var sub_list = JSON.parse(localStorage.getItem('sub'));
        if (sub_list === null || sub_list === undefined || Array.isArray(sub_list) && sub_list.length === 0) {
            localStorage.setItem('sub', JSON.stringify([subHtml]));
        }
        else {
            sub_list.push(subHtml);
            localStorage.setItem('sub', JSON.stringify(sub_list));
        }



        //사이드바에 HTML 변수 추가
        subscibers.insertAdjacentHTML('beforeend', subHtml);





        // SUBSCRIBES 회색으로 변경하고 사용자 정의 속성 (구독했음을 표시하는 속성) 추가
        subscribeButton.setAttribute('data-is-subscribed', 'true');
        subscribeButton.querySelector('img').style.filter = "grayscale(100%)";
    }
}

subscribeButton.addEventListener("click", function (event) {
    addSubscribe();
});

//toolbar - search 기능
function filterVideos() {
    var searchKeyword = document.getElementById('search-in-channel').value.toLowerCase();
    var videoCards = document.querySelectorAll('.video-card .xsmall-video');

    for (var i = 0; i < videoCards.length; i++) {
        var title = videoCards[i].querySelector('.xsmall-desc #title').textContent.toLowerCase();
        if (title.includes(searchKeyword)) {
            videoCards[i].style.display = 'block';
        } else {
            videoCards[i].style.display = 'none';
        }
    }
}
function handleSearch(event) {
    if (event.key === 'Enter') {
        filterVideos();
    }
}

document.getElementById('searchIcon').addEventListener('click', function () {
    filterVideos();
});
document.getElementById('search-in-channel').addEventListener('keyup', handleSearch);

//현재 날짜 정보를 가져와서 표시
const searchDayElement = document.getElementById("search-day");
const currentDate = new Date();

const day = String(currentDate.getDate()).padStart(2, '0');
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const year = String(currentDate.getFullYear()).substr(-2);

searchDayElement.textContent = `Search On ${year}.${month}.${day}`;


//인기 영상 가져오기 위한 함수(조회수 기준으로 정렬)
postData(getChannelVideo + querys.channel).then((data) => {
    const promises = data.map((item) => {
        return getData(getVideoInfo + item.video_id).then((data) => {
            daysPassed = daysPassedSinceDate(data.upload_date);
            const div_video = document.createElement("div");
            div_video.className = "xsmall-video";
            div_video.innerHTML = `
            <form id="video-Form-${data.video_id}" action="video.html" method="GET">
                <input type="hidden" name="id" value="${data.video_id}">
                <input type="hidden" name="channel" value="${data.video_channel}">
            </form>
            <form id="channel-Form-${data.video_id}" action="channel.html" method="GET">
                <input type="hidden" name="id" value="${data.video_id}">
                <input type="hidden" name="channel" value="${data.video_channel}">
            </form>
            <div class="xsmall-thumbnail"><img id="${data.video_id}" src="${data.image_link}"></div>
            <div class="xsmall-desc">
                <div id="title">${data.video_title}</div>                    
                <div id="userview">${formatNumber(data.views)} . ${daysPassed}일전</div>
            </div>
            `;
            return { data, div_video };
        });
    });
    return Promise.all(promises).then((videoDataList) => {
        // 조회수를 기준으로 정렬
        videoDataList.sort((a, b) => b.data.views - a.data.views);

        for (let i = 0; i < 5 && i < videoDataList.length; i++) {
            document.querySelector(".pop-video-card").appendChild(videoDataList[i].div_video);
        }
        document.querySelectorAll(".xsmall-video").forEach((element) => {
            element.addEventListener("click", function (event) {
                console.log(event.target)
                document.getElementById("video-Form-" + event.target.id).submit();
            });
        });
    });
});