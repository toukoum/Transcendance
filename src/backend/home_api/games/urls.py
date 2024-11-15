from django.urls import path
from games import views


urlpatterns = [
    path('game/new/', views.CreateMatchViewSet.as_view({'post': 'create'}), name='create_match'),
    path('game/ongoing/', views.MatchInfoView.as_view(), name='info_match'),
]
