class Player:
    def __init__(self, user_id, username = None):
        self.user_id = user_id
        self.username = username
        self.score = 0
        self.paddle = None