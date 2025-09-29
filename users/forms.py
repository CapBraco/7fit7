from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(
        required=True, 
        label='Email',
        widget=forms.EmailInput(attrs={'placeholder': 'myemail@example.com', 'class': 'form-control'})
    )
    first_name = forms.CharField(
        required=True,
        label="Name",
        widget=forms.TextInput(attrs={'placeholder': 'Your Name', 'class': 'form-control'})
    )
    last_name = forms.CharField(
        required=True,
        label='Last Name',
        widget=forms.TextInput(attrs={'placeholder': 'Last Name','class': 'form-control'})
    )

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']