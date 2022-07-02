import unittest
from unittest.mock import patch


class EmailError(Exception):
    pass


class EmailSender():
    def send_email(self, to):
        print(f"Sending a email to {to}")
        return True


def send_emails_to_users(list_users):
    email_sender = EmailSender()
    results = []

    for user in list_users:
        result = True # email_sender.send_email(to=user)
        if not result:
            raise EmailError("se produjo un error enviando el email")
        results.append(result)

    return results


@patch.object(EmailSender, "send_email")
def test_send_emails_to_users(mock_send_email):
    mock_send_email.return_value = True
    results = send_emails_to_users(["user1@gmail.com", "user2@gmail.com"])
    mock_send_email.assert_called()
    assert len(results) == 2
