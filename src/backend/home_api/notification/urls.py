

from django.urls import path

from notification import views

urlpatterns = [
	path('testNotif/', views.testNotif),
	path('testNotifUser/', views.testNotifUser),

]