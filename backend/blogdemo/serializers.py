from rest_framework import serializers
from .models import Article


class ArticleSerializer(serializers.ModelSerializer):
    """Serializer for the Article model, using all fields of the model."""

    class Meta:
        model = Article
        fields = "__all__"
