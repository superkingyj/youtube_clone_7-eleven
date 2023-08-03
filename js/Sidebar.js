//side2 - show more 클릭 기능
function toggleSide2() {
    var side2 = document.getElementById('show-more');
    side2.style.display = side2.style.display === 'none' ? 'block' : 'none';
}
    
//side3 - subscription 부분 show more 클릭 기능
function toggleSide3() {
    var side3 = document.getElementById('show-more-sub');
    side3.style.display = side3.style.display === 'none' ? 'flex' : 'none';
}
    

//구독 채널 목록 불러오기
var sub_list = JSON.parse(localStorage.getItem('sub'));
const subscibers = document.getElementById('show-more-sub');
//사이드바에 HTML 변수 추가

console.log(sub_list)
for (const list of sub_list){
    subscibers.insertAdjacentHTML('beforeend',list);
}

