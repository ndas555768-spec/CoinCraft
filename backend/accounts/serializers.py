from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["username", "email", "password", "confirm_password"]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value.strip()).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.strip().lower()

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value.strip()).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value.strip()

    def validate(self, attrs):
        confirm = attrs.get("confirm_password")
        if confirm and attrs.get("password") != confirm:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password", None)
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = User.objects.filter(email__iexact=email.strip()).first()
        if user is None or not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")

        attrs["user"] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "currency",
            "dark_mode",
            "profile_picture",
        ]
        read_only_fields = ["id"]

    def validate_email(self, value):
        user = self.instance
        if user and User.objects.filter(email__iexact=value.strip()).exclude(id=user.id).exists():
            raise serializers.ValidationError("This email is already in use by another account.")
        return value.strip().lower()

    def validate_username(self, value):
        user = self.instance
        if user and User.objects.filter(username__iexact=value.strip()).exclude(id=user.id).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value.strip()
