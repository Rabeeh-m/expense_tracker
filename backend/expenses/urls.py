from django.urls import path
from .views import ExpenseListCreateView, ExpenseDetailView, SummaryView

urlpatterns = [
    path('', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),
    path('summary/', SummaryView.as_view(), name='expense-summary'),
]