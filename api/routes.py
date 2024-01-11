from flask import Flask, render_template, request, redirect, session, make_response
import oauth2 as oauth
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime

app = Flask(__name__)

app.debug = False

app.config.from_pyfile('config.cfg', silent=True)
app.secret_key = app.config["SESSION_SECRET_KEY"]

app_url = app.config['APP_URL']
api_url = app.config['MSR_API_URL']
authorization_url = app.config['MSR_AUTHORIZATION_URL']
callback_url = app.config['MSR_CALLBACK_URL']
request_token_url = api_url + '/rest/tokens/request'
access_token_url = api_url + '/rest/tokens/access'

oauth_store = {}

success = "<h1>Success</h1>"
unauthorized = "<h1>Unauthorized</h1>"

## Auth
@app.route('/auth/request')
def get_request_token():
    consumer = oauth.Consumer(
        app.config['MSR_CONSUMER_KEY'], app.config['MSR_CONSUMER_SECRET'])
    client = oauth.Client(consumer)
    resp, content = client.request(request_token_url, "POST", body=urllib.parse.urlencode({
                                   "oauth_callback": callback_url}))

    if resp['status'] != '200':
        error_message = '{status} {message}'.format(
            status=resp['status'], message=content.decode('utf-8'))
        return render_template('error.html', error_message=error_message)

    request_token = dict(urllib.parse.parse_qsl(content))
    oauth_token = request_token[b'oauth_token'].decode('utf-8')
    oauth_token_secret = request_token[b'oauth_token_secret'].decode('utf-8')

    oauth_store[oauth_token] = oauth_token_secret

    return oauth_token


@app.route('/auth/callback')
def callback():
    oauth_token = request.args.get('oauth_token')
    oauth_verifier = request.args.get('oauth_verifier')
    oauth_denied = request.args.get('denied')

    if oauth_denied:
        if oauth_denied in oauth_store:
            del oauth_store[oauth_denied]
        app.logger.error('the OAuth request was denied by the user')
        return redirect(app_url)

    if not oauth_token or not oauth_verifier:
        app.logger.error('callback param(s) missing')
        return redirect(app_url)

    if oauth_token not in oauth_store:
        app.logger.error('oauth_token not found')
        return redirect(app_url)

    oauth_token_secret = oauth_store[oauth_token]

    consumer = oauth.Consumer(
        app.config['MSR_CONSUMER_KEY'], app.config['MSR_CONSUMER_SECRET'])
    
    token = oauth.Token(oauth_token, oauth_token_secret)
    token.set_verifier(oauth_verifier)

    client = oauth.Client(consumer, token)

    _, content = client.request(access_token_url, "POST")
    access_token = dict(urllib.parse.parse_qsl(content))

    real_oauth_token = access_token[b'oauth_token'].decode('utf-8')
    real_oauth_token_secret = access_token[b'oauth_token_secret'].decode('utf-8')

    real_token = oauth.Token(real_oauth_token, real_oauth_token_secret)

    del oauth_store[oauth_token]

    session.permanent = True
    session['oauth_token'] = real_token.key
    session['oauth_token_secret'] = real_token.secret

    return redirect(app_url)

@app.route('/auth/logout')
def logout():
    session.pop('oauth_token', None)
    session.pop('oauth_token_secret', None)

    return make_response(success, 200)


## API
def token():
    oauth_token = session.get('oauth_token')
    oauth_token_secret = session.get('oauth_token_secret')

    if (oauth_token and oauth_token_secret):
        return oauth.Token(oauth_token, oauth_token_secret)

    return None

def client(token: oauth.Token):
    consumer = oauth.Consumer(
        app.config['MSR_CONSUMER_KEY'], app.config['MSR_CONSUMER_SECRET'])

    client = oauth.Client(consumer, token)
    return client

def msr_request(uri, method):
    access_token = token()
    if not access_token:
        return make_response(unauthorized, 401)
    
    msr = client(access_token)
    response, content = msr.request(uri=uri, method=method)

    return make_response(content.decode('utf-8'), response.status)


@app.route('/api/user')
def user():
    return msr_request(uri=f'{api_url}/rest/me.json', method='GET')

@app.route('/api/user/events')
def user_events():
    return msr_request(uri=f'{api_url}/rest/me/events.json', method='GET')

@app.route('/api/organization/events')
def organization_events():   
    current_year = datetime.now().year
    start = str(current_year - 1) + '-01-01'
    end = str(current_year + 1) + '-12-31'

    return msr_request(uri=f'{api_url}/rest/calendars/organization/{app.config['MSR_ORGANIZATION_ID']}.json?start={start}&end={end}&archive=true', method='GET')

@app.route('/api/events/<event_id>/assignments')
def event_entry_list(event_id):
    return msr_request(uri=f'{api_url}/rest/events/{event_id}/entrylist.json', method='GET')
