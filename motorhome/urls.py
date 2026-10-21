"""
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from appointment import views
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.home,name='home'),
    path("api/appointment/",views.create_appointment,name="create_appointment"),
    path("api/appointment/status/<uuid:token>/",
         views.appointment_status,
         name="appointment_status"),
    path('<str:filename>', views.frontend_asset),
]
