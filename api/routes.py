from flask import Flask, redirect, session, make_response
from authlib.integrations.flask_client import OAuth
from datetime import datetime

app = Flask(__name__)

app.debug = False

app.config.from_pyfile('config.cfg', silent=True)
app.secret_key = app.config["SESSION_SECRET_KEY"]

def fetch_token():
    token = session.get('token')
    if token is None:
        token = {'oauth_token': None}

    return token

oauth = OAuth(app)
oauth.register('msr', fetch_token=fetch_token)

## Auth
@app.route('/auth/login')
def login():
    res = oauth.msr.authorize_redirect(app.config['MSR_CALLBACK_URL'])
    return res.location

@app.route('/auth/callback')
def callback():
    try:
        token = oauth.msr.authorize_access_token()
        session['token'] = token
    except Exception as e:
        app.logger.error(e)
    finally:
        return redirect(app.config['APP_URL'])

@app.route('/auth/logout')
def logout():
    session.pop('token', None)

    return make_response({}, 200)

## API
@app.route('/api/user')
def user():
    res = oauth.msr.get('rest/me.json')
    return make_response(res.content, res.status_code)

@app.route('/api/user/events')
def user_events():
    res = oauth.msr.get('rest/me/events.json')    
    return make_response(res.content, res.status_code)

@app.route('/api/organization/events')
def organization_events():   
    current_year = datetime.now().year
    start = str(current_year - 1) + '-01-01'
    end = str(current_year + 1) + '-12-31'

    res = oauth.msr.get(f'rest/calendars/organization/{app.config['MSR_ORGANIZATION_ID']}.json', params={'start': start, 'end': end, 'archive': True})
    return make_response(res.content, res.status_code)

@app.route('/api/events/<event_id>/assignments')
def event_assignments(event_id):
    res = oauth.msr.get(f'rest/events/{event_id}/entrylist.json')    
    return make_response(res.content, res.status_code)
