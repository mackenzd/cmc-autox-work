import json
import sys
import os
import csv
import time
import requests

### ENV ###
# MSR_ORGANIZATION_ID
# MSR_USERNAME
# MSR_PASSWORD

BASE_URL = 'https://api.motorsportreg.com/rest'

class MsrServer:
    _session: requests.Session

    def __init__(self, org_id, username: str, password: str) -> None:
        super().__init__()
        self._session = requests.session()
        self._session.auth = (username, password)
        self._session.headers.update({
            'X-Organization-Id': org_id,
            'Accepts': 'application/json',
        })

    def get_members(self):
        response = self._session.get(
            f'{BASE_URL}/members.json'
        )
        if response.status_code >= 300:
            self._print_response(response)
            raise Exception('Request failed.')
        else:
            try:
                return response.json()['response']['members']
            except:
                print(json.dumps(response.json(), indent=2), file=sys.stderr)
                raise

    def get_member(self, member_id: str):
        response = self._session.get(
            f'{BASE_URL}/members/{member_id}.json'
        )
        if response.status_code >= 300:
            self._print_response(response)
            raise Exception('Request failed.')
        else:
            try:
                return response.json()['response']['member']
            except:
                print(json.dumps(response.json(), indent=2), file=sys.stderr)
                raise

    @classmethod
    def _print_response(cls, response: requests.Response) -> None:
        response_body = response.content.decode('utf-8')
        print(f'Status = {response.status_code}', file=sys.stderr)
        print(f'Headers = {response.headers}', file=sys.stderr)
        content_type = response.headers["content-type"]
        print(f'Content Length ({content_type}) = {len(response_body)}', file=sys.stderr)
        print(json.dumps(response.json(), indent=2), file=sys.stderr)


def main():
    print("Start")

    server = MsrServer(os.environ['MSR_ORGANIZATION_ID'], os.environ['MSR_USERNAME'], os.environ['MSR_PASSWORD'])

    members = server.get_members()
    with open(f'users_{str(time.time())}.csv', 'a', newline='') as csvfile:
        w = csv.writer(csvfile)
        for m in members:
            print(m)
            if m['status'] == "Approved":
                member = server.get_member(m['id'])

                user_id = member['profileuri'].split('/')[2]
                member_id = member['id']
                email = member['email']
                first_name = member['firstName']
                last_name = member['lastName']
                avatar = ""

                w.writerow([user_id, member_id, email, first_name, last_name, avatar])

    print("Finish")

main()