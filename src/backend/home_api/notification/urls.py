

from django.urls import path

from notification import views

urlpatterns = [
	path('notifications/', views.NotificationsViewSet.as_view({'get': 'list'})),
	path('testNotif/', views.testNotif),
	path('testNotifUser/', views.testNotifUser),
]