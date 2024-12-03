import asyncio
from asgiref.sync import sync_to_async

# Game
from games.models import MatchPlayer
from games.game.models.Paddle import Paddle

class Player:
    def __init__(self, player:MatchPlayer):
        self.player = player
        self.paddle: Paddle = None

    # ----------------------------------- Utils ---------------------------------- #

    def score_point(self):
        self.player.score += 1
        asyncio.create_task(self.sync_to())

    async def update_state(self, state):
        if state == self.player.state:
            return
        if self.player.state == MatchPlayer.State.LEFT:
            return
        self.player.state = state
        await self.sync_to()

    # --------------------------------- Database --------------------------------- #
    @sync_to_async
    def sync_to(self):
        self.player.save()

    @sync_to_async
    def sync_from(self):
        self.player.refresh_from_db()
    
    # --------------------------------- Operator --------------------------------- #
    def __str__(self):
        return f'Player {self.player.id}'
    
    def __eq__(self, other):
        if isinstance(other, Player):
            return self.player == other.player
        return False
    
    def __hash__(self):
        return hash(self.player)
    
    def to_dict(self):
        return {
            'user': {
                'id': self.player.user.id,
                'username': self.player.user.username,
                'email': self.player.user.email,
                'avatar': self.player.user.profile.avatar.url if self.player.user.profile.avatar else None
            },
            'state': self.player.state,
            'score': self.player.score,
            'paddle': self.paddle.to_dict() if self.paddle else None
        }
        
