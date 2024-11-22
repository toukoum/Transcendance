

from django.urls import path

from notification import views

urlpatterns = [
	path('notifications/', views.NotificationsViewSet.as_view({'get': 'list'})),
	path('notifications/<int:pk>/', views.NotificationsViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
	path('notifications/<int:pk>/mark-as-read/', views.NotificationsViewSet.as_view({'post': 'mark_as_read'})),
	path('testNotif/', views.testNotif),
	path('testNotifUser/', views.testNotifUser),
]