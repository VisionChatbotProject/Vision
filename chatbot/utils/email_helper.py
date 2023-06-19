import smtplib, ssl


def send_email(**data):
    ret = True
    try:
        port = 465  # For SSL
        smtp_server = "smtp.gmail.com"
        sender_email = "proyectovision2022@gmail.com"
        app_password = "mqiyrltjltjijizw" 
        
        message = """From: %s\nTo: %s\nSubject: %s\n\n%s""" % (sender_email, ", ".join(data['receiver_email']), data['subject'], data['body'])

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
            server.login(sender_email, app_password)
            print("Login Done")
            server.sendmail(sender_email, data['receiver_email'], message)
            print(f"Mail Sent \n{message}")
            ret = True
    except Exception as e:
        print(e)
        ret = False

    return ret


def send_exam_notification(**data):
    ret = True
    try:
        port = 587  # For SSL
        smtp_server = "smtp.gmail.com"
        sender_email = "proyectovision2022@gmail.com"
        app_password = "mqiyrltjltjijizw"

        message = "You have the following exam/s coming up in the next week:\n"
        for exam in data["exams"]:
            message += exam[0] + "\n"

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
            server.login(sender_email, app_password)
            print("Login Done")
            for user_email in data["user_emails"]:
                server.sendmail(sender_email, user_email, message)
            print(f"Mail Sent \n{message}")
            ret = True
    except Exception as e:
        print(e)
        ret = False

    return ret


if __name__ == "__main__":
    receiver_email = ["proyectovision2022@gmail.com"]
    SUBJECT = "Hi there"
    MESSAGE = "This message is sent from CHATBOT. !! "
    send_email(receiver_email=receiver_email, subject=SUBJECT, body=MESSAGE)
    print("email sent , please check your mail box")
