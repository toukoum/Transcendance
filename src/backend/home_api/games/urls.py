from django.urls import path
from games import views


urlpatterns = [
    # path('game/new/', views.CreateMatchViewSet.as_view({'post': 'create'}), name='create_match'),
	path('game/', views.MatchView.as_view(), name='match'),
	# path('game/join/', views.MatchJoinView.as_view(), name='join_match'),
	path('game/<int:game_id>/join/', views.MatchJoinView.as_view(), name='join_match'),
    # Check if user is in a game
	path('game/check/', views.MatchCheckView.as_view(), name='check_match'),
	
]
