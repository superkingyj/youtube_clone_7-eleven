const likeDefDir = './img/video/like';
const likeActDir = './img/video/like-activated';
const dislikeActDir = './img/video/Disliked-activated';
const dislikeDefDir = './img/video/Disliked';

// 현재 페이지의 채널 명을 저장하기 위한 공유 변수
let currChannel = "";
let currVideoId = -1;

function formatTimePeriod(x) {
    if (x < 7) {
        return x + "일 전";
    } else if (x >= 7 && x < 30) {
        const weeks = Math.floor(x / 7);
        return weeks + "주 전";
    } else if (x >= 30 && x < 365) {
        const months = Math.floor(x / 30);
        return months + "달 전";
    } else {
        const years = Math.floor(x / 365);
        return years + "년 전";
    }
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
videoUrl = "https://oreumi.appspot.com/video/getVideoInfo?video_id="
channelUrl = "https://oreumi.appspot.com/channel/getChannelInfo?video_channel="
videoListUrl = "https://oreumi.appspot.com/video/getVideoList"

async function getData(videoUrl) {
    try {
        const response = await fetch(videoUrl);
        const data_video = await response.json();

        return data_video;
    } catch (error) {
        console.error('API 호출에 실패했습니다:', error);
    }
}

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
                <video class="video" src="${data_video.video_link}" controls autoplay muted></video>
                <section class="video-info">                    
                    <div class="video-title">${data_video.video_title}</div>
                    <div class="video-info-desc">
                        <div class="info-text">${formatNumber(data_video.views)} · ${formatTimePeriod(daysPassed)}</div>
                        <div class="info-buttons">
                            <button class="likeBtn" onclick="likeAndDislikeBtnClick(event, 'video')">
                                <img src="./img/video/like.svg" alt=""><span>0</span>
                            </button>
                            <button class="dilikeBtn" onclick="likeAndDislikeBtnClick(event, 'video')">
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
                document.querySelector(".user_name").setAttribute("data-channel-name", data_video.video_channel);
                document.querySelector(".desc").textContent = data_video.video_detail;
                document.querySelector("#button2").textContent = data_video.video_channel;
                document.querySelector("#button3").textContent = data_video.video_tag[0];
                //태그가 없는 경우 버튼 삭제
                const buttonElement = document.querySelector(".item4 button");
                if (data_video.video_tag[1]) {
                    buttonElement.textContent = data_video.video_tag[1];
                } else {
                    buttonElement.style.display = "none";
                }

                currChannel = data_video.video_channel;
                currVideoId = data_video.video_id;
                return data_video;
            } catch (error) {
                console.error('API 호출에 실패했습니다:', error);
            }
        }
        const videoPromise = videoData(videoUrl + queryParams.id)

        // 채널 정보가 필요한 부분
        async function channelData(data) {
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                };
                const response = await fetch(data, requestOptions);  // channelUrl값으로 응답내용 호출
                const channelUrl = await response.json();       // json 형태로 변경
                document.querySelector(".user-avatar img").src = channelUrl.channel_profile;
                document.querySelector(".user-avatar img").setAttribute("data-channel-name", channelUrl.channel_name);
                document.querySelector(".user_sub").textContent = formatNumber(channelUrl.subscribers) + " subscibers";

                function sub_list_load() {
                    const list_userName = channelUrl.channel_name;
                    const list_userImageSrc = channelUrl.channel_profile;

                    // 사이드바에 추가할 HTML 변수 지정
                    var subHtml = `<a href="./Channel.html?channel=${list_userName}">
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
                        // SUBSCRIBES 회색으로 변경하고 사용자 정의 속성 (구독했음을 표시하는 속성) 추가
                        subscribeButton.setAttribute('data-is-subscribed', 'true');
                        subscribeButton.querySelector('img').style.filter = "grayscale(100%)";
                    }
                }

                sub_list_load();

            } catch (error) {
                console.error('API 호출에 실패했습니다:', error);
            }
        }
        channelData(channelUrl + queryParams.channel)


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
            async function getAllListInfo() {
                let imageCounter = 0;

                for (const item of otherListJson) {
                    if (imageCounter >= 10) {
                        break;
                    }

                    cnt++;
                    targetTitleList.push(item.video_title);
                    targetVideoIdList.push(item.video_id);
                    targetChannelList.push(item.video_channel);
                    targetViewAndDateList.push(
                        formatNumber(item.views) + " Views · " + formatTimePeriod(daysPassedSinceDate(item.upload_date))
                    );
                    const response = await fetch(videoUrl + item.video_id);
                    const videoInfoData = await response.json();
                    targetThumbnailList.push(videoInfoData.image_link);
                    targetVideoLinkList.push(videoInfoData.video_link);

                    imageCounter++;
                }
            }
            async function getOtherListInfo() {
                for (const item of otherListJson) {
                    if (item.video_channel == currChannel) {
                        cnt++;
                        targetTitleList.push(item.video_title);
                        targetVideoIdList.push(item.video_id);
                        targetChannelList.push(item.video_channel);
                        targetViewAndDateList.push(formatNumber(item.views) + " Views · " + formatTimePeriod(daysPassedSinceDate(item.upload_date)));
                        // 썸네일 & 비디오 링크 가져오기
                        const response = await fetch(videoUrl + item.video_id);
                        const videoInfoData = await response.json();
                        targetThumbnailList.push(videoInfoData.image_link);
                        targetVideoLinkList.push(videoInfoData.video_link);
                    }
                }
            }
            async function getOtherTagInfo(x) {
                for (const item of otherListJson) {
                    if ((item.video_tag.includes(videoTag[x]) || item.video_tag.includes(videoTag[x])) && item.video_id !== currVideoId) {
                        cnt++;
                        targetTitleList.push(item.video_title);
                        targetVideoIdList.push(item.video_id);
                        targetChannelList.push(item.video_channel);
                        targetViewAndDateList.push(formatNumber(item.views) + " Views · " + formatTimePeriod(daysPassedSinceDate(item.upload_date)));

                        // 썸네일 & 비디오 링크 가져오기
                        const response = await fetch(videoUrl + item.video_id);
                        const videoInfoData = await response.json();
                        targetThumbnailList.push(videoInfoData.image_link);
                        targetVideoLinkList.push(videoInfoData.video_link);
                    }
                }
            }

            let end = 0;
            function rendering() {

                const otherList = document.getElementsByClassName('other-video')[0];
                otherList.innerHTML = "";
                for (let i = end; i < cnt; i++) {
                    otherList.innerHTML += `
                    <div>
                        <a href="./Video.html?id=${targetVideoIdList[i]}&channel=${targetChannelList[i]}">
                            <div class="other-video-thumbnail">
                                <span class="thumbnail-img" onmouseover="playVideo(event)" onmouseout="stopVideo(event)">
                                    <img src="${targetThumbnailList[i]}"/>
                                    <video src="${targetVideoLinkList[i]}" preload="metadata" style="display:none" controls="true" autoplay muted></video>
                                </span>
                            </div>
                        </a>
                        <div class="other-video-text">
                            <span class="thumnail-text">
                                <span class="thumnail-title" data-video-id="${targetVideoIdList[i]}" data-channel-name="${targetChannelList[i]}" onclick="redirectToOtherVideo(event)">${targetTitleList[i]}</span>
                                <span class="thumnail-channel" data-channel-name="${targetChannelList[i]}" onclick="redirectToChannel(event)">${targetChannelList[i]}</span>
                                <span class="thumnail-views">${targetViewAndDateList[i]}</span>
                            </span>
                        </div>
                    </div>
                    `;
                    end += 1;
                }
            }


            async function renderingAi(filter) {

                let end = 0;
                let filteredVideoList = await filter;
                const otherList = document.getElementsByClassName('other-video')[0];
                otherList.innerHTML = "";
                for (aiList of filteredVideoList) {
                    if (end < 5) {
                        var videoInfoAi = await getData(videoUrl + aiList.video_id.toString())
                        let daysPassed = daysPassedSinceDate(aiList.upload_date);
                        otherList.innerHTML += `
                    <div>
                        <a href="./Video.html?id=${videoInfoAi.video_id}&channel=${videoInfoAi.video_channel}">
                            <div class="other-video-thumbnail">
                                <span class="thumbnail-img" onmouseover="playVideo(event)" onmouseout="stopVideo(event)">
                                    <img src="${videoInfoAi.image_link}"/>
                                    <video src="${videoInfoAi.video_link}" preload="metadata" style="display:none" controls="true" autoplay muted></video>
                                </span>
                            </div>
                        </a>
                        <div class="other-video-text">
                            <span class="thumnail-text">
                                <span class="thumnail-title" data-video-id="${videoInfoAi.video_id}" data-channel-name="${videoInfoAi.video_channel}" onclick="redirectToOtherVideo(event)">${videoInfoAi.video_title}</span>
                                <span class="thumnail-channel" data-channel-name="${videoInfoAi.video_channel}" onclick="redirectToChannel(event)">${videoInfoAi.video_channel}</span>
                                <span class="thumnail-views">${formatNumber(videoInfoAi.views)} Views · ${formatTimePeriod(daysPassed)}</span>
                            </span>
                        </div>
                    </div>
                    `;
                        end += 1;
                    }
                    else {
                        break;
                    }
                }
            }
            await requestOtherListApi();
            await getAllListInfo();
            rendering();
            await getOtherTagInfo();

            document.getElementById('button1').addEventListener('click', async () => {
                try {
                    await getAllListInfo();
                    rendering();
                } catch (error) {
                    console.error('API 호출에 실패했습니다:', error);
                }
            });
            document.getElementById('button2').addEventListener('click', async () => {
                try {
                    await getOtherListInfo();
                    rendering();
                } catch (error) {
                    console.error('API 호출에 실패했습니다:', error);
                }
            });
            document.getElementById('button3').addEventListener('click', async () => {
                try {
                    await getOtherTagInfo(0);
                    rendering();
                } catch (error) {
                    console.error('API 호출에 실패했습니다:', error);
                }
            });
            document.getElementById('button4').addEventListener('click', async () => {
                try {
                    await getOtherTagInfo(1);
                    rendering();
                } catch (error) {
                    console.error('API 호출에 실패했습니다:', error);
                }
            });
            let targetVideoId = queryParams.id
            async function getSimilarity(firstWord, secondWord) {
                const openApiURL = "http://aiopen.etri.re.kr:8000/WiseWWN/WordRel";
                const access_key = "af31e56b-0aa7-49a2-8275-8c95da5481ed";

                let requestJson = {
                    argument: {
                        first_word: firstWord,
                        second_word: secondWord,
                    },
                };

                let response = await fetch(openApiURL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: access_key,
                    },
                    body: JSON.stringify(requestJson),
                });
                let data = await response.json();
                return data.return_object["WWN WordRelInfo"].WordRelInfo.Distance;
            }



            async function calculateVideoSimilarities(videoList, targetTagList) {
                let filteredVideoList = [];

                for (let video of videoList) {
                    let totalDistance = 0;
                    let promises = [];

                    for (let videoTag of video.video_tag) {
                        for (let targetTag of targetTagList) {
                            if (videoTag == targetTag) {
                                promises.push(0);
                            } else {
                                promises.push(getSimilarity(videoTag, targetTag));
                            }
                        }
                    }

                    let distances = await Promise.all(promises);

                    for (let distance of distances) {
                        if (distance !== -1) {
                            totalDistance += distance;
                        }
                    }

                    if (totalDistance !== 0) {
                        if (targetVideoId !== video.video_id) {
                            filteredVideoList.push({ ...video, score: totalDistance });
                        }
                    }
                }

                filteredVideoList.sort((a, b) => a.score - b.score);

                filteredVideoList = filteredVideoList.map((video) => ({
                    ...video,
                    score: 0,
                }));
                return filteredVideoList;
            }

            let filteredVideoList = await calculateVideoSimilarities(
                otherListJson,
                videoTag
            );
            document.getElementById('button5').addEventListener('click', async () => {
                try {
                    renderingAi(filteredVideoList);
                } catch (error) {
                    console.error('API 호출에 실패했습니다:', error);
                }
            });
        }

        // 로컬 스토리지에 저장되어 있던 댓글 불러오기
        function getSavedComments() {
            const commentsArray = JSON.parse(localStorage.getItem(`comment-${currVideoId}`));
            const commentCntElem = document.getElementsByClassName("comment-cnt")[0];
            commentCntElem.innerText = `댓글 ${commentsArray.length}개`
            if (commentsArray !== null) {
                for (let comment of commentsArray) {
                    if ((comment['like'] <= 0) && (comment['dislike'] <= 0)) {
                        drawCommentInDocument(comment['content'], comment['name'], comment['date'], comment['id'], likeDefDir, dislikeDefDir, comment['like'], comment['dislike']);
                    } else if ((comment['like'] > 0) && (comment['dislike'] <= 0)) {
                        drawCommentInDocument(comment['content'], comment['name'], comment['date'], comment['id'], likeActDir, dislikeDefDir, comment['like'], comment['dislike']);
                    } else if ((comment['like'] <= 0) && (comment['dislike'] > 0)) {
                        drawCommentInDocument(comment['content'], comment['name'], comment['date'], comment['id'], likeDefDir, dislikeActDir, comment['like'], comment['dislike']);
                    } else {
                        drawCommentInDocument(comment['content'], comment['name'], comment['date'], comment['id'], likeActDir, dislikeActDir, comment['like'], comment['dislike']);
                    }
                }
            }
        }

        Promise.all([videoPromise])
            .then((results) => {
                const data_video = results[0];
                otherListData(videoListUrl, data_video);
                getSavedComments();
            })
            .catch((error) => {
                console.error("Error occurred:", error);
            });


    } else {
        console.log("No query parameters found.");
    }


});
//우측 사이드 버튼 클릭 시 색상변경
function changeBackground(clickedButton) {
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        if (button.id === 'button' + clickedButton) {
            button.style.backgroundColor = 'white';
            button.style.color = "black";
        } else {
            button.style.backgroundColor = 'black';
            button.style.color = "white";
        }
    });
}

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

        // 현재 채널 정보
        const userImageSrc = document.querySelector('.user-avatar img').getAttribute('src');
        const userName = document.getElementsByClassName('user_name')[0].innerText;


        //로컬스토리지에서 삭제하려는 변수 지정
        var subHtml = `<a href="./Channel.html?channel=${userName}">
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

    } else {
        // 현재 채널 정보
        const userImageSrc = document.querySelector('.user-avatar img').getAttribute('src');
        const userName = document.getElementsByClassName('user_name')[0].innerText;

        // 사이드바에 추가
        const subscibers = document.getElementById('show-more-sub');

        // 사이드바에 추가할 HTML 변수 지정
        var subHtml = `<a href="./Channel.html?channel=${userName}">
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


const commentInput = document.getElementsByClassName('comment-area')[0];

function getUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


// 로컬 스토리지에 댓글 저장
function saveCommentInLocalStorage(key, name, date, content) {
    const uuid = getUUID();
    if (localStorage.getItem(key) === null) {
        const commentsArray = [
            {
                "id": uuid,
                "name": name,
                "date": date,
                "content": content,
                "like": 0,
                "dislike": 0
            }
        ];
        localStorage.setItem(key, JSON.stringify(commentsArray));
    }
    else {
        const commentsArray = JSON.parse(localStorage.getItem(key));
        commentsArray.push(
            {
                "id": uuid,
                "name": name,
                "date": date,
                "content": content,
                "like": 0,
                "dislike": 0
            }
        );
        localStorage.setItem(key, JSON.stringify(commentsArray));
    }
    return uuid;
}

// 댓글 화면에 그리기
function drawCommentInDocument(replyText, name, date, uuid, likeDir, dislikeDir, likeCnt = 0, dislikeCnt = 0) {
    const comments = document.getElementsByClassName("comments")[0];
    comments.insertAdjacentHTML(
        'beforeend',
        `
    <div class="comment" data-uuid="${uuid}">
        <div class="comments-pic">
        <img src="./img/avatar/User-Avatar.svg" alt="User Avatar" />
        </div>
        <div class="comments-info">
        <div class="comments-id">
            <span> ${name} · ${date} </span>
        </div>
        <div class="comments-text">
            ${replyText}
        </div>
        <div class="comments-btn">
            <button class="likeBtn" onclick="likeAndDislikeBtnClick(event)" >
            <img src="${likeDir}.svg" alt="" /><span>${likeCnt}</span>
            </button>
            <button class="dislikeBtn" onclick="likeAndDislikeBtnClick(event)">
            <img src="${dislikeDir}.svg" alt="" /><span>${dislikeCnt}</span>
            </button>
            <button><img src="./img/video/reply.svg" alt="" /></button>
        </div>
        </div>
    </div>
    `);
}

function getTodayFormmatingApi() {
    const tmp = Intl.DateTimeFormat('kr')
        .format(new Date()) // 2023. 08. 03.
        .replaceAll(" ", "") // 2023.8.3.
        .replace(".", "/") // 2023/8.3.
        .replace(".", "/") // 2023/8/3.
        .replace(".", ""); // 2023/8/3
    return tmp;
}

function updateCommentCnt() {
    const commentCntElem = document.getElementsByClassName("comment-cnt")[0];
    const tmp = commentCntElem.innerText.split(" ")[1];
    const newCnt = parseInt(tmp.slice(0, tmp.length - 1)) + 1;
    commentCntElem.innerText = `댓글 ${newCnt}개`;
}

// 댓글다는 기능
function addReply() {
    // 댓글 단 내용 가져오기
    const replyText = document.getElementsByClassName("comment-area")[0].value;
    // 인풋바 초기화
    document.getElementsByClassName("comment-area")[0].value = '';

    const replyKey = `comment-${currVideoId}`;
    const dateString = daysPassedSinceDate(getTodayFormmatingApi()) + "일 전";

    const uuid = saveCommentInLocalStorage(replyKey, "7-eleven-team", dateString, replyText);
    drawCommentInDocument(replyText, "7-eleven-team", dateString, uuid, likeDefDir, dislikeDefDir);
    updateCommentCnt();
}

commentInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addReply();
    }
});

// 로컬 스토리지에 저장된 댓글 좋아요 수정시 사용
function editComment(targetKey, value, uuid) {
    const key = `comment-${currVideoId}`;
    const commentsArray = JSON.parse(localStorage.getItem(key));
    for (let comment of commentsArray) {
        if (comment['id'] === uuid) {
            comment[targetKey] = value;
        }
    }
    localStorage.setItem(key, JSON.stringify(commentsArray));
}

const commentBtns = document.getElementsByClassName('comments-btn')[0];
function likeAndDislikeBtnClick(event, elem = "comment") {
    let buttonElem = 0;
    let imgElem = 0;
    let spanElem = 0;
    let uuid = 0;

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
    uuid = buttonElem.parentElement.parentElement.parentElement.getAttribute("data-uuid");

    // 이미 좋아요를 한 상태라면
    // TODO - 지금은 꼼수 씀. 개선 필요
    if (parseInt(spanElem.innerText) >= 1) {
        spanElem.innerHTML = cnt - 1;
        buttonElem.removeAttribute('data-is-activated');
        imgElem.removeAttribute('style');
        if (buttonElem.className === 'likeBtn') {
            if (elem === "comment") editComment('like', cnt - 1, uuid);
            imgElem.setAttribute("src", "./img/video/like.svg");
        } else {
            if (elem === "comment") editComment('dislike', cnt - 1, uuid);
            imgElem.setAttribute("src", "./img/video/Disliked.svg");
        }
    }
    else {
        spanElem.innerText = cnt + 1;
        buttonElem.setAttribute('data-is-activated', 'true')
        if (buttonElem.className === 'likeBtn') {
            if (elem === "comment") editComment('like', cnt + 1, uuid);
            imgElem.setAttribute("src", "./img/video/like-activated.svg");
        } else {
            if (elem === "comment") editComment('dislike', cnt + 1, uuid);
            imgElem.setAttribute("src", "./img/video/Disliked-activated.svg");
        }
    }
};


// 채널 화면으로 이동
function redirectToChannel(event) {
    window.location.href = `./Channel.html?channel=${event.target.getAttribute("data-channel-name")}`;
}

// 다른 비디오 화면으로 이동
function redirectToOtherVideo(event) {
    const targetVideoId = event.target.getAttribute('data-video-id');
    const targetChannelName = event.target.getAttribute('data-channel-name');
    window.location.href = `./Video.html?id=${targetVideoId}&channel=${targetChannelName}`;
}

// 비디오 재생 이벤트
function playVideo(event) {
    setTimeout(() => {
        const videoElement = event.target.parentElement.querySelector('video');
        const thumbnailImg = event.target.parentElement.querySelector('img');
        thumbnailImg.style.display = "none";
        videoElement.style.display = "block";
        videoElement.play();
    }, 300);
}

function stopVideo(event) {
    setTimeout(() => {
        const videoElement = event.target.parentElement.querySelector('video');
        const thumbnailImg = event.target.parentElement.querySelector('img');
        videoElement.style.display = "none";
        thumbnailImg.style.display = "block";
        videoElement.pause();
        videoElement.currentTime = 0;
    }, 300); // 0.3초 딜레이 추가 (300ms)
}
