from django.urls import path
from games import views


urlpatterns = [
    # path('game/new/', views.CreateMatchViewSet.as_view({'post': 'create'}), name='create_match'),
	path('game/', views.MatchView.as_view(), name='create_match'),
    # Check if user is in a game
	path('game/check/', views.MatchCheckView.as_view(), name='check_match'),
	
]
