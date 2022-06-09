from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from deubot_app.models import *
import datetime, json, random, os, environ
from django.db.models import Q
from google.cloud import dialogflow

env = environ.Env(DEBUG=(bool, True))
environ.Env.read_env(env_file='/home/ubuntu/Deubot_env/.env')
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = env('GOOGLE_APPLICATION_CREDENTIALS')

@database_sync_to_async
def detect_intent_texts(input_text):
        SSESION_ID = str(random.uniform(1,100000000))
        PROJECT_ID = "deu-chatbot"
        LANGUAGE_CODE = "ko"

        session_client = dialogflow.SessionsClient()
        session = session_client.session_path(PROJECT_ID, SSESION_ID)

        text_input = dialogflow.TextInput(text=input_text, language_code=LANGUAGE_CODE)
        query_input = dialogflow.QueryInput(text=text_input)

        response = session_client.detect_intent(request={"session": session, "query_input": query_input})
        return response.query_result


# Dialogflow response 검증 및 json 생성
@database_sync_to_async
def CreateJson(response):

    # 신뢰도 0.5 아래
    if(response.intent_detection_confidence < 0.5) :
        json_data = json.dumps({
             "intentName" : "default" 
        })

    #디폴트 인텐트 감지
    elif(response.intent.display_name == "Default Fallback Intent"):
        json_data = json.dumps({
             "intentName" : "default" 
        })

    #필수 엔티티 없음
    elif(response.all_required_params_present == False):
        json_data = json.dumps({
             "intentName" : "default" 
        })

    else:
        intentName = response.intent.display_name

        if(intentName == "안녕"):
            json_data = json.dumps({
                 "intentName" : intentName 
            })

        elif(intentName == "학식 메뉴"):
            url = LinkUrl.objects.get(intentName="학식 메뉴", url_name="학식 메뉴").url

            json_data = json.dumps({
                "intentName" : intentName,
                "url" : url
            })
        
        elif(intentName == "학식 메뉴[상세]"):
            server_today = datetime.date.today()
            days = ['월','화','수','목','금','토','일']
    
            menu_place = response.parameters["menu_place"]
            menu_time= response.parameters["menu_time"]
            menu_object = Menu.objects.get(menu_place=menu_place, menu_time=menu_time, menu_day=days[server_today.weekday()])
            data1 = menu_object.data1
            data2 = menu_object.data2
            
            json_data = json.dumps({
                "intentName" : intentName,
                "menu_place" : menu_place,
                "menu_time" : menu_time,
                "data1" : data1,
                "data2" : data2
            })
        
        elif(intentName == "날씨"):
            server_today = datetime.date.today()
            server_tomorrow = server_today + datetime.timedelta(days=1)
            url = LinkUrl.objects.get(intentName="날씨", url_name="날씨").url

            weather_object = Weather.objects.get(weather_date=server_today)
            today_description = weather_object.description
            today_iconImage = weather_object.iconImage
            today_tempMax = weather_object.tempMax
            today_tempMin = weather_object.tempMin
            today_pop = weather_object.pop
            weather_object = Weather.objects.get(weather_date=server_tomorrow)
            tom_description = weather_object.description
            tom_iconImage = weather_object.iconImage
            tom_tempMax = weather_object.tempMax
            tom_tempMin = weather_object.tempMin
            tom_pop = weather_object.pop
            
            json_data = json.dumps({
                "intentName" : intentName,
                "today_description" : today_description,
                "today_iconImage" : today_iconImage,
                "today_tempMax" : today_tempMax,
                "today_tempMin" : today_tempMin,
                "today_pop" : today_pop,
                "tom_description" : tom_description,
                "tom_iconImage" : tom_iconImage,
                "tom_tempMax" : tom_tempMax,
                "tom_tempMin" : tom_tempMin,
                "tom_pop" : tom_pop,
                "url" : url
            })

        elif(intentName == "편의 시설"):
            con_dict = {}
            place_objects = Place.objects.all()
            con_objects = Convenience.objects.all()

            for place_object in place_objects:
                con_dict[place_object.place] = []

            for con_object in con_objects:
                con_dict[con_object.place_id].append(con_object.store)

            json_data = json.dumps({
                "intentName" : intentName,
                "con_dict" : con_dict
            })

        elif(intentName == "학사 일정"):
            server_today = datetime.date.today()
            url = LinkUrl.objects.get(intentName="학사 일정", url_name="학사 일정").url

            cal_dict = {}
            calendar_objects = Calendar.objects.filter(Q(calendarStartDay__month=server_today.month) | Q(calendarEndDay__month=server_today.month)).order_by('calendarStartDay')

            for cal_object in calendar_objects:
                cal_dict[cal_object.detail] = []

            for cal_object in calendar_objects:
                if(cal_object.calendarStartDay == cal_object.calendarEndDay):
                    cal_dict[cal_object.detail].append(str(cal_object.calendarStartDay.day))

                elif(cal_object.calendarEndDay.month > server_today.month):
                    cal_dict[cal_object.detail].append(str(cal_object.calendarStartDay.day) + " ~ " + str(cal_object.calendarEndDay.month) + "/" + str(cal_object.calendarEndDay.day))

                elif(cal_object.calendarStartDay.month < server_today.month):
                    cal_dict[cal_object.detail].append(str(cal_object.calendarStartDay.month) + "/" + str(cal_object.calendarStartDay.day) + " ~ " + str(cal_object.calendarEndDay.day))
            
                else:
                    cal_dict[cal_object.detail].append(str(cal_object.calendarStartDay.day) + " ~ " + str(cal_object.calendarEndDay.day))

            json_data = json.dumps({
                "intentName" : intentName,
                "cal_dict" : cal_dict,
                "url" : url
            })

        elif(intentName == "장학금"):
            url = LinkUrl.objects.get(intentName="장학금", url_name="장학금").url
            result_str1 = ""
            result_str2 = ""
            result_str3 = ""

            sholarship_objects = Scholarship.objects.all()
            objects_count = int(sholarship_objects.count() / 3)
            
            if(objects_count == 0):
                objects_count = sholarship_objects.count()
                for i in range(objects_count):
                    result_str1 += sholarship_objects[i].types + ":"
                    result_str1 += sholarship_objects[i].description + "\n"
            
            else:
                start = 0
                for i in range(start,start+objects_count):
                    result_str1 += sholarship_objects[i].types + ":"
                    result_str1 += sholarship_objects[i].description + "\n"

                start = start + objects_count
                for i in range(start, start+objects_count):
                    result_str2 += sholarship_objects[i].types + ":"
                    result_str2 += sholarship_objects[i].description + "\n"
                
                start = start + objects_count
                for i in range(start, sholarship_objects.count()):
                    result_str3 += sholarship_objects[i].types + ":"
                    result_str3 += sholarship_objects[i].description + "\n"
             
            json_data = json.dumps({
                "intentName" : intentName,
                "result_str1" : result_str1,
                "result_str2" : result_str2,
                "result_str3" : result_str3,
                "url" : url
            })

        elif(intentName == "캠퍼스맵"):
            url = LinkUrl.objects.get(intentName="캠퍼스맵", url_name="캠퍼스맵").url
            json_data = json.dumps({
                "intentName" : intentName,
                "url" : url
            })

        elif(intentName == "휴학/복학"):
            aLeaveOfAbsense_url = LinkUrl.objects.get(intentName="휴학/복학", url_name="aLeaveOfAbsense_url").url
            aLeaveOfAbsenseExtension_url = LinkUrl.objects.get(intentName="휴학/복학", url_name="aLeaveOfAbsenseExtension_url").url
            aLeaveOfAbsenseAlteration_url = LinkUrl.objects.get(intentName="휴학/복학", url_name="aLeaveOfAbsenseAlteration_url").url
            returnToSchool_url = LinkUrl.objects.get(intentName="휴학/복학", url_name="returnToSchool_url").url
            FAQ_url =  LinkUrl.objects.get(intentName="휴학/복학", url_name = "FAQ_url").url
            url =  LinkUrl.objects.get(intentName="휴학/복학", url_name = "학사지원팀").url

            json_data = json.dumps({
                "intentName" : intentName,
                "aLeaveOfAbsense_url" : aLeaveOfAbsense_url,
                "aLeaveOfAbsenseExtension_url" : aLeaveOfAbsenseExtension_url,
                "aLeaveOfAbsenseAlteration_url" : aLeaveOfAbsenseAlteration_url,
                "returnToSchool_url" : returnToSchool_url,
                "FAQ_url" : FAQ_url,
                "url" : url
            })

        elif(intentName == "시험 일정"):
            server_today = datetime.date.today()
            exam_object = Exam.objects.all().order_by('-examEndDay')[0]
            remainDay = "완료"

            for exam_object in Exam.objects.all():
                if server_today <= exam_object.examEndDay:
                    if(exam_object.examStartDay <= server_today and server_today <= exam_object.examEndDay):
                        remainDay = "진행"
                    else:
                        remainDay = str((exam_object.examStartDay - server_today).days)
                    break
            
            examType = exam_object.examType
            examStartDay = str(exam_object.examStartDay)
            examEndDay = str(exam_object.examEndDay)
            url = LinkUrl.objects.get(url_name="학사 일정").url

            json_data = json.dumps({
                "intentName" : intentName,
                "examType" : examType,
                "examStartDate" : examStartDay,
                "examEndDate" : examEndDay,
                "remainDay" : remainDay,
                "url" : url
            })

        elif(intentName == "도서관"):
            url = LinkUrl.objects.get(intentName="도서관", url_name = "도서관").url
            seat_reservation_url = LinkUrl.objects.get(intentName="도서관", url_name = "좌석 예약").url
            book_request_url = LinkUrl.objects.get(intentName="도서관", url_name = "도서 신청").url

            json_data = json.dumps({
                "intentName" : intentName,
                "url" : url,
                "seat_reservation_url" : seat_reservation_url,
                "book_request_url" : book_request_url
            })
        
        elif(intentName == "도서관[인기대출도서]"):
            bookNameList=[]
            bookCountList=[]
            library_popularitylist_objects = Library_popularityList.objects.all().order_by('-count')

            for object in library_popularitylist_objects:
                bookNameList.append(object.book_name)
                bookCountList.append(object.count)

            json_data = json.dumps({
                "intentName" : "도서관[인기대출도서]",
                "bookNameList" : bookNameList,
                "bookCountList" : bookCountList
            })

        elif(intentName == "대출 권수"):
            typeList = []
            limitNumList = []
            deadLineList = []
            library_takeout_deadline_objects = Library_takeout_deadline.objects.all()

            for object in library_takeout_deadline_objects:
                typeList.append(object.type)
                limitNumList.append(object.limit_num)
                deadLineList.append(object.deadline)
            
            json_data = json.dumps({
                "intentName" : intentName,
                "typeList" : typeList,
                "limitNumList" : limitNumList,
                "deadLineList" : deadLineList
            })
            
        elif(intentName == "수강 신청"):
            url = LinkUrl.objects.get(intentName="수강 신청", url_name = "수강 신청").url
            manualPDF_url = LinkUrl.objects.get(intentName="수강 신청", url_name = "메뉴얼PDF").url
            curriculum_url = LinkUrl.objects.get(intentName="수강 신청", url_name = "교육 과정").url

            json_data = json.dumps({
                "intentName" : intentName,
                "url" : url,
                "manualPDF_url" : manualPDF_url,
                "curriculum_url" : curriculum_url
            })

        else:
            json_data = json.dumps({
                 "intentName" : "default"
            })

    return json_data


class ChatConsumer(AsyncWebsocketConsumer):
    # 연결 요청 시 실행
    async def connect(self):
        
        # 연결 허용
        await self.accept()
        await self.send(text_data=json.dumps({ "intentName" : "첫인사" }))

        # 연결 거절
        # await self.close()


    # 클라이언트로부터 데이터 수신 시 실행
    async def receive(self, text_data):

        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            response = await detect_intent_texts(message)
            response = await CreateJson(response)
        except:
            response = json.dumps({"intentName" : "default"})
        
        #클라이언트로 json 데이터 송신
        await self.send(response)
    
        # 연결 강제 종료
        # await self.close()
        # await self.close(code=4123)

    # 연결 종료 시 실행
    async def disconnect(self, close_code):
        pass



