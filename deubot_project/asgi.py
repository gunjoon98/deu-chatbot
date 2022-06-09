"""
ASGI config for deubot_project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'deubot_project.settings')
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import deubot_app.routing

# 클라이언트와 Channels 개발 서버가 연결 될 때, ASGI 어플리케이션으로 연결
application = ProtocolTypeRouter({
     # HTTP protocol 타입 연결이면
     "http": get_asgi_application(),

     # websocket protocol 타입 연결이면, AuthMiddlewareStack
    "websocket": AuthMiddlewareStack(
        # deuboot_app의 URLRouter 로 연결, 소비자의 라우트 연결 HTTP path를 조사
        URLRouter(deubot_app.routing.websocket_urlpatterns)),
})
