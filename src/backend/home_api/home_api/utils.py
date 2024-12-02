from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status, viewsets


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        message = None
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                message = response.data['detail']
            else:
                errors = []
                for field, messages in response.data.items():
                    if isinstance(messages, list):
                        for msg in messages:
                            errors.append(f"{field}: {msg}")
                    else:
                        errors.append(f"{field}: {messages}")
                message = '; '.join(errors)
        elif isinstance(response.data, list):
            message = response.data[0]
        else:
            message = str(response.data)
        
        response.data = {
            "data": None,
            "error": {
                "message": message,
                "details": response.data,
                "status": response.status_code
            }
        }

    return response


def format_response(data=None, error=None, status=200, response=None):
    """
    For the manual creation of responses
    """
    if error:
      error = {
        "message": error,
        "status": status
      }
    return Response({
        "data": data,
        "error": error
    }, status=status)



class BaseViewSet(viewsets.ModelViewSet):
    def format_response(self, data=None, error=None, status_code=status.HTTP_200_OK):
        return Response({
            "data": data,
            "error": error
        }, status=status_code)

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return self.format_response(data=serializer.data)
        except Exception as e:
            return self.format_response(error={"message": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return self.format_response(data=serializer.data)
        except Exception as e:
            return self.format_response(error={"message": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            return self.format_response(data=response.data, status_code=response.status_code)
        except Exception as e:
            return self.format_response(error={"message": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            response = super().update(request, *args, **kwargs)
            return self.format_response(data=response.data, status_code=response.status_code)
        except Exception as e:
            return self.format_response(error={"message": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            super().destroy(request, *args, **kwargs)
            return self.format_response(data={"message": "Deleted successfully"}, status_code=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return self.format_response(error={"message": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)
        

class BaseReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    def format_response(self, data=None, error=None, status_code=status.HTTP_200_OK):
        return Response({
            "data": data,
            "error": error
        }, status=status_code)

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return self.format_response(data=serializer.data)
        except Exception as e:
            return self.format_response(error={"message": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return self.format_response(data=serializer.data)
        except Exception as e:
            return self.format_response(error={"message": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)