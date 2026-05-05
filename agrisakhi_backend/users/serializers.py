from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    village = serializers.CharField(required=False, default='', allow_blank=True)
    district = serializers.CharField(required=False, default='', allow_blank=True)

    class Meta:
        model = User
        fields = ['name', 'phone', 'password', 'role', 'village', 'district', 'lat', 'lng']

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError('Phone number already registered.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        try:
            user = User.objects.get(phone=data['phone'])
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid phone or password.')
        if not user.check_password(data['password']):
            raise serializers.ValidationError('Invalid phone or password.')
        if not user.is_active:
            raise serializers.ValidationError('Account is disabled.')
        data['user'] = user
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'name', 'phone', 'role', 'village', 'district',
            'lat', 'lng', 'avatar_url', 'is_active', 'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'phone']
