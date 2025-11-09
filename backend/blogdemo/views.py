from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ArticleSerializer
from .models import Article


class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    queryset = Article.objects.all()
    
    # Define a PUT method that handles the update action
    def put(self, request, *args, **kwargs):
        """
        Handle PUT requests for updating an article.
        This method provides the same functionality as the default update method.
        """
        return super().update(request, *args, **kwargs)
