from django.test import TestCase
from .models import Article
from django.contrib.auth.models import User
from rest_framework import status

# Create your tests here.


class ArticleModelTest(TestCase):
    def setUp(self):
        self.article_title = "Test Article"
        self.article_content = "This is a test article."

        self.article = Article.objects.create(
            title=self.article_title,
            content=self.article_content
        )

    def test_article_creation(self):
        """
        GIVEN: A new Article instance
        WHEN: The instance is created
        THEN: The article should have the correct attributes
        """
        self.assertEqual(self.article.title, self.article_title, "Article title does not match")
        self.assertEqual(self.article.content, self.article_content, "Article content does not match")
        self.assertIsNotNone(self.article.created_at, "Article creation timestamp should not be None")
        self.assertIsNotNone(self.article.updated_at, "Article updated timestamp should not be None")


class ArticleAPITest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_login(self.user)

    def test_get_articles(self):
        """
        GIVEN: An authenticated user
        WHEN: The user requests the list of articles
        THEN: The response should contain the list of articles with status code 200
        """
        response = self.client.get('/api/articles/')
        self.assertEqual(response.status_code, status.HTTP_200_OK, "Failed to retrieve articles")
        self.assertIsInstance(response.json(), list, "Response is not a list of articles")

    def test_create_article(self):
        """
        GIVEN: An authenticated user
        WHEN: The user creates a new article
        THEN: The article should be created successfully with status code 201
        """
        new_article_data = {
            "title": "New Test Article",
            "content": "This is the content of the new test article."
        }
        response = self.client.post('/api/articles/', new_article_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Failed to create a new article")
        self.assertEqual(response.json().get('title'), new_article_data['title'], "Article title does not match")
        self.assertEqual(response.json().get('content'), new_article_data['content'], "Article content does not match")

    def test_edit_article(self):
        """
        GIVEN: An authenticated user and an existing article
        WHEN: The user edits the article
        THEN: The article should be updated successfully with status code 200
        """
        article = Article.objects.create(title="Old Title", content="Old content.")
        updated_article_data = {
            "title": "Updated Title",
            "content": "Updated content."
        }
        response = self.client.put(f'/api/articles/{article.id}/', updated_article_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, "Failed to update the article")
        self.assertEqual(response.json().get('title'), updated_article_data['title'], "Article title was not updated")
        self.assertEqual(response.json().get('content'), updated_article_data['content'], "Article content was not updated")

    def test_delete_article(self):
        """
        GIVEN: An authenticated user and an existing article
        WHEN: The user deletes the article
        THEN: The article should be deleted successfully with status code 204
        """
        article = Article.objects.create(title="Title to be deleted", content="Content to be deleted.")
        response = self.client.delete(f'/api/articles/{article.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT, "Failed to delete the article")
        self.assertFalse(Article.objects.filter(id=article.id).exists(), "Article was not deleted from the database")

    def test_unauthenticated_access(self):
        """
        GIVEN: An unauthenticated user
        WHEN: The user tries to access the articles API
        THEN: The response should be 403 Forbidden
        """
        self.client.logout()
        response = self.client.get('/api/articles/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, "Unauthenticated access should be forbidden")