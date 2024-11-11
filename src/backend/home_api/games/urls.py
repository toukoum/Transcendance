from django.urls import path
from games import views

urlpatterns = [
    path('new/', views.MatchViewSet.as_view({'post': 'create'}), name='create_match'),
]
