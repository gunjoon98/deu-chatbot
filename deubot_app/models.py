from xml.parsers.expat import model
from django.db import models

# Create your models here.
class Menu(models.Model):
    menu_place = models.CharField(max_length=30) #행복기숙사, 효민생활관
    menu_time = models.CharField(max_length=30) #조식, 중식, 석식
    menu_day = models.CharField(max_length=30) #"월, 화, 수, 목, 금, 토, 일"
    data1 = models.TextField() #[한식] 어묵국 고추장닭갈비 야채계란말이 단배추나물 김치 or [한식] 없음
    data2 = models.TextField() #[일품] 멸치숙주국수 오이생체 사과잼쿠키 포기김치 or [일품] 없음

class Weather(models.Model):
    weather_date = models.DateField(primary_key=True) #2022-04-01 (python의 datetime.date 인스턴스)
    description = models.TextField() #가벼운 비
    iconImage = models.CharField(max_length=30) #아이콘 이름
    tempMax = models.FloatField() #최고 온도 (python의 float 인스턴스)
    tempMin = models.FloatField() #최저 온도
    pop = models.FloatField() #강수 확률(0% ~ 100%)

class Place(models.Model):
    place = models.CharField(primary_key=True, max_length=100) # 건물 이름

class Convenience(models.Model):
    store = models.CharField(max_length=100) # 편의 시설 이름
    place = models.ForeignKey(Place, on_delete=models.CASCADE) # 건물 이름

class Calendar(models.Model):
    calendarStartDay = models.DateField()   #학사 일정 시작 일
    calendarEndDay = models.DateField()     #학사 일정 종료 일
    detail = models.TextField() #학사 일정 설명

class Scholarship(models.Model):
    types = models.CharField(max_length=100) # 장학금 유형
    description = models.TextField() #장학금 간략 설명

class LinkUrl(models.Model):
    intentName = models.CharField(max_length=100) #인텐트 이름
    url_name = models.CharField(max_length=100) #URL 이름
    url = models.TextField() #URL

class Exam(models.Model):
    examType = models.CharField(max_length=100) #시험 유형(중간시험 or 기말시험)
    examStartDay = models.DateField()   #시험 시작일
    examEndDay = models.DateField()     #시험 종료일

#==========도서관 관련 테이블========== 
class Library_popularityList(models.Model):
    book_name = models.CharField(max_length=200) # 책이름
    count = models.IntegerField() #대출 횟수

class Library_takeout_deadline(models.Model):
    type = models.CharField(max_length=100) #일반도서, 비도서, DVD, 베스트셀러, 수험서
    limit_num = models.CharField(max_length=100) #대출 최대 개수
    deadline = models.CharField(max_length=100) #대출 최대 기간
#=====================================


    
    




    


    







