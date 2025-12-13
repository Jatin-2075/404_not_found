from .models import Profile
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def Signup(request):
    if request.method != "POST":
        return JsonResponse({'success': False, 'msg': 'Invalid request method'})

    username = request.POST.get('username')
    email = request.POST.get('email')
    password = request.POST.get('password')

    print("METHOD:", request.method)
    print("POST DATA:", request.POST)

    if not username or not email or not password:
        return JsonResponse({'success': False, 'msg': 'All fields are required'})

    if User.objects.filter(username=username).exists():
        return JsonResponse({'success': False, 'msg': 'Username already present'})

    if User.objects.filter(email=email).exists():
        return JsonResponse({'success': False, 'msg': 'Email already present'})

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    Profile.objects.create(user=user)

    return JsonResponse({'success': True, 'msg': 'Account created'})

@csrf_exempt
def Login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        print("LOGIN DATA:", username, password)

        user = authenticate(username=username, password=password)
        print("AUTH USER:", user)

        if user is not None:
            login(request, user)
            return JsonResponse({'success' : True, 'msg' : 'logged in'})
        
        else:
            return JsonResponse({'success' : False, 'msg' : 'Somethings wrong check please'})

    else: 
        return JsonResponse ({'msg' : 'Try Again', 'success' : False})

    return JsonResponse({'success' : False, 'msg' : 'Error occurred'})

@csrf_exempt
def Logout(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse ({'msg' : 'Success', 'success' : True})

    return JsonResponse({'success' : False , 'msg' : 'Some Error Occurred'})