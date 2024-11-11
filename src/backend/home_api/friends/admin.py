from django.contrib import admin

from friends.models import Friendship


class FriendshipAdmin(admin.ModelAdmin):
    list_display = ('user1', 'user2', 'status', 'created_at', 'id')
    search_fields = ('user1__username', 'user2__username', 'status')
    list_filter = ('status',)

admin.site.register(Friendship, FriendshipAdmin)