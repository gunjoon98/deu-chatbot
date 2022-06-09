//소켓 연결
const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/bot/'
);

//종료 (readyState 속성이 closed로 바뀌었을때 CloseEvent 발생)
chatSocket.onclose = function(e) 
{
   AnswerAppend("서버와 연결이 끊겼어요. 다시 연결해주세요 😉");
};

//질문 추가
function QuestionAppend(message)
{
    if(message == null)
    {
        return;
    }

    var today = new Date();
    var time_str = (today.toLocaleTimeString("ko-kr").slice(0,8));
    var messageContainer = document.querySelector(".container");
    var text = 
    `
    <div class="message self">
        <div class="message-wrapper">
            <div class="message-content"><span>` + message +`</span></div>
        </div>
        <div class="message-options">
            <span class="message-date">` + time_str + `</span>
        </div>
    </div>
    `
    //문자열 한 행(\n) 마다 앞 뒤 공백 제거 후 \n 제거
    text = text.replace(/^\s+|\s+$/gm,'').replace(/\n/gm,"");

    messageContainer.insertAdjacentHTML('beforeend', text);

    //스크롤
    document.querySelector('.chat-finished').scrollIntoView({
        block: 'end',          
        behavior: 'auto'
    });
}

//대답 추가
function AnswerAppend(message)
{
    if(message == null)
    {
        return;
    }

    var today = new Date();
    var time_str = (today.toLocaleTimeString("ko-kr").slice(0,8));
    var messageContainer = document.querySelector(".container");
    var text = 
    `
    <div class="message">
        <div class="message-wrapper">
            <div class="message-content">` + message + `</div>
        </div>
        <div class="message-options">
            <div class="avatar avatar-sm"><img alt="" src="/static/custom/deuLogo.png"></div>
            <span class="message-date">` + time_str + `</span>
        </div>
    </div>
    `
    //문자열 한 행(\n) 마다 앞 뒤 공백 제거 후 \n 제거
    text = text.replace(/^\s+|\s+$/gm,'').replace(/\n/gm,"");

    //애니메이션 동작 중
    if(messageContainer.getElementsByClassName("three-balls")[0] !== undefined)
    {
        messageContainer.lastChild.innerHTML = text;
    }
    else
    {
        messageContainer.insertAdjacentHTML('beforeend', text);
    }

    //스크롤
    document.querySelector('.chat-finished').scrollIntoView({
        block: 'end',          
        behavior: 'auto'
    });
}

//애니메이션 추가
function AnswerAnimation()
{
    var today = new Date();
    var time_str = (today.toLocaleTimeString("ko-kr").slice(0,8));
    var messageContainer = document.querySelector(".container");

    var text = 
    `
    <div class="message">
        <div class="message-wrapper">
            <div class="message-content">
                <div class="three-balls">
                    <div class="ball1"></div>
                    <div class="ball2"></div>
                    <div class="ball"></div>
                </div>
            </div>
        </div>
        <div class="message-options">
            <div class="avatar avatar-sm"><img alt="" src="/static/custom/deuLogo.png"></div>
            <span class="message-date">` + time_str + `</span>
        </div>
    </div>
    `

    //문자열 한 행(\n) 마다 앞 뒤 공백 제거 후 \n 제거
    text = text.replace(/^\s+|\s+$/gm,'').replace(/\n/gm,"");

    messageContainer.insertAdjacentHTML('beforeend', text);

    //스크롤
    document.querySelector('.chat-finished').scrollIntoView({
        block: 'end',          
        behavior: 'auto'
    });
}

//질문 전송 및 질문 추가
function QuestionSend(message)
{
    //연결이 안됬음
    if(chatSocket.readyState !== chatSocket.OPEN)
    {
        return;
    }

    //허용하지 않는 값
    if(message == null || message === "") 
    { 
        return;
    }

    //애니메이션 동작 중(아직 대답이 안옴)
    var messageContainer = document.querySelector(".container");
    if(messageContainer.getElementsByClassName("three-balls")[0] !== undefined)
    {
        return;
    }

    //질문 추가
    QuestionAppend(message);

    //애니메이션 추가
    AnswerAnimation();

    //전송(json 형식)
    chatSocket.send(JSON.stringify({
        'message': message
    }));
}

