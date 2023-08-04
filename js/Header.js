const toggleButton = document.querySelector('.top-left-icons img');
const toggleContent = document.querySelector('.sidebar-body');
const sections = document.querySelector('section');

toggleButton.addEventListener('click', () => {
  // 태그를 숨기거나 나타내는 토글 기능을 구현
  if (toggleContent.style.display === 'none') {
    toggleContent.style.display = 'block'; // 나타냄    
    sections.style.paddingLeft = "240px";

  }
  else {
    toggleContent.style.display = 'none'; // 숨김
    sections.style.paddingLeft = "0px";
  }
});


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
const searchTextbox = document.querySelector("#searchInput"); 
function searchHome() {
  const searchText = searchTextbox.value.trim(); // 검색어를 얻어옴 (양쪽 공백 제거)
  if (searchText !== "") {
    localStorage.setItem("searchText", searchText); // 검색어를 localStorage에 저장
    window.location.href = "./index.html"; // home.html로 이동
  }
}

//검색창 엔터키 눌렀을때
async function homeEnterkey(event) {
  if (event.keyCode === 13) {
    const searchText = searchTextbox.value.trim(); // 검색어를 얻어옴 (양쪽 공백 제거)
    if (searchText !== "") {
      localStorage.setItem("searchText", searchText);

      // home.html로 이동
      window.location.href = "./index.html";
    }
  }
}