# 동의대 챗봇 '초아'
동의대학교 학생이 제작한 동의대 챗봇입니다. 학생들이 챗봇 초아를 통해 복잡한 홈페이지를 탐험하지 않고 정보를 쉽게 얻을 수 있도록 제작했습니다.

## Domain
http://deubot.com (현재 닫혀 있음)

## Menu
챗봇 초아는 웹을 통해 서비스를 제공합니다. 아래 10개의 주제에 대한 답변을 지원합니다.

+ 학식메뉴
+ 학사일정
+ 장학금
+ 수강 신청
+ 시험 일정
+ 도서관
+ 날씨
+ 편의 시설
+ 휴학/복학
+ 캠퍼스맵

## Description
![캡처](https://user-images.githubusercontent.com/48176143/192128304-99cd3c37-682a-4d1b-8153-183d1b93f490.PNG)

+ 웹 UI는 JS로 웹 디자인은 bootstrap 템플릿을 변형해 구현합니다.
+ AWS EC2, Nginx, Gunicorn, Daphne로 배포 서버를 구축합니다.
+ Google Dialogflow Api로 챗봇을 구현합니다.
+ 날씨 데이터는 OpenWeather Api를, 학식 데이터는 크롤링을 통해 가져옵니다.

사용자가 웹서버로 질문을 보내면 웹서버는 google dialogflow api를 통해 질문이 어느 주제(인텐트)에 속하는지 확인합니다. 그 후 해당 주제에 맞는 답변을 사용자에게
제공하는 구조입니다. 사용자에게 답변을 제공할 때 DB의 정보를 사용하고 학식이나 날씨 등은 하루마다 달라지기에 웹 크롤링, 외부 api를 통해 DB가 항상 최신 정보를 
유지하도록 했습니다.

## 기술 스택
|용도|기술|
|---|---|
|웹 앱|<img src="https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white"/>|
|웹 UI|<img src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white"/>|
|DB|<img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white"/>|
|배포 서버|<img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=flat&logo=Amazon AWS&logoColor=white"/>|
|소스 편집|<img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=flat&logo=visual studio code&logoColor=white"/>|

## 마무리, 개선할 점
학교 관련 정보를 찾기 위해 매 번 홈페이지를 탐험하다가 이걸 챗봇으로 자동화할 수 없을까 하는 생각이 들어 이 프로젝트를 진행하게 되었습니다. 제 생각대로 이미 여러 대학교에서 챗봇을 서비스하고 있지만 동의대에는 아직 없어 한번 만들어보았습니다. 학교 관련 정보 뿐만 아니라 다양한 정보를 다루기 위해 Q&A 사이트를 만들어 높은 추천수의 질문과 답변을 챗봇에 학습시키면 더 나은 챗봇이 될거라 기대합니다. 







