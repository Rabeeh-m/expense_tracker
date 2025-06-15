from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Sum
from .models import Expense
from .serializers import ExpenseSerializer
from .permissions import IsOwnerOrAdmin
from django.utils.dateparse import parse_date
from django.shortcuts import get_object_or_404

# View to list and create expense entries
class ExpenseListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # GET: Return list of expenses, filtered if query params are provided
    def get(self, request):
        user = request.user
        queryset = Expense.objects.all() if user.is_staff else Expense.objects.filter(user=user)
        
        # Apply filters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        category = request.query_params.get('category')
        user_id = request.query_params.get('user')

        if start_date:
            start_date = parse_date(start_date)
            if start_date:
                queryset = queryset.filter(date__gte=start_date)
        if end_date:
            end_date = parse_date(end_date)
            if end_date:
                queryset = queryset.filter(date__lte=end_date)
        if category:
            queryset = queryset.filter(category=category)
        if user_id and user.is_staff:
            queryset = queryset.filter(user_id=user_id)

        serializer = ExpenseSerializer(queryset, many=True)
        return Response(serializer.data)

    # POST: Create a new expense entry for the authenticated user
    def post(self, request):
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View to retrieve, update, or delete a single expense
class ExpenseDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    # Helper to fetch the object and apply permission check
    def get_object(self, pk):
        obj = get_object_or_404(Expense, pk=pk)
        self.check_object_permissions(self.request, obj)
        return obj

    # GET: Retrieve a single expense by ID
    def get(self, request, pk):
        expense = self.get_object(pk)
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)

    # PUT: Fully update the expense
    def put(self, request, pk):
        expense = self.get_object(pk)
        serializer = ExpenseSerializer(expense, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH: Partially update the expense
    def patch(self, request, pk):
        expense = self.get_object(pk)
        serializer = ExpenseSerializer(expense, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: Remove the expense
    def delete(self, request, pk):
        expense = self.get_object(pk)
        expense.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# View to get summary of expenses grouped by category
class SummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        queryset = Expense.objects.all() if user.is_staff else Expense.objects.filter(user=user)
        
        # Apply filters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if start_date:
            start_date = parse_date(start_date)
            if start_date:
                queryset = queryset.filter(date__gte=start_date)
        if end_date:
            end_date = parse_date(end_date)
            if end_date:
                queryset = queryset.filter(date__lte=end_date)

        summary = queryset.values('category').annotate(total=Sum('amount'))
        return Response(summary)