//Enter 키 누름
document.getElementById('messageInput').addEventListener('keydown',function(event)
{
    event.stopPropagation()
    if(event.keyCode === 13)
    {
        event.preventDefault();
        document.getElementById('messageButten').click();
    }
});

//입력 버튼 누름
document.getElementById('messageButten').addEventListener('click', function(event)
{
    event.stopPropagation()
    const messageInputDom = document.querySelector('#messageInput');
    const message = messageInputDom.value;     
    QuestionSend(message);
    messageInputDom.value = '';
});

//리스트 내 a태그 누름
function list_click(menu)
{
    if(document.querySelector("#chatContactTab > li.contacts-item.friends.active") !== null)
    {
        document.querySelector("#chatContactTab > li.contacts-item.friends.active").classList.remove("active");
    }

    elements = document.querySelectorAll("#chatContactTab > li");
    for(var i=0; i<elements.length; i++)
    {
        if(elements[i].innerText === menu)
        {
            elements[i].classList.add("active");
            QuestionSend(menu);
            return;
        }
    }
}

//답변 내 버튼 누름
document.getElementById("messageBody").addEventListener('click', function(event)
{    
    if(event.target instanceof HTMLButtonElement)
    {
        var clickNode = event.target;
        var message = "";

        if(clickNode.className.includes("hyomin_breakfast"))
        {
            message = "효민생활관 조식";
            QuestionSend(message);
        }
        else if(clickNode.className.includes("hyomin_lunch"))
        {
            message = "효민생활관 중식";
            QuestionSend(message);
        }
        else if(clickNode.className.includes("hyomin_dinner"))
        {
            message = "효민생활관 석식";
            QuestionSend(message);
        }
        else if(clickNode.className.includes("hangbok_breakfast"))
        {
            message = "행복기숙사 조식";
            QuestionSend(message);
        }
        else if(clickNode.className.includes("hangbok_lunch"))
        {
            message = "행복기숙사 중식";
            QuestionSend(message);
        }
        else if(clickNode.className.includes("hangbok_dinner"))
        {
            message = "행복기숙사 석식";
            QuestionSend(message);
        }
        else if(clickNode.className.includes("library_popularity_list"))
        {
            message = "인기 대출 도서";
            QuestionSend(message);
        }
        else if(clickNode.className.includes("library_takeout_deadline"))
        {
            message = "대출 권수";
            QuestionSend(message);
        }
    }
});

