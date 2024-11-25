from django.shortcuts import render

def index(request):
    return render(request, 'templates/chat/index.html')


def room(request, room_name):
    return render(request, 'templates/chat/room.html', {
        'room_name': room_name
        
				
    })


