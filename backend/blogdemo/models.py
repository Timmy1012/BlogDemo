from django.db import models

class Article(models.Model):
    """Model representing a blog article."""
    id = models.AutoField(primary_key=True)

    title = models.CharField(max_length=200)
    content = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
