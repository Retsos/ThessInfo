from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .settings import EMAIL_HOST_USER
from django.conf import settings

class NotifyView(APIView):
    def post(self, request):
        data = request.data
        subject = "Νέα δεδομένα από το frontend"
        message = f"Λάβαμε τα εξής δεδομένα:\n\n{data}"
        recipient_list = [EMAIL_HOST_USER]  # άλλαξε το με το email σου

        try:
            send_mail(subject, message, None, recipient_list)
            return Response({'success': True, 'message': 'Email στάλθηκε'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ContactAPIView(APIView):
    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        message = request.data.get("message")

        if not name or not email or not message:
            return Response(
                {"error": "Όλα τα πεδία είναι υποχρεωτικά."},
                status=status.HTTP_400_BAD_REQUEST
            )

        subject = f"Η αίτησή σας ελήφθη επιτυχώς, {name}!"

        body = (
            f"Γειά σας {name},\n\n"
            "Σας ευχαριστούμε που επικοινωνήσατε μαζί μας. "
            "Έχουμε λάβει το μήνυμά σας και το αίτημά σας βρίσκεται υπό επεξεργασία.\n\n"
            "Με εκτίμηση,\n"
            "Η ομάδα υποστήριξης"
        )
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]  # π.χ. εσύ ως παραλήπτης

        try:
            send_mail(subject, body, from_email, recipient_list)


            subject2 = f"Αντίγραφο μηνύματος από: {name}"
            body2 = f"Ο χρήστης {name} <{email}> έστειλε το εξής:\n\n{message}"
            send_mail(subject2, body2, from_email, [from_email])
            return Response(
                {"success": "Το μήνυμα εστάλη!"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
