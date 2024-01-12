from flask import Flask, redirect, session, make_response
from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.flask_client import OAuth
from datetime import datetime
from sqlalchemy.sql import text

db = SQLAlchemy()
app = Flask(__name__)

app.debug = False

app.config.from_pyfile('config.cfg', silent=True)
app.secret_key = app.config['SESSION_SECRET_KEY']

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{app.config['DATABASE_NAME']}'

db.init_app(app)

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.String(35), primary_key=True)
    email = db.Column(db.String(128), unique=False, nullable=False)
    first_name = db.Column(db.String(64), unique=False, nullable=False)
    last_name = db.Column(db.String(64), unique=False, nullable=False)

class WorkAssignment(db.Model):
    __tablename__ = 'work_assignment'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(35), unique=False, nullable=False)
    vehicle_number = db.Column(db.String(3), unique=False, nullable=False)
    work_assignment_type = db.Column(db.WorkAssignmentType, unique=False, nullable=False)
    work_assignment_station = db.Column(db.Integer, unique=False, nullable=False)
    work_assignment_run_group = db.Column(db.WorkAssignmentRunGroup, unique=False, nullable=False)
    work_assignment_segment = db.Column(db.WorkAssignmentSegment, unique=False, nullable=False)

class WorkAssignmentType(db.Model):
    __tablename__ = 'work_assignment_type'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

class WorkAssignmentStation(db.Model):
    __tablename__ = 'work_assignment_station'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

class WorkAssignmentRunGroup(db.Model):
    __tablename__ = 'work_assignment_run_group'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

class WorkAssignmentSegment(db.Model):
    __tablename__ = 'work_assignment_segment'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

with app.app_context():
    db.create_all()

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
    res = oauth.msr.authorize_redirect(app.config['CALLBACK_URL'])
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
@app.route('/app_status')
def app_status():
    try:
        db.session.query(text('1')).from_statement(text('SELECT 1')).all()
        return '<h1>Good</h1>'
    except Exception as e:
        return f'<p>Error:<br>{str(e)}</p>'



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
