"""
Routing para WebSockets de posts
"""
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/feed/$', consumers.FeedConsumer.as_asgi()),
    re_path(r'ws/post/(?P<post_id>[0-9a-f-]+)/$', consumers.PostConsumer.as_asgi()),
]