const toggleContent = document.querySelector('.sidebar-body');
const sections = document.querySelector('section');
const nav = document.querySelector('nav');

async function hamburger() {
  // 사이드바의 토글 기능을 구현합니다.
  if (toggleContent.classList.contains('active')) {
    // toggleContent.style.display = 'block'; // 사이드바를 나타냅니다.
    toggleContent.classList.toggle('active');
    nav.classList.toggle('active');
    // nav.style.paddingLeft = "240px"; // 메인 컨텐츠의 왼쪽 여백을 조정하여 사이드바가 보이도록 합니다.
  } else {
    // toggleContent.style.display = 'none'; // 사이드바를 숨깁니다.
    toggleContent.classList.toggle('active');
    nav.classList.toggle('active');
    // nav.style.paddingLeft = "0px"; // 메인 컨텐츠의 왼쪽 여백을 초기화합니다.
  }
}

// toggleButton.addEventListener('click', () => { //해당 코드가 작동하기 위해선
//     // 태그를 숨기거나 나타내는 토글 기능을 구현
//     if (toggleContent.placeholder === 'none') {
//         toggleContent.placeholder = 'search'; // 나타냄
//     } else {
//         toggleContent.placeholder = 'none'; // 숨김
//     }
//     });

// a태그 삭제필요

//로고 및 aside home 버튼 클릭시 홈화면 이동
function redirectToHome() {
  window.location.href = 'index.html';
}


//검색창 버튼
const searchTextvalue = document.querySelector("#searchInput");
function searchHome() {
  const searchText = searchTextvalue.value.trim(); // 검색어를 얻어옴 (양쪽 공백 제거)
  if (searchText !== "") {
    localStorage.setItem("searchText", searchText); // 검색어를 localStorage에 저장
    window.location.href = "./index.html"; // home.html로 이동
  }
}

//검색창 엔터키 눌렀을때
async function homeEnterkey(event) {
  if (event.keyCode === 13) {
    const searchText = searchTextvalue.value.trim(); // 검색어를 얻어옴 (양쪽 공백 제거)
    if (searchText !== "") {
      localStorage.setItem("searchText", searchText);

      // home.html로 이동
      window.location.href = "./index.html";
    }
  }
}


