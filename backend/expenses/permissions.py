from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow safe methods (GET, HEAD, OPTIONS) for owners or admins
        if request.method in permissions.SAFE_METHODS:
            return obj.user == request.user or request.user.is_staff
        # Allow write methods (PUT, DELETE) only for owners or admins
        return obj.user == request.user or request.user.is_staff