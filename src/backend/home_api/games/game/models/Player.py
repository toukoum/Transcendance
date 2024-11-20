from asgiref.sync import sync_to_async

# Game
from games.models import MatchPlayer
from games.game.models.Paddle import Paddle

class Player:
    def __init__(self, player:MatchPlayer):
        self.player = player
        # self.user_id = player.player_id
        # self.state = player.state
        # self.score = player.score

        # self.user_id = user_id
        # self.state = MatchPlayer.State.CONNECTED
        # self.username = username
        self.paddle: Paddle = None

        # print(self)

    # ----------------------------------- Utils ---------------------------------- #

    async def update_state(self, state):
        self.player.state = state
        await self.sync_to()

    # --------------------------------- Database --------------------------------- #

    # def sync_to_match_player(self):
    #     self.player.state = self.state
    #     self.player.score = self.score
    #     self.player.save()

    # def sync_from_match_player(self):
    #     self.state = self.player.state
    #     self.score = self.player.score
    #     return self.player

    @sync_to_async
    def sync_to(self):
        self.player.save()

    @sync_to_async
    def sync_from(self):
        self.player.refresh_from_db()

    # @database_sync_to_async
    # def sync_from(self):
    #     player = MatchPlayer.objects.get(match_id=self.match.id, player_id=self.user_id)
    #     self.state = player.state
    #     self.score = player.score
    #     return player
    
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
            'user_id': self.player.user.id,
            'state': self.player.state,
            'score': self.player.score,
            'paddle': self.paddle.to_dict() if self.paddle else None
        }
        # return {
        #     'user_id': self.user_id,
        #     'username': self.username,
        #     'state': self.state,
        #     'score': self.score,
        #     'paddle': self.paddle.to_dict() if self.paddle else None
        # }
        
