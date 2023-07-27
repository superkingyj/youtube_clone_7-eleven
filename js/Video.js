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

                function daysPassedSinceDate(dateString) {
                    const date = new Date(dateString); // 입력받은 날짜 문자열을 Date 객체로 변환
                    const currentDate = new Date(); // 현재 날짜를 구함
                  
                    // 입력된 날짜와 현재 날짜의 타임스탬프 차이 계산
                    const timeDifferenceInMilliseconds = currentDate - date;
                    const daysPassed = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
                  
                    return Math.floor(daysPassed); // 소수점 이하는 버림하여 정수값으로 반환
                }                
                const daysPassed = daysPassedSinceDate(data_video.upload_date); 


                // section 부분 자바스크립트
                document.getElementById("main-video").innerHTML = `
                <video class="video" width=640px height=360px src="${data_video.video_link}" controls></video>
                <section class="video-info">                    
                    <div class="video-title">${data_video.video_title}</div>
                    <div class="video-info-desc">
                        <div class="info-text">${formatNumber(data_video.views)} • ${daysPassed}일전</div>
                        <div class="info-buttons">
                            <div class="up">up</div>
                            <div class="down">down</div>
                            <div class="share">share</div>
                            <div class="save">save</div>
                            <div class="etc">...</div>
                        </div>
                    </div>
                </section>
                `;
                document.querySelector(".user_name").textContent = data_video.video_channel
                document.querySelector(".desc").textContent = data_video.video_detail                                
            } catch (error) {
                console.error('API 호출에 실패했습니다:', error);
            }
        }                
        videoData(videoUrl+queryParams.video)

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
                document.querySelector(".user-avatar img").src = channelUrl.channel_profile
                document.querySelector(".user_sub").textContent = formatNumber(channelUrl.subscibers) + " subscibers"                
            } catch (error) {
                console.error('API 호출에 실패했습니다:', error);
            }
        }
        channelData(channelUrl+queryParams.channel)


        //비디오 목록이 필요한 부분        
        
        
    } else {
        console.log("No query parameters found.");
    }
});