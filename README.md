# 동의대 챗봇 '초아'
동의대학교 학생이 제작한 동의대 챗봇입니다. 학생들이 챗봇 초아를 통해 복잡한 홈페이지를 탐험하지 않고 정보를 쉽게 얻을 수 있도록 하기 위해 
제작했습니다.

## Domain
http://deubot.com

## Description
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

사용자가 웹서버로 질문을 보내면 웹서버는 google dialogflow api를 호출해 질문이 어느 주제(인텐트)에 속하는지 확인합니다. 그 후 해당 주제에 맞는 답변을 사용자에게
제공하는 구조를 가집니다. 사용자에게 답변을 제공할 때 DB를 사용하고 학식이나 날씨 등은 하루마다 달라지기에 웹 크롤링, 외부 api를 통해 DB가 항상 최신 정보를 
유지하도록 했습니다. 웹 디자인은 bootstrap 템플릿을 변형해 구현했습니다.

![캡처](https://user-images.githubusercontent.com/48176143/172790758-c2f3ab51-8aac-4405-b8fc-641881f727ef.PNG)

## 기술 스택
|용도|기술|
|---|---|
|웹 앱|<img src="https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white"/>|
|웹 UI|<img src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white"/>|
|DB|<img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white"/>|
|배포 서버|<img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=flat&logo=Amazon AWS&logoColor=white"/>|
|소스 편집|<img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=flat&logo=visual studio code&logoColor=white"/>|

## 마무리
학교 관련 정보를 찾기 위해 매 번 홈페이지를 탐험하다가 이걸 챗봇으로 자동화할 수 없을까 하는 생각이 들어 이 프로젝트를 진행하게 되었습니다. 제 생각대로 이미
여러 대학교에서 챗봇을 서비스하고 있지만 동의대에는 아직 없어 한번 만들어보았습니다. 만들면서 여러 개선할 점이 보였습니다. 항상 정확한 정보를 짧게 정리하여 
전달해야하는데 홈페이지에 나와있는 정보로는 부족했습니다. 또 답변 정보가 계속 정확한지 검증하는 작업도 지속적으로 필요합니다. 이러한 문제를 해결하기 위해
동아리를 만들어 단체로 학생에게 유용한 정보를 조사, 요약, 검증 작업을 반복했으면 더 좋은 작품이 탄생했을거 같은데 1인 개발이라 그러지 못해 아쉽습니다.