//대답 수신 및 대답 추가 (서버로부터 메시지가 도착했을 때 Event 발생)
 chatSocket.onmessage = function(event) 
 {
    const data = JSON.parse(event.data);
    var message = "";

    switch(data.intentName)
    {
        case "첫인사":
            message = 
            `
            <p>안녕하세요! 동의대학교 비공식 챗봇 초아에요. 😊<br>
            궁금한 점이 있으시다면 왼쪽 메뉴(◀)를 클릭하시거나 질문을 입력하시면 초아가 답변해드려요! 😘</p> 
            `
            break;

        case "default":
            message =
            `
            <p>죄송해요. 답변을 찾지 못했어요. 😢</br>
            열심히 공부해서 더 많은 질문에 대답할 수 있는 챗봇 초아가 될게요!</p>
            `
            break;

        case "안녕":
            message = 
            `
            <p>안녕하세요! 오늘도 와주셔서 감사해요. 😊 <br>
            열심히 공부하는 챗봇 초아가 될게요!</p>
            `  
            break;
            
        case "학식 메뉴":
            message = 
            `
            <p>메뉴가 궁금하시다면 아래 버튼을 클릭해 주세요! 🙂 </p>

            <span>⭐효민 생활관</span>
            <div class="form-row">
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-light btn-lg border border-secondary hyomin_breakfast">조식 메뉴</button>
                        <button type="button" class="btn btn-light btn-lg border border-secondary hyomin_lunch">중식 메뉴</button>
                        <button type="button" class="btn btn-light btn-lg border border-secondary hyomin_dinner">석식 메뉴</button>
                    </div>
                </div>
            </div>

            <span>⭐행복 기숙사</span>
            <div class="form-row">
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-light btn-lg border border-secondary hangbok_breakfast">조식 메뉴</button>
                        <button type="button" class="btn btn-light btn-lg border border-secondary hangbok_lunch">중식 메뉴</button>
                        <button type="button" class="btn btn-light btn-lg border border-secondary hangbok_dinner">석식 메뉴</button>
                    </div>
                </div>
            </div>
            <a href="`+ data.url + `" target="_blank">⭐ 기숙사 홈페이지 링크</a>
            `
            break;

        case "학식 메뉴[상세]":
            message = 
            `<p>오늘의 ` + data.menu_place + ` ` + data.menu_time + `메뉴 입니다. 🙂</p>
            <span>` + data.data1 + `<br>` + data.data2 + `</span>`
            break;

        case "날씨":
            message =
            `
            <p>동의대학교 날씨 입니다. 🙂</p>

            <div class="form-row">
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <div class="card text-center text-white bg-dark mb-3" style="width: 15rem;">
                        <div class="card-body">
                            <h5 class="card-title">Today</h5>
                            <p class="card-text">` + data.today_description + `</br> 최고 온도 : ` + data.today_tempMax + '</br> 최저 온도 : ' + data.today_tempMin + `</br> 비 올 확률 : ` + data.today_pop + `% </p>
                            <img alt="" src="/static/custom/weather/` + data.today_iconImage + `.png" style="width:100px;">
                        </div>
                    </div>                
                </div>
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <div class="card text-center text-white bg-dark mb-3" style="width: 15rem;">
                        <div class="card-body">
                            <h5 class="card-title">Tomorrow</h5>
                            <p class="card-text">` + data.tom_description + `</br> 최고 온도 : ` + data.tom_tempMax + '</br> 최저 온도 : ' + data.tom_tempMin + `</br> 비 올 확률 : ` + data.tom_pop + `% </p>
                            <img alt="" src="/static/custom/weather/` + data.tom_iconImage + `.png" style="width:100px;">
                        </div>
                    </div>                
                </div>
            </div>
            <a href="` + data.url + `" target="_blank">⭐ 기상청 일기예보 홈페이지 링크</a>
            `
            break;

        case "편의 시설":
            var con_dict = data.con_dict;
            var tbody_html = "";

            for(var key in con_dict)
            {
                var store_list = con_dict[key];
                var stores = "";
                for(var index=0; index<store_list.length; index++)
                {
                    stores += store_list[index] + ", ";
                }
                stores = stores.slice(0,-2);
                tbody_html += 
                `
                <tr>
                    <td>`+ key +`</td>
                    <td>`+ stores +`</td>
                </tr>
                `
            }
            
            message =
            `
            <p>동의대학교 내 모든 편의 시설입니다. 🙂</p>

            <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">건물</th>
                        <th scope="col">편의시설</th>
                    </tr>
                    </thead>
                    <tbody>`+ tbody_html +`</tbody>
                </table>
            </div>

            `
            break;
        
        case "학사 일정":
            var cal_dict = data.cal_dict
            var tbody_html = "";

            for(var key in cal_dict)
            {
                var cal_list = cal_dict[key];
                var cal = "";
                for(var i=0; i<cal_list.length; i++)
                {
                    cal += cal_list[i] + ", ";
                }
                cal = cal.slice(0,-2);
                cal += "일";
                tbody_html += 
                `
                <tr>
                    <td>`+ key +`</td>
                    <td>`+ cal +`</td>
                </tr>
                `
            }

            message =
            `
            <p>이번달 학사 일정입니다. 🙂</p>

            <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">학사 일정</th>
                        <th scope="col">날짜</th>
                    </tr>
                    </thead>
                    <tbody>`+ tbody_html +`</tbody>
                </table>
            </div>

            `
            break;
        
        case "장학금":
            IDtab1 = 'tab1' + Math.random().toString().replace(/\./g,'');
            IDtab2 = 'tab2' + Math.random().toString().replace(/\./g,'');
            IDtab3 = 'tab3' + Math.random().toString().replace(/\./g,'');
            message = 
            `
            <p> 장학금 유형입니다. 🙂</p>

            <ul class="nav nav-tabs" id="myTab">
                <li class="nav-item">
                    <a class="nav-link active" data-toggle="tab" href="#`+ IDtab1 +`">Page 1</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#`+ IDtab2 +`">Page 2</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#`+ IDtab3 +`">Page 3</a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane fade show active" id="`+ IDtab1 +`">
                    <p></br>` + data.result_str1.replace(/\n/g, '</br></br>').replace(/:/g, '</br>') + `</p>
                </div>
                <div class="tab-pane fade" id="`+ IDtab2 +`">
                    <p></br>` + data.result_str2.replace(/\n/g, '</br></br>').replace(/:/g, '</br>') + `</p>
                </div>
                <div class="tab-pane fade" id="`+ IDtab3 +`">
                    <p></br>` + data.result_str3.replace(/\n/g, '</br></br>').replace(/:/g, '</br>') + `</p>
                </div>
            </div>
            <a href="` + data.url + `" target="_blank">⭐ 장학금 공지사항 링크</a>
            `
            break;

        case "캠퍼스맵":
            message = 
            `
            <p>동의대학교 캠퍼스맵이 궁금하시다면 아래 버튼을 클릭해 주세요! 🙂</p>

            <span>⭐동의대학교 캠퍼스맵</span>
            <div class="form-row">
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <a role="button" class="btn btn-light btn-lg border border-secondary" target="_blank" href="`+ data.url +`")>캠퍼스맵</a>
                </div>
            </div>
            `
            break;

        case "휴학/복학":
            message =
            `
            <p>휴학/복학이 궁금하시다면 아래 버튼을 클릭해 주세요! 🙂</p>

            <span>⭐휴학</span>
            <div class="form-row">
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <a role="button" class="btn btn-light btn-lg border border-secondary" target="_blank" href="`+ data.aLeaveOfAbsense_url +`")>휴학</a>
                        <a role="button" class="btn btn-light btn-lg border border-secondary" target="_blank" href="`+ data.aLeaveOfAbsenseExtension_url +`")>휴학 연장</a>
                        <a role="button" class="btn btn-light btn-lg border border-secondary" target="_blank" href="`+ data.aLeaveOfAbsenseAlteration_url +`")>휴학 변경</a>
                    </div>
                </div>
            </div>

            <span>⭐복학</span>
            <div class="form-row">
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <div><a role="button" class="btn btn-light btn-lg border border-secondary" target="_blank" href="`+ data.returnToSchool_url +`")>복학</a></div>
                </div>
            </div>

            <span>⭐자주하는질문 FAQ</span>
            <div class="form-row">
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <div><a role="button" class="btn btn-light btn-lg border border-secondary" target="_blank" href="`+ data.FAQ_url +`")>FAQ</a></div>
                </div>
            </div>
            <a href="` + data.url + `" target="_blank">⭐ 학사지원팀 홈페이지 링크</a>
            `
            break;

        case "시험 일정":
            var remainDayStr = ""
            if(data.remainDay === "진행")
                remainDayStr = "드디어 시험이네요! 화이팅! 💯🙏"
            else if(data.remainDay === "완료")
                remainDayStr = "올해는 더 이상 시험이 없네요. 수고하셨어요!"
            else
                remainDayStr = "시험 시작일까지 D-" + data.remainDay + "일 남았어요!"
            
            message =
            `
            <p>다음 시험 일정입니다. 🙂</p>

            <span>` + data.examType + ' ' + data.examStartDate + ' ~ ' + data.examEndDate + '</br>' + remainDayStr + `</br></br>
            <a href="`+ data.url +`" target="_blank">⭐ 학사일정 홈페이지 링크</a>
            `
            break;

        case "도서관":
            message = 
            `
            <p>도서관 관련 정보입니다. 🙂</p>
            
            <span>⭐좌석 예약</br></br>
            도서관 내의 키오스크에서 좌석을 배정받거나 인터넷으로 예약할 수 있어요!</br>
            노트북을 써야하면 노트북 열람실을 이용하세요! (노트북 전용실, 충전 포트 제공)</br></br></span>

            <span>⭐스터디룸 예약</br></br>
            동의대학교 홈페이지 내의 예약 신청에 의해서만 이용인원이 최소인원(2명) 이상일 경우에만 신청 가능해요.</br>
            신청자는 이용시간에 맟춰 데스크에 방문하여 담당자로부터 확인 절차를 거친후 입실해요.</br></br></span>

            <span>⭐좌석/스터디룸 예약</span>
            <div class="form-row">
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <div><a role="button" class="btn btn-light btn-lg border border-secondary" target="_blank" href="`+ data.seat_reservation_url +`")>예약</a></div>
                </div>
            </div>

            <span>⭐인기 대출 도서</span>
            <div class="form-row">
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <button type="button" class="btn btn-light btn-lg border border-secondary library_popularity_list">도서 목록</button>
                </div>
            </div>

            <span>⭐도서 대출 권수</span>
            <div class="form-row">
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <button type="button" class="btn btn-light btn-lg border border-secondary library_takeout_deadline">대출 권수</button>
                </div>
            </div>

            <span>⭐도서 신청</span>
            <div class="form-row">
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <div><a role="button" class="btn btn-light btn-lg border border-secondary" target="_blank" href="`+ data.book_request_url +`")>도서 신청</a></div>
                </div>
            </div>
            `
            break;

        case "도서관[인기대출도서]":
            bookNameList = data.bookNameList;
            bookCountList = data.bookCountList;
            tbody_html = "";

            for(var index=0; index<bookNameList.length; index++)
            {
                tbody_html += 
                `
                <tr>
                    <th scope="row">`+ (index+1).toString() +`</th>
                    <td>`+ (bookCountList[index]).toString() +`</td>
                    <td>`+ bookNameList[index] +`</td>
                </tr>
                `
            }
            
            message =
            `
            <p>인기 대출 도서 목록입니다. 🙂</p>
            <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">순위</th>
                        <th scope="col">대출 횟수</th>
                        <th scope="col">책 이름</th>
                    </tr>
                    </thead>
                    <tbody>`+ tbody_html +`</tbody>
                </table>
            </div>
            `
            break;

        case "대출 권수":
            typeList = data.typeList;
            limitNumList = data.limitNumList;
            deadLineList = data.deadLineList;
            tbody_html = "";

            for(var index=0; index<typeList.length; index++)
            {
                tbody_html += 
                `
                <tr>
                    <td>`+ typeList[index] +`</td>
                    <td>`+ limitNumList[index] +`</td>
                    <td>`+ deadLineList[index] +`</td>
                </tr>
                `
            }

            message =
            `
            <p>도서별 최대 대출 권수입니다. 🙂</p>
            <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">도서 유형</th>
                        <th scope="col">최대 대출 권수</th>
                        <th scope="col">최대 대출 기한</th>
                    </tr>
                    </thead>
                    <tbody>`+ tbody_html +`</tbody>
                </table>
            </div>
            `
            break;

       case "수강 신청":
           message =
           `
            <p>수강신청 관련 정보입니다. 🙂</p>

            <span>⭐수강 신청</br></br>
            동의대 공지사항에서 수강 신청 일정 확인 후 수강 신청 페이지에서 수강 신청하시면 되요!</br></span>
            <div class="form-row">
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <a role="button" class="btn btn-light btn-lg border border-secondary" target="_blank" href="`+ data.url +`")>수강 신청 페이지</a>
                        <a role="button" class="btn btn-light btn-lg border border-secondary" target="_blank" href="`+ data.manualPDF_url +`")>수강 신청 메뉴얼 PDF</a>
                    </div>
                </div>
            </div>

            <span>⭐졸업 학점 확인</br></br>
            DAP 시스템 접속 -> 학생정보시스템 -> 수강 정보-> 개인별미이수과목 에서 확인할 수 있어요!</br></span>
            <div class="form-row">
                <div class="col" style="padding-top:20px; padding-bottom:20px;">
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <a role="button" class="btn btn-light btn-lg border border-secondary" target="_blank" href="`+ data.curriculum_url +`")>2022년 교육 과정</a>
                    </div>
                </div>
            </div>
           `
           break;

    }
    AnswerAppend(message);
};





